const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Service = sequelize.define('Service', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('grooming', 'medical', 'boarding'),
        allowNull: false,
    },
    notes: {
        type: DataTypes.TEXT, 
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'services',
    timestamps: false,
});

module.exports = Service;