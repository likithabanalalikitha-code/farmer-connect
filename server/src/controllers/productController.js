const productService = require('../services/productService');
const { successResponse } = require('../utils/apiResponse');

const getProducts = async (req, res, next) => {
  try {
    const result = await productService.queryProducts(req.query);
    return successResponse(res, 200, 'Products fetched successfully', result.products, result.pagination);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    return successResponse(res, 200, 'Product details fetched', { product });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.user._id, req.body);
    return successResponse(res, 201, 'Product created successfully', { product });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(
      req.params.id,
      req.user._id,
      req.user.role,
      req.body
    );
    return successResponse(res, 200, 'Product updated successfully', { product });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const result = await productService.deleteProduct(
      req.params.id,
      req.user._id,
      req.user.role
    );
    return successResponse(res, 200, result.message);
  } catch (error) {
    next(error);
  }
};

const getFarmerProducts = async (req, res, next) => {
  try {
    const products = await productService.getFarmerProducts(req.user._id);
    return successResponse(res, 200, 'Farmer products retrieved', { products });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await productService.getCategories();
    return successResponse(res, 200, 'Categories retrieved', { categories });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFarmerProducts,
  getCategories
};
