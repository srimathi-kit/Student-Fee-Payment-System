const express = require('express');
const router = express.Router();
const { makePayment, getStudentPayments } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, makePayment);
router.route('/student/:studentId').get(protect, getStudentPayments);

module.exports = router;
