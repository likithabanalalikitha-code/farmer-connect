const Product = require('../models/Product');
const Category = require('../models/Category');

const queryProducts = async (queryParams) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    organic,
    location,
    farmer,
    sort = 'newest',
    page = 1,
    limit = 12
  } = queryParams;

  const query = { isActive: true };

  // Search by keyword in name or description
  if (search && search.trim() !== '') {
    query.$or = [
      { name: { $regex: search.trim(), $options: 'i' } },
      { description: { $regex: search.trim(), $options: 'i' } },
      { category: { $regex: search.trim(), $options: 'i' } },
      { location: { $regex: search.trim(), $options: 'i' } }
    ];
  }

  // Filter by category
  if (category && category !== 'All' && category.trim() !== '') {
    query.category = { $regex: `^${category.trim()}$`, $options: 'i' };
  }

  // Filter by organic
  if (organic !== undefined && organic !== '') {
    query.organic = organic === 'true' || organic === true;
  }

  // Filter by location
  if (location && location.trim() !== '') {
    query.location = { $regex: location.trim(), $options: 'i' };
  }

  // Filter by farmer
  if (farmer) {
    query.farmer = farmer;
  }

  // Filter by price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  // Sorting
  let sortOption = { createdAt: -1 };
  if (sort === 'price-low') sortOption = { price: 1 };
  else if (sort === 'price-high') sortOption = { price: -1 };
  else if (sort === 'name-asc') sortOption = { name: 1 };
  else if (sort === 'name-desc') sortOption = { name: -1 };
  else if (sort === 'oldest') sortOption = { createdAt: 1 };

  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
  const skip = (parsedPage - 1) * parsedLimit;

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('farmer', 'name email phone avatar farmName farmDescription city state')
      .sort(sortOption)
      .skip(skip)
      .limit(parsedLimit)
      .lean(),
    Product.countDocuments(query)
  ]);

  const pages = Math.ceil(total / parsedLimit) || 1;

  return {
    products,
    pagination: {
      total,
      page: parsedPage,
      limit: parsedLimit,
      pages
    }
  };
};

const getProductById = async (id) => {
  const product = await Product.findById(id)
    .populate('farmer', 'name email phone avatar farmName farmDescription city state address')
    .lean();

  if (!product) {
    const error = new Error('Product not found.');
    error.statusCode = 404;
    throw error;
  }

  return product;
};

const createProduct = async (farmerId, productData) => {
  const product = await Product.create({
    ...productData,
    farmer: farmerId,
    availableQuantity: productData.availableQuantity !== undefined
      ? productData.availableQuantity
      : productData.quantity
  });

  return await product.populate('farmer', 'name farmName city state');
};

const updateProduct = async (productId, userId, userRole, updateData) => {
  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error('Product not found.');
    error.statusCode = 404;
    throw error;
  }

  // Check ownership unless admin
  if (userRole !== 'admin' && product.farmer.toString() !== userId.toString()) {
    const error = new Error('Unauthorized to update this product listing.');
    error.statusCode = 403;
    throw error;
  }

  Object.assign(product, updateData);
  await product.save();

  return await product.populate('farmer', 'name farmName city state');
};

const deleteProduct = async (productId, userId, userRole) => {
  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error('Product not found.');
    error.statusCode = 404;
    throw error;
  }

  if (userRole !== 'admin' && product.farmer.toString() !== userId.toString()) {
    const error = new Error('Unauthorized to delete this product listing.');
    error.statusCode = 403;
    throw error;
  }

  await Product.findByIdAndDelete(productId);
  return { message: 'Product successfully removed.' };
};

const getFarmerProducts = async (farmerId) => {
  return await Product.find({ farmer: farmerId })
    .sort({ createdAt: -1 })
    .lean();
};

const getCategories = async () => {
  // First attempt from Category model, fallback to distinct categories in products
  const dbCategories = await Category.find({ isActive: true }).sort({ name: 1 }).lean();
  if (dbCategories && dbCategories.length > 0) {
    return dbCategories;
  }

  const distinctCategories = await Product.distinct('category', { isActive: true });
  return distinctCategories.map(cat => ({ name: cat, slug: cat.toLowerCase().replace(/\s+/g, '-') }));
};

module.exports = {
  queryProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFarmerProducts,
  getCategories
};
