const express = require('express');
const PetController = require('../controllers/PetController');
const { verifyTokenVet } = require('../middleware/veritify');
const router = express.Router();

router.get('/pets', verifyTokenVet, PetController.getPets); // Fetch all pets
router.get('/pets/:petId/medical-history', verifyTokenVet, PetController.getMedicalHistory);

module.exports = router;
