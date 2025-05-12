const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');

const Notification = sequelize.define('Notification', {
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
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: true, // URL is optional
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Default value is false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'notifications',
    timestamps: false,
});

module.exports = Notification;