const express = require('express');
const PetController = require('../controllers/PetController');
const { verifyToken } = require('../middleware/veritify');
const router = express.Router();

router.post('/', verifyToken, PetController.createPet); // Yêu cầu token
router.put('/:id', verifyToken, PetController.updatePet); // Yêu cầu token
router.get('/:id', verifyToken, PetController.getPet); // Yêu cầu token

module.exports = router;