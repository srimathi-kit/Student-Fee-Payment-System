const mongoose = require('mongoose');
const feeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  academicYear: { type: String, required: true },
  semester: { type: String, required: true },
  tuitionFee: { type: Number, default: 0 },
  examFee: { type: Number, default: 0 },
  libraryFee: { type: Number, default: 0 },
  labFee: { type: Number, default: 0 },
  hostelFee: { type: Number, default: 0 },
  transportFee: { type: Number, default: 0 },
  otherFee: { type: Number, default: 0 },
  totalFee: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  pendingAmount: { type: Number, required: true },
  dueDate: { type: Date },
  status: { type: String, enum: ['PAID', 'PARTIALLY_PAID', 'PENDING', 'OVERDUE'], default: 'PENDING' }
}, { timestamps: true });
module.exports = mongoose.model('Fee', feeSchema);