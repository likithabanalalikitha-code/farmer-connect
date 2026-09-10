const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    unit: {
      type: String,
      default: 'kg'
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    image: {
      type: String,
      default: ''
    }
  },
  { _id: true }
);

const timelineSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true
    },
    note: {
      type: String,
      default: ''
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Buyer is required']
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount must be non-negative']
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      location: {
        latitude: { type: Number, min: -90, max: 90 },
        longitude: { type: Number, min: -180, max: 180 },
        provider: { type: String, default: 'google' }
      }
    },
    paymentMethod: {
      type: String,
      enum: ['Cash on Delivery', 'Direct Bank Transfer', 'UPI Demo'],
      default: 'Cash on Delivery'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending'
    },
    deliveryAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    assignedAt: { type: Date, default: null },
    deliveryOtpHash: { type: String, default: null, select: false },
    deliveryOtpEncrypted: { type: String, default: null, select: false },
    deliveryOtpExpiresAt: { type: Date, default: null, select: false },
    deliveryOtpVerifiedAt: { type: Date, default: null },
    deliveryAddressEditCount: { type: Number, default: 0, min: 0, max: 1 },
    cancellationReason: {
      type: String,
      default: ''
    },
    timeline: [timelineSchema]
  },
  {
    timestamps: true
  }
);

orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ 'items.farmer': 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ deliveryAgent: 1, orderStatus: 1, createdAt: -1 });
orderSchema.index(
  { deliveryAgent: 1 },
  {
    unique: true,
    partialFilterExpression: {
      deliveryAgent: { $type: 'objectId' },
      orderStatus: { $in: ['ready_for_pickup', 'out_for_delivery'] }
    }
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
