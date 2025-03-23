const express = require('express');
require('dotenv').config();
const sequelize = require('./database');
const router = require('./routes/route');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
router(app);

// Route mặc định
app.get('/', (req, res) => {
    res.send('Welcome to the Pet Care API!');
});

// Xử lý route không tồn tại
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Xử lý lỗi
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Kết nối cơ sở dữ liệu và khởi động server
sequelize.sync({ force: false })
    .then(() => {
        console.log('Database synced successfully.');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });