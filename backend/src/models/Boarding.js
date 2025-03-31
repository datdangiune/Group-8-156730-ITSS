const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Boarding = sequelize.define('Boarding', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    price: {  // giá trên ngày
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    maxday: {  //Số ngày nhiều nhất có thể hỗ trợ
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('available', 'unavailable'),
        allowNull: false,
        defaultValue: 'available',
    },
    details: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
    },
}, {
    tableName: 'boarding',
    timestamps: false,
});

module.exports = Boarding;