const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

exports.createStudent = async (req, res) => {
  try {
    const { studentId, name, email, phone, department, year, semester, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const student = await Student.create({ studentId, name, email, phone, department, year, semester, passwordHash });
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().select('-passwordHash');
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).select('-passwordHash');
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { email, phone, profileImage } = req.body;
    const student = await Student.findById(req.user._id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    
    if (email) student.email = email;
    if (phone) student.phone = phone;
    if (profileImage) student.profileImage = profileImage;
    
    await student.save();
    
    // Create notification
    const Notification = require('../models/Notification');
    await Notification.create({
      userId: student._id,
      title: 'Profile Updated',
      message: 'Your student profile has been updated successfully.',
      type: 'INFO'
    });
    
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};