const { Appointment, Service, Boarding, Notification, Pet, User } = require('../models');
const { Op } = require('sequelize');

const StaffController = {
    // Lấy thống kê dashboard
    async getDashboardStats(req, res) {
        try {
    // Lấy ngày hiện tại
    const today = new Date();
    today.setDate(today.getDate() + 2); // Cộng thêm 2 ngày

    // Lấy khoảng thời gian từ đầu ngày đến cuối ngày
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString(); // 2025-03-30T00:00:00.000Z
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString(); // 2025-03-30T23:59:59.999Z

    console.log('Start of Day:', startOfDay);
    console.log('End of Day:', endOfDay);

    // Truy vấn dựa trên khoảng thời gian
    const counttodayAppointments = await Appointment.count({
        where: {
            appointment_date: {
                [Op.between]: [startOfDay, endOfDay], // Sử dụng khoảng thời gian
            },
        },
    });

            // Lấy số lượng thú cưng đang lưu trú
            const activeBoarders = await Boarding.count({
                where: { status: 'ongoing' },
            });

            // Lấy số lượng dịch vụ đang chờ xử lý
            const pendingServices = await Service.count({
                where: { status: 'inactive' },
            });

            // Lấy số lượng thông báo chưa đọc
            const unreadNotifications = await Notification.count({
                where: { is_read: false },
            });

            // Trả về kết quả
            res.status(200).json({
                success: true,
                message: 'Dashboard stats fetched successfully',
                data: {
                    counttodayAppointments,
                    activeBoarders,
                    pendingServices,
                    unreadNotifications,
                },
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error fetching dashboard stats',
                error: err.message,
            });
        }
    },

    // Lấy danh sách lịch hẹn hôm nay
    async getTodayAppointments(req, res) {
        try {
            const today = new Date();
            today.setDate(today.getDate() + 2); // Cộng thêm 2 ngày
        
            // Lấy khoảng thời gian từ đầu ngày đến cuối ngày
            const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString(); // 2025-03-30T00:00:00.000Z
            const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString(); // 2025-03-30T23:59:59.999Z
        
            console.log('Start of Day:', startOfDay);
            console.log('End of Day:', endOfDay);
        
            // Truy vấn dựa trên khoảng thời gian
            const appointments = await Appointment.findAll({
                where: {
                    appointment_date: {
                        [Op.between]: [startOfDay, endOfDay], // Sử dụng khoảng thời gian
                    },
                },
                include: [
                    {
                        model: Pet,
                        as: 'pet',
                        attributes: ['id', 'name', 'breed', 'age'],
                    },
                    {
                        model: User,
                        as: 'owner',
                        attributes: ['id', 'username', 'email'],
                    },
                ],
            });

            res.status(200).json({
                success: true,
                message: "Today's appointments fetched successfully",
                data: appointments,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error fetching today\'s appointments',
                error: err.message,
            });
        }
    },

    async getAllAppointments(req, res) {
        try {
            const appointments = await Appointment.findAll({
                include: [
                    {
                        model: Pet,
                        as: 'pet',
                        attributes: ['id', 'name', 'breed', 'age'],
                    },
                    {
                        model: User,
                        as: 'owner',
                        attributes: ['id', 'username', 'email'],
                    },
                ],
            });

            res.status(200).json({
                success: true,
                message: 'All appointments fetched successfully',
                data: appointments,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error fetching all appointments',
                error: err.message,
            });
        }
    },

    async getAppointmentById(req, res) {
        try {
            const { id } = req.params;

            const appointment = await Appointment.findOne({
                where: { id },
                include: [
                    {
                        model: Pet,
                        as: 'pet',
                        attributes: ['id', 'name', 'breed', 'age'],
                    },
                    {
                        model: User,
                        as: 'owner',
                        attributes: ['id', 'username', 'email'],
                    },
                ],
            });

            if (!appointment) {
                return res.status(404).json({
                    success: false,
                    message: 'Appointment not found',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Appointment fetched successfully',
                data: appointment,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error fetching appointment',
                error: err.message,
            });
        }
    },

    async updateAppointmentStatus(req, res) {
        try {
            const { id } = req.params;
            const { appointment_status } = req.body;

            const updated = await Appointment.update(
                { appointment_status },
                { where: { id } }
            );

            if (!updated[0]) {
                return res.status(404).json({
                    success: false,
                    message: 'Appointment not found',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Appointment status updated successfully',
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error updating appointment status',
                error: err.message,
            });
        }
    },
};

module.exports = StaffController;