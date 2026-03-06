const Admin = require('./Admin');
const Service = require('./Service');
const Bill = require('./Bill');
const BillItem = require('./BillItem');
const Settings = require('./Settings');
const Consultation = require('./Consultation');

// Associations
Bill.hasMany(BillItem, { as: 'items', foreignKey: 'billId' });
BillItem.belongsTo(Bill, { foreignKey: 'billId' });

module.exports = {
    Admin,
    Service,
    Bill,
    BillItem,
    Settings,
    Consultation
};
