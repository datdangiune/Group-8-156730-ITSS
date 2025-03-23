const express = require('express');
const AppointmentController = require('../controllers/AppointmentController');
const { verifyToken } = require('../middleware/veritify');
const router = express.Router();

router.post('/', verifyToken, AppointmentController.createAppointment); // Yêu cầu authorization
router.get('/:id', verifyToken, AppointmentController.getAppointment); // Yêu cầu authorization

module.exports = router;