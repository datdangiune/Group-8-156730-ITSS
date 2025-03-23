const Appointment = require('../models/Appointment');

const AppointmentController = {
    async createAppointment(req, res) {
        try {
            const appointment = await Appointment.create(req.body);
            res.status(201).json({ message: 'Appointment created successfully', appointment });
        } catch (err) {
            res.status(500).json({ message: 'Error creating appointment', error: err.message });
        }
    },

    async getAppointment(req, res) {
        try {
            const appointment = await Appointment.findByPk(req.params.id);
            if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
            res.status(200).json(appointment);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching appointment', error: err.message });
        }
    },
};

module.exports = AppointmentController;