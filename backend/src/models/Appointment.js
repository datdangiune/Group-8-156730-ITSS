const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Appointment = sequelize.define('Appointment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    appointment_type:{
        type: DataTypes.ENUM('Annual Checkup', 'Vaccination'),
        allowNull: false
    },
    pet_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'pets',
            key: 'id',
        },
    },
    owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Tên bảng người dùng
            key: 'id',
        },
    },
    appointment_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    appointment_hour: {
        type: DataTypes.TIME,  
        allowNull: false,
    },
    appointment_location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'appointments',
    timestamps: false,
});

module.exports = Appointment;