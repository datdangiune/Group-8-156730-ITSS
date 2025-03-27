const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Appointment = sequelize.define('Appointment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    appointment_type:{
        type: DataTypes.ENUM('Annual Checkup', 'Vaccination', "Dental Cleaning", "Wing Trimming", "Checkup"),
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
            model: 'users', 
            key: 'id',
        },
    },
    appointment_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    appointment_hour: {
        type: DataTypes.ENUM(
            '08:00', '09:30', '11:00', '12:30', '14:00', '15:30'
        ),  
        allowNull: false,
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    appointment_status: {
        type: DataTypes.ENUM('Scheduled', 'Done', 'Cancel', 'In progess'),
        allowNull: false,
        defaultValue: "In progess",
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