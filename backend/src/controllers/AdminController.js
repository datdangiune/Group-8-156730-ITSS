// Updated AdminController.js with English error messages and improved logging

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Appointment, Boarding, BoardingUser,  Pet,  Service, ServiceUser, User} = require('../models');
const { Op, Sequelize } = require('sequelize');
require("dotenv").config();

const AdminController = {

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

    // System page
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