const express = require('express');
const StaffController = require('../controllers/StaffController');
const { verifyTokenAdmin } = require('../middleware/veritify'); // Chỉ nhân viên hoặc admin được phép
const router = express.Router();

// Quản lý lịch hẹn
router.get('/appointments', verifyTokenAdmin, StaffController.getAllAppointments); // Lấy danh sách lịch hẹn
router.patch('/appointments/:id', verifyTokenAdmin, StaffController.updateAppointmentStatus); // Cập nhật trạng thái lịch hẹn

// Quản lý dịch vụ
router.patch('/services/:id', verifyTokenAdmin, StaffController.updateServiceStatus); // Cập nhật trạng thái dịch vụ

// Quản lý lưu trú
router.get('/boarding', verifyTokenAdmin, StaffController.getAllBoarding); // Lấy danh sách lưu trú
router.patch('/boarding/:id', verifyTokenAdmin, StaffController.updateBoardingStatus); // Cập nhật trạng thái lưu trú

// Gửi thông báo và cập nhật tình trạng thú cưng
router.post('/boarding/:id/notify', verifyTokenAdmin, StaffController.notifyBoardingStatus);

router.post('/boarding/:id/pickup-reminder', verifyTokenAdmin, StaffController.sendPickupReminder);
module.exports = router;