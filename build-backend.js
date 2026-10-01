const fs = require('fs');
const path = require('path');

const serverDir = path.join(__dirname, 'server');
const dirs = ['models', 'controllers', 'routes', 'middleware', 'config'];

dirs.forEach(d => {
  if (!fs.existsSync(path.join(serverDir, d))) {
    fs.mkdirSync(path.join(serverDir, d), { recursive: true });
  }
});

const files = {
  'models/Student.js': `
const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  department: { type: String, required: true },
  year: { type: String, required: true },
  semester: { type: String, required: true },
  passwordHash: { type: String, required: true },
  profileImage: { type: String }
}, { timestamps: true });
module.exports = mongoose.model('Student', studentSchema);
`,
  'models/Fee.js': `
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
`,
  'models/Payment.js': `
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
`,
  'models/Admin.js': `
const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'admin' }
}, { timestamps: true });
module.exports = mongoose.model('Admin', adminSchema);
`,
  'middleware/authMiddleware.js': `
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
`,
  'controllers/authController.js': `
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
`,
  'controllers/feeController.js': `
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
`,
  'controllers/paymentController.js': `
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
`,
  'controllers/studentController.js': `
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
`,
  'controllers/reportController.js': `
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
`,
  'routes/index.js': `
const express = require('express');
const router = express.Router();

const { studentLogin, adminLogin } = require('../controllers/authController');
const { createStudent, getStudents } = require('../controllers/studentController');
const { assignFee, getStudentFees } = require('../controllers/feeController');
const { processPayment, getPayments } = require('../controllers/paymentController');
const { getDashboardStats } = require('../controllers/reportController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/auth/student/login', studentLogin);
router.post('/auth/admin/login', adminLogin);

router.post('/students', protect, adminOnly, createStudent);
router.get('/students', protect, adminOnly, getStudents);

router.post('/fees', protect, adminOnly, assignFee);
router.get('/fees/student/:studentId', protect, getStudentFees);

router.post('/payments', protect, processPayment);
router.get('/payments', protect, getPayments);

router.get('/reports/dashboard', protect, adminOnly, getDashboardStats);

module.exports = router;
`,
  'server.js': `
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', require('./routes/index'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
`,
  'seed.js': `
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Student = require('./models/Student');
const Admin = require('./models/Admin');
const Fee = require('./models/Fee');
const Payment = require('./models/Payment');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Student.deleteMany();
    await Admin.deleteMany();
    await Fee.deleteMany();
    await Payment.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const studentPass = await bcrypt.hash('Student@123', salt);
    const adminPass = await bcrypt.hash('Admin@123', salt);

    const admin = await Admin.create({
      name: 'College Admin',
      email: 'admin@college.edu',
      passwordHash: adminPass
    });

    const student = await Student.create({
      studentId: '23CSE001',
      name: 'Srimathi',
      email: 'srimathi@college.edu',
      phone: '9876543210',
      department: 'Computer Science & Engineering',
      year: 'III Year',
      semester: 'V',
      passwordHash: studentPass
    });

    await Fee.create({
      studentId: student._id,
      academicYear: '2026-2027',
      semester: 'V',
      tuitionFee: 50000,
      examFee: 10000,
      libraryFee: 5000,
      labFee: 10000,
      otherFee: 10000,
      totalFee: 85000,
      paidAmount: 60000,
      pendingAmount: 25000,
      status: 'PENDING'
    });
    
    await Fee.create({
      studentId: student._id,
      academicYear: '2025-2026',
      semester: 'IV',
      tuitionFee: 50000,
      examFee: 10000,
      libraryFee: 5000,
      labFee: 10000,
      otherFee: 7000,
      totalFee: 82000,
      paidAmount: 70000,
      pendingAmount: 12000,
      status: 'PARTIALLY_PAID'
    });

    console.log('Real Demo Data Imported!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(serverDir, filepath), content.trim());
}
console.log('Backend rebuilt successfully.');
