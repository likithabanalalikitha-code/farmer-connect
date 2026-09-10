const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const AIConversation = require('../models/AIConversation');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalFarmers,
      totalConsumers,
      totalProducts,
      activeProducts,
      totalOrders,
      ordersAggregate,
      recentOrders,
      recentUsers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'farmer' }),
      User.countDocuments({ role: 'consumer' }),
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' } } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
      ]),
      Order.find()
        .populate('buyer', 'name email')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      User.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ]);

    const totalRevenue = ordersAggregate[0] ? ordersAggregate[0].totalRevenue : 0;

    // Monthly orders summary for chart
    const monthlyStats = await Order.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalOrders: { $sum: 1 },
          totalSales: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    return successResponse(res, 200, 'Admin statistics fetched', {
      counts: {
        totalUsers,
        totalFarmers,
        totalConsumers,
        totalProducts,
        activeProducts,
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100
      },
      recentOrders,
      recentUsers,
      monthlyStats
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (role && role !== 'all') {
      filter.role = role;
    }

    if (search && search.trim() !== '') {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { phone: { $regex: search.trim(), $options: 'i' } },
        { farmName: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (parsedPage - 1) * parsedLimit;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      User.countDocuments(filter)
    ]);

    return successResponse(res, 200, 'Users fetched', users, {
      total,
      page: parsedPage,
      limit: parsedLimit,
      pages: Math.ceil(total / parsedLimit) || 1
    });
  } catch (error) {
    next(error);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive, role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, 404, 'User not found.');
    }

    // Protect against self-deactivation or admin demotion if it is the current admin
    if (user._id.toString() === req.user._id.toString() && isActive === false) {
      return errorResponse(res, 400, 'You cannot deactivate your own administrative account.');
    }

    if (isActive !== undefined) user.isActive = isActive;
    if (role && ['consumer', 'farmer', 'delivery-agent', 'admin'].includes(role)) user.role = role;

    await user.save();
    return successResponse(res, 200, 'User status updated successfully', { user: user.toJSON() });
  } catch (error) {
    next(error);
  }
};

const getAdminProducts = async (req, res, next) => {
  try {
    const { search, category, isActive, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (search && search.trim() !== '') {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (isActive !== undefined && isActive !== 'all') {
      filter.isActive = isActive === 'true';
    }

    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (parsedPage - 1) * parsedLimit;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('farmer', 'name email farmName phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Product.countDocuments(filter)
    ]);

    return successResponse(res, 200, 'Products fetched for admin', products, {
      total,
      page: parsedPage,
      limit: parsedLimit,
      pages: Math.ceil(total / parsedLimit) || 1
    });
  } catch (error) {
    next(error);
  }
};

const updateProductStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).populate('farmer', 'name farmName email');

    if (!product) {
      return errorResponse(res, 404, 'Product not found.');
    }

    return successResponse(res, 200, 'Product status updated', { product });
  } catch (error) {
    next(error);
  }
};

const deleteProductAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return errorResponse(res, 404, 'Product not found.');
    }
    return successResponse(res, 200, 'Product removed by admin.');
  } catch (error) {
    next(error);
  }
};

const getAdminOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.orderStatus = status;
    }

    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (parsedPage - 1) * parsedLimit;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('buyer', 'name email phone')
        .populate('items.farmer', 'name farmName phone')
        .populate('deliveryAgent', 'name phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .lean(),
      Order.countDocuments(filter)
    ]);

    return successResponse(res, 200, 'Orders retrieved for admin', orders, {
      total,
      page: parsedPage,
      limit: parsedLimit,
      pages: Math.ceil(total / parsedLimit) || 1
    });
  } catch (error) {
    next(error);
  }
};

const assignDeliveryAgent = async (req, res, next) => {
  try {
    const { agentId } = req.body;
    const agent = await User.findOne({ _id: agentId, role: 'delivery-agent', isActive: true });
    if (!agent) return errorResponse(res, 400, 'An active delivery-agent account is required.');
    const order = await Order.findById(req.params.id);
    if (!order) return errorResponse(res, 404, 'Order not found.');
    if (['delivered', 'cancelled'].includes(order.orderStatus)) return errorResponse(res, 400, 'Completed orders cannot be assigned.');
    order.deliveryAgent = agent._id;
    order.assignedAt = new Date();
    if (!['delivered', 'cancelled'].includes(order.orderStatus)) order.orderStatus = 'ready_for_pickup';
    order.timeline.push({ status: order.orderStatus, note: `Assigned to delivery agent ${agent.name}.`, timestamp: new Date() });
    await order.save();
    return successResponse(res, 200, 'Delivery agent assigned', { order });
  } catch (error) {
    next(error);
  }
};

const manageCategories = {
  get: async (req, res, next) => {
    try {
      const categories = await Category.find().sort({ name: 1 }).lean();
      return successResponse(res, 200, 'Categories retrieved', { categories });
    } catch (error) {
      next(error);
    }
  },
  create: async (req, res, next) => {
    try {
      const { name, description, icon, image } = req.body;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const existing = await Category.findOne({ slug });
      if (existing) {
        return errorResponse(res, 400, 'A category with this name already exists.');
      }

      const category = await Category.create({ name, slug, description, icon, image });
      return successResponse(res, 201, 'Category created', { category });
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
      if (!category) return errorResponse(res, 404, 'Category not found.');
      return successResponse(res, 200, 'Category updated', { category });
    } catch (error) {
      next(error);
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await Category.findByIdAndDelete(id);
      if (!category) return errorResponse(res, 404, 'Category not found.');
      return successResponse(res, 200, 'Category deleted');
    } catch (error) {
      next(error);
    }
  }
};

const getAISummary = async (req, res, next) => {
  try {
    const totalConversations = await AIConversation.countDocuments();
    const recentConversations = await AIConversation.find()
      .populate('user', 'name email role')
      .sort({ updatedAt: -1 })
      .limit(10)
      .lean();

    return successResponse(res, 200, 'AI metrics retrieved', {
      totalConversations,
      recentConversations
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getUsers,
  updateUserStatus,
  getAdminProducts,
  updateProductStatus,
  deleteProductAdmin,
  getAdminOrders,
  assignDeliveryAgent,
  manageCategories,
  getAISummary
};
