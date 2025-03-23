const express = require('express');
require('dotenv').config();
const sequelize = require('./database');
const router = require('./routes/route');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

router(app);


const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.send('Hello World!');
});


