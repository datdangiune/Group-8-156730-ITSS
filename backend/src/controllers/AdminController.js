const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Service, Appointment, MedicalRecord, Boarding, Room, Notification, Payment, Pet } = require('../models');
const { Op, Sequelize } = require('sequelize');
require("dotenv").config();
const AdminController = {
    // Admin login
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
    
            // Tìm người dùng theo email
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            // So sánh mật khẩu
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
    
            // Kiểm tra vai trò admin
            if (user.role !== 'admin') {
                return res.status(403).json({ message: 'Access denied. Admins only.' });
            }
    
            const token = jwt.sign(
                { id: user.id, role: user.role, username: user.username, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
    
            res.status(200).json({ message: 'Login successful', token });
        } catch (err) {
            res.status(500).json({ message: 'Error logging in', error: err.message });
        }
    },    
    // Dashboard statistics
    getDashboardStats: async (req, res) => {
        try {
            const totalUsers = await User.count({ where: { role: 'pet_owner' } });
            const activeBoarders = await Boarding.count({ where: { status: 'ongoing' } });
            const pendingServices = await Service.count({ where: { status: 'available' } });
            const revenueOverview = await Payment.findAll({
                attributes: [[Sequelize.fn('SUM', Sequelize.col('amount')), 'totalRevenue']],
                where: { createdAt: { [Op.gte]: new Date(new Date().getFullYear(), 0, 1) } },
                group: [Sequelize.fn('MONTH', Sequelize.col('createdAt'))],
            });
            const servicesByCategory = await Service.findAll({
                attributes: ['type', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
                group: ['type'],
            });
            res.json({ totalUsers, activeBoarders, pendingServices, revenueOverview, servicesByCategory });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Lấy danh sách user
getAllUsers: async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['name', 'email', 'role']
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
            attributes: ['name', 'price', 'duration', 'status']
        });
        res.json({ success: true, services });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
},


    // Fetch appointments
    getAppointments : async (req, res) => {
        try {
            const today = new Date();
    
            // Lấy lịch hẹn sắp tới
            const upcomingAppointments = await Appointment.findAll({
                where: { appointment_date: { [Op.gte]: today } },
                include: [
                    { model: Pet, attributes: ['name', 'type', 'breed'] }, // Lấy thông tin thú cưng
                    { model: User, attributes: ['name'], as: 'vet', where: { role: 'vet' } } // Lấy tên bác sĩ
                ],
                order: [['appointment_date', 'ASC']]
            });
    
            // Lấy lịch hẹn đã hoàn thành
            const recentAppointments = await Appointment.findAll({
                where: { appointment_date: { [Op.lt]: today } },
                include: [
                    { model: Pet, attributes: ['name', 'type', 'breed'] },
                    { model: User, attributes: ['name'], as: 'vet', where: { role: 'vet' } }
                ],
                order: [['appointment_date', 'DESC']]
            });
    
            // Format dữ liệu trả về
            const formatAppointments = (appointments) => {
                return appointments.map(appt => ({
                    title: `${appt.appointment_type} - ${appt.Pet.name} (${appt.Pet.type} - ${appt.Pet.breed || 'Unknown'})`,
                    date: appt.appointment_date,
                    time: appt.appointment_hour,
                    doctor: `Dr. ${appt.vet.name}`
                }));
            };
    
            res.json({
                success: true,
                message: "Appointments retrieved successfully",
                upcomingAppointments: formatAppointments(upcomingAppointments),
                recentAppointments: formatAppointments(recentAppointments)
            });
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
            const occupied = await Boarding.count({ where: { status: 'ongoing' } });
            const available = await Room.count({ where: { is_available: true } });
            const reserved = await Boarding.count({ where: { status: 'completed' } });
            const currentBoarders = await Boarding.findAll({
                where: { status: 'ongoing' },
                include: [{ model: Room, attributes: ['room_number', 'type'] }]
            });
            res.json({ totalRooms, occupied, available, reserved, currentBoarders });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAnalyticsData: async (req, res) => {
        try {
            const newPatients = await User.count({ where: { role: 'pet_owner', createdAt: { [Op.gte]: Sequelize.literal('CURRENT_DATE - INTERVAL 1 MONTH') } } });
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
                attributes: ['type', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
                group: ['type'],
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
