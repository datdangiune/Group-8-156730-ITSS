const express = require('express');
require('dotenv').config();
const sequelize = require('./database');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const vetRoutes = require('./routes/vet');
const staffRoutes = require('./routes/staff');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/vet', vetRoutes);
app.use('/api/v1/staff', staffRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the Pet Care API!');
});

// Sync database and start server
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