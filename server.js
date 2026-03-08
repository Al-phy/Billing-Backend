const express = require('express');
const compression = require('compression');
const cors = require('cors');
const sequelize = require('./config/db');
const { Admin, Service, Bill, BillItem, Settings, Consultation } = require('./models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(compression());
app.use(cors({
  origin: ['billing-frontend-seven.vercel.app', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Catch unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

// Auth Middleware
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Failed to authenticate token' });
        req.userId = decoded.id;
        next();
    });
};

// --- AUTH ROUTES ---
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ where: { username } });

    if (!admin || !(await admin.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, username: admin.username });
});

// --- SERVICE ROUTES ---
app.get('/api/services', authenticate, async (req, res) => {
    try {
        const services = await Service.findAll();
        res.json(services);
    } catch (err) {
        console.error("Services fetch error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/services', authenticate, async (req, res) => {
    try {
        const service = await Service.create(req.body);
        res.json(service);
    } catch (err) {
        console.error("Service create error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/services/:id', authenticate, async (req, res) => {
    try {
        const { name, rate } = req.body;
        await Service.update({ name, rate }, { where: { id: req.params.id } });
        const updatedService = await Service.findByPk(req.params.id);
        res.json(updatedService);
    } catch (err) {
        console.error("Service update error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/services/:id', authenticate, async (req, res) => {
    try {
        await Service.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Service deleted' });
    } catch (err) {
        console.error("Service delete error:", err);
        res.status(500).json({ error: err.message });
    }
});

// --- BILLING ROUTES ---
app.get('/api/bills', authenticate, async (req, res) => {
    try {
        const bills = await Bill.findAll({
            include: [{ model: BillItem, as: 'items' }],
            order: [['createdAt', 'DESC']]
        });
        res.json(bills);
    } catch (err) {
        console.error("Bills fetch error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/bills', authenticate, async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { patient, items, subtotal, taxAmount, discount, grandTotal, payment, doctorName, consultationTime } = req.body;
        const invoiceId = `INV-${Date.now()}`;

        const bill = await Bill.create({
            invoiceId,
            patientName: patient.name,
            patientMobile: patient.mobile,
            subtotal,
            taxAmount,
            discount,
            grandTotal,
            paymentMode: payment.mode,
            paymentReference: payment.reference,
            doctorName,
            consultationTime,
            status: 'Paid'
        }, { transaction: t });

        const billItemsPromise = items.map(item => BillItem.create({
            name: item.name,
            rate: item.rate,
            qty: item.qty,
            total: item.rate * item.qty,
            billId: bill.id
        }, { transaction: t }));

        await Promise.all(billItemsPromise);
        await t.commit();

        const completeBill = await Bill.findByPk(bill.id, { include: [{ model: BillItem, as: 'items' }] });
        res.json(completeBill);
    } catch (err) {
        await t.rollback();
        console.error("Bill creation error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/bills/:id/cancel', authenticate, async (req, res) => {
    try {
        await Bill.update({ status: 'Cancelled' }, { where: { invoiceId: req.params.id } });
        res.json({ message: 'Bill cancelled' });
    } catch (err) {
        console.error("Bill cancel error:", err);
        res.status(500).json({ error: err.message });
    }
});

// --- CONSULTATION ROUTES ---
app.get('/api/consultations', authenticate, async (req, res) => {
    try {
        const consultations = await Consultation.findAll({ order: [['createdAt', 'DESC']] });
        res.json(consultations);
    } catch (err) {
        console.error("Consultations fetch error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/consultations', authenticate, async (req, res) => {
    try {
        const consultation = await Consultation.create(req.body);
        res.json(consultation);
    } catch (err) {
        console.error("Consultation create error:", err);
        res.status(500).json({ error: err.message });
    }
});

// --- SETTINGS ROUTES ---
app.get('/api/settings', authenticate, async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) settings = await Settings.create({});
        res.json(settings);
    } catch (err) {
        console.error("Settings fetch error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/settings', authenticate, async (req, res) => {
    try {
        await Settings.update(req.body, { where: { id: 1 } });
        res.json({ message: 'Settings updated' });
    } catch (err) {
        console.error("Settings update error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// --- DB SYNC & START ---
const start = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        await sequelize.sync();
        console.log('Database synced.');

        // Seed admin if not exists
        const adminCount = await Admin.count();
        if (adminCount === 0) {
            await Admin.create({ username: 'admin', password: 'admin123' });
            console.log('Default admin created: admin / admin123');
        }

        // Seed initial services if empty
        const serviceCount = await Service.count();
        if (serviceCount === 0) {
            await Service.bulkCreate([
                { name: "Consultation Fee", rate: 500 },
                { name: "Shirodhara (45 mins)", rate: 1500 },
                { name: "Abhyanga Massage", rate: 1200 }
            ]);
        }

        const PORT = process.env.PORT || 10000;   // ← Updated for Render

// Keep everything else same
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
// Health check route for Render + testing
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Billing Backend is healthy',
    time: new Date().toISOString(),
    port: process.env.PORT || 10000
  });
});
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

start();
