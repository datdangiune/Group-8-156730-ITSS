const { MedicalRecord, Notification } = require('../models');

const VetController = {
    // Quản lý hồ sơ y tế
    async updateMedicalRecord(req, res) {
        try {
            const { id } = req.params; // Lấy medical record ID từ URL
            const { diagnosis, treatment, medication, follow_up_date } = req.body;

            const record = await MedicalRecord.update(
                { diagnosis, treatment, medication, follow_up_date },
                { where: { id } }
            );

            if (!record[0]) {
                return res.status(404).json({ success: false, message: 'Medical record not found' });
            }

            res.status(200).json({ success: true, message: 'Medical record updated successfully' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error updating medical record', error: err.message });
        }
    },

    // Kê đơn thuốc
    async addPrescription(req, res) {
        try {
            const { id } = req.params; // Lấy medical record ID từ URL
            const { medication } = req.body;

            const record = await MedicalRecord.update(
                { medication },
                { where: { id } }
            );

            if (!record[0]) {
                return res.status(404).json({ success: false, message: 'Medical record not found' });
            }

            res.status(200).json({ success: true, message: 'Prescription added successfully' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error adding prescription', error: err.message });
        }
    },

    // Gửi nhắc lịch tái khám
    async sendFollowUpReminder(req, res) {
        try {
            const { user_id, pet_id, follow_up_date } = req.body;

            const notification = await Notification.create({
                user_id,
                title: 'Follow-up Reminder',
                message: `Your pet has a follow-up appointment scheduled on ${follow_up_date}.`,
            });

            res.status(201).json({ success: true, message: 'Follow-up reminder sent successfully', notification });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error sending follow-up reminder', error: err.message });
        }
    },

    // Gửi cảnh báo sức khỏe
    async sendHealthAlert(req, res) {
        try {
            const { user_id, pet_id, message } = req.body;

            const notification = await Notification.create({
                user_id,
                title: 'Health Alert',
                message,
            });

            res.status(201).json({ success: true, message: 'Health alert sent successfully', notification });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error sending health alert', error: err.message });
        }
    },

    async getVetAppointments(req, res) {
        try {
            const vetId = req.user.id; // Lấy ID của bác sĩ từ token
            const appointments = await Appointment.findAll({
                where: { staff_id: vetId },
                include: [
                    {
                        model: Pet,
                        as: 'pet',
                        attributes: ['id', 'name', 'breed', 'age'],
                    },
                    {
                        model: User,
                        as: 'owner',
                        attributes: ['id', 'username', 'email'],
                    },
                ],
            });

            res.status(200).json({
                success: true,
                message: 'Appointments fetched successfully',
                data: appointments,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error fetching appointments',
                error: err.message,
            });
        }
    },

    async sendRoutineReminder(req, res) {
        try {
            const { user_id, pet_id, message } = req.body;

            const notification = await Notification.create({
                user_id,
                title: 'Routine Reminder',
                message: message || 'It is time for your pet\'s vaccination or grooming.',
            });

            res.status(201).json({
                success: true,
                message: 'Routine reminder sent successfully',
                data: notification,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error sending routine reminder',
                error: err.message,
            });
        }
    },

};

module.exports = VetController;