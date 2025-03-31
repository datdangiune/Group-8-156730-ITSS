const express = require('express');
const AdminController = require('../controllers/AdminController');
const { verifyTokenAdmin } = require('../middleware/veritify'); // Chỉ admin được phép
const router = express.Router();

// Quản lý tài khoản
router.get('/users', verifyTokenAdmin, AdminController.getAllUsers);
router.post('/users', verifyTokenAdmin, AdminController.addUser);

// Quản lý dịch vụ
// router.get('/services', verifyTokenAdmin, AdminController.getAllServices);

// Quản lý lưu trú
router.get('/boarding', verifyTokenAdmin, AdminController.getBoardingInfo);

// Báo cáo và thống kê
router.get('/dashboard', verifyTokenAdmin, AdminController.getDashboardStats);
router.get('/analytics', verifyTokenAdmin, AdminController.getAnalyticsData);

// Quản lý cuộc hẹn
router.get('/appointments', verifyTokenAdmin, AdminController.getAppointments);

// Quản lý hồ sơ y tế
router.get('/medical-records', verifyTokenAdmin, AdminController.getMedicalRecords);

// Quản lý thông báo
router.get('/notifications', verifyTokenAdmin, AdminController.getNotifications);
router.patch('/notifications/read-all', verifyTokenAdmin, AdminController.markAllNotificationsAsRead);

// Quản lý admin
router.post('/auth/login', AdminController.login);
router.patch('/profile', verifyTokenAdmin, AdminController.updateProfile);
router.patch('/profile/password', verifyTokenAdmin, AdminController.updatePassword);

module.exports = router;
