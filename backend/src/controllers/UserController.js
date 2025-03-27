const { Pet, Appointment, Payment, Service } = require('../models');
const sendMail = require('../util/sendMail'); // Import sendMail utility

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

            const existingAppointments = await Appointment.count({
                where: { appointment_date, appointment_hour }
            });

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
            const appointments = await Appointment.findAll({
                where: { owner_id: ownerId },
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
    }
}

module.exports =  UserController;



