// middleware/adminAuth.js
const auth = require('./auth');

module.exports = function(req, res, next) {
  // First, check if token is valid (auth middleware)
  auth(req, res, () => {
    // Then, check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied: Not an admin' });
    }
    next();
  });
};