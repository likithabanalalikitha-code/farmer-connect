const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getNotifications,
  markNotificationRead
} = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');
const { validateProfile } = require('../middleware/validationMiddleware');

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', validateProfile, updateProfile);

router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);

module.exports = router;
