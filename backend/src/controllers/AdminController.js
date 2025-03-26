const { User, Service, Boarding, Report } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // Assuming Admin model exists

const AdminController = {
    // Quản lý tài khoản người dùng
    async getAllUsers(req, res) {
        try {
            const users = await User.findAll(); // Ensure the User model is correctly defined
            res.status(200).json({ success: true, message: 'Users fetched successfully', data: users });
        } catch (err) {
            console.error('Error fetching users:', err); // Log the error for debugging
            res.status(500).json({ success: false, message: 'Error fetching users', error: err.message });
        }
    },

    async updateUserRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;

            // Validate role
            const validRoles = ['admin', 'staff', 'vet', 'user']; // Update this list based on your ENUM values
            if (!validRoles.includes(role)) {
                return res.status(400).json({ success: false, message: 'Invalid role value' });
            }

            const user = await User.update({ role }, { where: { id } });

            if (!user[0]) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            res.status(200).json({ success: true, message: 'User role updated successfully' });
        } catch (err) {
            console.error('Error updating user role:', err); // Log the error for debugging
            res.status(500).json({ success: false, message: 'Error updating user role', error: err.message });
        }
    },

    // Quản lý dịch vụ
    async getAllServices(req, res) {
        try {
            const services = await Service.findAll(); // Ensure the Service model is correctly defined
            res.status(200).json({ success: true, message: 'Services fetched successfully', data: services });
        } catch (err) {
            console.error('Error fetching services:', err); // Log the error for debugging
            res.status(500).json({ success: false, message: 'Error fetching services', error: err.message });
        }
    },

    async createService(req, res) {
        try {
            const { name, description, price } = req.body;

            if (!name || !price) {
                return res.status(400).json({ success: false, message: 'Name and price are required' });
            }

            const service = await Service.create({ name, description, price });
            res.status(201).json({ success: true, message: 'Service created successfully', data: service });
        } catch (err) {
            console.error('Error creating service:', err);
            res.status(500).json({ success: false, message: 'Error creating service', error: err.message });
        }
    },

    async updateService(req, res) {
        try {
            const { id } = req.params;
            const { name, description, price } = req.body;

            if (!name || !price) {
                return res.status(400).json({ success: false, message: 'Name and price are required' });
            }

            const [updated] = await Service.update({ name, description, price }, { where: { id } });

            if (!updated) {
                return res.status(404).json({ success: false, message: 'Service not found' });
            }

            const updatedService = await Service.findByPk(id);
            res.status(200).json({ success: true, message: 'Service updated successfully', data: updatedService });
        } catch (err) {
            console.error('Error updating service:', err);
            res.status(500).json({ success: false, message: 'Error updating service', error: err.message });
        }
    },

    async deleteService(req, res) {
        try {
            const { id } = req.params;

            const deleted = await Service.destroy({ where: { id } });

            if (!deleted) {
                return res.status(404).json({ success: false, message: 'Service not found' });
            }

            res.status(200).json({ success: true, message: 'Service deleted successfully' });
        } catch (err) {
            console.error('Error deleting service:', err);
            res.status(500).json({ success: false, message: 'Error deleting service', error: err.message });
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

    // Đăng ký admin
    async registerAdmin(req, res) {
        try {
            const { username, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const newAdmin = await Admin.create({ username, password: hashedPassword });
            res.status(201).json({ message: 'Admin registered successfully', admin: newAdmin });
        } catch (error) {
            res.status(500).json({ message: 'Error registering admin', error });
        }
    },

    // Đăng nhập admin
    async loginAdmin(req, res) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ message: 'Username and password are required' });
            }

            console.log('Login attempt:', { username }); // Debugging log
            const admin = await Admin.findOne({ where: { username } });
            if (!admin) {
                console.log('Admin not found:', username); // Debugging log
                return res.status(404).json({ message: 'Admin not found' });
            }

            const isPasswordValid = await bcrypt.compare(password, admin.password);
            if (!isPasswordValid) {
                console.log('Invalid password for:', username); // Debugging log
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
            console.log('Login successful for:', username); // Debugging log
            res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            console.error('Error during login:', error); // Debugging log
            res.status(500).json({ message: 'Error logging in', error: error.message || error });
        }
    },
};

module.exports = AdminController;