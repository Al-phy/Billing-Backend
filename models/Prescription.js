const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Prescription = sequelize.define('Prescription', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    patientName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    patientMobile: {
        type: DataTypes.STRING,
        allowNull: true
    },
    age: {
        type: DataTypes.STRING,
        allowNull: true
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true
    },
    doctorName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    diagnosis: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    prescription: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Prescription;
