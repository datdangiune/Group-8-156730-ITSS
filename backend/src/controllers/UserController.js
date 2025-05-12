const { Pet, Appointment, Payment, Service, User, ServiceUser, Boarding, BoardingUser, AppointmentResult} = require('../models');
const sendMail = require('../util/sendMail'); 
const { Op, fn, col, where } = require("sequelize");
const { differenceInDays } = require('date-fns');
const {VNPay} = require('vnpay');
const {HashAlgorithm, ProductCode} = require('../enums');
const { encrypt, decrypt } = require('../util/encryption');
require('dotenv').config();
const vnpay = new VNPay({
    tmnCode: process.env.vnp_TmnCode,
    secureSecret: process.env.vnp_HashSecret,
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true, // optional
    hashAlgorithm: HashAlgorithm.SHA512, // optional
    enableLog: true, // optional
    //loggerFn: ignoreLogger, // optional
    endpoints: {
      paymentEndpoint: 'paymentv2/vpcpay.html',
      queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
      getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
  },
  })
const UserController  = { 
    async createPet(req, res) {
        console.log("Received pet data:", req.body);
        const {name, age, gender, breed, fur_color, health_status,  diet_plan, medical_history, vaccination_history, type, image} = req.body
        if(!name || !age || !gender || !breed || !fur_color ){
            return res.status(400).json({message: 'Please fill in all fields.'})
        }
        try {
            const petData = {
                name,
                age,
                gender,
                type,
                breed,
                fur_color,
                health_status,
                diet_plan,
                medical_history,
                vaccination_history,
                image,
                owner_id: req.user.id, 
            };
            console.log("Pet data to be saved:", petData);
            const pet = await Pet.create(petData);
            res.status(201).json({ message: 'Pet registered successfully', pet });
        } catch (err) {
            res.status(500).json({ message: 'Error registering pet', error: err.message });
        }
    },

    async getAllPets(req, res) {
        try {
            const ownerId = req.user.id; 
            const pets = await Pet.findAll({ where: { owner_id: ownerId } });
            res.status(200).json({ success: true, message: 'Pets fetched successfully', data: pets });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error fetching pets', error: err.message });
        }
    },

    async getPet(req, res) {
        try {
            const pet = await Pet.findOne({
                where: { id: req.params.id, owner_id: req.user.id },
            });
            if (!pet) {
                return res.status(404).json({ message: 'Pet not found' });
            }

            res.status(200).json({
                success: true,
                message: 'Pet details fetched successfully',
                data: pet,
            });
        } catch (err) {
            res.status(500).json({ message: 'Error fetching pet details', error: err.message });
        }
    },

    async updateHealthAndDiet(req, res) {
        try {
            const { id } = req.params; // Lấy pet_id từ URL
            const { health_status, diet_plan } = req.body; // Lấy thông tin sức khỏe và chế độ dinh dưỡng từ body
            const pet = await Pet.update(
                { health_status, diet_plan },
                { where: { id, owner_id: req.user.id } } // Xác thực pet thuộc về chủ nuôi
            );
            if (!pet[0]) {
                return res.status(404).json({ success: false, message: 'Pet not found or unauthorized' });
            }
            res.status(200).json({ success: true, message: 'Health and diet updated successfully' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error updating health and diet', error: err.message });
        }
    },
    async updatePetInfo(req, res) {
        console.log("Received pet update data:", req.body);
    
        const { id } = req.params; // Lấy pet_id từ URL
        const { name, age, gender, breed, fur_color, health_status, diet_plan, medical_history, vaccination_history, type, image } = req.body;
    
        try {
            // Tìm thú cưng theo ID
            const pet = await Pet.findOne({ where: { id: id, owner_id: req.user.id } });
    
            if (!pet) {
                return res.status(404).json({ message: 'Pet not found or unauthorized' });
            }
    
            // Cập nhật các trường có trong req.body
            await pet.update({
                name: name || pet.name,
                age: age || pet.age,
                gender: gender || pet.gender,
                type: type || pet.type,
                breed: breed || pet.breed,
                fur_color: fur_color || pet.fur_color,
                health_status: health_status || pet.health_status,
                diet_plan: diet_plan || pet.diet_plan,
                medical_history: medical_history || pet.medical_history,
                vaccination_history: vaccination_history || pet.vaccination_history,
                image: image || pet.image,
            });
    
            res.status(200).json({ message: 'Pet updated successfully', pet });
        } catch (err) {
            console.error('Error updating pet:', err);
            res.status(500).json({ message: 'Error updating pet', error: err.message });
        }
    },
    
    // Quản lý lịch khám bệnh
    async createAppointment(req, res) {
        try {
            const { appointment_type, pet_id, appointment_date, appointment_hour, reason } = req.body;
            const { id, email , username } = req.user; // Include user's email

            if (!appointment_type || !pet_id || !appointment_date || !appointment_hour) {
                return res.status(400).json({ message: 'Missing required fields.' });
            }

            const validHours = ['08:00', '09:30', '11:00', '12:30', '14:00', '15:30'];
            if (!validHours.includes(appointment_hour)) {
                return res.status(400).json({ message: 'Invalid appointment hour. Please select from the available slots.' });
            }
            const formattedDate = new Date(appointment_date);
            if (isNaN(formattedDate.getTime())) {
                return res.status(400).json({ message: "Invalid appointment date." });
            }
    
            const existingAppointments = await Appointment.count({
                where: {
                    appointment_date: {
                        [Op.eq]: formattedDate,  
                    },
                    appointment_hour: appointment_hour,
                },
            });
            console.log(existingAppointments)
            if (existingAppointments >= 2) {
                return res.status(400).json({ message: 'This time slot is full. Please choose another time.' });
            }

            const newAppointment = await Appointment.create({
                appointment_type,
                pet_id,
                owner_id: id,
                appointment_date,
                appointment_hour,
                reason
            });
            
                // Send email notification
            const emailContent = `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <div style="text-align: center; padding: 20px; background-color: #f4f4f4; border-bottom: 1px solid #ddd;">
                            <h2 style="color: #4CAF50; margin: 0;">Appointment Confirmation</h2>
                        </div>
                        <div style="padding: 20px;">
                            <p style="font-size: 16px; margin-bottom: 20px;">Dear <strong>${username}</strong>,</p>
                            <p style="margin-bottom: 20px;">
                                We are pleased to confirm your appointment has been successfully scheduled. Here are the details:
                            </p>
                            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Appointment Type</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${appointment_type}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Date</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${appointment_date}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Time</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${appointment_hour}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold;">Reason</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${reason || 'N/A'}</td>
                                </tr>
                            </table>
                            <p style="margin-bottom: 20px;">If you have any questions or need to reschedule, please don't hesitate to contact us.</p>
                            <p style="margin-bottom: 20px; color: #555;">Thank you for choosing our service. We look forward to serving you!</p>
                        </div>
                        <div style="text-align: center; padding: 10px; background-color: #f4f4f4; border-top: 1px solid #ddd; font-size: 12px; color: #777;">
                            <p style="margin: 0;">This is an automated message, please do not reply.</p>
                        </div>
                    </div>
            `;
            await sendMail({ email, html: emailContent });


            return res.status(201).json({
                message: 'Appointment created successfully!',
                appointment: newAppointment
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    async getUserAppointments(req, res) {
        try {
            const ownerId = req.user.id;
            const { status } = req.query;
            const validStatuses = ['Scheduled', 'Done', 'Cancel', 'In progess'];
            const whereCondition = { owner_id: ownerId };
            if (status) {
                if (!validStatuses.includes(status)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid appointment status',
                    });
                }
                whereCondition.appointment_status = status;
            }
            const appointments = await Appointment.findAll({
                where: whereCondition,
                include: [
                    {
                        model: Pet,
                        as: 'pet',
                        attributes: ['id', 'name'],
                    },
                ],
            });

            res.status(200).json({
                success: true,
                message: 'Appointments fetched successfully',
                data: appointments,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error fetching appointments',
                error: err.message,
            });
        }
    },

    async getAppointmentDetails(req, res) {
        try {
            const { id } = req.params; // Lấy appointment ID từ URL
            const appointment = await Appointment.findOne({
                where: { id, owner_id: req.user.id },
                include: [
                    {
                        model: Pet,
                        as: 'pet',
                        attributes: ['id', 'name', 'breed', 'age'],
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
                message: 'Appointment details fetched successfully',
                data: appointment,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error fetching appointment details',
                error: err.message,
            });
        }
    },

    // Lịch sử dịch vụ
    async getPetServiceHistory(req, res) {
        try {
            const { petId } = req.params; // Lấy pet_id từ URL
            const services = await Service.findAll({ where: { pet_id: petId } });
            res.status(200).json({ success: true, message: 'Service history fetched successfully', data: services });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error fetching service history', error: err.message });
        }
    },

    // Lịch sử thanh toán
    async getPaymentHistory(req, res) {
        try {
            const payments = await Payment.findAll({ where: { user_id: req.user.id } });
            res.status(200).json(payments);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching payment history', error: err.message });
        }
    },

    async createBoarding(req, res) {
        try {
            const { pet_id, start_date, end_date, special_care_instructions } = req.body;

            // Kiểm tra xem thú cưng có thuộc về chủ nuôi không
            const pet = await Pet.findOne({ where: { id: pet_id, owner_id: req.user.id } });
            if (!pet) {
                return res.status(404).json({ success: false, message: 'Pet not found or unauthorized' });
            }

            // Tìm phòng trống
            const room = await Room.findOne({ where: { is_available: true } });
            if (!room) {
                return res.status(400).json({ success: false, message: 'No available rooms' });
            }

            // Tạo bản ghi lưu trú
            const boarding = await Boarding.create({
                pet_id,
                owner_id: req.user.id,
                room_id: room.id,
                start_date,
                end_date,
                special_care_instructions,
                status: 'ongoing',
            });

            // Cập nhật trạng thái phòng
            await Room.update({ is_available: false }, { where: { id: room.id } });

            res.status(201).json({
                success: true,
                message: 'Boarding created successfully',
                data: boarding,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error creating boarding',
                error: err.message,
            });
        }
    },
    async uploadImage(req, res){
        try {
            if(!req.file){
                return res.status(400).json({ success: false, message: 'No file uploaded'})
            }
            res.status(200).json({
                url: req.file.path
            })
        } catch (error) {
            
        }
    },
    async getAllService(req, res){
        try {
            const { type } = req.query; 
        
            // Kiểm tra nếu type có trong giá trị hợp lệ
            const validTypes = ['grooming', 'boarding', 'training'];
            if (type && !validTypes.includes(type)) {
              return res.status(400).json({ message: 'Invalid service type provided.' });
            }
        
            // Truy vấn dịch vụ theo loại (type)
            const services = await Service.findAll({
              where: type ? { type } : {}, // Nếu type có, lọc theo type, nếu không, lấy tất cả
            });
        
            // Kiểm tra nếu không có dịch vụ
            if (services.length === 0) {
              return res.status(404).json({ message: 'No services found.' });
            }
        
            // Trả về danh sách dịch vụ
            return res.status(200).json({
              message: 'Services retrieved successfully',
              services,
            });
          } catch (error) {
            console.error('Error fetching services:', error);
            return res.status(500).json({ message: 'An error occurred while fetching services.' });
          }
    },
    async getServiceById(req, res){
        try {
            const {id} = req.params
            

            const services = await Service.findAll({
              where:  {id: id}
            });
        
            // Kiểm tra nếu không có dịch vụ
            if (services.length === 0) {
              return res.status(404).json({ message: 'No services found.' });
            }
        
            // Trả về danh sách dịch vụ
            return res.status(200).json({
              message: 'Services retrieved successfully',
              services,
            });
          } catch (error) {
            console.error('Error fetching services:', error);
            return res.status(500).json({ message: 'An error occurred while fetching services.' });
          }
    },
    async registerService(req, res){
        const { petId, serviceId, date, hour } = req.body;
        const {id} = req.user
        try {
          // Kiểm tra sự tồn tại của dịch vụ, người dùng và thú cưng
          const service = await Service.findByPk(serviceId);
          const user = await User.findByPk(id);
          const pet = await Pet.findByPk(petId);
      
          if (!service || !user || !pet) {
            return res.status(404).json({ message: 'Service, User, or Pet not found' });
          }
      
          // Tạo bản ghi mới trong bảng ServiceUser
          const serviceUser = await ServiceUser.create({
            serviceId,
            userId: id,
            petId,
            date,
            hour,
          });
      
          return res.status(201).json({
            message: 'Service registration successful',
            serviceUser,
          });
        } catch (error) {
          console.error('Error registering service:', error);
          return res.status(500).json({ message: 'Internal server error' });
        }
    },
    async getUserServices(req, res){
        try {
            const userId = req.user.id; 
            const { status } = req.query;
    
            const whereCondition = { userId };
            if (status) {
                whereCondition.status = { [Op.eq]: status };
            }
    
            const userServices = await ServiceUser.findAll({
                where: whereCondition,
                include: [
                    {
                        model: Service,
                        as: 'service',
                        attributes: ['id', 'name', 'description', 'price', 'duration', 'type', 'status'],
                    },
                    {
                        model: Pet,
                        as: 'pet',
                        attributes: ['id', 'name', 'type', 'breed'],
                    }
                ]
            });
            if(!userServices){
                return res.status(404).json({ 
                    data: [],
                    success: true,
                    message: 'No services found' 
                });
            }
            res.status(200).json({
                success: true,
                message: 'User services fetched successfully',
                data: userServices
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error fetching user services',
                error: err.message
            });
        }
    },
    async getAllBoarding(req, res){
        try {
            const { type } = req.query; 
                    // Truy vấn dịch vụ theo loại (type)
            const boarding = await Boarding.findAll({
              where: type ? { type } : {}, 
            });
        
            // Kiểm tra nếu không có dịch vụ
            if (boarding.length === 0) {
              return res.status(404).json({ message: 'No boarding found.' });
            }
        
            // Trả về danh sách dịch vụ
            return res.status(200).json({
              message: 'boarding retrieved successfully',
              boarding,
            });
          } catch (error) {
            console.error('Error fetching boarding:', error);
            return res.status(500).json({ message: 'An error occurred while fetching boarding.' });
          }
    },
    async getBoardingById(req, res){
        try {
            const {id} = req.params
            const boardings = await Boarding.findAll({
              where:  {id: id}
            });

            if (boardings.length === 0) {
              return res.status(404).json({ message: 'No boardings found.' });
            }
        
            // Trả về danh sách dịch vụ
            return res.status(200).json({
              message: 'boardings retrieved successfully',
              boardings,
            });
          } catch (error) {
            console.error('Error fetching boardings:', error);
            return res.status(500).json({ message: 'An error occurred while fetching boardings.' });
          }
    },
    async registerBoarding(req, res){
        const { petId, boardingId, start_date, end_date, notes } = req.body;
        const { id } = req.user;
      
        try {
          const service = await Boarding.findByPk(boardingId);
          const user = await User.findByPk(id);
          const pet = await Pet.findByPk(petId);
      
          if (!service || !user || !pet) {
            return res.status(404).json({ message: 'Boarding, User, or Pet not found' });
          }
      
          // Tính số ngày giữa start_date và end_date
          const startDate = new Date(start_date);
          const endDate = new Date(end_date);
          const numberOfDays = differenceInDays(endDate, startDate);
      
          if (numberOfDays <= 0) {
            return res.status(400).json({ message: 'End date must be after start date' });
          }
      
          // Tính tổng giá
          const total_price = numberOfDays * service.price;
      
          // Tạo bản ghi mới trong bảng BoardingUser
          const serviceUser = await BoardingUser.create({
            boardingId,
            userId: id,
            petId,
            start_date: startDate,
            end_date: endDate,
            notes,
            total_price,
          });
      
          return res.status(201).json({
            message: 'Service registration successful',
            serviceUser,
          });
        } catch (error) {
          console.error('Error registering service:', error);
          return res.status(500).json({ message: 'Internal server error' });
        }
    },
    async getUserBoarding(req, res){
        try {
            const userId = req.user.id; 
            const { status } = req.query;
    
            const whereCondition = { userId };
            if (status) {
                whereCondition.status = { [Op.eq]: status };
            }
    
            const userBoarding = await BoardingUser.findAll({
                where: whereCondition,
                include: [
                    {
                        model: Boarding,
                        as: 'boarding',
                        attributes: ['id', 'name', 'price', 'maxday', 'image', 'type'],
                    },
                    {
                        model: Pet,
                        as: 'pet',
                        attributes: ['id', 'name', 'type', 'breed'],
                    }
                ]
            });
            if(!userBoarding){
                return res.status(404).json({ 
                    data: [],
                    success: true,
                    message: 'No services found' 
                });
            }
            res.status(200).json({
                success: true,
                message: 'User services fetched successfully',
                data: userBoarding
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Error fetching user boarding',
                error: err.message
            });
        }
    },
    async userPaymentService(req, res) {
        try {
            const { id } = req.params;
    
            const service_user = await ServiceUser.findByPk(id, {
                include: {
                    model: Service,
                    as: 'service',
                    attributes: ['price', 'status'],
                },
            });
    
            if (!service_user) {
                return res.status(404).json({
                    success: false,
                    message: "ServiceUser not found"
                });
            }
    
            if (!service_user.service) {
                return res.status(404).json({
                    success: false,
                    message: "Service not found for this ServiceUser"
                });
            }
            if(service_user.service.status === "unavailable"){
                console.log(service_user.service.status)
                return res.status(400).json({
                    success: false,
                    message: "ServiceUser hiện không khả dụng"
                });
            }
            if (service_user.status_payment === 'paid') {
                return res.status(400).json({
                    success: false,
                    message: "ServiceUser đã thanh toán trước đó"
                });
            }

            const vnp_Amount = service_user.service.price;
            const encryptedId = encrypt(service_user.id.toString());
            const vnp_TxnRef = `SU-${encryptedId}`;
            console.log(encryptedId);
    
            const urlString = vnpay.buildPaymentUrl(
                {
                    vnp_Amount: vnp_Amount,
                    vnp_IpAddr: '1.1.1.1',
                    vnp_TxnRef: vnp_TxnRef,
                    vnp_OrderInfo: `Payment for order ${vnp_TxnRef}`,
                    vnp_OrderType: ProductCode.Other,
                    vnp_ReturnUrl: "http://localhost:3000/vnpay-return",
                },
                {
                    logger: {
                        type: 'pick',
                        fields: ['createdAt', 'method', 'paymentUrl'],
                    },
                }
            );
    
            return res.status(200).json({url: urlString});
    
        } catch (error) {
            console.error("Payment error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },
    async userPaymentBoarding(req, res) {
        try {
            const { id } = req.params;
    
            const boarding_user = await BoardingUser.findByPk(id);
    
            if (!boarding_user) {
                return res.status(404).json({
                    success: false,
                    message: "BoardingUser not found"
                });
            }
    
            if (boarding_user.status_payment === 'paid') {
                return res.status(400).json({
                    success: false,
                    message: "ServiceUser đã thanh toán trước đó"
                });
            }
    
            const vnp_Amount = boarding_user.total_price;
            const encryptedId = encrypt(boarding_user.id.toString());
            const vnp_TxnRef = `BU-${encryptedId}`;

            console.log(encryptedId);
    
            const urlString = vnpay.buildPaymentUrl(
                {
                    vnp_Amount: vnp_Amount,
                    vnp_IpAddr: '1.1.1.1',
                    vnp_TxnRef: vnp_TxnRef,
                    vnp_OrderInfo: `Payment for order ${vnp_TxnRef}`,
                    vnp_OrderType: ProductCode.Other,
                    vnp_ReturnUrl: "http://localhost:3000/vnpay-return",
                },
                {
                    logger: {
                        type: 'pick',
                        fields: ['createdAt', 'method', 'paymentUrl'],
                    },
                }
            );
    
            return res.status(200).json({url: urlString});
    
        } catch (error) {
            console.error("Payment error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },


    async callbackURL(req, res) {
        try {
            const verify = vnpay.verifyReturnUrl(req.query);
            if (!verify.isVerified) {
                return res.send('Xác thực tính toàn vẹn dữ liệu thất bại');
            }
    
            const rawRef = req.query.vnp_TxnRef;
            const [type, encryptedId] = rawRef.split('-');
            if (!type || !encryptedId) {
                return res.send('Định dạng TxnRef không hợp lệ');
            }
    
            let id;
            try {
                id = decrypt(encryptedId);
            } catch (err) {
                return res.send('Không thể giải mã ID đơn hàng');
            }
    
            if (!verify.isSuccess) {
                return res.redirect('http://localhost:8080');
            }
    
            if (type === 'SU') {
                const serviceUser = await ServiceUser.findByPk(id, {
                    include: [
                        { model: User, as: 'user', attributes: ['email', 'name'] },
                        { model: Service, as: 'service', attributes: ['name', 'price'] }
                    ]
                });
    
                if (!serviceUser) return res.send('Không tìm thấy ServiceUser');
    
                await serviceUser.update({ status_payment: 'paid' });
    
                const emailContent = `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2 style="color: #4CAF50;">Thanh toán thành công</h2>
                        <p>Xin chào <strong>${serviceUser.user.name}</strong>,</p>
                        <p>Bạn đã thanh toán thành công cho dịch vụ <strong>${serviceUser.service.name}</strong>.</p>
                        <ul>
                            <li><strong>Mã đơn hàng:</strong> ${rawRef}</li>
                            <li><strong>Số tiền:</strong> ${(serviceUser.service.price).toLocaleString()} VND</li>
                            <li><strong>Thời gian thanh toán:</strong> ${new Date().toLocaleString()}</li>
                            <li><strong>Trạng thái:</strong> Thành công</li>
                        </ul>
                        <p>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ!</p>
                        <p><strong>PetCare Team</strong></p>
                    </div>
                `;
                await sendMail({ email: serviceUser.user.email, html: emailContent });
    
                return res.redirect('http://localhost:8080/services/me');
            }
    
            if (type === 'BU') {
                const boardingUser = await BoardingUser.findByPk(id, {
                    include: [
                        { model: User, as: 'user', attributes: ['email', 'name'] },
                        { model: Boarding, as: 'boarding', attributes: ['name'] }
                    ]
                });
    
                if (!boardingUser) return res.send('Không tìm thấy BoardingUser');
    
                await boardingUser.update({ status_payment: 'paid' });
    
                const emailContent = `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2 style="color: #4CAF50;">Thanh toán thành công</h2>
                        <p>Xin chào <strong>${boardingUser.user.name}</strong>,</p>
                        <p>Bạn đã thanh toán thành công cho dịch vụ <strong>${boardingUser.boarding.name}</strong>.</p>
                        <ul>
                            <li><strong>Mã đơn hàng:</strong> ${rawRef}</li>
                            <li><strong>Số tiền:</strong> ${(boardingUser.total_price).toLocaleString()} VND</li>
                            <li><strong>Thời gian thanh toán:</strong> ${new Date().toLocaleString()}</li>
                            <li><strong>Trạng thái:</strong> Thành công</li>
                        </ul>
                        <p>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ!</p>
                        <p><strong>PetCare Team</strong></p>
                    </div>
                `;
                await sendMail({ email: boardingUser.user.email, html: emailContent });
    
                return res.redirect('http://localhost:8080/boardings/me');
            }
    
            return res.send('Loại đơn hàng không xác định');
    
        } catch (error) {
            console.error('Lỗi xử lý callbackURL:', error);
            return res.send('Đã xảy ra lỗi trong quá trình xử lý callback');
        }
    },
    async getAppointmentResultById(req, res) {
        const { id } = req.params;
        const ownerId = req.user.id;

        try {
            const appointment = await Appointment.findOne({
                where: { id },
                include: [
                    {
                        model: AppointmentResult,
                        as: 'result',
                    },
                    {
                        model: Pet,
                        as: 'pet',
                    },
                    {
                        model: User,
                        as: 'owner',
                    },
                ],
            });

            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }

            // ✅ Check if the owner of the appointment matches the requester
            if (appointment.owner_id !== ownerId) {
                return res.status(403).json({ message: 'Access denied: not your appointment' });
            }

            res.status(200).json({
                success: true,
                message: 'ok',
                data: appointment,
            });
        } catch (error) {
            console.error('Error fetching appointment:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async deleteScheduledAppointment(req, res) {
        try {
            const { id } = req.params; // Lấy appointment ID từ URL
            const ownerId = req.user.id;

            // Tìm appointment với status là Scheduled và thuộc về user
            const appointment = await Appointment.findOne({
                where: { id, owner_id: ownerId, appointment_status: 'Scheduled' },
            });

            if (!appointment) {
                return res.status(404).json({ success: false, message: 'Appointment not found or not deletable' });
            }

            // Xóa appointment
            await appointment.destroy();

            res.status(200).json({ success: true, message: 'Appointment deleted successfully' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Error deleting appointment', error: err.message });
        }
    },

}

module.exports =  UserController;



