const Pet = require('../models/Pet');

const PetController = {
    async createPet(req, res) {
        try {
            const petData = {
                ...req.body,
                owner_id: req.user.id, // Lấy owner_id từ token
            };
            const pet = await Pet.create(petData);
            res.status(201).json({ message: 'Pet registered successfully', pet });
        } catch (err) {
            res.status(500).json({ message: 'Error registering pet', error: err.message });
        }
    },

    async updatePet(req, res) {
        try {
            const pet = await Pet.update(req.body, { where: { id: req.params.id, owner_id: req.user.id } });
            res.status(200).json({ message: 'Pet updated successfully', pet });
        } catch (err) {
            res.status(500).json({ message: 'Error updating pet', error: err.message });
        }
    },

    async getPet(req, res) {
        try {
            const pet = await Pet.findOne({ where: { id: req.params.id, owner_id: req.user.id } });
            if (!pet) return res.status(404).json({ message: 'Pet not found' });
            res.status(200).json(pet);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching pet', error: err.message });
        }
    },
};

module.exports = PetController;