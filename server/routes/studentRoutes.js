const express = require('express');
const router = express.Router();
const { authStudent, getStudentProfile } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', authStudent);
router.route('/:id').get(protect, getStudentProfile);

module.exports = router;
