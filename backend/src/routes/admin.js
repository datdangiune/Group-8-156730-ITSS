const express = require('express');
const AdminController = require('../controllers/AdminController');
const { verifyTokenAdmin } = require('../middleware/veritify'); // Chỉ admin được phép
const router = express.Router();

// Đăng nhập admin
router.post('/auth/login', AdminController.login);

// Dashboard và báo cáo
router.get('/dashboard', verifyTokenAdmin, AdminController.getDashboardStats);
router.get('/analytics', verifyTokenAdmin, AdminController.getAnalyticsData);

// Quản lý người dùng
router.get('/users', verifyTokenAdmin, AdminController.getAllUsers);
router.post('/allusers', verifyTokenAdmin, AdminController.addUser);

// Quản lý dịch vụ
router.get('/services', verifyTokenAdmin, AdminController.getAllServices);


// Quản lý cuộc hẹn
router.get('/appointments', verifyTokenAdmin, AdminController.getAppointments);

// Quản lý hồ sơ y tế
router.get('/medical-records', verifyTokenAdmin, AdminController.getMedicalRecords);

// Quản lý lưu trú
router.get('/boarding', verifyTokenAdmin, AdminController.getBoardingInfo);

// Thông báo
router.get('/notifications', verifyTokenAdmin, AdminController.getNotifications);
router.post('/notifications/mark-all-read', verifyTokenAdmin, AdminController.markAllNotificationsAsRead);

// Cài đặt admin
router.put('/settings/profile', verifyTokenAdmin, AdminController.updateProfile);
router.put('/settings/account', verifyTokenAdmin, AdminController.updatePassword);
router.put('/settings/notifications', verifyTokenAdmin, AdminController.updateNotificationPreferences);
router.put('/settings/system', verifyTokenAdmin, AdminController.updateSystemSettings);

module.exports = router;
