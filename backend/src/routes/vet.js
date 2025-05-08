const express = require('express');
const VetController = require('../controllers/VetController');
const { verifyTokenVet } = require('../middleware/veritify'); // Chỉ bác sĩ hoặc admin được phép
const router = express.Router();

// Cập nhật chẩn đoán và xét nghiệm
router.patch('/appointments/:appointment_id/diagnosis', verifyTokenVet, VetController.updateDiagnosisAndTests);

// Lưu trữ đơn thuốc
router.patch('/appointments/:appointment_id/prescription', verifyTokenVet, VetController.storePrescription);

// Lên lịch nhắc tái khám
router.post('/appointments/:appointment_id/follow-up', verifyTokenVet, VetController.scheduleFollowUp);

module.exports = router;