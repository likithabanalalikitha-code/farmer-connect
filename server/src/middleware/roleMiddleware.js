const { errorResponse } = require('../utils/apiResponse');

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'Authentication required to access this resource.');
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        `Access denied. Role '${req.user.role}' is not authorized to perform this action.`
      );
    }

    next();
  };
};

module.exports = {
  authorizeRoles
};
