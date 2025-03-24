const { User, Service, Boarding, Report } = require('../models');

const AdminController = {
    // Quản lý tài khoản người dùng
    async getAllUsers(req, res) {
        try {
            const users = await User.findAll();
            res.status(200).json({ success: true, message: 'Users fetched successfully', data: users });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error fetching users', error: err.message });
        }
    },

    async updateUserRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;

            const user = await User.update({ role }, { where: { id } });

            if (!user[0]) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            res.status(200).json({ success: true, message: 'User role updated successfully' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error updating user role', error: err.message });
        }
    },

    // Quản lý dịch vụ
    async getAllServices(req, res) {
        try {
            const services = await Service.findAll();
            res.status(200).json({ success: true, message: 'Services fetched successfully', data: services });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error fetching services', error: err.message });
        }
    },

    async createService(req, res) {
        try {
            const service = await Service.create(req.body);
            res.status(201).json({ success: true, message: 'Service created successfully', data: service });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error creating service', error: err.message });
        }
    },

    // Quản lý lưu trú
    async getAllBoarding(req, res) {
        try {
            const boardingList = await Boarding.findAll();
            res.status(200).json({ success: true, message: 'Boarding data fetched successfully', data: boardingList });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error fetching boarding data', error: err.message });
        }
    },

    // Báo cáo và thống kê
    async getDashboard(req, res) {
        try {
            const report = await Report.generateDashboard(); // Giả định có hàm generateDashboard
            res.status(200).json({ success: true, message: 'Dashboard data fetched successfully', data: report });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error fetching dashboard data', error: err.message });
        }
    },

        // Lọc danh sách người dùng theo vai trò
    async getUsersByRole(req, res) {
        try {
            const { role } = req.query; // Vai trò cần lọc
            if (!role) {
                return res.status(400).json({ success: false, message: 'Role is required' });
            }

            const users = await User.findAll({ where: { role } });
            res.status(200).json({
                success: true,
                message: `Users with role ${role} fetched successfully`,
                data: users,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error fetching users by role',
                error: err.message,
            });
        }
    },

    // Lọc danh sách người dùng theo vai trò
    async getUsersByRole(req, res) {
        try {
            const { role } = req.query; // Vai trò cần lọc
            if (!role) {
                return res.status(400).json({ success: false, message: 'Role is required' });
            }

            const users = await User.findAll({ where: { role } });
            res.status(200).json({
                success: true,
                message: `Users with role ${role} fetched successfully`,
                data: users,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error fetching users by role',
                error: err.message,
            });
        }
    },

    async getRevenueReport(req, res) {
        try {
            const { start_date, end_date } = req.query;

            const whereClause = {};
            if (start_date) whereClause.payment_date = { [Op.gte]: start_date };
            if (end_date) whereClause.payment_date = { ...whereClause.payment_date, [Op.lte]: end_date };

            const revenue = await Payment.sum('amount', { where: whereClause });

            res.status(200).json({
                success: true,
                message: 'Revenue report fetched successfully',
                data: { revenue },
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error fetching revenue report',
                error: err.message,
            });
        }
    },

    async getHealthTrends(req, res) {
        try {
            const healthTrends = await Pet.findAll({
                attributes: ['medical_history', [sequelize.fn('COUNT', sequelize.col('medical_history')), 'count']],
                group: ['medical_history'],
                order: [[sequelize.fn('COUNT', sequelize.col('medical_history')), 'DESC']],
            });

            res.status(200).json({
                success: true,
                message: 'Health trends fetched successfully',
                data: healthTrends,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error fetching health trends',
                error: err.message,
            });
        }
    },

    async getPetRegistrationStats(req, res) {
        try {
            const { start_date, end_date } = req.query;

            const whereClause = {};
            if (start_date) whereClause.created_at = { [Op.gte]: start_date };
            if (end_date) whereClause.created_at = { ...whereClause.created_at, [Op.lte]: end_date };

            const count = await Pet.count({ where: whereClause });

            res.status(200).json({
                success: true,
                message: 'Pet registration statistics fetched successfully',
                data: { count },
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error fetching pet registration statistics',
                error: err.message,
            });
        }
    },

    async getServiceUsageStats(req, res) {
        try {
            const { start_date, end_date } = req.query;

            const appointmentCount = await Appointment.count({
                where: {
                    appointment_date: {
                        [Op.between]: [start_date, end_date],
                    },
                },
            });

            const serviceCount = await Service.count({
                where: {
                    created_at: {
                        [Op.between]: [start_date, end_date],
                    },
                },
            });

            res.status(200).json({
                success: true,
                message: 'Service usage statistics fetched successfully',
                data: {
                    appointments: appointmentCount,
                    services: serviceCount,
                },
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error fetching service usage statistics',
                error: err.message,
            });
        }
    },
};

module.exports = AdminController;