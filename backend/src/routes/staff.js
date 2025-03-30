const express = require('express');
const StaffController = require('../controllers/StaffController');
const { verifyTokenStaff } = require('../middleware/veritify'); 
const router = express.Router();


router.get('/dashboard-stats', verifyTokenStaff,StaffController.getDashboardStats); // Lấy thống kê dashboard
router.get('/appointments/today', verifyTokenStaff, StaffController.getTodayAppointments); // Fetch today's appointments
router.get('/appointments', verifyTokenStaff, StaffController.getAllAppointments); // Fetch all appointments
router.get('/appointments/:id', verifyTokenStaff, StaffController.getAppointmentById); // Fetch appointment by ID
router.patch('/appointments/:id/status', verifyTokenStaff, StaffController.updateAppointmentStatus); // Update appointment status
router.post('/appointments/new', verifyTokenStaff, StaffController.createAppointment); // Create a new appointment
router.get('/owners', verifyTokenStaff, StaffController.getOwners); // Fetch all owners
router.get('/owners/:ownerId/pets', verifyTokenStaff, StaffController.getPetsByOwner); // Fetch pets by owner ID
router.post('/service', verifyTokenStaff, StaffController.createService)
router.get('/services', verifyTokenStaff, StaffController.getServices); // Fetch services
module.exports = router;