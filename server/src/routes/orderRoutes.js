const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  verifyDeliveryOtp,
  getFarmerStats,
  acceptDeliveryOrder,
  updateDeliveryAddress,
  cancelOrder
} = require('../controllers/orderController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validateOrder, validateDeliveryAddress } = require('../middleware/validationMiddleware');

router.use(authenticate);

router.get('/farmer/stats', authorizeRoles('farmer'), getFarmerStats);
router.post('/:id/delivery/accept', authorizeRoles('delivery-agent'), acceptDeliveryOrder);
router.put('/:id/delivery-address', authorizeRoles('consumer'), validateDeliveryAddress, updateDeliveryAddress);

router.post('/', authorizeRoles('consumer', 'admin'), validateOrder, createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', authorizeRoles('farmer', 'delivery-agent', 'admin'), updateOrderStatus);
router.post('/:id/delivery/verify', authorizeRoles('delivery-agent'), verifyDeliveryOtp);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
