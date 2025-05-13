const express = require('express');
const StaffController = require('../controllers/StaffController');
const { verifyTokenStaff } = require('../middleware/veritify');
const router = express.Router();

// Define routes
router.get('/dashboard-stats', verifyTokenStaff, StaffController.getDashboardStats);
router.get('/appointments/today', verifyTokenStaff, StaffController.getTodayAppointments);
router.get('/appointments', verifyTokenStaff, StaffController.getAllAppointments);
router.get('/appointments/:id', verifyTokenStaff, StaffController.getAppointmentById);
router.patch('/appointments/:id/status', verifyTokenStaff, StaffController.updateAppointmentStatus);
router.post('/appointments/new', verifyTokenStaff, StaffController.createAppointment);
router.get('/owners', verifyTokenStaff, StaffController.getOwners);
router.get('/owners/:ownerId/pets', verifyTokenStaff, StaffController.getPetsByOwner);
router.post('/clinic-services/create', verifyTokenStaff, StaffController.createService);
router.get('/clinic-services', verifyTokenStaff, StaffController.getServices);
router.put('/clinic-services/:id/edit', verifyTokenStaff, StaffController.editService);
router.patch('/clinic-services/:id/status', verifyTokenStaff, StaffController.toggleServiceStatus);
router.get('/user-services', verifyTokenStaff, StaffController.getUserServices);
router.patch('/user-services/:id/checkin', verifyTokenStaff, StaffController.checkinService);
router.patch('/user-services/:id/complete', verifyTokenStaff, StaffController.completeService);
router.get('/boarding-services/available', verifyTokenStaff, StaffController.getAvailableBoardingServices);
router.post('/boarding-services/new', verifyTokenStaff, StaffController.addNewBoardingService);
router.put('/boarding-services/:id/edit', verifyTokenStaff, StaffController.updateBoardingService);
router.patch('/boarding-services/:id/status', verifyTokenStaff, StaffController.toggleBoardingServiceStatus);
router.get('/user-boarding', verifyTokenStaff, StaffController.getUsersBoardings);
router.get('/boarding-user-details', StaffController.getBoardingUserDetails);
router.patch('/user-boarding/:id/checkin', verifyTokenStaff, StaffController.checkinBoarding);
router.patch('/user-boarding/:id/complete', verifyTokenStaff, StaffController.completeBoarding);
router.get('/pets', verifyTokenStaff, StaffController.getPets);

module.exports = router;