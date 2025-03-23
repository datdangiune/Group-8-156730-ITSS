const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Pet = require('./Pet');
const User = require('./User');

const MedicalRecord = sequelize.define('MedicalRecord', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    pet_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Pet,
            key: 'id',
        },
    },
    vet_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
    diagnosis: {
        type: DataTypes.TEXT,
    },
    treatment: {
        type: DataTypes.TEXT,
    },
    medication: {
        type: DataTypes.TEXT,
    },
    follow_up_date: {
        type: DataTypes.DATE,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'medical_records',
    timestamps: false,
});

module.exports = MedicalRecord;