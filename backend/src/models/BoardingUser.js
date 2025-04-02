const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const BoardingUser = sequelize.define('BoardingUser', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    total_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    boardingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'boarding',
          key: 'id',
        },
      },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',  // Tên bảng 'users'
            key: 'id',       // Khóa chính của bảng 'users'
        },
    },
    petId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'pets',  // Tên bảng 'pets'
            key: 'id',      // Khóa chính của bảng 'pets'
        },
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'boarding_user',
    timestamps: false,
});

module.exports = BoardingUser;
