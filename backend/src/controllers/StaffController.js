const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Ho_Chi_Minh');

const { assign } = require('nodemailer/lib/shared');
const { Appointment, Service, Boarding, Notification, Pet, User, ServiceUser, BoardingUser, MedicalRecord, AppointmentResult } = require('../models');
const { Op } = require('sequelize');

const StaffController = {
    // Lấy thống kê dashboard
    async getDashboardStats(req, res) {
        try {
            const today = dayjs().tz();
            const startOfDay = today.startOf('day').toISOString();
            const endOfDay = today.endOf('day').toISOString();

            // Fetch today's appointments
            const todayAppointments = await Appointment.findAll({
                where: {
                    appointment_date: {
                        [Op.between]: [startOfDay, endOfDay],
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

            // Fetch today's services
            const todayServices = await ServiceUser.findAll({
                where: {
                    date: {
                        [Op.between]: [startOfDay, endOfDay],
                    },
                },
                include: [
                    {
                        model: Service,
                        as: 'service',
                        attributes: ['id', 'name', 'type', 'price', 'duration'],
                    },
                    {
                        model: Pet,
                        as: 'pet',
                        attributes: ['id', 'name', 'breed'],
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username', 'email'],
                    },
                ],
            });

            // Fetch active boarders
            const activeBoarders = await BoardingUser.findAll({
                where: {
                    status: 'In Progress',
                },
                include: [
                    {
                        model: Boarding,
                        as: 'boarding',
                        attributes: ['id', 'name', 'type', 'price', 'maxday'],
                    },
                    {
                        model: Pet,
                        as: 'pet',
                        attributes: ['id', 'name', 'type', 'breed'],
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username', 'email'],
                    },
                ],
            });

            // Fetch recent appointment results (medical records)
            const recentAppointmentResults = await AppointmentResult.findAll({
                limit: 10,
                order: [['created_at', 'DESC']],
                include: [
                    {
                        model: Appointment,
                        as: 'appointment',
                        attributes: ['appointment_date'],
                        include: [
                            {
                                model: Pet,
                                as: 'pet',
                                attributes: ['id', 'name', 'breed'],
                            },
                            {
                                model: User,
                                as: 'owner',
                                attributes: ['id', 'username', 'email'],
                            },
                        ],
                    },
                ],
            });

            res.status(200).json({
                success: true,
                message: 'Dashboard stats fetched successfully',
                data: {
                    counts: {
                        todayAppointments: todayAppointments.length,
                        todayServices: todayServices.length,
                        activeBoarders: activeBoarders.length,
                        totalMedicalRecords: recentAppointmentResults.length,
                    },
                    lists: {
                        todayAppointments,
                        todayServices,
                        activeBoarders,
                        recentMedicalRecords: recentAppointmentResults,
                    },
                },
            });
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
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
            const today = dayjs().tz();
            const startOfDay = today.startOf('day').toISOString();
            const endOfDay = today.endOf('day').toISOString();

            // Truy vấn dựa trên khoảng thời gian
            const appointments = await Appointment.findAll({
                where: {
                    appointment_date: {
                        [Op.between]: [startOfDay, endOfDay],
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

            // Update the appointment status
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

            // Fetch appointment details to get user and pet information
            const appointment = await Appointment.findOne({
                where: { id },
                include: [
                    {
                        model: Pet,
                        as: 'pet',
                        attributes: ['name'],
                    },
                    {
                        model: User,
                        as: 'owner',
                        attributes: ['id', 'username'],
                    },
                ],
            });

            if (!appointment) {
                return res.status(404).json({
                    success: false,
                    message: 'Appointment details not found',
                });
            }

            // Create a notification for the user
            await Notification.create({
                user_id: appointment.owner.id,
                title: 'Appointment Status Updated',
                message: `The status of your appointment for ${appointment.pet.name} has been updated to "${appointment_status}".`,
                url: `/appointments/${id}`, // URL to redirect the user to the appointment details
            });

            res.status(200).json({
                success: true,
                message: 'Appointment status updated successfully and notification sent',
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

            // Build dynamic query conditions
            const whereCondition = {};
            if (type) whereCondition.type = type;
            if (status) whereCondition.status = status;

            // Query the list of services
            const services = await Service.findAll({
                where: whereCondition,
                attributes: ['id', 'type', 'name', 'description', 'price', 'duration', 'status', 'image'],
                order: [['created_at', 'DESC']],
            });

            if (!services.length) {
                return res.status(404).json({
                    success: false,
                    message: 'No services found',
                });
            }

            // Format prices with VND
            const formattedServices = services.map(service => ({
                id: service.id,
                type: service.type,
                name: service.name,
                description: service.description,
                price: `${service.price.toLocaleString()}`, // Format price with VND
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

    async checkinService(req, res) {
        try {
            const { id } = req.params; // Use 'id' from params
            console.log("ServiceUser ID received in checkinService:", id); // Add logging

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid or missing ServiceUser ID',
                });
            }

            const serviceUser = await ServiceUser.findOne({
                where: { id },
                include: [
                    {
                        model: Service,
                        as: 'service',
                        attributes: ['name'],
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username', 'email'],
                    },
                ],
            });

            if (!serviceUser) {
                console.error(`ServiceUser with ID ${id} not found`); // Log the issue
                return res.status(404).json({
                    success: false,
                    message: 'Service user not found',
                });
            }

            if (serviceUser.status !== 'Scheduled') {
                return res.status(400).json({
                    success: false,
                    message: `Cannot check in service. Current status is ${serviceUser.status}`,
                });
            }

            await serviceUser.update({ status: 'In Progress' });

            // Ensure service and user details are available for the notification
            if (serviceUser.service && serviceUser.user) {
                await Notification.create({
                    user_id: serviceUser.user.id,
                    title: 'Service Check-in',
                    message: `Your service "${serviceUser.service.name}" has been checked in and is now in progress.`,
                    url: `/services/me`, // URL to redirect the user to the service details
                });
                console.log("Notification created successfully for user:", serviceUser.user.id); // Log success
            } else {
                console.error("Service or user details are missing for notification creation.");
            }

            res.status(200).json({
                success: true,
                message: 'Service checked in successfully and notification sent',
                data: serviceUser,
            });
        } catch (err) {
            console.error('Error checking in service:', err);
            res.status(500).json({
                success: false,
                message: 'Error checking in service',
                error: err.message,
            });
        }
    },

    async completeService(req, res) {
        try {
            const { id: serviceId } = req.params;
            console.log("Service ID received in completeService:", serviceId); // Add logging

            if (!serviceId || isNaN(Number(serviceId))) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid or missing service ID',
                });
            }

            const serviceUser = await ServiceUser.findOne({
                where: { id: serviceId },
                include: [
                    {
                        model: Service,
                        as: 'service',
                        attributes: ['name'],
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username'],
                    },
                ],
            });

            if (!serviceUser) {
                return res.status(404).json({
                    success: false,
                    message: 'Service user not found',
                });
            }

            if (serviceUser.status !== 'In Progress') {
                return res.status(400).json({
                    success: false,
                    message: `Cannot complete service. Current status is ${serviceUser.status}`,
                });
            }

            await serviceUser.update({ status: 'Completed' });

            // Create a notification for the user
            if (serviceUser.service && serviceUser.user) {
                await Notification.create({
                    user_id: serviceUser.user.id,
                    title: 'Service Completed',
                    message: `Your service "${serviceUser.service.name}" has been successfully completed.`,
                    url: `/services/me`, // URL to redirect the user to the service details
                });
            }

            res.status(200).json({
                success: true,
                message: 'Service marked as completed and notification sent',
                data: serviceUser,
            });
        } catch (err) {
            console.error('Error completing service:', err);
            res.status(500).json({
                success: false,
                message: 'Error completing service',
                error: err.message,
            });
        }
    },

    async getUserServices(req, res) {
        try {
            const { id } = req.user;

            // Query the list of services the user has registered for
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

            // Format the output data
            const formattedServices = services.map(serviceUser => ({
                id: serviceUser.id, // Booking ID
                serviceId: serviceUser.service?.id || null, // Service ID
                type: serviceUser.service?.type || null,
                serviceName: serviceUser.service?.name || null,
                status_payment: serviceUser.status_payment,
                pet: serviceUser.pet ? {
                    id: serviceUser.pet.id,
                    name: serviceUser.pet.name,
                    breed: serviceUser.pet.breed,
                } : null,
                description: serviceUser.service?.description || null,
                price: serviceUser.service ? `${serviceUser.service.price.toFixed(2)}` : null,
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

    async checkinBoarding(req, res) {
        try {
            const { id } = req.params;

            // Validate the boarding ID
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid or missing boarding ID',
                });
            }

            // Find the boarding user record
            const boardingUser = await BoardingUser.findByPk(id);
            if (!boardingUser) {
                return res.status(404).json({
                    success: false,
                    message: 'Boarding user not found',
                });
            }

            // Ensure the current status is "Scheduled"
            if (boardingUser.status !== 'Scheduled') {
                return res.status(400).json({
                    success: false,
                    message: `Cannot check in boarding. Current status is ${boardingUser.status}`,
                });
            }

            // Update the status to "In Progress"
            await boardingUser.update({ status: 'In Progress' });

            res.status(200).json({
                success: true,
                message: 'Boarding checked in successfully',
                data: boardingUser,
            });
        } catch (err) {
            console.error('Error checking in boarding:', err);
            res.status(500).json({
                success: false,
                message: 'Error checking in boarding',
                error: err.message,
            });
        }
    },

    async completeBoarding(req, res) {
        try {
            const { id } = req.params;

            // Validate the boarding ID
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid or missing boarding ID',
                });
            }

            // Find the boarding user record
            const boardingUser = await BoardingUser.findOne({
                where: { id },
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'name', 'email'], // Include user details
                    },
                    {
                        model: Pet,
                        as: 'pet',
                        attributes: ['name'], // Include pet details
                    },
                ],
            });

            if (!boardingUser) {
                return res.status(404).json({
                    success: false,
                    message: 'Boarding user not found',
                });
            }

            // Ensure the current status is "In Progress"
            if (boardingUser.status !== 'In Progress') {
                return res.status(400).json({
                    success: false,
                    message: `Cannot complete boarding. Current status is ${boardingUser.status}`,
                });
            }

            // Update the status to "Completed"
            await boardingUser.update({ status: 'Completed' });

            // Send a notification to the user
            await Notification.create({
                user_id: boardingUser.user.id,
                title: 'Boarding Completed',
                message: `The boarding service for your pet ${boardingUser.pet.name} has been successfully completed.`,
                url: `/boarding/${id}`, // URL to redirect the user to the boarding details
            });

            res.status(200).json({
                success: true,
                message: 'Boarding completed successfully and notification sent',
                data: boardingUser,
            });
        } catch (err) {
            console.error('Error completing boarding:', err);
            res.status(500).json({
                success: false,
                message: 'Error completing boarding',
                error: err.message,
            });
        }
    },

    async getPets(req, res) {
        // Ensure this method is implemented
        // ...existing code...
    },
};    

module.exports = StaffController;