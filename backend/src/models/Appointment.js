const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Appointment = sequelize.define('Appointment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    staff_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users', // Tên bảng nhân viên
            key: 'id',
        },
    },
    appointment_date: {
        type: DataTypes.DATE,
        allowNull: false,
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