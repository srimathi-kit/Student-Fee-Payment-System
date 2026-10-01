const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  feeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fee', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' },
  paymentDate: { type: Date, default: Date.now },
  failureReason: { type: String }
}, { timestamps: true });
module.exports = mongoose.model('Payment', paymentSchema);