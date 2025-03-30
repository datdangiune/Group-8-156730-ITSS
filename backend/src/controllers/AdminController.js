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
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
    
            const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
            res.json({ success: true, message: 'Login successful', token });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },    
    // Dashboard statistics
    getDashboardStats: async (req, res) => {
        try {
            const totalUsers = await User.count({ where: { role: 'owner' } });
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

    // Lấy danh sách user
getAllUsers: async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['name', 'email', 'role', 'lastActive']
        });
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
},
// Add user
addUser: async (req, res) => {
    try {
        const { name, email, role, status } = req.body;
        const password = await bcrypt.hash('defaultPassword', 10);
        const newUser = await User.create({ name, email, role, password });
        res.json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
},
// Lấy danh sách service
getAllServices: async (req, res) => {
    try {
        const services = await Service.findAll({
            attributes: ['name', 'category', 'price', 'duration', 'status']
        });
        res.json({ success: true, services });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
    getAnalyticsData: async (req, res) => {
        try {
            const newPatients = await User.count({ where: { role: 'customer', createdAt: { [Op.gte]: Sequelize.literal('CURRENT_DATE - INTERVAL 1 MONTH') } } });
            const revenueGrowth = await Payment.sum('amount', { where: { createdAt: { [Op.gte]: Sequelize.literal('CURRENT_DATE - INTERVAL 1 MONTH') } } });
            const avgVisitValue = await Payment.findOne({ attributes: [[Sequelize.fn('AVG', Sequelize.col('amount')), 'avgValue']] });
            const bookings = await Appointment.count();
            const capacityUtilization = (bookings / (await Room.count())) * 100;

            const revenueOverview = await Payment.findAll({
                attributes: [[Sequelize.fn('SUM', Sequelize.col('amount')), 'totalRevenue']],
                where: { createdAt: { [Op.gte]: new Date(new Date().getFullYear(), 0, 1) } },
                group: [Sequelize.fn('MONTH', Sequelize.col('createdAt'))],
            });

            const servicesBreakdown = await Service.findAll({
                attributes: ['category', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
                group: ['category'],
            });

            res.json({ newPatients, revenueGrowth, avgVisitValue, bookings, capacityUtilization, revenueOverview, servicesBreakdown });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Fetch notifications
    getNotifications: async (req, res) => {
        try {
            const { type } = req.query;
            const filter = type ? { category: type } : {};
            const notifications = await Notification.findAll({ where: filter });
            res.json(notifications);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    markAllNotificationsAsRead: async (req, res) => {
        try {
            await Notification.update({ status: 'read' }, { where: {} });
            res.json({ message: 'All notifications marked as read' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Manage admin profile
    updateProfile: async (req, res) => {
        try {
            const { firstName, lastName, email, bio } = req.body;
            await User.update({ firstName, lastName, email, bio }, { where: { id: req.user.id } });
            res.json({ message: 'Profile updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updatePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = await User.findByPk(req.user.id);
            if (!(await bcrypt.compare(currentPassword, user.password))) {
                return res.status(401).json({ message: 'Current password is incorrect' });
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await User.update({ password: hashedPassword }, { where: { id: req.user.id } });
            res.json({ message: 'Password updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateNotificationPreferences: async (req, res) => {
        try {
            const { emailNotifications, pushNotifications, smsNotifications, desktopNotifications } = req.body;
            await Setting.update({ emailNotifications, pushNotifications, smsNotifications, desktopNotifications }, { where: { userId: req.user.id } });
            res.json({ message: 'Notification preferences updated' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateSystemSettings: async (req, res) => {
        try {
            const { language, timezone, autoUpdates, analyticsCollection, errorReporting } = req.body;
            await Setting.update({ language, timezone, autoUpdates, analyticsCollection, errorReporting }, { where: { userId: req.user.id } });
            res.json({ message: 'System settings updated' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};



module.exports = AdminController;