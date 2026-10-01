const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Fee = require('./models/Fee');
const Student = require('./models/Student');

dotenv.config();

const testFees = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  const student = await Student.findOne({ studentId: '23CSE001' });
  console.log('Student ID (ObjectId):', student._id);
  
  const fees = await Fee.find({ studentId: student._id });
  console.log('Fees found:', fees.length);
  
  process.exit();
};

testFees();
