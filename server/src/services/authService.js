const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const registerUser = async ({ name, email, password, role = 'consumer', phone, farmName, farmDescription }) => {
  // Public registration supports operational roles but never administrative access.
  const assignedRole = ['farmer', 'delivery-agent'].includes(role) ? role : 'consumer';

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('A user with this email address already exists.');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({
    name,
    email,
    password,
    role: assignedRole,
    phone: phone || '',
    farmName: assignedRole === 'farmer' ? farmName || `${name}'s Farm` : '',
    farmDescription: assignedRole === 'farmer' ? farmDescription || '' : ''
  });

  const token = generateToken(user);
  return { user: user.toJSON(), token };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error('Your account has been deactivated. Please contact support.');
    error.statusCode = 403;
    throw error;
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);
  return { user: user.toJSON(), token };
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }
  return user.toJSON();
};

const updateUserProfile = async (userId, updateData) => {
  // Disallow modifying role or password directly here
  delete updateData.role;
  delete updateData.password;
  delete updateData.email;

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true
  });

  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  return user.toJSON();
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};
