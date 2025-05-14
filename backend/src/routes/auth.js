const express = require('express');
const router = express.Router();
const { login, register, loginVetStaff, registerStaff, registerAdmin, loginAdmin } = require('../controllers/authController');

router.post('/login', login); // Existing login for petpal (user)
router.post('/register', register); // Existing register for petpal (user)
router.post('/vetstaff/login', loginVetStaff); // New login for vet and staff
router.post('/register-staff', registerStaff);
router.post('/register-admin', registerAdmin); // New login for admin
router.post('/admin/login', loginAdmin); // New login for admin
module.exports = router;