const authService = require('../services/authService');
const Notification = require('../models/Notification');
const { successResponse } = require('../utils/apiResponse');

const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getUserProfile(req.user._id);
    return successResponse(res, 200, 'Profile retrieved', { user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await authService.updateUserProfile(req.user._id, req.body);
    return successResponse(res, 200, 'Profile successfully updated', { user: updatedUser });
  } catch (error) {
    next(error);
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });

    return successResponse(res, 200, 'Notifications retrieved', {
      notifications,
      unreadCount
    });
  } catch (error) {
    next(error);
  }
};

const markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id === 'all') {
      await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
      return successResponse(res, 200, 'All notifications marked as read');
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { isRead: true },
      { new: true }
    );

    return successResponse(res, 200, 'Notification marked as read', { notification });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getNotifications,
  markNotificationRead
};
