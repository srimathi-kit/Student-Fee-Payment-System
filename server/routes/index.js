const express = require('express');
const router = express.Router();

const { studentLogin, adminLogin, getMe } = require('../controllers/authController');
const { createStudent, getStudents, getProfile, updateProfile } = require('../controllers/studentController');
const { assignFee, getStudentFees } = require('../controllers/feeController');
const { processPayment, getPayments } = require('../controllers/paymentController');
const { getDashboardStats } = require('../controllers/reportController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/auth/student/login', studentLogin);
router.post('/auth/admin/login', adminLogin);
router.get('/auth/me', protect, getMe);

router.post('/students', protect, adminOnly, createStudent);
router.get('/students', protect, adminOnly, getStudents);
router.get('/students/profile', protect, getProfile);
router.put('/students/profile', protect, updateProfile);

router.post('/fees', protect, adminOnly, assignFee);
router.get('/fees/student/:studentId', protect, getStudentFees);

router.post('/payments', protect, processPayment);
router.get('/payments', protect, getPayments);

const { getNotifications } = require('../controllers/notificationController');
router.get('/notifications', protect, getNotifications);

router.get('/reports/dashboard', protect, adminOnly, getDashboardStats);

module.exports = router;