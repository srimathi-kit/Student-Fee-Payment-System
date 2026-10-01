const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const Fee = require('../models/Fee');
const Student = require('../models/Student');

exports.processPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { feeId, amount, paymentMethod } = req.body;
    
    const fee = await Fee.findById(feeId).session(session);
    if(!fee) throw new Error('Fee record not found');
    if(fee.pendingAmount < amount) throw new Error('Payment amount exceeds pending balance');
    
    const transactionId = 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
    
    // Simulate delay
    await new Promise(r => setTimeout(r, 1500));
    
    const payment = new Payment({
      transactionId,
      studentId: fee.studentId,
      feeId: fee._id,
      amount,
      paymentMethod,
      paymentStatus: 'SUCCESS'
    });
    
    await payment.save({ session });
    
    fee.paidAmount += Number(amount);
    fee.pendingAmount -= Number(amount);
    
    if (fee.paidAmount === 0) fee.status = 'PENDING';
    else if (fee.paidAmount > 0 && fee.paidAmount < fee.totalFee) fee.status = 'PARTIALLY_PAID';
    else if (fee.paidAmount === fee.totalFee) fee.status = 'PAID';
    
    await fee.save({ session });
    
    const Notification = require('../models/Notification');
    await Notification.create([{
      userId: fee.studentId,
      title: 'Payment Successful',
      message: `Your payment of ₹${amount.toLocaleString()} was successfully processed.`,
      type: 'PAYMENT'
    }], { session });

    await session.commitTransaction();
    session.endSession();
    
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    let filter = {};
    if(req.user.role === 'student') {
      filter.studentId = req.user._id;
    }
    const payments = await Payment.find(filter).populate('studentId', 'name studentId department').populate('feeId', 'semester').sort({ paymentDate: -1 });
    res.json({ success: true, data: payments });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};