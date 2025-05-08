const express = require('express');
const AdminController = require('../controllers/AdminController');
const { verifyTokenAdmin } = require('../middleware/veritify'); // Chỉ admin được phép
const router = express.Router();

// Check if all required controller methods are defined
if (
    !AdminController.getAllUsers ||
    !AdminController.updateUserRole ||
    !AdminController.getAllServices ||
    !AdminController.createService ||
    !AdminController.updateService ||
    !AdminController.deleteService ||
    !AdminController.getAllBoarding ||
    !AdminController.getDashboard ||
    !AdminController.getUsersByRole ||
    !AdminController.getRevenueReport ||
    !AdminController.getHealthTrends ||
    !AdminController.getPetRegistrationStats ||
    !AdminController.getServiceUsageStats ||
    !AdminController.getAllAppointments ||
    !AdminController.deleteAppointment ||
    !AdminController.getAllMedicalRecords ||
    !AdminController.deleteMedicalRecord ||
    !AdminController.registerAdmin ||
    !AdminController.loginAdmin ||
    !AdminController.getAnalyticsData
) {
    throw new Error('One or more AdminController methods are undefined. Please check the controller implementation.');
}

// Define routes
router.get('/users', verifyTokenAdmin, AdminController.getAllUsers);
router.patch('/users/:id/role', verifyTokenAdmin, AdminController.updateUserRole);
router.get('/services', verifyTokenAdmin, AdminController.getAllServices);
router.post('/services', verifyTokenAdmin, AdminController.createService);
router.put('/services/:id', verifyTokenAdmin, AdminController.updateService);
router.delete('/services/:id', verifyTokenAdmin, AdminController.deleteService);
router.get('/boarding', verifyTokenAdmin, AdminController.getAllBoarding);
router.get('/dashboard', verifyTokenAdmin, AdminController.getDashboard);
router.get('/users/by-role', verifyTokenAdmin, AdminController.getUsersByRole);
router.get('/reports/revenue', verifyTokenAdmin, AdminController.getRevenueReport);
router.get('/reports/health-trends', verifyTokenAdmin, AdminController.getHealthTrends);
router.get('/reports/pet-registration', verifyTokenAdmin, AdminController.getPetRegistrationStats);
router.get('/reports/service-usage', verifyTokenAdmin, AdminController.getServiceUsageStats);
router.get('/appointments', verifyTokenAdmin, AdminController.getAllAppointments);
router.delete('/appointments/:id', verifyTokenAdmin, AdminController.deleteAppointment);
router.get('/medical-records', verifyTokenAdmin, AdminController.getAllMedicalRecords);
router.delete('/medical-records/:id', verifyTokenAdmin, AdminController.deleteMedicalRecord);
router.post('/auth/register', AdminController.registerAdmin);
router.post('/auth/login', AdminController.loginAdmin);
router.get('/analytics', verifyTokenAdmin, AdminController.getAnalyticsData);

module.exports = router;