const { assign } = require('nodemailer/lib/shared');
const { Appointment, Service, Boarding, Notification, Pet, User, ServiceUser, BoardingUser } = require('../models');
const { Op } = require('sequelize');

const StaffController = {
    // Lấy thống kê dashboard
    async getDashboardStats(req, res) {
        try {
            // Get the current date
            const today = new Date();

            // Set the start and end of the day
            const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
            const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

            // Count today's appointments
            const counttodayAppointments = await Appointment.count({
                where: {
                    appointment_date: {
                        [Op.between]: [startOfDay, endOfDay],
                    },
                },
            });

            // Count active boarders (status: 'available')
            const activeBoarders = await Boarding.count({
                where: { status: 'available' },
            });

            // Count pending services (status: 'available')
            const pendingServices = await Service.count({
                where: { status: 'available' },
            });

            // Count unread notifications
            const unreadNotifications = await Notification.count({
                where: { is_read: false },
            });

            // Return the results
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

        
            // Truy vấn dựa trên khoảng thời gian
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

    async createAppointment(req, res) {
        try {
            const { pet_id, owner_id, appointment_date, appointment_hour, appointment_type, reason } = req.body;

            // Log the incoming request payload for debugging
            console.log("Incoming request payload:", req.body);

            // Validate required fields
            if (!pet_id || !owner_id || !appointment_date || !appointment_hour || !appointment_type) {
                console.error("Validation failed: Missing required fields");
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields',
                });
            }

            // Check if pet and owner exist
            const pet = await Pet.findByPk(pet_id);
            const owner = await User.findByPk(owner_id);

            if (!pet) {
                console.error(`Pet with ID ${pet_id} not found`);
                return res.status(404).json({
                    success: false,
                    message: `Pet with ID ${pet_id} not found`,
                });
            }

            if (!owner) {
                console.error(`Owner with ID ${owner_id} not found`);
                return res.status(404).json({
                    success: false,
                    message: `Owner with ID ${owner_id} not found`,
                });
            }

            // Log before creating the appointment
            console.log("Creating appointment with data:", {
                pet_id,
                owner_id,
                appointment_date,
                appointment_hour,
                appointment_type,
                reason,
            });

            // Create a new appointment
            const newAppointment = await Appointment.create({
                pet_id,
                owner_id,
                appointment_date,
                appointment_hour,
                appointment_type,
                reason,
                appointment_status: 'Scheduled', // Default status
            });

            // Log after successful creation
            console.log("Appointment created successfully:", newAppointment);

            res.status(201).json({
                success: true,
                message: 'Appointment created successfully',
                data: newAppointment,
            });
        } catch (err) {
            console.error("Error creating appointment:", err); // Log the error for debugging
            res.status(500).json({
                success: false,
                message: 'Error creating appointment',
                error: err.message,
            });
        }
    },

    async getOwners(req, res) {
        try {
            const owners = await User.findAll({
                attributes: ['id', 'username', 'email'], // Select relevant fields
                where: { role: 'pet_owner' }, // Ensure 'role' column exists and is correctly set
            });

            res.status(200).json({
                success: true,
                message: 'Owners fetched successfully',
                data: owners,
            });
        } catch (err) {
            console.error("Error fetching owners:", err); // Log the error for debugging
            res.status(500).json({
                success: false,
                message: 'Error fetching owners',
                error: err.message,
            });
        }
    },

    async getPetsByOwner(req, res) {
        try {
            const { ownerId } = req.params;

            const pets = await Pet.findAll({
                attributes: ['id', 'name', 'type', 'breed', 'age'], // Select relevant fields
                where: { owner_id: ownerId }, // Filter by owner ID
            });

            if (!pets.length) {
                return res.status(404).json({
                    success: false,
                    message: 'No pets found for the specified owner',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Pets fetched successfully',
                data: pets,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error fetching pets',
                error: err.message,
            });
        }
    },
    async createService(req, res){
        try {
            const { type, name, description, price, duration, status, image, details } = req.body;
        
            // Kiểm tra các trường bắt buộc
            if (!type || !name || !description || !price || !duration) {
              return res.status(400).json({ message: 'Missing required fields' });
            }
        
            // Tạo một dịch vụ mới
            const newService = await Service.create({
              type,
              name,
              description,
              price,
              duration,
              status: status || 'available',
              image,
              details,
            });
        
            // Trả về phản hồi khi thành công
            return res.status(201).json({
              message: 'Service created successfully',
              service: newService,
            });
          } catch (error) {
            console.error('Error creating service:', error);
            return res.status(500).json({ message: 'Internal server error' });
          }
    },

    async getServices(req, res) {
        try {
            const { type, status } = req.query;

            // Xây dựng điều kiện truy vấn động
            const whereCondition = {};
            if (type) whereCondition.type = type;
            if (status) whereCondition.status = status;

            // Truy vấn danh sách dịch vụ
            const services = await Service.findAll({
                where: whereCondition,
                attributes: ['id', 'type', 'name', 'description', 'price', 'duration', 'status', 'image'],
                order: [['created_at', 'DESC']], // Use 'created_at' for sorting
            });

            if (!services.length) {
                return res.status(404).json({
                    success: false,
                    message: 'No services found',
                });
            }

            // Định dạng dữ liệu đầu ra phù hợp với frontend
            const formattedServices = services.map(service => ({
                id: service.id,
                type: service.type,
                name: service.name,
                description: service.description,
                price: `$${service.price.toFixed(2)}`,
                duration: service.duration,
                status: service.status,
                image: service.image,
            }));

            res.status(200).json({
                success: true,
                message: 'Services fetched successfully',
                data: formattedServices,
            });
        } catch (err) {
            console.error('Error fetching services:', err);
            res.status(500).json({
                success: false,
                message: 'Error fetching services',
                error: err.message,
            });
        }
    },
   
    async editService(req, res) {
        try {
            const { id } = req.params;
            const { type, name, description, price, duration, status, image, details } = req.body;

            // Validate required fields
            if (!type || !name || !description || !price || !duration) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            // Find the service by ID
            const service = await Service.findByPk(id);
            if (!service) {
                return res.status(404).json({ message: 'Service not found' });
            }

            // Update the service
            await service.update({
                type,
                name,
                description,
                price,
                duration,
                status: status || service.status,
                image,
                details,
            });

            // Return the updated service in the same format as createService
            return res.status(200).json({
                message: 'Service updated successfully',
                service,
            });
        } catch (error) {
            console.error('Error updating service:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    async toggleServiceStatus(req, res) {
        try {
            const { id } = req.params;

            // Find the service by ID
            const service = await Service.findByPk(id);
            if (!service) {
                return res.status(404).json({ message: 'Service not found' });
            }

            // Toggle the status field
            const newStatus = service.status === 'available' ? 'unavailable' : 'available';
            await service.update({ status: newStatus });

            // Return a success response
            return res.status(200).json({
                message: `Service status updated to ${newStatus}`,
                status: newStatus,
            });
        } catch (error) {
            console.error('Error toggling service status:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    async getUserServices(req, res) {
        try {
            const { id } = req.user;

            // Truy vấn danh sách dịch vụ mà user đã đăng ký
            const services = await ServiceUser.findAll({
                
                include: [
                    {
                        model: Service,
                        as: 'service',
                        attributes: ['id', 'type', 'name', 'description', 'price', 'duration', 'status'],
                    },
                    {
                        
                        model: Pet,
                        as: 'pet',
                        attributes: ['id', 'name', 'breed'],
                    },
                ],
                order: [['date', 'DESC']],
            });

            if (!services || services.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: 'No registered services found for this user',
                    data: [],
                });
            }

            // Định dạng dữ liệu đầu ra
            const formattedServices = services.map(serviceUser => ({
                serviceId: serviceUser.service?.id || null,
                type: serviceUser.service?.type || null,
                serviceName: serviceUser.service?.name || null,
                pet: serviceUser.pet ? {
                    id: serviceUser.pet.id,
                    name: serviceUser.pet.name,
                    breed: serviceUser.pet.breed,
                } : null,
                description: serviceUser.service?.description || null,
                price: serviceUser.service ? `$${serviceUser.service.price.toFixed(2)}` : null,
                duration: serviceUser.service?.duration || null,
                status: serviceUser.status || null,
                date: serviceUser.date || null,
                hour: serviceUser.hour || null,
            }));

            res.status(200).json({
                success: true,
                message: 'User services fetched successfully',
                data: formattedServices,
            });
        } catch (err) {
            console.error('Error fetching user services:', err);
            res.status(500).json({
                success: false,
                message: 'Error fetching user services',
                error: err.message,
            });
        }
    },

    async getBoardingUserDetails(req, res) {
        try {
            const boardingUsers = await BoardingUser.findAll({
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username'], // Removed 'phone'
                    },
                    {
                        model: Pet,
                        as: 'pet',
                        attributes: ['id', 'name', 'type', 'breed'], // Include pet details
                    },
                ],
                attributes: ['id', 'start_date', 'end_date', 'total_price', 'status'], // Include boarding details
            });

            if (!boardingUsers.length) {
                return res.status(404).json({
                    success: false,
                    message: 'No boarding users found',
                });
            }

            // Format the data for frontend
            const formattedBoardingUsers = boardingUsers.map(boarding => ({
                pet: {
                    name: boarding.pet.name,
                    type: boarding.pet.type,
                    breed: boarding.pet.breed,
                },
                owner: {
                    name: boarding.user.username, // Removed 'phone'
                },
                checkIn: boarding.start_date,
                checkOut: boarding.end_date,
                status: boarding.status || 'In progress',
                medications: boarding.details?.medications || [], // Include medications if available
            }));

            res.status(200).json({
                success: true,
                message: 'Boarding user details fetched successfully',
                data: formattedBoardingUsers,
            });
        } catch (err) {
            console.error('Error fetching boarding user details:', err);
            res.status(500).json({
                success: false,
                message: 'Error fetching boarding user details',
                error: err.message,
            });
        }
    },

    async getAvailableBoardingServices(req, res) {
        try {
            // Fetch boarding services with status 'available'
            const boardingServices = await Boarding.findAll({
                where: { status: 'available' },
                attributes: ['id', 'price', 'maxday', 'image', 'status', 'details', 'created_at', 'name',],
                order: [['created_at', 'DESC']], // Sort by creation date
            });

            if (!boardingServices.length) {
                return res.status(404).json({
                    success: false,
                    message: 'No available boarding services found',
                });
            }

            // Format the data for frontend
            const formattedBoardingServices = boardingServices.map(service => {
                let amenities = [];
                let description = "";

                // Parse details if it's a string
                if (service.details) {
                    try {
                        const parsedDetails = typeof service.details === "string" ? JSON.parse(service.details) : service.details;
                        amenities = parsedDetails.included || [];
                        description = parsedDetails.description || "";
                    } catch (err) {
                        console.error("Error parsing details for service ID:", service.id, err.message);
                    }
                }

                return {
                    id: service.id,
                    name: service.name,
                    description: service.type, // Use 'type' as description,
                    pricePerDay: service.price,
                    maxStay: service.maxday,
                    status: service.status,
                    createdAt: service.created_at,
                    image: service.image || null,
                    amenities: service.details || [], // Correctly extract amenities
                };
            });

            res.status(200).json({
                success: true,
                message: 'Available boarding services fetched successfully',
                data: formattedBoardingServices,
            });
        } catch (err) {
            console.error('Error fetching available boarding services:', err);
            res.status(500).json({
                success: false,
                message: 'Error fetching available boarding services',
                error: err.message,
            });
        }
    },

    async addNewBoardingService(req, res) {
        try {
            const { name, price, maxday, image, status, details, type } = req.body;
            //const parsedDetails = details ? JSON.parse(details) : [];  // Ensure parsedDetails is defined here

            // Kiểm tra dữ liệu đầu vào
            if (!name || !price  || !type || !maxday) {
                return res.status(400).json({ message: "Missing required fields" });
            }
    
            // Tạo bản ghi mới trong cơ sở dữ liệu
            const newBoarding = await Boarding.create({
                name,
                price,
              type, //description
                maxday,
                image,
                status: status || 'available',
                details: details,
            });
    
            return res.status(201).json({ message: "Boarding service added successfully", boarding: newBoarding });
        } catch (error) {
            console.error("Error adding boarding service:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    async getUsersBoardings(req, res){
        try {
            const userBoardings = await BoardingUser.findAll({
                include: [
                    {
                        model: Boarding,
                        as: 'boarding',
                        attributes: ['id', 'name', 'type', 'price', 'maxday'],
                    },
                    {
                        model: Pet,
                        as: 'pet',
                        attributes: ['id', 'name', 'type', 'breed', 'health_status', 'diet_plan', 'medical_history', 'vaccination_history'],
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name', 'email'],
                    }
                ]
            });
            if(!userBoardings){
                return res.status(404).json({ 
                    data: [],
                    success: true,
                    message: 'No services found' 
                });
            }
            res.status(200).json({
                success: true,
                message: 'User services fetched successfully',
                data: userBoardings
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error fetching user services',
                error: err.message
            });
        }
    },

    async getPets(req, res) {
        // Ensure this method is implemented
        // ...existing code...
    },
};    

module.exports = StaffController;