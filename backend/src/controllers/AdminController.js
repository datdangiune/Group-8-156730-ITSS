const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Appointment, AppointmentResult, Boarding, BoardingUser, MedicalRecord, Notification, Pet, Report, Room, Service, ServiceUser, User} = require('../models');
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
//Trang dashboard thống kê
    async getDashboardStats(req, res) {
        try {
          const [totalUsers, activeBoarders, pendingServices, unreadNotifications] = await Promise.all([
            User.count(),
            BoardingUser.count({ where: { status_payment: 'paid' } }),
            ServiceUser.count({ where: { status: 'In Progess' } }),
            Notification.count({ where: { is_read: false } }),
          ]);
    
          res.json({
            totalUsers,
            activeBoarders,
            pendingServices,
            unreadNotifications,
          });
        } catch (err) {
          console.error('Dashboard stats error:', err);
          res.status(500).json({ error: 'Failed to fetch dashboard statistics', details: err });
        }
      },
    // Biểu đồ doanh thu theo tháng (USD)
    async getMonthlyRevenue(req, res) {
    try {
      const revenues = await Report.findAll({
        where: { type: 'revenue' },
        attributes: [
          [Sequelize.fn('MONTH', Sequelize.col('generated_at')), 'month'],
          [Sequelize.fn('SUM', Sequelize.cast(Sequelize.col('content'), 'float')), 'total']
        ],
        group: ['month'],
        order: [['month', 'ASC']]
      });

      res.json(revenues);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch revenue data', details: err });
    }
  },

  // Biểu đồ thống kê dịch vụ theo loại (grooming, training, boarding) theo thứ trong tuần
  async getServiceStatsByCategory(req, res) {
    try {
      const services = await ServiceUser.findAll({
        attributes: [
          [Sequelize.fn('DAYNAME', Sequelize.col('date')), 'day'],
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        include: [{
          model: Service,
          as: 'service',
          attributes: ['type']
        }],
        group: ['day', 'service.type'],
        raw: true
      });

      res.json(services);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch service stats', details: err });
    }
  },

  // Lịch hẹn và dịch vụ hôm nay
  async getTodaySchedule(req, res) {
    try {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

      const appointments = await Appointment.findAll({
        where: Sequelize.where(Sequelize.fn('DATE', Sequelize.col('appointment_date')), today),
        include: [
          {
            model: Pet,
            as: 'pet',
            attributes: ['name', 'type']
          }
        ],
        attributes: ['id', 'appointment_type', 'appointment_hour', 'appointment_status']
      });

      const services = await ServiceUser.findAll({
        where: { date: today },
        include: [
          {
            model: Pet,
            as: 'pet',
            attributes: ['name', 'type']
          },
          {
            model: Service,
            as: 'service',
            attributes: ['name']
          }
        ],
        attributes: ['id', 'hour', 'status']
      });

      res.json({ appointments, services });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch today schedule', details: err });
    }
  },

  // Danh sách thông báo gần đây
  async getRecentNotifications(req, res) {
    try {
      const notifications = await Notification.findAll({
        order: [['created_at', 'DESC']],
        limit: 5
      });

      res.json(notifications);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch recent notifications', details: err });
    }
  },
//Trang user management
 async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'role', 'phone_number', 'created_at'],
        order: [['created_at', 'DESC']]
      });

      res.json(users);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
      res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
  },

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
//Lấy dịch vụ ở trang service
    async getAllServices(req, res) {
    try {
      const services = await Service.findAll({
        attributes: ['id', 'name', 'type', 'price', 'duration', 'status'],
        order: [['created_at', 'DESC']]
      });

      res.json(services);
    } catch (err) {
      console.error('❌ Error fetching services:', err);
      res.status(500).json({ message: 'Failed to fetch services', error: err.message });
    }
  },
//Trang Appointments
  // 1. Lịch hẹn sắp tới (Upcoming)
  async getUpcomingAppointments(req, res) {
    try {
      const today = new Date();
      const appointments = await Appointment.findAll({
        where: {
          appointment_date: {
            [Op.gte]: today // hôm nay hoặc tương lai
          },
          appointment_status: {
            [Op.in]: ['Scheduled', 'In progress']
          }
        },
        include: [
          {
            model: Pet,
            as: 'pet',
            attributes: ['name', 'type']
          },
          {
            model: User,
            as: 'staff',
            attributes: ['name']
          }
        ],
        order: [['appointment_date', 'ASC'], ['appointment_hour', 'ASC']]
      });

      res.json(appointments);
    } catch (err) {
      console.error('❌ Error fetching upcoming appointments:', err);
      res.status(500).json({ message: 'Failed to fetch upcoming appointments', error: err.message });
    }
  },

  // 2. Lịch hẹn gần đây (Recent)
  async getRecentAppointments(req, res) {
    try {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 7); // 7 ngày gần đây

      const appointments = await Appointment.findAll({
        where: {
          appointment_status: 'Done',
          appointment_date: {
            [Op.gte]: fromDate
          }
        },
        include: [
          {
            model: Pet,
            as: 'pet',
            attributes: ['name', 'type']
          },
          {
            model: User,
            as: 'staff',
            attributes: ['name']
          }
        ],
        order: [['appointment_date', 'DESC'], ['appointment_hour', 'DESC']]
      });

      res.json(appointments);
    } catch (err) {
      console.error('❌ Error fetching recent appointments:', err);
      res.status(500).json({ message: 'Failed to fetch recent appointments', error: err.message });
    }
  }, 
//Trang Medical Record 
   // 1. Recent medical records
  async getRecentMedicalRecords(req, res) {
    try {
      const records = await MedicalRecord.findAll({
        include: [
          {
            model: Pet,
            attributes: ['name', 'type']
          },
          {
            model: User,
            attributes: ['name']
          }
        ],
        order: [['record_date', 'DESC']],
        limit: 10
      });

      res.json(records);
    } catch (err) {
      console.error('❌ Error fetching recent medical records:', err);
      res.status(500).json({ message: 'Failed to fetch medical records', error: err.message });
    }
  },

  // 2. Chi tiết một bản ghi y tế
  async getMedicalRecordById(req, res) {
    try {
      const { id } = req.params;
      const record = await MedicalRecord.findByPk(id, {
        include: [
          {
            model: Pet,
            attributes: ['name', 'type']
          },
          {
            model: User,
            attributes: ['name']
          }
        ]
      });

      if (!record) return res.status(404).json({ message: 'Medical record not found' });

      res.json(record);
    } catch (err) {
      console.error('❌ Error fetching medical record detail:', err);
      res.status(500).json({ message: 'Failed to fetch medical record detail', error: err.message });
    }
  },
//Trang Boarding
  // 1. Thống kê Boarding
  async getBoardingStats(req, res) {
    try {
      const today = new Date();

      const [totalRooms, occupied, available, reserved] = await Promise.all([
        Room.count(),
        BoardingUser.count({
          where: {
            start_date: { [Op.lte]: today },
            end_date: { [Op.gte]: today },
            status_payment: 'paid'
          }
        }),
        Room.count({ where: { is_available: true } }),
        BoardingUser.count({ where: { status_payment: 'pending' } })
      ]);

      res.json({
        totalRooms,
        occupied,
        available,
        reserved
      });
    } catch (err) {
      console.error('❌ Error fetching boarding stats:', err);
      res.status(500).json({ message: 'Failed to fetch boarding stats', error: err.message });
    }
  },

  // 2. Danh sách các thú cưng đang ở trọ hiện tại
  async getCurrentBoarders(req, res) {
  try {
    const today = new Date();

    const boarders = await BoardingUser.findAll({
      where: {
        start_date: { [Op.lte]: today },
        end_date: { [Op.gte]: today },
        status_payment: 'paid'
      },
      include: [
        {
          model: Pet,
          as: 'pet',
          attributes: ['name', 'type', 'breed']
        }
      ],
      order: [['start_date', 'ASC']]
    });

    const formatted = boarders.map(b => ({
      id: b.id,
      petName: b.pet.name,
      petBreed: b.pet.breed,
      dateRange: '${b.start_date.toISOString().slice(0, 10)} - ${b.end_date.toISOString().slice(0, 10)}',
      notes: b.notes
    }));

    res.json(formatted);
  } catch (err) {
    console.error('❌ Error fetching current boarders:', err);
    res.status(500).json({ message: 'Failed to fetch current boarders', error: err.message });
  }
},
//Trang Analytics
async getMonthlyRevenue(req, res) {
  try {
    const revenueData = await Report.findAll({
      where: { type: 'revenue' },
      attributes: [
        [Sequelize.fn('MONTH', Sequelize.col('generated_at')), 'month'],
        [Sequelize.fn('SUM', Sequelize.cast(Sequelize.col('content'), 'float')), 'total']
      ],
      group: ['month'],
      order: [['month', 'ASC']]
    });

    res.json(revenueData);
  } catch (err) {
    console.error('❌ Revenue fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch revenue overview' });
  }
},
async getServiceBreakdown(req, res) {
  try {
    const serviceStats = await ServiceUser.findAll({
      include: [{
        model: Service,
        as: 'service',
        attributes: ['type']
      }],
      attributes: [
        [Sequelize.col('service.type'), 'type'],
        [Sequelize.fn('COUNT', Sequelize.col('ServiceUser.id')), 'count']
      ],
      group: ['service.type']
    });

    res.json(serviceStats);
  } catch (err) {
    console.error('❌ Service breakdown error:', err);
    res.status(500).json({ message: 'Failed to fetch service breakdown' });
  }
},

async getKPIs(req, res) {
  try {
    const today = new Date();
    const startThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    // New patients
    const newThisMonth = await User.count({ where: { created_at: { [Op.gte]: startThisMonth } } });
    const newLastMonth = await User.count({ where: { created_at: { [Op.between]: [startLastMonth, endLastMonth] } } });
    const newPatientsGrowth = newLastMonth ? (((newThisMonth - newLastMonth) / newLastMonth) * 100).toFixed(1) : '100';

    // Revenue growth
    const revenueReports = await Report.findAll({
      where: { type: 'revenue' }
    });

    const thisMonthRevenue = revenueReports
      .filter(r => new Date(r.generated_at) >= startThisMonth)
      .reduce((acc, r) => acc + parseFloat(r.content || 0), 0);

    const lastMonthRevenue = revenueReports
      .filter(r => new Date(r.generated_at) >= startLastMonth && new Date(r.generated_at) < startThisMonth)
      .reduce((acc, r) => acc + parseFloat(r.content || 0), 0);

    const revenueGrowth = lastMonthRevenue ? (((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1) : '100';

    // Avg visit value
    const totalAppointments = await Appointment.count();
    const avgVisitValue = totalAppointments ? (thisMonthRevenue / totalAppointments).toFixed(2) : 0;

    // Booking utilization
    const maxSlots = 30 * 6; // 6 slot/hours mỗi ngày giả định
    const bookings = await Appointment.count({
      where: {
        appointment_date: { [Op.gte]: startThisMonth }
      }
    });
    const bookingUtilization = ((bookings / maxSlots) * 100).toFixed(1);

    res.json({
      newPatients: newPatientsGrowth + '%',
      revenueGrowth: revenueGrowth + '%',
      avgVisitValue: '$' + avgVisitValue,
      bookingUtilization: bookingUtilization + '%'
    });
  } catch (err) {
    console.error('❌ KPI error:', err);
    res.status(500).json({ message: 'Failed to fetch KPIs', error: err.message });
  }
},

};

module.exports = AdminController;
