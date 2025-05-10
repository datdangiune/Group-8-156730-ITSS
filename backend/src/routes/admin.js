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


// === Auth ===
router.post('/login', AdminController.login);

// === Dashboard ===
router.get('/dashboard/stats', AdminController.getDashboardStats);
router.get('/dashboard/monthly-revenue', AdminController.getMonthlyRevenue);
router.get('/dashboard/service-stats', AdminController.getServiceStatsByCategory);
router.get('/dashboard/today-schedule', AdminController.getTodaySchedule);
router.get('/dashboard/recent-notifications', AdminController.getRecentNotifications);

// === Users ===
router.get('/users', AdminController.getAllUsers);
router.post('/users', AdminController.addUser);
router.put('/users/:id', AdminController.updateUser);
router.patch('/users/:id/password', AdminController.changeUserPassword);

// === Services ===
router.get('/services', AdminController.getAllServices);

// === Appointments ===
router.get('/appointments/upcoming', AdminController.getUpcomingAppointments);
router.get('/appointments/recent', AdminController.getRecentAppointments);

// === Medical Records ===
router.get('/medical-records/recent', AdminController.getRecentMedicalRecords);
router.get('/medical-records/:id', AdminController.getMedicalRecordById);

// === Boarding ===
router.get('/boarding/stats', AdminController.getBoardingStats);
router.get('/boarding/current', AdminController.getCurrentBoarders);

// === Analytics ===
router.get('/analytics/monthly-revenue', AdminController.getMonthlyRevenue); // trùng với dashboard
router.get('/analytics/service-breakdown', AdminController.getServiceBreakdown);
router.get('/analytics/kpis', AdminController.getKPIs);

// === Notifications ===
router.get('/notifications', AdminController.getAllNotifications);
router.get('/notifications/unread', AdminController.getUnreadNotifications);
router.patch('/notifications/mark-all-read', AdminController.markAllAsRead);
router.patch('/notifications/:id/mark-read', AdminController.markAsRead);

module.exports = router;