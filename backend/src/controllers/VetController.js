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


    async updateExaminationRecord(req, res) {
        try {
            const { appointment_id } = req.params;
            const { diagnosis, medications, follow_up_date, user_id } = req.body;

            // Validate required fields
            if (!appointment_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Appointment ID is required',
                });
            }

    

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
                await Notification.create({
                    user_id,
                    title: 'Follow-up Reminder',
                    message: `Your pet has a follow-up appointment scheduled on ${follow_up_date}.`,
                    url: `/appointments/${appointment_id}`, // URL to redirect the user to the appointment details
                });
            }

            // Send a notification about the updated examination record
            await Notification.create({
                user_id,
                title: 'Examination Record Updated',
                message: `The examination record for your pet has been updated. Please check the details.`,
                url: `/appointments/${appointment_id}`, // URL to redirect the user to the appointment details
            });

            res.status(200).json({
                success: true,
                message: 'Examination record updated successfully and notifications sent',
                data: result,
            });
        } catch (err) {
            console.error('Error updating examination record:', err.message);
            res.status(500).json({
                success: false,
                message: 'Error updating examination record',
                error: err.message,
            });
        }
    },
};

module.exports = VetController;