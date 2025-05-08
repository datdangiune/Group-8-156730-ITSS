const { MedicalRecord, Notification, Appointment, Pet, User, AppointmentResult } = require('../models');

const VetController = {
    async getMedicalRecordsByAppointment(req, res) {
        try {
            const { appointment_id } = req.params;

            const medicalRecords = await MedicalRecord.findAll({
                where: { appointment_id },
                include: [
                    {
                        model: Pet,
                        attributes: ['name'],
                    },
                    {
                        model: User,
                        attributes: ['name'],
                    },
                    {
                        model: Appointment,
                        attributes: ['appointment_date'],
                    },
                ],
            });

            if (!medicalRecords.length) {
                return res.status(404).json({
                    success: false,
                    message: 'No medical records found for the given appointment',
                });
            }

            const formattedRecords = medicalRecords.map((record) => ({
                petName: record.Pet.name,
                ownerName: record.User.name,
                appointmentDate: record.Appointment.appointment_date,
                diagnosis: record.diagnosis,
                treatment: record.treatment,
                medication: record.medication,
            }));

            res.status(200).json({
                success: true,
                message: 'Medical records fetched successfully',
                data: formattedRecords,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error fetching medical records',
                error: err.message,
            });
        }
    },

    // Update diagnosis and test results
    async updateDiagnosisAndTests(req, res) {
        try {
            const { appointment_id } = req.params;
            const { diagnosis, tests } = req.body;

            const result = await AppointmentResult.upsert({
                appointment_id,
                diagnosis,
                tests,
            });

            res.status(200).json({
                success: true,
                message: 'Diagnosis and test results updated successfully',
                data: result,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error updating diagnosis and test results',
                error: err.message,
            });
        }
    },

    // Store prescription
    async storePrescription(req, res) {
        try {
            const { appointment_id } = req.params;
            const { prescription } = req.body;

            const result = await AppointmentResult.update(
                { prescription },
                { where: { appointment_id } }
            );

            if (!result[0]) {
                return res.status(404).json({
                    success: false,
                    message: 'Appointment result not found',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Prescription stored successfully',
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error storing prescription',
                error: err.message,
            });
        }
    },

    // Schedule follow-up reminder
    async scheduleFollowUp(req, res) {
        try {
            const { appointment_id } = req.params;
            const { follow_up_date, user_id } = req.body;

            const result = await AppointmentResult.update(
                { follow_up_date },
                { where: { appointment_id } }
            );

            if (!result[0]) {
                return res.status(404).json({
                    success: false,
                    message: 'Appointment result not found',
                });
            }

            const notification = await Notification.create({
                user_id,
                title: 'Follow-up Reminder',
                message: `Your pet has a follow-up appointment scheduled on ${follow_up_date}.`,
            });

            res.status(200).json({
                success: true,
                message: 'Follow-up reminder scheduled successfully',
                data: notification,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error scheduling follow-up reminder',
                error: err.message,
            });
        }
    },
};

module.exports = VetController;