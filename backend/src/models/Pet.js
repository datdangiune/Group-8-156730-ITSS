const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Pet = sequelize.define('Pet', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    owner_id: {
        type: DataTypes.INTEGER,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
    },
    type: {
        type: DataTypes.ENUM('dog' ,'cat' , 'bird' , 'rabbit' , 'fish' , 'other'),
        allowNull: false,
    },
    gender: {
        type: DataTypes.ENUM('Male', 'Female'),
        allowNull: false,
    },
    breed: {
        type: DataTypes.STRING,
    },
    fur_color: {
        type: DataTypes.STRING,
    },
    health_status: {
        type: DataTypes.TEXT,
    },
    diet_plan: {
        type: DataTypes.TEXT,
    },
    medical_history: {
        type: DataTypes.TEXT,
    },
    vaccination_history: {
        type: DataTypes.TEXT,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    image: {
        type: DataTypes.STRING,
    }
}, {
    tableName: 'pets',
    timestamps: false,
});

module.exports = Pet;