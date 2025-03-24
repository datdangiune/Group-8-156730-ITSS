const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Boarding = sequelize.define('Boarding', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    pet_id: {
        type: DataTypes.INTEGER,
    },
    owner_id: {
        type: DataTypes.INTEGER,
    },
    room_id: {
        type: DataTypes.INTEGER,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    special_care_instructions: {
        type: DataTypes.TEXT,
    },
    status: {
        type: DataTypes.ENUM('ongoing', 'completed'),
        defaultValue: 'ongoing',
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'boarding',
    timestamps: false,
});

module.exports = Boarding;