const express = require('express');
const UserController = require('../controllers/UserController');
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

// Lịch sử dịch vụ
router.get('/services/history/:petId', verifyToken, UserController.getPetServiceHistory); // Xem lịch sử dịch vụ

// Lịch sử thanh toán
router.get('/payments', verifyToken, UserController.getPaymentHistory); // Xem lịch sử thanh toán

// Đặt phòng lưu trú
router.post('/boarding', verifyToken, UserController.createBoarding);

router.get('/get-all-service', verifyToken, UserController.getAllService)
router.get('/get-service/:id', verifyToken, UserController.getServiceById)
router.post('/service', verifyToken, UserController.registerService)
router.post('/image', verifyToken, fileUploader.single('file'), UserController.uploadImage)
module.exports = router;