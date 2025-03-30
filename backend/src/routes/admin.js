const express = require('express');
const AdminController = require('../controllers/AdminController');
const { verifyTokenAdmin } = require('../middleware/veritify'); // Chỉ admin được phép
const router = express.Router();

// Quản lý tài khoản
router.get('/users', verifyTokenAdmin, AdminController.getAllUsers); 
router.patch('/users/:id/role', verifyTokenAdmin, AdminController.updateUserRole); 

// Quản lý dịch vụ
router.get('/services', verifyTokenAdmin, AdminController.getAllServices); 
router.post('/services', verifyTokenAdmin, AdminController.addService); // Đồng bộ với AdminController
router.put('/services/:id', verifyTokenAdmin, AdminController.updateService);
router.delete('/services/:id', verifyTokenAdmin, AdminController.deleteService);

// Quản lý lưu trú
router.get('/boarding', verifyTokenAdmin, AdminController.getBoardingInfo); // Đổi tên API cho đúng với AdminController

// Báo cáo và thống kê
router.get('/dashboard', verifyTokenAdmin, AdminController.getDashboardStats); // Đổi tên API
router.get('/analytics', verifyTokenAdmin, AdminController.getAnalyticsData); 

router.get('/reports/revenue', verifyTokenAdmin, AdminController.getRevenueReport);
router.get('/reports/service-usage', verifyTokenAdmin, AdminController.getServiceUsageStats);

// Quản lý cuộc hẹn
router.get('/appointments', verifyTokenAdmin, AdminController.getAppointments); 
router.delete('/appointments/:id', verifyTokenAdmin, AdminController.deleteAppointment); 

// Quản lý hồ sơ y tế
router.get('/medical-records', verifyTokenAdmin, AdminController.getMedicalRecords); // Đồng bộ với AdminController
router.delete('/medical-records/:id', verifyTokenAdmin, AdminController.deleteMedicalRecord);

// Đăng nhập và quản lý admin
router.post('/auth/login', AdminController.login);
router.post('/auth/register', verifyTokenAdmin, AdminController.registerAdmin); 

// Thông báo và cài đặt
router.get('/notifications', verifyTokenAdmin, AdminController.getNotifications);
router.post('/notifications/mark-all-read', verifyTokenAdmin, AdminController.markAllNotificationsAsRead);

router.put('/settings/profile', verifyTokenAdmin, AdminController.updateProfile);
router.put('/settings/account', verifyTokenAdmin, AdminController.updatePassword); // Sửa đúng tên API
router.put('/settings/notifications', verifyTokenAdmin, AdminController.updateNotificationPreferences);
router.put('/settings/system', verifyTokenAdmin, AdminController.updateSystemSettings);

module.exports = router;
