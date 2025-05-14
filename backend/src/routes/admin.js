// Fixed admin.js - Most important: Removed verifyTokenAdmin from login route

const express = require('express');
const AdminController = require('../controllers/AdminController');
const { verifyTokenAdmin } = require('../middleware/veritify'); // Only admins allowed
const router = express.Router();



// === Dashboard ===
router.get('/dashboard/total-counts', verifyTokenAdmin, AdminController.getTotalCounts);

// === Users ===
router.get('/users/simple', verifyTokenAdmin, AdminController.getSimpleUserList);
router.post('/users', verifyTokenAdmin, AdminController.addUser);
router.patch('/users/:id/set-admin', verifyTokenAdmin, AdminController.setAsAdmin);
router.patch('/users/:id/set-vet', verifyTokenAdmin, AdminController.setAsVet);
router.patch('/users/:id/set-staff', verifyTokenAdmin, AdminController.setAsStaff);

// === Services ===
router.get('/services-with-stats', verifyTokenAdmin, AdminController.getServiceListWithStats);
router.get('/service-users-by-service', verifyTokenAdmin, AdminController.getServiceUsersByService);

// === Appointments ===
router.get('/appointments-mock-format', verifyTokenAdmin, AdminController.getAppointmentsMockFormat);


// === Boarding ===
router.get('/boarding-with-stats', verifyTokenAdmin, AdminController.getBoardingListWithStats);
router.get('/boarding-users-by-boarding', verifyTokenAdmin, AdminController.getBoardingUsersByBoarding);

// === Analytics ===
router.get('/analytics/data', verifyTokenAdmin, AdminController.getAnalyticsData);

module.exports = router;