// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { User, Service, Appointment, MedicalRecord, Boarding, Room, Notification, Payment } = require('../models');
// const { Op, Sequelize } = require('sequelize');

// const AdminController = {
//     // Admin login
//     login: async (req, res) => {
//         try {
//             const { email, password } = req.body;
//             const admin = await User.findOne({ where: { email, role: 'admin' } });
//             if (!admin || !(await bcrypt.compare(password, admin.password))) {
//                 return res.status(401).json({ message: 'Invalid credentials' });
//             }
//             const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
//             res.json({ token, admin });
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     },

//     // Dashboard statistics
//     getDashboardStats: async (req, res) => {
//         try {
//             const totalUsers = await User.count({ where: { role: 'owner' } });
//             const activeBoarders = await Boarding.count({ where: { status: 'active' } });
//             const pendingServices = await Service.count({ where: { status: 'pending' } });
//             const unreadNotifications = await Notification.count({ where: { status: 'unread' } });
            
//             const revenueOverview = await Payment.findAll({
//                 attributes: [[Sequelize.fn('SUM', Sequelize.col('amount')), 'totalRevenue']],
//                 where: { createdAt: { [Op.gte]: new Date(new Date().getFullYear(), 0, 1) } },
//                 group: [Sequelize.fn('MONTH', Sequelize.col('createdAt'))],
//             });
            
//             const servicesByCategory = await Service.findAll({
//                 attributes: ['category', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
//                 group: ['category'],
//             });

//             res.json({ totalUsers, activeBoarders, pendingServices, unreadNotifications, revenueOverview, servicesByCategory });
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     },

//     // Add user
//     addUser: async (req, res) => {
//         try {
//             const { name, email, role, status } = req.body;
//             const password = await bcrypt.hash('defaultPassword', 10);
//             const newUser = await User.create({ name, email, role, status, password });
//             res.json(newUser);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     },

//     // Add service
//     addService: async (req, res) => {
//         try {
//             const { name, category, price, duration, status } = req.body;
//             const newService = await Service.create({ name, category, price, duration, status });
//             res.json(newService);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     },

//     // Fetch appointments
//     getAppointments: async (req, res) => {
//         try {
//             const today = new Date();
//             const upcomingAppointments = await Appointment.findAll({ where: { appointment_date: { [Op.gte]: today } } });
//             const recentAppointments = await Appointment.findAll({ where: { appointment_date: { [Op.lt]: today } } });
//             res.json({ upcomingAppointments, recentAppointments });
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     },

//     // Fetch medical records
//     getMedicalRecords: async (req, res) => {
//         try {
//             const records = await MedicalRecord.findAll();
//             res.json(records);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     },

//     // Fetch boarding details
//     getBoardingInfo: async (req, res) => {
//         try {
//             const totalRooms = await Room.count();
//             const occupied = await Boarding.count({ where: { status: 'occupied' } });
//             const available = totalRooms - occupied;
//             const reserved = await Boarding.count({ where: { status: 'reserved' } });
//             const currentBoarders = await Boarding.findAll({ where: { status: 'occupied' } });
//             res.json({ totalRooms, occupied, available, reserved, currentBoarders });
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     },
// };

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Appointment, Boarding, Service, Notification, Payment, MedicalRecord, Room } = require('../models');
const { verifyTokenAdmin } = require('../middleware/verify');
const router = express.Router();

// Admin Login
router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const admin = await User.findOne({ where: { email, role: 'admin' } });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: admin.id, role: admin.role }, 'your_secret_key', { expiresIn: '1h' });
    res.json({ token });
});

// Dashboard Analytics
router.get('/dashboard', verifyTokenAdmin, async (req, res) => {
    const totalUsers = await User.count();
    const activeBoarders = await Boarding.count({ where: { status: 'ongoing' } });
    const pendingServices = await Service.count({ where: { status: 'pending' } });
    const unreadNotifications = await Notification.count({ where: { is_read: false } });
    const revenueOverview = await Payment.findAll({ attributes: ['amount'], raw: true });
    const servicesBreakdown = await Service.findAll({ attributes: ['type', 'id'], raw: true });
    const keyMetrics = { newPatients: 20, revenueGrowth: 10, avgVisitValue: 50, bookingsUtilization: 80 };
    res.json({ totalUsers, activeBoarders, pendingServices, unreadNotifications, revenueOverview, servicesBreakdown, keyMetrics });
});

// User Management
router.get('/users', verifyTokenAdmin, async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

router.post('/users', verifyTokenAdmin, async (req, res) => {
    const { name, email, role, status } = req.body;
    const newUser = await User.create({ name, email, role, status, password: bcrypt.hashSync('defaultpassword', 10) });
    res.json(newUser);
});

router.patch('/users/:id/role', verifyTokenAdmin, async (req, res) => {
    const { role } = req.body;
    await User.update({ role }, { where: { id: req.params.id } });
    res.json({ message: 'User role updated' });
});

// Service Management
router.get('/services', verifyTokenAdmin, async (req, res) => {
    const services = await Service.findAll();
    res.json(services);
});

router.post('/services', verifyTokenAdmin, async (req, res) => {
    const { name, category, price, duration, status } = req.body;
    const newService = await Service.create({ name, type: category, price, duration, status });
    res.json(newService);
});

router.put('/services/:id', verifyTokenAdmin, async (req, res) => {
    await Service.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Service updated' });
});

router.delete('/services/:id', verifyTokenAdmin, async (req, res) => {
    await Service.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Service deleted' });
});

// Appointment Management
router.get('/appointments', verifyTokenAdmin, async (req, res) => {
    const upcomingAppointments = await Appointment.findAll({ where: { appointment_status: 'Scheduled' } });
    const recentAppointments = await Appointment.findAll({ where: { appointment_status: 'Done' } });
    res.json({ upcomingAppointments, recentAppointments });
});

router.delete('/appointments/:id', verifyTokenAdmin, async (req, res) => {
    await Appointment.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Appointment deleted' });
});

// Medical Records
router.get('/medical-records', verifyTokenAdmin, async (req, res) => {
    const medicalRecords = await MedicalRecord.findAll();
    res.json(medicalRecords);
});

router.delete('/medical-records/:id', verifyTokenAdmin, async (req, res) => {
    await MedicalRecord.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Medical record deleted' });
});

// Boarding Info
router.get('/boarding', verifyTokenAdmin, async (req, res) => {
    const totalRooms = await Room.count();
    const occupied = await Boarding.count({ where: { status: 'ongoing' } });
    const available = totalRooms - occupied;
    const reserved = await Boarding.count({ where: { status: 'reserved' } });
    const currentBoarders = await Boarding.findAll();
    res.json({ totalRooms, occupied, available, reserved, currentBoarders });
});

// Notifications
router.get('/notifications', verifyTokenAdmin, async (req, res) => {
    const notifications = await Notification.findAll();
    res.json(notifications);
});

router.post('/notifications/mark-all-read', verifyTokenAdmin, async (req, res) => {
    await Notification.update({ is_read: true }, { where: {} });
    res.json({ message: 'All notifications marked as read' });
});

// Settings
router.put('/settings/profile', verifyTokenAdmin, async (req, res) => {
    const { id, firstName, lastName, email, bio } = req.body;
    await User.update({ name: `${firstName} ${lastName}`, email, bio }, { where: { id } });
    res.json({ message: 'Profile updated' });
});

router.put('/settings/account', verifyTokenAdmin, async (req, res) => {
    const { id, currentPassword, newPassword } = req.body;
    const user = await User.findByPk(id);
    if (!(await bcrypt.compare(currentPassword, user.password))) {
        return res.status(400).json({ message: 'Current password is incorrect' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated' });
});

router.put('/settings/notifications', verifyTokenAdmin, async (req, res) => {
    await User.update(req.body, { where: { id: req.body.id } });
    res.json({ message: 'Notification preferences updated' });
});

router.put('/settings/system', verifyTokenAdmin, async (req, res) => {
    await User.update(req.body, { where: { id: req.body.id } });
    res.json({ message: 'System settings updated' });
});
module.exports = AdminController;
