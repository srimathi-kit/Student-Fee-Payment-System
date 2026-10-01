const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

const generateToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });

exports.studentLogin = async (req, res) => {
  try {
    const { studentId, password } = req.body;
    const student = await Student.findOne({ studentId });
    if (student && (await bcrypt.compare(password, student.passwordHash))) {
      res.json({ success: true, data: { _id: student._id, studentId: student.studentId, name: student.name, role: 'student', token: generateToken(student._id, 'student') } });
    } else {
      res.status(401).json({ success: false, message: 'Invalid Student ID or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
      res.json({ success: true, data: { _id: admin._id, name: admin.name, role: 'admin', token: generateToken(admin._id, 'admin') } });
    } else {
      res.status(401).json({ success: false, message: 'Invalid Email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized' });
    const userData = { ...req.user.toObject(), role: req.user.role };
    res.json({ success: true, data: userData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};