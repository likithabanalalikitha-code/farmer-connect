const orderService = require('../services/orderService');
const { successResponse } = require('../utils/apiResponse');

const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.user._id, req.body);
    return successResponse(res, 201, 'Order created successfully', { order });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const result = await orderService.getUserOrders(req.user, req.query);
    return successResponse(res, 200, 'Orders retrieved successfully', result.orders, result.pagination);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user);
    return successResponse(res, 200, 'Order details retrieved', { order });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status, note, req.user);
    return successResponse(res, 200, 'Order status updated successfully', { order });
  } catch (error) {
    next(error);
  }
};

const verifyDeliveryOtp = async (req, res, next) => {
  try {
    const order = await orderService.verifyDeliveryOtp(req.params.id, req.body.otp, req.user);
    return successResponse(res, 200, 'Delivery completed successfully', { order });
  } catch (error) {
    next(error);
  }
};

const getFarmerStats = async (req, res, next) => {
  try {
    const stats = await orderService.getFarmerStats(req.user._id);
    return successResponse(res, 200, 'Farmer statistics retrieved', stats);
  } catch (error) {
    next(error);
  }
};

const acceptDeliveryOrder = async (req, res, next) => {
  try {
    const order = await orderService.acceptDeliveryOrder(req.params.id, req.user);
    return successResponse(res, 200, 'Delivery order accepted', { order });
  } catch (error) {
    next(error);
  }
};

const updateDeliveryAddress = async (req, res, next) => {
  try {
    const order = await orderService.updateDeliveryAddress(req.params.id, req.body, req.user);
    return successResponse(res, 200, 'Delivery address updated and agent notified', { order });
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const order = await orderService.cancelOrder(req.params.id, reason, req.user);
    return successResponse(res, 200, 'Order cancelled successfully', { order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  verifyDeliveryOtp,
  getFarmerStats,
  acceptDeliveryOrder,
  updateDeliveryAddress,
  cancelOrder
};
