const { Appointment, Service, Boarding } = require('../models');

const StaffController = {
    async getAllAppointments(req, res) {
        try {
            const { status } = req.query;
            const whereClause = status ? { status } : {};
            const appointments = await Appointment.findAll({ where: whereClause });
            res.status(200).json({ success: true, message: 'Appointments fetched successfully', data: appointments });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error fetching appointments', error: err.message });
        }
    },

    async updateAppointmentStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const appointment = await Appointment.update({ status }, { where: { id } });

            if (!appointment[0]) {
                return res.status(404).json({ success: false, message: 'Appointment not found' });
            }

            res.status(200).json({ success: true, message: 'Appointment status updated successfully' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error updating appointment status', error: err.message });
        }
    },

    async updateServiceStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, notes } = req.body;

            const service = await Service.update({ status, notes }, { where: { id } });

            if (!service[0]) {
                return res.status(404).json({ success: false, message: 'Service not found' });
            }

            res.status(200).json({ success: true, message: 'Service status updated successfully' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error updating service status', error: err.message });
        }
    },

    async getAllBoarding(req, res) {
        try {
            const boardingList = await Boarding.findAll();
            res.status(200).json({ success: true, message: 'Boarding data fetched successfully', data: boardingList });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error fetching boarding data', error: err.message });
        }
    },

    async updateBoardingStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, notes } = req.body;

            const boarding = await Boarding.update({ status, notes }, { where: { id } });

            if (!boarding[0]) {
                return res.status(404).json({ success: false, message: 'Boarding record not found' });
            }

            res.status(200).json({ success: true, message: 'Boarding status updated successfully' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error updating boarding status', error: err.message });
        }
    },

    async notifyBoardingStatus(req, res) {
        try {
            const { id } = req.params; // Boarding ID
            const { message, image_url } = req.body;

            // Kiểm tra bản ghi lưu trú
            const boarding = await Boarding.findOne({ where: { id } });
            if (!boarding) {
                return res.status(404).json({ success: false, message: 'Boarding record not found' });
            }

            // Tạo thông báo
            const notification = await Notification.create({
                user_id: boarding.owner_id,
                title: 'Boarding Update',
                message,
            });

            // Cập nhật trạng thái (nếu cần)
            if (image_url) {
                // Lưu hình ảnh hoặc xử lý thêm nếu cần
            }

            res.status(201).json({
                success: true,
                message: 'Notification sent successfully',
                data: notification,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error sending notification',
                error: err.message,
            });
        }
    },

        // Gửi nhắc nhở lịch đón thú cưng
        async sendPickupReminder(req, res) {
            try {
                const { id } = req.params; // Boarding ID
                const { message } = req.body;
    
                // Kiểm tra bản ghi lưu trú
                const boarding = await Boarding.findOne({ where: { id } });
                if (!boarding) {
                    return res.status(404).json({ success: false, message: 'Boarding record not found' });
                }
    
                // Tạo thông báo
                const notification = await Notification.create({
                    user_id: boarding.owner_id,
                    title: 'Pickup Reminder',
                    message: message || 'Please pick up your pet from the boarding center.',
                });
    
                res.status(201).json({
                    success: true,
                    message: 'Pickup reminder sent successfully',
                    data: notification,
                });
            } catch (err) {
                res.status(500).json({
                    success: false,
                    message: 'Error sending pickup reminder',
                    error: err.message,
                });
            }
        },

};

module.exports = StaffController;