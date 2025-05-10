const express = require('express');
const StaffController = require('../controllers/StaffController');
const { verifyTokenStaff } = require('../middleware/veritify');
const router = express.Router();

// Check if all required controller methods are defined
if (
    !StaffController.getDashboardStats ||
    !StaffController.getTodayAppointments ||
    !StaffController.getAllAppointments ||
    !StaffController.getAppointmentById ||
    !StaffController.updateAppointmentStatus ||
    !StaffController.createAppointment ||
    !StaffController.getOwners ||
    !StaffController.getPetsByOwner ||
    !StaffController.createService ||
    !StaffController.getServices ||
    !StaffController.getUserServices ||
    !StaffController.getAvailableBoardingServices ||
    !StaffController.addNewBoardingService ||
    !StaffController.getUsersBoardings ||
    !StaffController.getBoardingUserDetails ||
    !StaffController.getPets ||
    !StaffController.editService
) {
    throw new Error('One or more StaffController methods are undefined. Please check the controller implementation.');
}

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
router.get('/user-services', verifyTokenStaff, StaffController.getUserServices);
router.get('/boarding-services/available', verifyTokenStaff, StaffController.getAvailableBoardingServices);
router.post('/boarding-services/new', verifyTokenStaff, StaffController.addNewBoardingService);
router.get('/user-boarding', verifyTokenStaff, StaffController.getUsersBoardings);
router.get('/boarding-user-details', StaffController.getBoardingUserDetails);
router.get('/pets', verifyTokenStaff, StaffController.getPets);

module.exports = router;