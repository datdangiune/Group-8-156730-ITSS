const express = require('express');
require('dotenv').config();
const sequelize = require('./database');
const router = require('./routes/route')
const adminRoutes = require('./routes/admin'); // Import admin routes

const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/admin', adminRoutes); // Register admin routes under /api prefix
router(app)
app.get('/', (req, res) => {
    res.send('Welcome to the Pet Care API!');
});


sequelize.sync({ force: false})
    .then(() => {
        console.log('Database synced successfully.');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });