const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BillItem = sequelize.define('BillItem', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    qty: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
});

module.exports = BillItem;
