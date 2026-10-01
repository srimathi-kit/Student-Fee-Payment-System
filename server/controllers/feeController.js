const Fee = require('../models/Fee');
const Student = require('../models/Student');

const updateFeeStatus = (fee) => {
  if (fee.paidAmount === 0) fee.status = 'PENDING';
  else if (fee.paidAmount > 0 && fee.paidAmount < fee.totalFee) fee.status = 'PARTIALLY_PAID';
  else if (fee.paidAmount === fee.totalFee) fee.status = 'PAID';
  
  if(fee.dueDate && new Date() > fee.dueDate && fee.pendingAmount > 0) fee.status = 'OVERDUE';
  return fee;
}

exports.assignFee = async (req, res) => {
  try {
    const { studentId, academicYear, semester, tuitionFee, examFee, libraryFee, labFee, hostelFee, transportFee, otherFee, dueDate } = req.body;
    const student = await Student.findOne({ studentId });
    if(!student) return res.status(404).json({ success: false, message: 'Student not found' });
    
    const totalFee = (tuitionFee||0) + (examFee||0) + (libraryFee||0) + (labFee||0) + (hostelFee||0) + (transportFee||0) + (otherFee||0);
    let fee = new Fee({
      studentId: student._id, academicYear, semester, tuitionFee, examFee, libraryFee, labFee, hostelFee, transportFee, otherFee,
      totalFee, paidAmount: 0, pendingAmount: totalFee, dueDate
    });
    
    fee = updateFeeStatus(fee);
    await fee.save();
    res.status(201).json({ success: true, data: fee });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getStudentFees = async (req, res) => {
  try {
    let studentId = req.params.studentId;
    if(req.user.role === 'student' && req.user._id.toString() !== studentId) {
       // Allow querying by student ID string
       const s = await Student.findOne({studentId});
       if(s) studentId = s._id.toString();
    }
    const fees = await Fee.find({ studentId }).sort({ createdAt: -1 });
    res.json({ success: true, data: fees });
  } catch(err) {
    res.status(500).json({ success: false, message: err.message });
  }
};