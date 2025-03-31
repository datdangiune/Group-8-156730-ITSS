const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const MedicalRecord = sequelize.define('MedicalRecord', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    pet_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'pets',  // Liên kết với bảng 'pets'
            key: 'id',
        },
    },
    appointment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'appointments', // Liên kết với bảng 'appointments'
            key: 'id',
        },
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',  // Liên kết với bảng 'users'
            key: 'id',
        },
    },
    record_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,  // Ngày ghi nhận bản ghi y tế
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,  // Mô tả chi tiết về tình trạng và điều trị
    },
    treatment: {
        type: DataTypes.TEXT,
        allowNull: true,  // Các phương pháp điều trị đã thực hiện
    },
    status: {
        type: DataTypes.ENUM('Healthy', 'Ill', 'Recovered', 'Under Treatment'),
        defaultValue: 'Healthy',  // Trạng thái y tế của thú cưng
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
