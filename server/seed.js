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