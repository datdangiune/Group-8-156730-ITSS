const express = require('express');
const AdminController = require('../controllers/AdminController');
const { verifyTokenAdmin} = require('../middleware/veritify'); // Chỉ admin được phép
const router = express.Router();

// Đăng nhập admin
router.post('/auth/login', AdminController.login);

// Dashboard stats
router.get('/dashboard/stats', verifyTokenAdmin, AdminController.getDashboardStats);

// Analytics data
router.get('/analytics', verifyTokenAdmin, AdminController.getAnalyticsData);

// Quản lý user
router.get('/users', verifyTokenAdmin, AdminController.getAllUsers);
router.post('/users', verifyTokenAdmin, AdminController.addUser);
// router.patch('/users/:id/role', verifyTokenAdmin, AdminController.updateUserRole); // (bạn cần viết hàm này trong AdminController nếu chưa có)

// Quản lý cuộc hẹn
router.get('/appointments', verifyTokenAdmin, AdminController.getAppointments);

// Quản lý hồ sơ y tế
router.get('/medical-records', verifyTokenAdmin, AdminController.getMedicalRecords);

// Quản lý lưu trú
router.get('/boarding-info', verifyTokenAdmin, AdminController.getBoardingInfo);

// Quản lý thông báo
router.get('/notifications', verifyTokenAdmin, AdminController.getNotifications);
router.patch('/notifications/mark-all-read', verifyTokenAdmin, AdminController.markAllNotificationsAsRead);

// Quản lý hồ sơ admin
router.put('/profile', verifyTokenAdmin, AdminController.updateProfile);
router.put('/profile/password', verifyTokenAdmin, AdminController.updatePassword);
router.put('/profile/notification-preferences', verifyTokenAdmin, AdminController.updateNotificationPreferences);
router.put('/profile/system-settings', verifyTokenAdmin, AdminController.updateSystemSettings);


// router.delete('/del', AdminController.deleteService)
module.exports = router;