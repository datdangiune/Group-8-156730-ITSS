const express = require('express');
const AdminController = require('../controllers/AdminController');
const { verifyTokenAdmin } = require('../middleware/veritify');
const router = express.Router();

router.get('/dashboard', verifyTokenAdmin, AdminController.getDashboard); // Chỉ admin được phép truy cập

module.exports = router;