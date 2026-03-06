const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Settings = sequelize.define('Settings', {
    clinicName: {
        type: DataTypes.STRING,
        defaultValue: "Zefveda"
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    gstNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    defaultGst: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 5
    }
});

module.exports = Settings;
