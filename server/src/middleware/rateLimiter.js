const rateLimit = require('express-rate-limit');
const { errorResponse } = require('../utils/apiResponse');

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(res, 429, 'Too many requests from this IP, please try again after 15 minutes.');
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(res, 429, 'Too many login or registration attempts. Please try again after 15 minutes.');
  }
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(res, 429, 'AI query limit reached. Please wait a few minutes before asking more questions.');
  }
});

module.exports = {
  generalLimiter,
  authLimiter,
  aiLimiter
};
