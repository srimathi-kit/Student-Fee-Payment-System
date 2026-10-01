const express = require('express');
const router = express.Router();
const { getStudentFee } = require('../controllers/feeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:studentId').get(protect, getStudentFee);

module.exports = router;
