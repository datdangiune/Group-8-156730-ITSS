const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Service, Appointment, MedicalRecord, Boarding, Room, Notification, Payment } = require('../models');
const { Op, Sequelize } = require('sequelize');

const AdminController = {
    // Admin login
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const admin = await User.findOne({ where: { email, role: 'admin' } });
            if (!admin || !(await bcrypt.compare(password, admin.password))) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.json({ token, admin });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Dashboard statistics
    getDashboardStats: async (req, res) => {
        try {
            const totalUsers = await User.count({ where: { role: 'customer' } });
            const activeBoarders = await Boarding.count({ where: { status: 'active' } });
            const pendingServices = await Service.count({ where: { status: 'pending' } });
            const unreadNotifications = await Notification.count({ where: { status: 'unread' } });
            
            const revenueOverview = await Payment.findAll({
                attributes: [[Sequelize.fn('SUM', Sequelize.col('amount')), 'totalRevenue']],
                where: { createdAt: { [Op.gte]: new Date(new Date().getFullYear(), 0, 1) } },
                group: [Sequelize.fn('MONTH', Sequelize.col('createdAt'))],
            });
            
            const servicesByCategory = await Service.findAll({
                attributes: ['category', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
                group: ['category'],
            });

            res.json({ totalUsers, activeBoarders, pendingServices, unreadNotifications, revenueOverview, servicesByCategory });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Add user
    addUser: async (req, res) => {
        try {
            const { name, email, role, status } = req.body;
            const password = await bcrypt.hash('defaultPassword', 10);
            const newUser = await User.create({ name, email, role, status, password });
            res.json(newUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Add service
    addService: async (req, res) => {
        try {
            const { name, category, price, duration, status } = req.body;
            const newService = await Service.create({ name, category, price, duration, status });
            res.json(newService);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Fetch appointments
    getAppointments: async (req, res) => {
        try {
            const today = new Date();
            const upcomingAppointments = await Appointment.findAll({ where: { appointment_date: { [Op.gte]: today } } });
            const recentAppointments = await Appointment.findAll({ where: { appointment_date: { [Op.lt]: today } } });
            res.json({ upcomingAppointments, recentAppointments });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Fetch medical records
    getMedicalRecords: async (req, res) => {
        try {
            const records = await MedicalRecord.findAll();
            res.json(records);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Fetch boarding details
    getBoardingInfo: async (req, res) => {
        try {
            const totalRooms = await Room.count();
            const occupied = await Boarding.count({ where: { status: 'occupied' } });
            const available = totalRooms - occupied;
            const reserved = await Boarding.count({ where: { status: 'reserved' } });
            const currentBoarders = await Boarding.findAll({ where: { status: 'occupied' } });
            res.json({ totalRooms, occupied, available, reserved, currentBoarders });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = AdminController;
