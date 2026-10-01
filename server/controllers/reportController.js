const Fee = require('../models/Fee');
const Student = require('../models/Student');
const Payment = require('../models/Payment');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const fees = await Fee.find();
    let totalFees = 0;
    let totalCollected = 0;
    let totalPending = 0;
    
    fees.forEach(fee => {
      totalFees += fee.totalFee;
      totalCollected += fee.paidAmount;
      totalPending += fee.pendingAmount;
    });
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const todaysPayments = await Payment.find({ paymentStatus: 'SUCCESS', paymentDate: { $gte: today } });
    const todaysCollection = todaysPayments.reduce((acc, p) => acc + p.amount, 0);

    res.json({ success: true, data: { totalStudents, totalFees, totalCollected, totalPending, todaysCollection } });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};