const express = require('express');
const VetController = require('../controllers/VetController');
const { verifyTokenVet } = require('../middleware/veritify'); // Chỉ bác sĩ hoặc admin được phép
const router = express.Router();

// Check if all required controller methods are defined
if (
    !VetController.updateDiagnosisAndTests ||
    !VetController.storePrescription ||
    !VetController.scheduleFollowUp ||
    !VetController.updateExaminationRecord
) {
    throw new Error('One or more VetController methods are undefined. Please check the controller implementation.');
}

// Cập nhật chẩn đoán và xét nghiệm
router.patch('/appointments/:appointment_id/diagnosis', verifyTokenVet, VetController.updateDiagnosisAndTests);

// Lưu trữ đơn thuốc
router.patch('/appointments/:appointment_id/prescription', verifyTokenVet, VetController.storePrescription);

// Lên lịch nhắc tái khám
router.post('/appointments/:appointment_id/follow-up', verifyTokenVet, VetController.scheduleFollowUp);

// Unified route to update examination record
router.patch('/appointments/:appointment_id/examination', verifyTokenVet, VetController.updateExaminationRecord);

module.exports = router;