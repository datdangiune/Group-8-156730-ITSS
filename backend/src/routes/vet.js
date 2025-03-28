const express = require('express');
const VetController = require('../controllers/VetController');
const { verifyTokenVet } = require('../middleware/veritify'); // Chỉ bác sĩ hoặc admin được phép
const router = express.Router();

// Quản lý hồ sơ y tế
router.patch('/medical-records/:id', verifyTokenVet, VetController.updateMedicalRecord); // Cập nhật hồ sơ y tế
router.patch('/medical-records/:id/prescription', verifyTokenVet, VetController.addPrescription); // Lưu trữ đơn thuốc

// Gửi thông báo
router.post('/notifications/reminder', verifyTokenVet, VetController.sendFollowUpReminder); // Gửi nhắc lịch tái khám
router.post('/notifications/health-alert', verifyTokenVet, VetController.sendHealthAlert); // Gửi cảnh báo sức khỏe

// Lấy danh sách lịch hẹn của bác sĩ
router.get('/appointments', verifyTokenVet, VetController.getVetAppointments); // Lấy danh sách lịch hẹn của bác sĩ

router.post('/notifications/routine-reminder', verifyTokenVet, VetController.sendRoutineReminder); // Gửi nhắc lịch tái khám định kỳ


module.exports = router;