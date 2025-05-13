const { MedicalRecord, Pet, User, AppointmentResult, Appointment } = require('../models');
const { Sequelize } = require('sequelize');

const PetController = {
  async getPets(req, res) {
    try {
      const pets = await Pet.findAll({
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'name'],
          },
        ],
      });
      res.status(200).json({ success: true, message: 'Pets fetched successfully', data: pets });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error fetching pets', error: err.message });
    }
  },

  async getMedicalHistory(req, res) {
    try {
        const { petId } = req.params;
  
        const records = await AppointmentResult.findAll({
          include: [
            {
              model: Appointment,
              as: 'appointment',
              where: { pet_id: petId },
              attributes: [], // Không cần lấy dữ liệu từ Appointment
            },
          ],
          attributes: [
            'id',
            'appointment_id',
            'created_at',
            'diagnosis',
            'prescription',
            'follow_up_date',
          ],
        });
  
        res.status(200).json({
          success: true,
          message: 'Medical history fetched successfully',
          data: records,
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          message: 'Error fetching medical history',
          error: err.message,
        });
      }
  },

  async getPetRecordCounts(req, res) {
    try {
      const recordCounts = await Pet.findAll({
        attributes: [
          'id',
          'name',
          [Sequelize.literal(`(
            SELECT COUNT(*)
            FROM appointment_results AS ar
            INNER JOIN appointments AS a ON a.id = ar.appointment_id
            WHERE a.pet_id = "Pet"."id"
          )`), 'record_count'],
        ],
      });

      res.status(200).json({
        success: true,
        message: 'Record counts fetched successfully',
        data: recordCounts,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error fetching record counts',
        error: err.message,
      });
    }
  },
};

module.exports = PetController;
