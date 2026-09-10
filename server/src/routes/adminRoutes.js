const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Guard all admin routes with authentication and role check
router.use(authenticate, authorizeRoles('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);

router.get('/products', getAdminProducts);
router.put('/products/:id/status', updateProductStatus);
router.delete('/products/:id', deleteProductAdmin);

router.get('/orders', getAdminOrders);
router.put('/orders/:id/assign-agent', assignDeliveryAgent);

router.get('/categories', manageCategories.get);
router.post('/categories', manageCategories.create);
router.put('/categories/:id', manageCategories.update);
router.delete('/categories/:id', manageCategories.delete);

router.get('/ai-summary', getAISummary);

module.exports = router;
