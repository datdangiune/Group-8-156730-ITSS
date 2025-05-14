// Updated AdminController.js with English error messages and improved logging

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Appointment, AppointmentResult, Boarding, BoardingUser, MedicalRecord, Notification, Pet, Report, Room, Service, ServiceUser, User} = require('../models');
const { Op, Sequelize } = require('sequelize');
require("dotenv").config();

const AdminController = {
    // Admin login function - tested successfully
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            console.log('Login attempt for email:', email);
    
            // Find user by email
            const user = await User.findOne({ where: { email } });
            if (!user) {
                console.log('User not found for email:', email);
                return res.status(404).json({ message: 'User not found' });
            }
    
            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log('Invalid credentials for user:', email);
                return res.status(401).json({ message: 'Invalid credentials' });
            }
    
            // Check admin role
            if (user.role !== 'admin') {
                console.log('Access denied - not admin. User role:', user.role);
                return res.status(403).json({ message: 'Access denied. Admins only.' });
            }
    
            const token = jwt.sign(
                { id: user.id, role: user.role, username: user.username, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
    
            console.log('Login successful for user:', email);
            res.status(200).json({ message: 'Login successful', token });
        } catch (err) {
            console.error('Login error:', err);
            res.status(500).json({ message: 'Error logging in', error: err.message });
        }
    },  

    // Dashboard statistics
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

    // Controller to fetch total counts for dashboard
    async getTotalCounts(req, res) {
      try {
        const [
          totalUsers,
          totalAppointments,
          totalPets,
          totalServices,
          totalBoardings
        ] = await Promise.all([
          User.count(),
          Appointment.count(),
          Pet.count(),
          Service.count(),
          Boarding.count()
        ]);

        res.json({
          totalUsers,
          totalAppointments,
          totalPets,
          totalServices,
          totalBoardings
        });
      } catch (err) {
        console.error('Error fetching total counts:', err);
        res.status(500).json({ message: 'Failed to fetch total counts', error: err.message });
      }
    },

    // Monthly revenue chart
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

    // Service statistics by category
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

    // Today's appointments and services
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

    // Recent notifications list
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

    // User management page
    async getAllUsers(req, res) {
      try {
        console.log("Fetching all users");
        const users = await User.findAll({
          attributes: ['id', 'name', 'email', 'role', 'phone_number', 'created_at'],
          order: [['created_at', 'DESC']]
        });

        console.log(`Found ${users.length} users`);
        res.json(users);
      } catch (err) {
        console.error("❌ Error fetching users:", err);
        res.status(500).json({ message: 'Error fetching users', error: err.message });
      }
    },

    // Controller to get all users in simple format for selection
    async getSimpleUserList(req, res) {
      try {
        const users = await User.findAll({
          attributes: ['id', 'name', 'email', 'role'],
          order: [['id', 'ASC']]
        });

        // Map to required format (id as string, role as string)
        const result = users.map(u => ({
          id: u.id.toString(),
          name: u.name,
          email: u.email,
          role: u.role
        }));

        res.json(result);
      } catch (err) {
        console.error("Error fetching simple user list:", err);
        res.status(500).json({ message: "Failed to fetch user list", error: err.message });
      }
    },

    // Add new user
    addUser: async (req, res) => {
        try {
            console.log("Add user request:", req.body);
            const { name, email, role, username, phone_number } = req.body;
            
            // Check if username was provided
            if (!username) {
                console.log("Username not provided in request");
                return res.status(400).json({ error: "Username is required!" });
            }
            
            // Check if email or username already exists
            const existingUser = await User.findOne({ 
                where: { 
                    [Op.or]: [{ email }, { username }] 
                } 
            });
            
            if (existingUser) {
                console.log(`User already exists with email ${email} or username ${username}`);
                return res.status(400).json({ error: "Email or Username already exists!" });
            }
            
            // Default password will be hashed in the `beforeCreate` hook
            const newUser = await User.create({
                name,
                username,
                email,
                role: role || 'client', // Default to 'client' if not provided
                password: 'defaultPassword', // Will be automatically hashed
                phone_number
            });
            
            console.log(`User created successfully: ${newUser.email}`);
            res.status(201).json({ 
                success: true, 
                message: "User created successfully!", 
                user: newUser 
            });
        } catch (error) {
            console.error("Error adding user:", error);
            res.status(500).json({ error: error.message });
        }
    },

    // Add new user (with password)
    async addUser(req, res) {
      try {
        const { name, username, email, password, role } = req.body;

        // Validate required fields
        if (!name || !username || !email || !password || !role) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        // Check if email or username already exists
        const existingUser = await User.findOne({
          where: {
            [Op.or]: [{ email }, { username }]
          }
        });

        if (existingUser) {
          return res.status(400).json({ error: "Email or Username already exists!" });
        }

        // Create new user (password will be hashed by model hook)
        const newUser = await User.create({
          name,
          username,
          email,
          password,
          role
        });

        res.status(201).json({
          success: true,
          message: "User created successfully!",
          user: {
            id: newUser.id,
            name: newUser.name,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
          }
        });
      } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ error: error.message });
      }
    },

    // Get all services for services page
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

    // Controller to get service list with usage stats
    async getServiceListWithStats(req, res) {
      try {
        // Fetch all services
        const services = await Service.findAll({
          attributes: ['id', 'name', 'type', 'price', 'duration', 'status'],
          order: [['created_at', 'DESC']]
        });
    
        // Fetch usage counts for all services
        const usageCounts = await ServiceUser.findAll({
          attributes: [
            ['serviceId', 'serviceId'],
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalUses'],
            [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END`)), 'activeUses']
          ],
          group: ['serviceId'],
          raw: true
        });
    
        // Map usage counts by serviceId for quick lookup
        const usageMap = {};
        usageCounts.forEach(u => {
          usageMap[u.serviceId] = {
            totalUses: parseInt(u.totalUses, 10) || 0,
            activeUses: parseInt(u.activeUses, 10) || 0
          };
        });
    
        // Format the response
        const result = services.map(service => ({
          id: service.id.toString(),
          name: service.name,
          category: service.type,
          price: service.price,
          duration: service.duration,
          isActive: service.status === 'available',
          activeUses: usageMap[service.id]?.activeUses || 0,
          totalUses: usageMap[service.id]?.totalUses || 0,
        }));
    
        res.json(result);
      } catch (err) {
        console.error('Error fetching service list with stats:', err);
        res.status(500).json({ message: 'Failed to fetch service list', error: err.message });
      }
    },
    
    // Controller to get mock-like service user entries for each service
    async getServiceUsersByService(req, res) {
      try {
        // Get all services
        const services = await Service.findAll({
          attributes: ['id', 'name'],
          order: [['id', 'ASC']]
        });
    
        // Get all ServiceUser entries with related Pet and User
        const serviceUsers = await ServiceUser.findAll({
          attributes: ['id', ['serviceId', 'serviceId'], 'date', 'hour', 'status'],
          include: [
            {
              model: Pet,
              as: 'pet',
              attributes: ['name']
            },
            {
              model: User,
              as: 'user',
              attributes: ['name']
            }
          ],
          order: [['date', 'DESC'], ['hour', 'DESC']]
        });
    
        // Group service users by serviceId
        const result = {};
        services.forEach(service => {
          const entries = serviceUsers
            .filter(su => su.serviceId === service.id)
            .map(su => ({
              id: su.id.toString(),
              petName: su.pet?.name || "",
              ownerName: su.user?.name || "",
              time: su.date && su.hour
                ? `${new Date(su.date).toLocaleDateString()} - ${su.hour}`
                : "",
              status: su.status === "In Progress" ? "ongoing" : (su.status === "Completed" ? "completed" : su.status?.toLowerCase() || "")
            }));
          result[service.id.toString()] = entries;
        });
    
        res.json(result);
      } catch (err) {
        console.error("Error fetching service users by service:", err);
        res.status(500).json({ message: "Failed to fetch service users by service", error: err.message });
      }
    },

    // Controller to get boarding list with usage stats
    async getBoardingListWithStats(req, res) {
      try {
        // Fetch all boarding services
        const boardings = await Boarding.findAll({
          attributes: ['id', 'name', 'price', 'type', 'maxday', 'status'],
          order: [['created_at', 'DESC']]
        });

        // Fetch usage counts for all boardings
        const usageCounts = await BoardingUser.findAll({
          attributes: [
            ['boardingId', 'boardingId'],
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalUses'],
            [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END`)), 'activeUses']
          ],
          group: ['boardingId'],
          raw: true
        });

        // Map usage counts by boardingId for quick lookup
        const usageMap = {};
        usageCounts.forEach(u => {
          usageMap[u.boardingId] = {
            totalUses: parseInt(u.totalUses, 10) || 0,
            activeUses: parseInt(u.activeUses, 10) || 0
          };
        });

        // Format the response
        const result = boardings.map(boarding => ({
          id: boarding.id.toString(),
          name: boarding.name,
          price: boarding.price,
          type: boarding.type,
          maxday: boarding.maxday,
          isActive: boarding.status === 'available',
          activeUses: usageMap[boarding.id]?.activeUses || 0,
          totalUses: usageMap[boarding.id]?.totalUses || 0,
        }));

        res.json(result);
      } catch (err) {
        console.error('Error fetching boarding list with stats:', err);
        res.status(500).json({ message: 'Failed to fetch boarding list', error: err.message });
      }
    },

    // Controller to get boarding users grouped by boardingId (mock-like structure)
    async getBoardingUsersByBoarding(req, res) {
      try {
        // Get all boardings
        const boardings = await Boarding.findAll({
          attributes: ['id', 'name'],
          order: [['id', 'ASC']]
        });
    
        // Get all BoardingUser entries with related Pet and User
        const boardingUsers = await BoardingUser.findAll({
          attributes: ['id', ['boardingId', 'boardingId'], 'start_date', 'end_date', 'total_price', 'status', 'status_payment', 'notes'],
          include: [
            {
              model: Pet,
              as: 'pet',
              attributes: ['name']
            },
            {
              model: User,
              as: 'user',
              attributes: ['name']
            }
          ],
          order: [['start_date', 'DESC'], ['end_date', 'DESC']]
        });
    
        // Group boarding users by boardingId
        const result = {};
        boardings.forEach(boarding => {
          const entries = boardingUsers
            .filter(bu => bu.boardingId === boarding.id)
            .map(bu => ({
              id: bu.id.toString(),
              petName: bu.pet?.name || "",
              ownerName: bu.user?.name || "",
              startDate: bu.start_date ? bu.start_date.toISOString().slice(0, 10) : "",
              endDate: bu.end_date ? bu.end_date.toISOString().slice(0, 10) : "",
              totalPrice: bu.total_price,
              status: bu.status,
              statusPayment: bu.status_payment,
              notes: bu.notes || undefined,
            }));
          result[boarding.id.toString()] = entries;
        });
    
        res.json(result);
      } catch (err) {
        console.error("Error fetching boarding users by boarding:", err);
        res.status(500).json({ message: "Failed to fetch boarding users by boarding", error: err.message });
      }
    },

    // Controller to get appointments in the requested mock format
    async getAppointmentsMockFormat(req, res) {
      try {
        // Fetch all appointments with related Pet and User
        const appointments = await Appointment.findAll({
          include: [
            {
              model: Pet,
              as: 'pet',
              attributes: ['name', 'type', 'breed']
            },
            {
              model: User,
              as: 'owner',
              attributes: ['name']
            }
          ],
          order: [['appointment_date', 'DESC'], ['appointment_hour', 'ASC']]
        });
    
        // Map to the required format
        const result = appointments.map(a => ({
          id: a.id.toString(),
          petName: a.pet?.name || "",
          petType: a.pet?.breed || a.pet?.type || "",
          ownerName: a.owner?.name || "",
          appointmentType: a.appointment_type,
          appointmentDate: a.appointment_date,
          reason: a.reason,
          status: a.appointment_status
        }));
    
        res.json(result);
      } catch (err) {
        console.error("Error fetching appointments in mock format:", err);
        res.status(500).json({ message: "Failed to fetch appointments", error: err.message });
      }
    },

    // Appointments page
    // 1. Upcoming appointments
    async getUpcomingAppointments(req, res) {
      try {
        const today = new Date();
        const appointments = await Appointment.findAll({
          where: {
            appointment_date: {
              [Op.gte]: today // today or future
            },
            appointment_status: {
              [Op.in]: ['Scheduled', 'In progess']
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

    // 2. Recent appointments
    async getRecentAppointments(req, res) {
      try {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 7); // last 7 days

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

    // Medical Records page
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

    // 2. Medical record details
    async getMedicalRecordById(req, res) {
      try {
        const { id } = req.params;

        // Check if id is not a number
        if (isNaN(id)) {
          return res.status(400).json({ message: 'Invalid medical record ID' });
        }

        const record = await MedicalRecord.findByPk(parseInt(id), {
          include: [
            { model: Pet, attributes: ['name', 'type'] },
            { model: User, attributes: ['name'] }
          ]
        });

        if (!record) {
          return res.status(404).json({ message: 'Medical record not found' });
        }

        res.json(record);
      } catch (err) {
        console.error('❌ Error fetching medical record detail:', err);
        res.status(500).json({ message: 'Failed to fetch medical record detail', error: err.message });
      }
    },

    // Boarding page
    // 1. Boarding statistics
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

    // 2. List of current boarding pets
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
          dateRange: `${b.start_date.toISOString().slice(0, 10)} - ${b.end_date.toISOString().slice(0, 10)}`,
          notes: b.notes
        }));

        res.json(formatted);
      } catch (err) {
        console.error('❌ Error fetching current boarders:', err);
        res.status(500).json({ message: 'Failed to fetch current boarders', error: err.message });
      }
    },

    // Analytics page
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
        const maxSlots = 30 * 6; // 6 slots/hours per day assumption
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

    // Controller for analytics: revenueData and serviceData
    async getAnalyticsData(req, res) {
      try {
        // Use EXTRACT(MONTH FROM ...) for better compatibility
        const serviceRevenue = await ServiceUser.findAll({
          attributes: [
            [Sequelize.literal('EXTRACT(MONTH FROM "date")'), 'month'],
            [Sequelize.fn('SUM', Sequelize.col('service.price')), 'serviceRevenue']
          ],
          include: [{
            model: Service,
            as: 'service',
            attributes: []
          }],
          group: [Sequelize.literal('EXTRACT(MONTH FROM "date")')],
          raw: true
        });

        const boardingRevenue = await BoardingUser.findAll({
          attributes: [
            [Sequelize.literal('EXTRACT(MONTH FROM "start_date")'), 'month'],
            [Sequelize.fn('SUM', Sequelize.col('total_price')), 'boardingRevenue']
          ],
          group: [Sequelize.literal('EXTRACT(MONTH FROM "start_date")')],
          raw: true
        });

        // Merge serviceRevenue and boardingRevenue by month
        const revenueMap = {};
        serviceRevenue.forEach(r => {
          const m = r.month;
          revenueMap[m] = { month: m, service: parseFloat(r.serviceRevenue) || 0, boarding: 0 };
        });
        boardingRevenue.forEach(r => {
          const m = r.month;
          if (!revenueMap[m]) revenueMap[m] = { month: m, service: 0, boarding: 0 };
          revenueMap[m].boarding = parseFloat(r.boardingRevenue) || 0;
        });

        // Compose revenueData for 12 months (fill 0 if missing)
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const revenueData = [];
        for (let i = 1; i <= 12; i++) {
          const entry = revenueMap[i] || { month: i, service: 0, boarding: 0 };
          revenueData.push({
            name: monthNames[i - 1],
            value: entry.service + entry.boarding
          });
        }

        // 2. Service usage breakdown (service, boarding, appointment)
        // Service usage
        const serviceUsage = await ServiceUser.findAll({
          attributes: [
            [Sequelize.col('service.type'), 'type'],
            [Sequelize.fn('COUNT', Sequelize.col('ServiceUser.id')), 'count']
          ],
          include: [{
            model: Service,
            as: 'service',
            attributes: []
          }],
          group: ['service.type'],
          raw: true
        });

        // Boarding usage
        const boardingCount = await BoardingUser.count();

        // Appointment usage
        const appointmentCount = await Appointment.count();

        // Compose serviceData
        const serviceData = [
          ...serviceUsage.map(s => ({
            name: s.type.charAt(0).toUpperCase() + s.type.slice(1),
            value: parseInt(s.count, 10)
          })),
          { name: 'Boarding', value: boardingCount },
          { name: 'Appointment', value: appointmentCount }
        ];

        res.json({ revenueData, serviceData });
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        res.status(500).json({ message: 'Failed to fetch analytics data', error: err.message });
      }
    },

    // Notifications page
    // Get all notifications for a user
    async getAllNotifications(req, res) {
      try {
        const userId = req.user.id;

        const notifications = await Notification.findAll({
          where: { user_id: userId },
          order: [['created_at', 'DESC']]
        });

        res.json(notifications);
      } catch (err) {
        res.status(500).json({ message: 'Error retrieving notifications', error: err.message });
      }
    },

    // Get unread notifications
    async getUnreadNotifications(req, res) {
      try {
        const userId = req.user.id;

        const unread = await Notification.findAll({
          where: { user_id: userId, is_read: false },
          order: [['created_at', 'DESC']]
        });

        res.json(unread);
      } catch (err) {
        res.status(500).json({ message: 'Error retrieving unread notifications', error: err.message });
      }
    },

    // Mark all as read
    async markAllAsRead(req, res) {
      try {
        const userId = req.user.id;

        await Notification.update(
          { is_read: true },
          { where: { user_id: userId, is_read: false } }
        );

        res.json({ message: 'All notifications marked as read' });
      } catch (err) {
        res.status(500).json({ message: 'Error marking notifications as read', error: err.message });
      }
    },

    // Mark one notification as read
    async markAsRead(req, res) {
      try {
        const { id } = req.params;
        const userId = req.user.id;

        const notification = await Notification.findOne({ where: { id, user_id: userId } });
        if (!notification) {
          return res.status(404).json({ message: 'Notification not found' });
        }

        notification.is_read = true;
        await notification.save();

        res.json({ message: 'Notification marked as read' });
      } catch (err) {
        res.status(500).json({ message: 'Error marking notification as read', error: err.message });
      }
    },

    // System page
    // Update user information (name, email, phone_number, role only)
    async updateUser(req, res) {
      try {
        const { id } = req.params;
        const { name, email, phone_number, role } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        user.name = name;
        user.email = email;
        user.phone_number = phone_number;
        user.role = role;
        await user.save();

        res.json({ message: 'User updated successfully', user });
      } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err.message });
      }
    },

    // Change user password
    async changeUserPassword(req, res) {
      try {
        const { id } = req.params;
        const { newPassword } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'User password changed successfully' });
      } catch (err) {
        res.status(500).json({ message: 'Error changing password', error: err.message });
      }
    },

    // Set user as Admin
    async setAsAdmin(req, res) {
      try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        user.role = 'admin';
        await user.save();
        res.json({ message: 'User role updated to admin', user });
      } catch (err) {
        res.status(500).json({ message: 'Error setting user as admin', error: err.message });
      }
    },

    // Set user as Vet
    async setAsVet(req, res) {
      try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        user.role = 'vet';
        await user.save();
        res.json({ message: 'User role updated to vet', user });
      } catch (err) {
        res.status(500).json({ message: 'Error setting user as vet', error: err.message });
      }
    },

    // Set user as Staff
    async setAsStaff(req, res) {
      try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        user.role = 'staff';
        await user.save();
        res.json({ message: 'User role updated to staff', user });
      } catch (err) {
        res.status(500).json({ message: 'Error setting user as staff', error: err.message });
      }
    },
};

module.exports = AdminController;