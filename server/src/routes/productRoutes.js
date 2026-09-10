const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFarmerProducts,
  getCategories
} = require('../controllers/productController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validateProduct } = require('../middleware/validationMiddleware');

// Public endpoints
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/farmer/my-products', authenticate, authorizeRoles('farmer', 'admin'), getFarmerProducts);
router.get('/:id', getProductById);

// Farmer / Admin restricted endpoints
router.post('/', authenticate, authorizeRoles('farmer', 'admin'), validateProduct, createProduct);
router.put('/:id', authenticate, authorizeRoles('farmer', 'admin'), updateProduct);
router.delete('/:id', authenticate, authorizeRoles('farmer', 'admin'), deleteProduct);

module.exports = router;
