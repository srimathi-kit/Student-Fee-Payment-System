const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if(decoded.role === 'admin') {
        req.user = await Admin.findById(decoded.id).select('-passwordHash');
        req.user.role = 'admin';
      } else {
        req.user = await Student.findById(decoded.id).select('-passwordHash');
        req.user.role = 'student';
      }
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as an admin' });
  }
};
module.exports = { protect, adminOnly };