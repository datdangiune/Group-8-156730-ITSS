const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgresql://admin:npg_e7akvCz8wKqW@ep-delicate-surf-a2nmn43y-pooler.eu-central-1.aws.neon.tech/pet', {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, 
        },
    },
});

sequelize.authenticate()
    .then(() => console.log('Database connected successfully.'))
    .catch((err) => console.error('Unable to connect to the database:', err));

module.exports = sequelize;