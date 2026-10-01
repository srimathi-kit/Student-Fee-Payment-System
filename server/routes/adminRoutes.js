const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const Student = require('../models/Student');
const Fee = require('../models/Fee');
const Payment = require('../models/Payment');
const bcrypt = require('bcryptjs');

// Helper admin endpoints
router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({ role: 'student' });
    const fees = await Fee.find();
    let totalFeeAmount = 0;
    let totalCollected = 0;
    let totalPending = 0;
    
    fees.forEach(fee => {
      totalFeeAmount += fee.totalFee;
      totalCollected += fee.paidAmount;
      totalPending += fee.pendingAmount;
    });

    res.json({ totalStudents, totalFeeAmount, totalCollected, totalPending });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/student', protect, admin, async (req, res) => {
  try {
    const { studentId, name, email, department, year, semester, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const student = await Student.create({ studentId, name, email, department, year, semester, password: hashedPassword });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/students', protect, admin, async (req, res) => {
  try {
    const students = await Student.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/fee', protect, admin, async (req, res) => {
    try {
      const { studentId, semester, tuitionFee, examFee, libraryFee, hostelFee, otherFee } = req.body;
      const student = await Student.findOne({ studentId });
      if(!student) return res.status(404).json({message: 'Student not found'});
      
      const totalFee = tuitionFee + examFee + libraryFee + hostelFee + otherFee;
      const fee = await Fee.create({ studentId: student._id, semester, tuitionFee, examFee, libraryFee, hostelFee, otherFee, totalFee, pendingAmount: totalFee });
      res.status(201).json(fee);
    } catch(err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/payments', protect, admin, async (req, res) => {
    try {
        const payments = await Payment.find().populate('studentId', 'name studentId department').sort({ createdAt: -1 });
        res.json(payments);
    } catch(err) {
        res.status(500).json({message: err.message});
    }
})

module.exports = router;
