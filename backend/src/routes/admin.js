const express = require('express');
const AdminController = require('../controllers/AdminController');
const { verifyTokenAdmin } = require('../middleware/veritify'); // Chỉ admin được phép
const router = express.Router();

// Quản lý tài khoản
router.get('/users', verifyTokenAdmin, AdminController.getAllUsers); // Lấy danh sách người dùng
router.patch('/users/:id/role', verifyTokenAdmin, AdminController.updateUserRole); // Cập nhật vai trò người dùng

// Quản lý dịch vụ
router.get('/services', verifyTokenAdmin, AdminController.getAllServices); // Lấy danh sách dịch vụ
router.post('/services', verifyTokenAdmin, AdminController.createService); // Tạo dịch vụ mới

// Quản lý lưu trú
router.get('/boarding', verifyTokenAdmin, AdminController.getAllBoarding); // Lấy danh sách lưu trú

// Báo cáo và thống kê
router.get('/dashboard', verifyTokenAdmin, AdminController.getDashboard); // Lấy dữ liệu dashboard

router.get('/users/by-role', verifyTokenAdmin, AdminController.getUsersByRole);

router.get('/reports/revenue', verifyTokenAdmin, AdminController.getRevenueReport);

router.get('/reports/health-trends', verifyTokenAdmin, AdminController.getHealthTrends);

router.get('/reports/pet-registration', verifyTokenAdmin, AdminController.getPetRegistrationStats);

router.get('/reports/service-usage', verifyTokenAdmin, AdminController.getServiceUsageStats);
module.exports = router;