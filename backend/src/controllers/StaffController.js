const { Appointment, Service, Boarding, Notification } = require('../models');
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
};

module.exports = StaffController;