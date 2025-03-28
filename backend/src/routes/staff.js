const express = require('express');
const StaffController = require('../controllers/StaffController');
const { verifyTokenStaff } = require('../middleware/veritify'); 
const router = express.Router();


router.get('/dashboard-stats', verifyTokenStaff,StaffController.getDashboardStats); // Lấy thống kê dashboard

module.exports = router;