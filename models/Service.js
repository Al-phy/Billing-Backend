const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Service = sequelize.define('Service', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
});

module.exports = Service;
