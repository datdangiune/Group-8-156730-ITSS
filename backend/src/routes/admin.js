// Fixed admin.js - Most important: Removed verifyTokenAdmin from login route

const express = require('express');
const AdminController = require('../controllers/AdminController');
const { verifyTokenAdmin } = require('../middleware/veritify'); // Only admins allowed
const router = express.Router();

// === Auth ===
router.post('/login', AdminController.login); // Removed verifyTokenAdmin middleware

// === Dashboard ===
router.get('/dashboard/stats', verifyTokenAdmin, AdminController.getDashboardStats);
router.get('/dashboard/monthly-revenue', verifyTokenAdmin, AdminController.getMonthlyRevenue);
router.get('/dashboard/service-stats', verifyTokenAdmin, AdminController.getServiceStatsByCategory);
router.get('/dashboard/today-schedule', verifyTokenAdmin, AdminController.getTodaySchedule);
router.get('/dashboard/recent-notifications', verifyTokenAdmin, AdminController.getRecentNotifications);

// === Users ===
router.get('/users', verifyTokenAdmin, AdminController.getAllUsers);
router.post('/users', verifyTokenAdmin, AdminController.addUser);
router.put('/users/:id', verifyTokenAdmin, AdminController.updateUser);
router.patch('/users/:id/password', verifyTokenAdmin, AdminController.changeUserPassword);

// === Services ===
router.get('/services', verifyTokenAdmin, AdminController.getAllServices);
router.get('/services-with-stats', verifyTokenAdmin, AdminController.getServiceListWithStats);
router.get('/service-users-by-service', verifyTokenAdmin, AdminController.getServiceUsersByService);

// === Appointments ===
router.get('/appointments/upcoming', verifyTokenAdmin, AdminController.getUpcomingAppointments);
router.get('/appointments/recent', verifyTokenAdmin, AdminController.getRecentAppointments);

// === Medical Records ===
router.get('/medical-records/recent', verifyTokenAdmin, AdminController.getRecentMedicalRecords);
router.get('/medical-records/:id', verifyTokenAdmin, AdminController.getMedicalRecordById);

// === Boarding ===
router.get('/boarding/stats', verifyTokenAdmin, AdminController.getBoardingStats);
router.get('/boarding/current', verifyTokenAdmin, AdminController.getCurrentBoarders);

// === Analytics ===
router.get('/analytics/monthly-revenue', verifyTokenAdmin, AdminController.getMonthlyRevenue);
router.get('/analytics/service-breakdown', verifyTokenAdmin, AdminController.getServiceBreakdown);
router.get('/analytics/kpis', verifyTokenAdmin, AdminController.getKPIs);

// === Notifications ===
router.get('/notifications', verifyTokenAdmin, AdminController.getAllNotifications);
router.get('/notifications/unread', verifyTokenAdmin, AdminController.getUnreadNotifications);
router.patch('/notifications/mark-all-read', verifyTokenAdmin, AdminController.markAllAsRead);
router.patch('/notifications/:id/mark-read', verifyTokenAdmin, AdminController.markAsRead);

module.exports = router;