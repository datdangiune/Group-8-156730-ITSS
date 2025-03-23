const express = require('express');
const NotificationController = require('../controllers/NotificationController');
const { verifyToken } = require('../middleware/veritify');
const router = express.Router();

router.get('/:user_id', verifyToken, NotificationController.getNotifications); // Yêu cầu authorization

module.exports = router;