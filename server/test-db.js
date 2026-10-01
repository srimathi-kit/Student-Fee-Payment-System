const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Student = require('./models/Student');

dotenv.config();

const testDb = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected successfully');
  
  const student = await Student.findOne({ studentId: '23CSE001' });
  console.log('Student found:', !!student);
  
  if (student) {
    const match = await bcrypt.compare('Student@123', student.passwordHash);
    console.log('Password match:', match);
  }
  
  process.exit();
};

testDb();
