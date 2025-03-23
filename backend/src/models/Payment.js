const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');
const Appointment = require('./Appointment');
const Service = require('./Service');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
    appointment_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Appointment,
            key: 'id',
        },
    },
    service_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Service,
            key: 'id',
        },
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    payment_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    method: {
        type: DataTypes.ENUM('cash', 'credit_card', 'online'),
        allowNull: false,
    },
}, {
    tableName: 'payments',
    timestamps: false,
});

module.exports = Payment;