const { User, Service, Boarding, Report, Pet, Appointment, MedicalRecord } = require('../models'); // Add MedicalRecord to the imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');// Assuming Admin model exists
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
            const boardingList = await Boarding.findAll({
                include: [
                    { model: Pet, as: 'pet', attributes: ['name'] },
                    { model: User, as: 'owner', attributes: ['name'] },
                ],
            });
            res.status(200).json({ success: true, message: 'Boarding data fetched successfully', data: boardingList });
        } catch (err) {
            console.error('Error fetching boarding data:', err);
            res.status(500).json({ success: false, message: 'Error fetching boarding data', error: err.message });
        }
    },

    // Báo cáo và thống kê
    async getDashboard(req, res) {
        try {
            const totalPets = await Pet.count(); // Count total pets
            const totalAppointments = await Appointment.count(); // Count total appointments
            const ongoingServices = await Service.count({ where: { status: 'ongoing' } }); // Count ongoing services
            const totalUsers = await User.count(); // Count total users
            const totalServices = await Service.count(); // Count total services

            res.status(200).json({
                success: true,
                message: 'Dashboard data fetched successfully',
                data: {
                    pets: totalPets,
                    appointments: totalAppointments,
                    ongoingServices: ongoingServices,
                    users: totalUsers,
                    services: totalServices,
                },
            });
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
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
            const { username, password, name, email } = req.body;
            if (!username || !password || !name || !email) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng nhập đầy đủ thông tin',
                });
            }

            // Ensure password is hashed before saving
            
            const newAdmin = await User.create({ username, password, name, email, role: "admin" });
            res.status(201).json({ message: 'Admin registered successfully', admin: newAdmin });
        } catch (error) {
            res.status(500).json({ message: 'Error registering admin', error });
        }
    },

// Đăng nhập admin
async loginAdmin(req, res) {
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

    async getAllAppointments(req, res) {
        try {
            const appointments = await Appointment.findAll({
                include: [
                    { model: Pet, as: 'appointmentPet', attributes: ['name'] }, // Use the correct alias
                    { model: User, as: 'owner', attributes: ['name'] },
                    { model: User, as: 'staff', attributes: ['name'] },
                ],
            });
            res.status(200).json({ success: true, message: 'Appointments fetched successfully', data: appointments });
        } catch (err) {
            console.error('Error fetching appointments:', err);
            res.status(500).json({ success: false, message: 'Error fetching appointments', error: err.message });
        }
    },

    async deleteAppointment(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Appointment.destroy({ where: { id } });
            if (!deleted) {
                return res.status(404).json({ success: false, message: 'Appointment not found' });
            }
            res.status(200).json({ success: true, message: 'Appointment deleted successfully' });
        } catch (err) {
            console.error('Error deleting appointment:', err);
            res.status(500).json({ success: false, message: 'Error deleting appointment', error: err.message });
        }
    },

    async getAllMedicalRecords(req, res) {
        try {
            const medicalRecords = await MedicalRecord.findAll({
                include: [
                    { model: Pet, as: 'pet', attributes: ['name'] },
                    { model: User, as: 'owner', attributes: ['name'] },
                ],
            });
            res.status(200).json({ success: true, message: 'Medical records fetched successfully', data: medicalRecords });
        } catch (err) {
            console.error('Error fetching medical records:', err);
            res.status(500).json({ success: false, message: 'Error fetching medical records', error: err.message });
        }
    },

    async deleteMedicalRecord(req, res) {
        try {
            const { id } = req.params;
            const deleted = await MedicalRecord.destroy({ where: { id } });
            if (!deleted) {
                return res.status(404).json({ success: false, message: 'Medical record not found' });
            }
            res.status(200).json({ success: true, message: 'Medical record deleted successfully' });
        } catch (err) {
            console.error('Error deleting medical record:', err);
            res.status(500).json({ success: false, message: 'Error deleting medical record', error: err.message });
        }
    },

    async getAnalyticsData(req, res) {
        try {
            const totalUsers = await User.count();
            const totalPets = await Pet.count();
            const totalAppointments = await Appointment.count();
            const totalRevenue = await Payment.sum('amount') || 0;

            res.status(200).json({
                success: true,
                message: 'Analytics data fetched successfully',
                data: {
                    totalUsers,
                    totalPets,
                    totalAppointments,
                    totalRevenue,
                },
            });
        } catch (err) {
            console.error('Error fetching analytics data:', err);
            res.status(500).json({ success: false, message: 'Error fetching analytics data', error: err.message });
        }
    },
};

module.exports = AdminController;