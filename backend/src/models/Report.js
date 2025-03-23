const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');

const Report = sequelize.define('Report', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: DataTypes.ENUM('revenue', 'health', 'service_usage'),
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
    },
    generated_by: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
    generated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'reports',
    timestamps: false,
});

module.exports = Report;