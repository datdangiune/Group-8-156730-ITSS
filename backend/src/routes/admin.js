const express = require('express');
const AdminController = require('../controllers/AdminController');
const { verifyTokenAdmin } = require('../middleware/veritify'); // Chỉ admin được phép
const router = express.Router();

// Check if all required controller methods are defined
// if (
//     !AdminController.getAllUsers ||
//     !AdminController.updateUserRole ||
//     !AdminController.getAllServices ||
//     !AdminController.createService ||
//     !AdminController.updateService ||
//     !AdminController.deleteService ||
//     !AdminController.getAllBoarding ||
//     !AdminController.getDashboard ||
//     !AdminController.getUsersByRole ||
//     !AdminController.getRevenueReport ||
//     !AdminController.getHealthTrends ||
//     !AdminController.getPetRegistrationStats ||
//     !AdminController.getServiceUsageStats ||
//     !AdminController.getAllAppointments ||
//     !AdminController.deleteAppointment ||
//     !AdminController.getAllMedicalRecords ||
//     !AdminController.deleteMedicalRecord ||
//     !AdminController.registerAdmin ||
//     !AdminController.loginAdmin ||
//     !AdminController.getAnalyticsData
// ) {
//     throw new Error('One or more AdminController methods are undefined. Please check the controller implementation.');
// }

// // Define routes
// router.get('/users', verifyTokenAdmin, AdminController.getAllUsers);
// router.patch('/users/:id/role', verifyTokenAdmin, AdminController.updateUserRole);
// router.get('/services', verifyTokenAdmin, AdminController.getAllServices);
// router.post('/services', verifyTokenAdmin, AdminController.createService);
// router.put('/services/:id', verifyTokenAdmin, AdminController.updateService);
// router.delete('/services/:id', verifyTokenAdmin, AdminController.deleteService);
// router.get('/boarding', verifyTokenAdmin, AdminController.getAllBoarding);
// router.get('/dashboard', verifyTokenAdmin, AdminController.getDashboard);
// router.get('/users/by-role', verifyTokenAdmin, AdminController.getUsersByRole);
// router.get('/reports/revenue', verifyTokenAdmin, AdminController.getRevenueReport);
// router.get('/reports/health-trends', verifyTokenAdmin, AdminController.getHealthTrends);
// router.get('/reports/pet-registration', verifyTokenAdmin, AdminController.getPetRegistrationStats);
// router.get('/reports/service-usage', verifyTokenAdmin, AdminController.getServiceUsageStats);
// router.get('/appointments', verifyTokenAdmin, AdminController.getAllAppointments);
// router.delete('/appointments/:id', verifyTokenAdmin, AdminController.deleteAppointment);
// router.get('/medical-records', verifyTokenAdmin, AdminController.getAllMedicalRecords);
// router.delete('/medical-records/:id', verifyTokenAdmin, AdminController.deleteMedicalRecord);
// router.post('/auth/register', AdminController.registerAdmin);
// router.post('/auth/login', AdminController.loginAdmin);
// router.get('/analytics', verifyTokenAdmin, AdminController.getAnalyticsData);

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