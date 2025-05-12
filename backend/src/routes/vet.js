const express = require('express');
const VetController = require('../controllers/VetController');
const { verifyTokenVet } = require('../middleware/veritify'); // Chỉ bác sĩ hoặc admin được phép
const router = express.Router();


// Unified route to update examination record
router.patch('/appointments/:appointment_id/examination', verifyTokenVet, VetController.updateExaminationRecord);

module.exports = router;