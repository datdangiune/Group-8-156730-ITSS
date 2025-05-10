const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const AppointmentResult = sequelize.define('AppointmentResult', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    appointment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'appointments', 
            key: 'id',
        },
    },
    diagnosis: {
        type: DataTypes.TEXT,
        allowNull: false, 
    },
    prescription: {
        type: DataTypes.TEXT,
        allowNull: true, // Prescription details
    },
    follow_up_date: {
        type: DataTypes.DATE,
        allowNull: true, // Follow-up date
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'appointment_results',
    timestamps: false,
});

module.exports = AppointmentResult;
