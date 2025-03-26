const express = require('express');
const AdminController = require('../controllers/AdminController');
const { verifyTokenAdmin } = require('../middleware/veritify'); // Chỉ admin được phép
const router = express.Router();

// Quản lý tài khoản
router.get('/users', verifyTokenAdmin, AdminController.getAllUsers); // Ensure this route exists
router.patch('/users/:id/role', verifyTokenAdmin, AdminController.updateUserRole); // Cập nhật vai trò người dùng

// Quản lý dịch vụ
router.get('/services', verifyTokenAdmin, AdminController.getAllServices); // Ensure this route exists
router.post('/services', verifyTokenAdmin, AdminController.createService); // Tạo dịch vụ mới
router.put('/services/:id', verifyTokenAdmin, AdminController.updateService); // Cập nhật dịch vụ
router.delete('/services/:id', verifyTokenAdmin, AdminController.deleteService); // Xóa dịch vụ

// Quản lý lưu trú
router.get('/boarding', verifyTokenAdmin, AdminController.getAllBoarding); // Lấy danh sách lưu trú

// Báo cáo và thống kê
router.get('/dashboard', verifyTokenAdmin, AdminController.getDashboard); // Lấy dữ liệu dashboard

router.get('/users/by-role', verifyTokenAdmin, AdminController.getUsersByRole);

router.get('/reports/revenue', verifyTokenAdmin, AdminController.getRevenueReport);
router.get('/reports/health-trends', verifyTokenAdmin, AdminController.getHealthTrends);
router.get('/reports/pet-registration', verifyTokenAdmin, AdminController.getPetRegistrationStats);

router.get('/reports/service-usage', verifyTokenAdmin, AdminController.getServiceUsageStats);

// Quản lý cuộc hẹn
router.get('/appointments', verifyTokenAdmin, AdminController.getAllAppointments); // Fetch all appointments
router.delete('/appointments/:id', verifyTokenAdmin, AdminController.deleteAppointment); // Delete an appointment

// Quản lý hồ sơ y tế
router.get('/medical-records', verifyTokenAdmin, AdminController.getAllMedicalRecords); // Fetch all medical records
router.delete('/medical-records/:id', verifyTokenAdmin, AdminController.deleteMedicalRecord); // Delete a medical record

// Đăng nhập và đăng ký admin
router.post('/auth/register', AdminController.registerAdmin); // Đăng ký admin
router.post('/auth/login', AdminController.loginAdmin); // Đăng nhập admin

router.get('/analytics', verifyTokenAdmin, AdminController.getAnalyticsData); // Fetch analytics data

module.exports = router;