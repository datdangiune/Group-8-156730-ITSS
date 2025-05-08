const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Service, Appointment, MedicalRecord, Boarding, Room, Notification, Payment, Pet, ServiceUser} = require('../models');
const { Op, Sequelize } = require('sequelize');
require("dotenv").config();
const AdminController = {
    //Thông tin đăng nhập của admin => test thành công
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
    // Lấy thông tin bảng ở trang dashboard => test thành công, lưu ý tính tổng revenue 
    getDashboardStats: async (req, res) => {
        try {
            const totalUsers = await User.count({ where: { role: 'pet_owner' } });
            const ongoingBoarders = await Boarding.count({ where: { status: 'ongoing' } });
            const availableServices = await Service.count({ where: { status: 'available' } });
    
            const revenueOverview = await Payment.findAll({
                attributes: [
                    [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalRevenue'],
                    [Sequelize.literal("EXTRACT(MONTH FROM payment_date)"), 'month']
                ],
                where: { 
                    payment_date: { [Op.gte]: new Date(new Date().getFullYear(), 0, 1) }
                },
                group: [Sequelize.literal("EXTRACT(MONTH FROM payment_date)")],
                order: [[Sequelize.literal("EXTRACT(MONTH FROM payment_date)"), 'ASC']]
            });
    
            const servicesByCategory = await Service.findAll({
                attributes: ['type', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
                group: ['type'],
            });
    
            res.json({ totalUsers, ongoingBoarders, availableServices, revenueOverview, servicesByCategory });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    

    // Lấy danh sách user => test thành công
getAllUsers: async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['name', 'username', 'email', 'role']
        });
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
},
// Thêm user => test thành công
    addUser: async (req, res) => {
        try {
            const { name, email, role, username, phone_number } = req.body;
            // Kiểm tra xem username đã được cung cấp chưa
            if (!username) {
                return res.status(400).json({ error: "Username is required!" });
            }
            // Kiểm tra xem email hoặc username đã tồn tại chưa
            const existingUser = await User.findOne({ where: { [Op.or]: [{ email }, { username }] } });
            if (existingUser) {
                return res.status(400).json({ error: "Email hoặc Username đã tồn tại!" });
            }
            // Mật khẩu mặc định sẽ được hash trong hook `beforeCreate`
            const newUser = await User.create({
                name,
                username, // Sử dụng username trực tiếp từ req.body
                email,
                role: role || 'pet_owner', // Mặc định là 'pet_owner' nếu không truyền
                password: 'defaultPassword', // Sẽ được hash tự động
                phone_number
            });
            res.status(201).json({ success: true, message: "User created successfully!", user: newUser });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    

    getAppointments: async (req, res) => {
        try {
            const today = new Date();
    
            // Lấy lịch hẹn sắp tới
            const upcomingAppointments = await Appointment.findAll({
                where: { appointment_date: { [Op.gte]: today } },
                include: [
                    { model: Pet, as: 'pet', attributes: ['name', 'type', 'breed'] }, // Đúng alias 'pet'
                    { model: User, as: 'staff', attributes: ['name'], where: { role: 'vet' } } // Đúng alias 'staff'
                ],
                order: [['appointment_date', 'ASC']]
            });
    
            // Lấy lịch hẹn đã hoàn thành
            const recentAppointments = await Appointment.findAll({
                where: { appointment_date: { [Op.lt]: today } },
                include: [
                    { model: Pet, as: 'pet', attributes: ['name', 'type', 'breed'] },
                    { model: User, as: 'staff', attributes: ['name'], where: { role: 'vet' } }
                ],
                order: [['appointment_date', 'DESC']]
            });
    
            // Format dữ liệu trả về
            const formatAppointments = (appointments) => {
                return appointments.map(appt => ({
                    title: `${appt.appointment_type} - ${appt.pet.name} (${appt.pet.type} - ${appt.pet.breed || 'Unknown'})`,
                    date: appt.appointment_date,
                    time: appt.appointment_hour,
                    doctor: `Dr. ${appt.staff.name}` // Đổi từ 'vet' thành 'staff'
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
    // Fetch medical records => Đang đợi sửa db
    getMedicalRecords: async (req, res) => {
        try {
            const records = await MedicalRecord.findAll();
            res.json(records);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Fetch boarding details => Đang đợi sửa db
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
            const newPatients = await User.count({ 
                where: { 
                    role: 'pet_owner', 
                    created_at: { [Op.gte]: Sequelize.literal('CURRENT_DATE - INTERVAL 1 MONTH') } 
                } 
            });
    
            const revenueGrowth = await Payment.sum('amount', { 
                where: { 
                    payment_date: { [Op.gte]: Sequelize.literal('CURRENT_DATE - INTERVAL 1 MONTH') } 
                } 
            });
    
            const avgVisitValue = await Payment.findOne({ 
                attributes: [[Sequelize.fn('AVG', Sequelize.col('amount')), 'avgValue']] 
            });
    
            const bookings = await Appointment.count();
            const capacityUtilization = (bookings / (await Room.count())) * 100;
    
            const revenueOverview = await Payment.findAll({
                attributes: [
                    [Sequelize.fn('MONTH', Sequelize.col('payment_date')), 'month'],
                    [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalRevenue']
                ],
                where: { 
                    payment_date: { [Op.gte]: new Date(new Date().getFullYear(), 0, 1) } 
                },
                group: [Sequelize.fn('MONTH', Sequelize.col('payment_date'))],
                order: [[Sequelize.fn('MONTH', Sequelize.col('payment_date')), 'ASC']]
            });
    
            const servicesBreakdown = await Service.findAll({
                attributes: ['type', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
                group: ['type'],
            });
    
            res.json({ 
                newPatients, 
                revenueGrowth, 
                avgVisitValue, 
                bookings, 
                capacityUtilization, 
                revenueOverview, 
                servicesBreakdown 
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    

    // Fetch notifications
    getNotifications: async (req, res) => {
        try {
            const { type } = req.query;
            const filter = type ? { category: type } : {};
            const notifications = await Notification.findAll({ where: filter }); //filter???
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
    //mượn xóa tạm
    // deleteService: async (req, res) => {
    //     try {
    //         await ServiceUser.destroy({
    //             where: { }
    //         });
    //         await Service.destroy({ where: {} }); // Xóa tất cả bản ghi
    //         res.status(200).json({ message: "Deleted all services successfully!" });
    //     } catch (error) {
    //         res.status(500).json({ message: "Error deleting services", error });
    //     }
    // },

    async updateUserRole(req, res) {
        // Ensure this method is implemented
        // ...existing code...
    },

    async getAllServices(req, res) {
        // Ensure this method is implemented
        // ...existing code...
    },

    async createService(req, res) {
        // Ensure this method is implemented
        // ...existing code...
    },

    async updateService(req, res) {
        // Ensure this method is implemented
        // ...existing code...
    },

    async deleteService(req, res) {
        // Ensure this method is implemented
        // ...existing code...
    },

    async getAllBoarding(req, res) {
        // Ensure this method is implemented
        // ...existing code...
    },

    async getDashboard(req, res) {
        // Ensure this method is implemented
        // ...existing code...
    },

    async getUsersByRole(req, res) {
        // Ensure this method is implemented
        // ...existing code...
    },

    async getRevenueReport(req, res) {
        // Ensure this method is implemented
        // ...existing code...
    },

    async getHealthTrends(req, res) {
        // Ensure this method is implemented
        // ...existing code...
    },

    async getPetRegistrationStats(req, res) {
        // Ensure this method is implemented
        // ...existing code...
    },

    async getServiceUsageStats(req, res) {
        // Ensure this method is implemented
        // ...existing code...
    },

    async getAllAppointments(req, res) {
        // Ensure this method is implemented
        // ...existing code...
    },

    async deleteAppointment(req, res) {
        // Ensure this method is implemented
        // ...existing code...
    },

    async getAllMedicalRecords(req, res) {
        // Ensure this method is implemented
        // ...existing code...
    },

    async deleteMedicalRecord(req, res) {
        // Ensure this method is implemented
        // ...existing code...
    },

    async registerAdmin(req, res) {
        // Ensure this method is implemented
        // ...existing code...
    },

    async loginAdmin(req, res) {
        // Ensure this method is implemented
        // ...existing code...
    },
};

module.exports = AdminController;
