const express = require('express');
const UserController = require('../controllers/UserController');
const PetController = require('../controllers/PetController');
const { verifyToken } = require('../middleware/veritify');
const fileUploader = require('../config/uploadImage')
const router = express.Router();

// Quản lý thú cưng
router.post('/pets', verifyToken, UserController.createPet); // Đăng ký thú cưng
router.get('/pets', verifyToken, UserController.getAllPets); // Xem danh sách thú cưng
router.get('/get-pet/:id', verifyToken, UserController.getPet); // Xem chi tiết thú cưng
router.patch('/pets/:id/health', verifyToken, UserController.updateHealthAndDiet); // Cập nhật sức khỏe và dinh dưỡng
router.put('/pets/:id', verifyToken, UserController.updatePetInfo)
// Quản lý lịch khám bệnh
router.post('/appointments', verifyToken, UserController.createAppointment); // Đặt lịch khám
router.get('/appointments', verifyToken, UserController.getUserAppointments); // Xem danh sách lịch hẹn
router.get('/appointments/:id', verifyToken, UserController.getAppointmentDetails); // Xem chi tiết lịch hẹn
router.delete('/appointments/:id', verifyToken, UserController.deleteScheduledAppointment); // Xóa lịch hẹn

// Lịch sử dịch vụ
router.get('/services/history/:petId', verifyToken, UserController.getPetServiceHistory); // Xem lịch sử dịch vụ

// Lịch sử thanh toán
router.get('/payments', verifyToken, UserController.getPaymentHistory); // Xem lịch sử thanh toán

router.get('/notifications', verifyToken, UserController.getUserNotifications);
router.patch('/notifications/:id/read', verifyToken, UserController.markNotificationAsRead);

router.get('/get-all-service', verifyToken, UserController.getAllService)
router.get('/get-service/:id', verifyToken, UserController.getServiceById)
router.post('/service', verifyToken, UserController.registerService)
router.get('/service', verifyToken, UserController.getUserServices)

router.get('/get-all-boarding', verifyToken, UserController.getAllBoarding)
router.get('/get-boarding/:id', verifyToken, UserController.getBoardingById)
router.post('/boarding', verifyToken, UserController.registerBoarding)
router.get('/boarding', verifyToken, UserController.getUserBoarding)
router.post('/image', verifyToken, fileUploader.single('file'), UserController.uploadImage)

router.get('/pay/:id',verifyToken, UserController.userPaymentService)
router.get('/pay-boarding/:id', verifyToken,UserController.userPaymentBoarding)
router.get('/appointment-result/:id', verifyToken, UserController.getAppointmentResultById)
router.get('/:petId/medical-history', verifyToken, PetController.getMedicalHistory);
router.get('/vnpay-return', UserController.callbackURL)
module.exports = router;