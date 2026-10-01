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