const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const crypto = require('crypto');
const config = require('../config/env');

const encryptDeliveryOtp = (otp) => {
  const key = crypto.createHash('sha256').update(config.jwtSecret).digest();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(otp, 'utf8'), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

const decryptDeliveryOtp = (value) => {
  const [ivHex, encryptedHex] = value.split(':');
  const key = crypto.createHash('sha256').update(config.jwtSecret).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(ivHex, 'hex'));
  return Buffer.concat([decipher.update(Buffer.from(encryptedHex, 'hex')), decipher.final()]).toString('utf8');
};

const createOrder = async (buyerId, { items, shippingAddress, paymentMethod = 'Cash on Delivery' }) => {
  if (!items || items.length === 0) {
    const error = new Error('No order items provided.');
    error.statusCode = 400;
    throw error;
  }

  const processedItems = [];
  let totalAmount = 0;
  const involvedFarmers = new Set();

  // Validate stock and prepare items
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      const error = new Error(`Product not found: ${item.product}`);
      error.statusCode = 404;
      throw error;
    }

    if (!product.isActive) {
      const error = new Error(`Product "${product.name}" is currently inactive.`);
      error.statusCode = 400;
      throw error;
    }

    if (product.availableQuantity < item.quantity) {
      const error = new Error(
        `Insufficient stock for "${product.name}". Available: ${product.availableQuantity} ${product.unit}`
      );
      error.statusCode = 400;
      throw error;
    }

    const subtotal = Math.round(product.price * item.quantity * 100) / 100;
    totalAmount += subtotal;
    involvedFarmers.add(product.farmer.toString());

    // Deduct stock from inventory
    product.availableQuantity -= item.quantity;
    await product.save();

    processedItems.push({
      product: product._id,
      farmer: product.farmer,
      name: product.name,
      quantity: item.quantity,
      unit: product.unit,
      price: product.price,
      subtotal,
      image: product.images && product.images.length > 0 ? product.images[0] : ''
    });
  }

  totalAmount = Math.round(totalAmount * 100) / 100;

  const order = await Order.create({
    buyer: buyerId,
    items: processedItems,
    totalAmount,
    shippingAddress,
    paymentMethod,
    paymentStatus: paymentMethod === 'Cash on Delivery' ? 'pending' : 'paid',
    orderStatus: 'pending',
    timeline: [
      {
        status: 'pending',
        note: 'Order successfully placed by customer. Awaiting farmer confirmation.',
        timestamp: new Date()
      }
    ]
  });

  // Notify involved farmers
  for (const farmerId of involvedFarmers) {
    await Notification.create({
      user: farmerId,
      title: 'New Order Received',
      message: `You have received a new order (#${order._id.toString().slice(-6)}) for your agricultural produce.`,
      type: 'order',
      relatedOrder: order._id
    });
  }

  // Notify buyer
  await Notification.create({
    user: buyerId,
    title: 'Order Placed Successfully',
    message: `Your order (#${order._id.toString().slice(-6)}) totaling ₹${totalAmount} has been placed.`,
    type: 'order',
    relatedOrder: order._id
  });

  return await order.populate([
    { path: 'buyer', select: 'name email phone' },
    { path: 'items.farmer', select: 'name farmName phone' }
  ]);
};

const getUserOrders = async (user, queryParams = {}) => {
  const { status, page = 1, limit = 10 } = queryParams;
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (parsedPage - 1) * parsedLimit;

  let filter = {};

  if (user.role === 'consumer') {
    filter.buyer = user._id;
  } else if (user.role === 'farmer') {
    filter['items.farmer'] = user._id;
  } else if (user.role === 'delivery-agent') {
    filter.$or = [
      { deliveryAgent: user._id },
      { deliveryAgent: null, orderStatus: { $in: ['confirmed', 'processing', 'ready_for_pickup'] } }
    ];
  } else if (user.role === 'admin') {
    // Admin can view all
  }

  if (status && status !== 'all') {
    filter.orderStatus = status;
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('buyer', 'name email phone avatar')
      .populate('items.farmer', 'name farmName phone city')
      .populate('deliveryAgent', 'name phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit)
      .lean(),
    Order.countDocuments(filter)
  ]);

  return {
    orders,
    pagination: {
      total,
      page: parsedPage,
      limit: parsedLimit,
      pages: Math.ceil(total / parsedLimit) || 1
    }
  };
};

const acceptDeliveryOrder = async (orderId, user) => {
  const activeOrder = await Order.exists({
    deliveryAgent: user._id,
    orderStatus: { $in: ['ready_for_pickup', 'out_for_delivery'] }
  });
  if (activeOrder) {
    const error = new Error('Complete your current delivery before accepting another order.');
    error.statusCode = 409;
    throw error;
  }

  const order = await Order.findOneAndUpdate(
    {
      _id: orderId,
      deliveryAgent: null,
      orderStatus: { $in: ['confirmed', 'processing', 'ready_for_pickup'] }
    },
    {
      $set: { deliveryAgent: user._id, assignedAt: new Date(), orderStatus: 'ready_for_pickup' },
      $push: { timeline: { status: 'ready_for_pickup', note: `Delivery accepted by ${user.name}.`, timestamp: new Date() } }
    },
    { new: true }
  ).populate([
    { path: 'buyer', select: 'name email phone' },
    { path: 'items.farmer', select: 'name farmName phone' },
    { path: 'deliveryAgent', select: 'name phone' }
  ]);

  if (!order) {
    const error = new Error('This order is no longer available. Another delivery agent may have accepted it.');
    error.statusCode = 409;
    throw error;
  }

  await Notification.create({
    user: order.buyer,
    title: 'Delivery agent assigned',
    message: `${user.name} accepted your order for delivery.`,
    type: 'order',
    relatedOrder: order._id
  });
  return order;
};

const getOrderById = async (orderId, user) => {
  const order = await Order.findById(orderId)
    .select('+deliveryOtpEncrypted +deliveryOtpExpiresAt')
    .populate('buyer', 'name email phone address city state pincode')
    .populate('items.product', 'name category images location')
    .populate('items.farmer', 'name farmName phone email city state')
    .lean();

  if (!order) {
    const error = new Error('Order not found.');
    error.statusCode = 404;
    throw error;
  }

  // Authorization: buyer, involved farmer, or admin
  const isBuyer = order.buyer._id.toString() === user._id.toString();
  const isFarmer = order.items.some(
    (item) => item.farmer && item.farmer._id.toString() === user._id.toString()
  );
  const isAdmin = user.role === 'admin';
  const isDeliveryAgent = order.deliveryAgent && order.deliveryAgent.toString() === user._id.toString();

  if (!isBuyer && !isFarmer && !isAdmin && !isDeliveryAgent) {
    const error = new Error('Unauthorized to view this order.');
    error.statusCode = 403;
    throw error;
  }

  if (isBuyer && order.orderStatus === 'out_for_delivery' && order.deliveryOtpEncrypted) {
    order.deliveryOtp = decryptDeliveryOtp(order.deliveryOtpEncrypted);
  }
  delete order.deliveryOtpEncrypted;
  delete order.deliveryOtpHash;
  return order;
};

const updateDeliveryAddress = async (orderId, address, user) => {
  const order = await Order.findOne({ _id: orderId, buyer: user._id });
  if (!order) {
    const error = new Error('Order not found.');
    error.statusCode = 404;
    throw error;
  }
  if (order.deliveryAddressEditCount >= 1) {
    const error = new Error('Delivery address can only be changed once for an order.');
    error.statusCode = 400;
    throw error;
  }
  if (!['pending', 'confirmed', 'processing', 'ready_for_pickup'].includes(order.orderStatus)) {
    const error = new Error('Delivery address can no longer be changed after the delivery has started.');
    error.statusCode = 400;
    throw error;
  }

  order.shippingAddress = address;
  order.deliveryAddressEditCount = 1;
  order.timeline.push({ status: order.orderStatus, note: 'Customer updated the delivery address.', timestamp: new Date() });
  await order.save();

  if (order.deliveryAgent) {
    await Notification.create({
      user: order.deliveryAgent,
      title: 'Delivery address updated',
      message: `The customer updated the destination for order #${order._id.toString().slice(-6)}.`,
      type: 'order',
      relatedOrder: order._id
    });
  }

  return getOrderById(orderId, user);
};

const updateOrderStatus = async (orderId, newStatus, note = '', user) => {
  const validStatuses = ['pending', 'confirmed', 'processing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!validStatuses.includes(newStatus)) {
    const error = new Error(`Invalid status. Allowed: ${validStatuses.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  const order = await Order.findById(orderId);
  if (!order) {
    const error = new Error('Order not found.');
    error.statusCode = 404;
    throw error;
  }

  // Only farmer with items in order or admin can update
  const isFarmer = order.items.some(
    (item) => item.farmer.toString() === user._id.toString()
  );
  const isAdmin = user.role === 'admin';
  const isDeliveryAgent = order.deliveryAgent && order.deliveryAgent.toString() === user._id.toString();

  if (!isFarmer && !isAdmin && !isDeliveryAgent) {
    const error = new Error('Not authorized to update status for this order.');
    error.statusCode = 403;
    throw error;
  }

  // Prevent invalid re-updates if already completed/cancelled
  if (order.orderStatus === 'delivered' && newStatus !== 'delivered') {
    const error = new Error('Cannot change status of an already delivered order.');
    error.statusCode = 400;
    throw error;
  }

  if (order.orderStatus === 'cancelled') {
    const error = new Error('Cannot update status of a cancelled order.');
    error.statusCode = 400;
    throw error;
  }

  if (isDeliveryAgent && newStatus !== 'out_for_delivery') {
    const error = new Error('Delivery agents can only start an assigned delivery.');
    error.statusCode = 403;
    throw error;
  }

  if (newStatus === 'delivered') {
    const error = new Error('Orders can only be delivered through customer OTP verification.');
    error.statusCode = 403;
    throw error;
  }

  if (isDeliveryAgent && newStatus === 'out_for_delivery') {
    const otp = crypto.randomInt(100000, 1000000).toString();
    order.deliveryOtpHash = crypto.createHash('sha256').update(otp).digest('hex');
    order.deliveryOtpEncrypted = encryptDeliveryOtp(otp);
    // The OTP remains valid until this delivery is completed or cancelled.
    order.deliveryOtpExpiresAt = null;
    order.orderStatus = newStatus;
    order.timeline.push({ status: newStatus, note: 'Delivery agent started the delivery. OTP generated for handover.', timestamp: new Date() });
    await order.save();
    await Notification.create({ user: order.buyer, title: 'Delivery is on the way', message: `Share OTP ${otp} with your delivery agent when your order arrives.`, type: 'order', relatedOrder: order._id });
    return await order.populate([{ path: 'buyer', select: 'name email phone' }, { path: 'items.farmer', select: 'name farmName phone' }]);
  }

  // If transitioning to cancelled, restock products
  if (newStatus === 'cancelled') {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { availableQuantity: item.quantity }
      });
    }
    order.cancellationReason = note || `Cancelled by ${user.role}`;
  }

  // If delivered and payment was COD, update payment status to paid
  if (newStatus === 'delivered' && order.paymentMethod === 'Cash on Delivery') {
    order.paymentStatus = 'paid';
  }

  order.orderStatus = newStatus;
  order.timeline.push({
    status: newStatus,
    note: note || `Order updated to ${newStatus} by ${user.name}`,
    timestamp: new Date()
  });

  await order.save();

  // Notify buyer of status update
  await Notification.create({
    user: order.buyer,
    title: `Order Status: ${newStatus.toUpperCase()}`,
    message: `Your order (#${order._id.toString().slice(-6)}) is now ${newStatus}. ${note ? `Note: ${note}` : ''}`,
    type: 'order',
    relatedOrder: order._id
  });

  return await order.populate([
    { path: 'buyer', select: 'name email phone' },
    { path: 'items.farmer', select: 'name farmName phone' }
  ]);
};

const cancelOrder = async (orderId, reason = '', user) => {
  const order = await Order.findById(orderId);
  if (!order) {
    const error = new Error('Order not found.');
    error.statusCode = 404;
    throw error;
  }

  const isBuyer = order.buyer.toString() === user._id.toString();
  const isAdmin = user.role === 'admin';

  if (!isBuyer && !isAdmin) {
    const error = new Error('Not authorized to cancel this order.');
    error.statusCode = 403;
    throw error;
  }

  if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
    const error = new Error(`Cannot cancel order when status is already ${order.orderStatus}.`);
    error.statusCode = 400;
    throw error;
  }

  // Restock products
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { availableQuantity: item.quantity }
    });
  }

  order.orderStatus = 'cancelled';
  order.cancellationReason = reason || 'Cancelled by customer';
  order.timeline.push({
    status: 'cancelled',
    note: reason ? `Cancelled: ${reason}` : 'Cancelled by buyer',
    timestamp: new Date()
  });

  await order.save();

  // Notify farmers
  const farmerIds = [...new Set(order.items.map((i) => i.farmer.toString()))];
  for (const fid of farmerIds) {
    await Notification.create({
      user: fid,
      title: 'Order Cancelled',
      message: `Order (#${order._id.toString().slice(-6)}) was cancelled by the buyer. Reserved inventory has been restored.`,
      type: 'order',
      relatedOrder: order._id
    });
  }

  return order;
};

const verifyDeliveryOtp = async (orderId, otp, user) => {
  const order = await Order.findById(orderId).select('+deliveryOtpHash +deliveryOtpExpiresAt');
  if (!order) {
    const error = new Error('Order not found.');
    error.statusCode = 404;
    throw error;
  }
  if (user.role !== 'delivery-agent' || !order.deliveryAgent || order.deliveryAgent.toString() !== user._id.toString()) {
    const error = new Error('Only the assigned delivery agent can verify this order.');
    error.statusCode = 403;
    throw error;
  }
  if (order.orderStatus !== 'out_for_delivery' || !order.deliveryOtpHash) {
    const error = new Error('This delivery OTP is not available for the current order status.');
    error.statusCode = 400;
    throw error;
  }
  const candidateHash = crypto.createHash('sha256').update(String(otp)).digest('hex');
  if (candidateHash !== order.deliveryOtpHash) {
    const error = new Error('Invalid delivery OTP.');
    error.statusCode = 400;
    throw error;
  }
  order.orderStatus = 'delivered';
  order.deliveryOtpVerifiedAt = new Date();
  order.deliveryOtpHash = null;
  order.deliveryOtpEncrypted = null;
  order.deliveryOtpExpiresAt = null;
  order.timeline.push({ status: 'delivered', note: 'Delivery completed after customer OTP verification.', timestamp: new Date() });
  if (order.paymentMethod === 'Cash on Delivery') order.paymentStatus = 'paid';
  await order.save();
  await Notification.create({ user: order.buyer, title: 'Order delivered', message: `Order #${order._id.toString().slice(-6)} was delivered successfully.`, type: 'order', relatedOrder: order._id });
  return order;
};

const getFarmerStats = async (farmerId) => {
  const [orders, monthlySales] = await Promise.all([
    Order.aggregate([
      { $match: { 'items.farmer': farmerId } },
      { $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        pendingOrders: { $sum: { $cond: [{ $in: ['$orderStatus', ['pending', 'confirmed', 'processing', 'ready_for_pickup']] }, 1, 0] } },
        totalRevenue: { $sum: { $cond: [{ $ne: ['$orderStatus', 'cancelled'] }, '$totalAmount', 0] } }
      } }
    ]),
    Order.aggregate([
      { $match: { 'items.farmer': farmerId, orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, amount: { $sum: '$totalAmount' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])
  ]);
  const current = orders[0] || { totalOrders: 0, pendingOrders: 0, totalRevenue: 0 };
  return {
    totalOrders: current.totalOrders,
    pendingOrders: current.pendingOrders,
    totalRevenue: Math.round(current.totalRevenue * 100) / 100,
    monthlySales: monthlySales.map((entry) => ({ month: `${entry._id.year}-${String(entry._id.month).padStart(2, '0')}`, amount: Math.round(entry.amount * 100) / 100 }))
  };
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  verifyDeliveryOtp,
  getFarmerStats,
  acceptDeliveryOrder,
  updateDeliveryAddress
};
