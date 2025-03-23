const express = require('express');
const PaymentController = require('../controllers/PaymentController');
const { verifyToken } = require('../middleware/veritify');
const router = express.Router();

router.post('/', verifyToken, PaymentController.createPayment); // Yêu cầu authorization
router.get('/history/:user_id', verifyToken, PaymentController.getPaymentHistory); // Yêu cầu authorization

module.exports = router;