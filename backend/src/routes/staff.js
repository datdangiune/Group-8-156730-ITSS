const express = require('express');
const StaffController = require('../controllers/StaffController');
const { verifyTokenAdmin } = require('../middleware/veritify'); 
const router = express.Router();


router.get('/appointments', verifyTokenAdmin, StaffController.getAllAppointments); 
router.patch('/appointments/:id', verifyTokenAdmin, StaffController.updateAppointmentStatus); 


router.patch('/services/:id', verifyTokenAdmin, StaffController.updateServiceStatus); 


router.get('/boarding', verifyTokenAdmin, StaffController.getAllBoarding); 
router.patch('/boarding/:id', verifyTokenAdmin, StaffController.updateBoardingStatus); 


router.post('/boarding/:id/notify', verifyTokenAdmin, StaffController.notifyBoardingStatus);

router.post('/boarding/:id/pickup-reminder', verifyTokenAdmin, StaffController.sendPickupReminder);
module.exports = router;