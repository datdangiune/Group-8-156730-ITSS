const Payment = require('../models/Payment');

const PaymentController = {
    async createPayment(req, res) {
        try {
            const payment = await Payment.create(req.body);
            res.status(201).json({ message: 'Payment successful', payment });
        } catch (err) {
            res.status(500).json({ message: 'Error processing payment', error: err.message });
        }
    },

    async getPaymentHistory(req, res) {
        try {
            const payments = await Payment.findAll({ where: { user_id: req.params.user_id } });
            res.status(200).json(payments);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching payment history', error: err.message });
        }
    },
};

module.exports = PaymentController;