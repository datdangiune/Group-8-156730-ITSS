const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Pet = require('./Pet');
const User = require('./User');
const Room = require('./Room');

const Boarding = sequelize.define('Boarding', {
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
    owner_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
    room_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Room,
            key: 'id',
        },
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