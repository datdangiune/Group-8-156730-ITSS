const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Pet = require('./Pet');
const User = require('./User');

const Appointment = sequelize.define('Appointment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    pet_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Pet, // Tên model Pet
            key: 'id',
        },
    },
    owner_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User, // Tên model User
            key: 'id',
        },
    },
    staff_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User, // Tên model User
            key: 'id',   // Khóa chính của bảng User
        },
    },
    type: {
        type: DataTypes.ENUM('general_checkup', 'vaccination', 'testing', 'grooming', 'boarding'),
        allowNull: false,
    },
    appointment_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'canceled'),
        defaultValue: 'pending',
    },
    notes: {
        type: DataTypes.TEXT,
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