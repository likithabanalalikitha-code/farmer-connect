const { body, param, query, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/apiResponse');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg
    }));
    return errorResponse(res, 400, 'Validation failed. Please check your inputs.', formattedErrors);
  }
  next();
};

const validateRegister = [
  body('name').trim().notEmpty().withMessage('Full name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('role')
    .optional()
    .isIn(['consumer', 'farmer', 'delivery-agent'])
    .withMessage('Role must be consumer, farmer, or delivery-agent. Admin cannot be registered publicly.'),
  body('phone').optional().trim(),
  body('farmName').optional().trim(),
  body('farmDescription').optional().trim(),
  handleValidationErrors
];

const validateLogin = [
  body('email').trim().isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

const validateProduct = [
  body('name').trim().notEmpty().withMessage('Product name is required').isLength({ max: 150 }),
  body('description').trim().notEmpty().withMessage('Product description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),
  body('unit').trim().notEmpty().withMessage('Unit of measurement is required'),
  body('quantity').isFloat({ min: 0 }).withMessage('Quantity must be greater than or equal to 0'),
  body('availableQuantity')
    .isFloat({ min: 0 })
    .withMessage('Available quantity must be greater than or equal to 0'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('organic').optional().isBoolean().withMessage('Organic must be true or false'),
  body('images').optional().isArray().withMessage('Images must be an array of URLs'),
  handleValidationErrors
];

const validateOrder = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.product').isMongoId().withMessage('Valid Product ID is required for each item'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1 for each item'),
  body('shippingAddress.fullName').trim().notEmpty().withMessage('Recipient full name is required'),
  body('shippingAddress.phone').trim().notEmpty().withMessage('Phone number is required'),
  body('shippingAddress.address').trim().notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.pincode').trim().notEmpty().withMessage('Pincode is required'),
  body('shippingAddress.location.latitude').optional().isFloat({ min: -90, max: 90 }),
  body('shippingAddress.location.longitude').optional().isFloat({ min: -180, max: 180 }),
  handleValidationErrors
];

const validateDeliveryAddress = [
  body('fullName').trim().notEmpty().withMessage('Recipient full name is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('address').trim().notEmpty().withMessage('Street address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('pincode').trim().notEmpty().withMessage('Pincode is required'),
  body('location.latitude').optional().isFloat({ min: -90, max: 90 }),
  body('location.longitude').optional().isFloat({ min: -180, max: 180 }),
  handleValidationErrors
];

const validateProfile = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().trim(),
  body('address').optional().trim(),
  body('city').optional().trim(),
  body('state').optional().trim(),
  body('pincode').optional().trim(),
  body('farmName').optional().trim(),
  body('farmDescription').optional().trim(),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateProduct,
  validateOrder,
  validateDeliveryAddress,
  validateProfile,
  handleValidationErrors
};
