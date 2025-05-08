const { MedicalRecord, Pet, User } = require('../models');

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
      const records = await MedicalRecord.findAll({
        where: { pet_id: petId },
        attributes: ['id', 'appointment_id', 'created_at', 'diagnosis', 'description', 'treatment', 'status'],
      });
      res.status(200).json({ success: true, message: 'Medical history fetched successfully', data: records });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error fetching medical history', error: err.message });
    }
  },
};

module.exports = PetController;
