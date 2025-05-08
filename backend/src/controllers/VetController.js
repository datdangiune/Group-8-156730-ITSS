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

    async updateDiagnosisAndTests(req, res) {
        // Ensure this method is implemented
        // ...existing code...
    },

    async storePrescription(req, res) {
        // Ensure this method is implemented
        // ...existing code...
    },

    async scheduleFollowUp(req, res) {
        // Ensure this method is implemented
        // ...existing code...
    },

    // Unified controller to update examination record
    async updateExaminationRecord(req, res) {
        try {
            const { appointment_id } = req.params;
            const { diagnosis, medications, follow_up_date } = req.body;

            // Upsert the appointment result
            const result = await AppointmentResult.upsert({
                appointment_id,
                diagnosis,
                prescription: medications.map(
                    (med) => `${med.name} (${med.dosage}): ${med.instructions}`
                ).join("; "), // Combine medications into a single string
                follow_up_date,
            });

            // If follow-up date is provided, create a notification
            if (follow_up_date) {
                const { user_id } = req.body;
                await Notification.create({
                    user_id,
                    title: 'Follow-up Reminder',
                    message: `Your pet has a follow-up appointment scheduled on ${follow_up_date}.`,
                });
            }

            res.status(200).json({
                success: true,
                message: 'Examination record updated successfully',
                data: result,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error updating examination record',
                error: err.message,
            });
        }
    },
};

module.exports = VetController;