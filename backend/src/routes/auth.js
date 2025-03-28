const express = require('express');
const router = express.Router();
const { login, register, loginVetStaff } = require('../controllers/authController');

router.post('/login', login); // Existing login for petpal (user)
router.post('/register', register); // Existing register for petpal (user)
router.post('/vetstaff/login', loginVetStaff); // New login for vet and staff

module.exports = router;