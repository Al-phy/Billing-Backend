const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Bill = sequelize.define('Bill', {
    invoiceId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    patientName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    patientMobile: {
        type: DataTypes.STRING,
        allowNull: true
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    taxAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    discount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    grandTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    paymentMode: {
        type: DataTypes.ENUM('Cash', 'UPI', 'Card', 'Online'),
        allowNull: false
    },
    paymentReference: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('Paid', 'Cancelled'),
        defaultValue: 'Paid'
    },
    doctorName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    consultationTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    billDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Bill;
