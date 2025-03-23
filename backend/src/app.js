const express = require('express');
require('dotenv').config();
const sequelize = require('./database');

// Import tất cả các models
const User = require('./models/User');
const Pet = require('./models/Pet');
const Appointment = require('./models/Appointment');
const Service = require('./models/Service');
const MedicalRecord = require('./models/MedicalRecord');
const Boarding = require('./models/Boarding');
const Notification = require('./models/Notification');
const Payment = require('./models/Payment');
const Report = require('./models/Report');
const Room = require('./models/Room');

// Import routes
const authRoutes = require('./routes/auth');

// Khởi tạo ứng dụng Express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sử dụng route authentication
app.use('/auth', authRoutes);

// Lấy PORT từ file .env hoặc sử dụng mặc định là 3000
const PORT = process.env.PORT || 3000;

// Route mặc định
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Đồng bộ tất cả các bảng
sequelize.sync({ force: false }) // Đặt force: true nếu muốn xóa và tạo lại bảng
    .then(() => {
        console.log('Database synced successfully.');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });