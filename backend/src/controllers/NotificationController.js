const Notification = require('../models/Notification');

const NotificationController = {
    async getNotifications(req, res) {
        try {
            const notifications = await Notification.findAll({ where: { user_id: req.params.user_id } });
            res.status(200).json(notifications);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching notifications', error: err.message });
        }
    },
};

module.exports = NotificationController;