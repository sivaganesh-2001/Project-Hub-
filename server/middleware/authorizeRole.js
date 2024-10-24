// Middleware to check for HOD role
const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
      // Check if the user's roles array contains any of the allowed roles
      if (!req.user.roles.some(role => allowedRoles.includes(role))) {
        return res.status(403).json({ message: 'Access denied. You do not have the required permissions.' });
      }
      next();
    };
  };
  
  
module.exports = authorizeRole;

