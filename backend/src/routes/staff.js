const express = require('express');
const StaffController = require('../controllers/StaffController');
const { verifyTokenAdmin } = require('../middleware/veritify'); 
const router = express.Router();


router.get('/dashboard-stats', StaffController.getDashboardStats); // Lấy thống kê dashboard

module.exports = router;