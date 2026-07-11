// KamySoft POS & ERP Express Server Backend
// Implements full MERN API server with ZATCA Phase 2 XML generator, Employee Asset Depreciation, and multi-currency options
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 8089;
const JWT_SECRET = process.env.JWT_SECRET || 'kamysoft_super_secret_key_2026';

// ----------------------------------------------------
// EMAIL SERVICE CONFIGURATION (SendGrid)
// ----------------------------------------------------
const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY || 'SG.mock-key-for-development' // Replace with real key in production .env
    }
});

const getBaseDomain = (host) => {
    host = host.toLowerCase();
    if (host.endsWith('ssh-erp.26i.uk')) return 'ssh-erp.26i.uk';
    if (host.endsWith('26i.uk')) return '26i.uk';
    if (host.endsWith('localhost')) return 'localhost';
    return host;
};

const sendLicenseEmail = async (tenantEmail, tenantId, businessName, licenseKey, expiresAt, baseDomain = '26i.uk') => {
    if (!process.env.SENDGRID_API_KEY) {
        console.log(`[Mock Email] License key for ${businessName} (${tenantId}) sent to ${tenantEmail}: ${licenseKey}`);
        return;
    }
    try {
        await transporter.sendMail({
            from: '"SME Solutions" <no-reply@kamysofterp.com>',
            to: tenantEmail,
            subject: 'Welcome to SME Solutions! Your License Key',
            html: `
                <h3>Welcome to SME Solutions, ${businessName}!</h3>
                <p>Your store has been successfully created. You can access it at: <b>https://${tenantId}.${baseDomain}</b></p>
                <div style="background:#f3f4f6;padding:16px;border-radius:8px;margin:16px 0;">
                    <p style="margin:0;font-size:14px;color:#6b7280;">Your License Key:</p>
                    <p style="margin:8px 0 0 0;font-size:24px;font-weight:bold;color:#111827;letter-spacing:2px;">${licenseKey}</p>
                </div>
                <p>This license is valid until: <b>${new Date(expiresAt).toLocaleDateString()}</b>.</p>
                <p>This key is automatically validated when you log in.</p>
            `
        });
        console.log(`License email sent to ${tenantEmail}`);
    } catch (err) {
        console.error('Failed to send license email:', err.message);
    }
};

const getTenantId = (req) => {
    const host = (req.headers.host || '').split(':')[0].toLowerCase();
    const baseDomain = getBaseDomain(host);

    if (host.endsWith(`.${baseDomain}`)) {
        const subdomain = host.slice(0, -(baseDomain.length + 1));
        if (subdomain !== 'www' && subdomain !== 'demo') return subdomain;
    }
    if (host === baseDomain) return 'default';

    const tenantHeader = req.headers['x-tenant-id'];
    if (tenantHeader) return tenantHeader.trim().toLowerCase();
    
    return 'default'; // fallback
};

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ----------------------------------------------------
// DATABASE CONNECTION (Portability Mode)
// ----------------------------------------------------
let isMongoConnected = false;
const MONGO_URI = process.env.MONGO_URI;

if (MONGO_URI) {
    mongoose.connect(MONGO_URI)
        .then(() => {
            console.log('Successfully connected to MongoDB.');
            isMongoConnected = true;
            seedDatabase();
        })
        .catch(err => {
            console.warn('MongoDB connection failed. Starting in PORTABLE in-memory mode.', err.message);
        });
} else {
    console.log('No MONGO_URI provided. Running in PORTABLE in-memory mode.');
}

// ----------------------------------------------------
// IN-MEMORY STORAGE (Fallback / Mock Database)
// ----------------------------------------------------
const mockDb = {
    users: [
        // Admin: admin123, Manager: manager123, Cashier: cashier123, Demo: demo123
        { id: '1', username: 'admin', passwordHash: bcrypt.hashSync('admin123', 10), role: 'Admin' },
        { id: '2', username: 'manager', passwordHash: bcrypt.hashSync('manager123', 10), role: 'Manager' },
        { id: '3', username: 'cashier', passwordHash: bcrypt.hashSync('cashier123', 10), role: 'Cashier' },
        { id: '4', username: 'demo', passwordHash: bcrypt.hashSync('demo123', 10), role: 'Cashier' }
    ],
    products: [
        { id: '1001', nameEN: 'Premium Smart Monitor 27"', nameAR: 'شاشة ذكية فاخرة 27 بوصة', price: 950, cost: 650, stock: 12, category: 'electronics', emoji: '🖥️', barcode: '628100100010' },
        { id: '1002', nameEN: 'Wireless Laser Scanner', nameAR: 'قارئ باركود لاسلكي ليزري', price: 250, cost: 170, stock: 8, category: 'electronics', emoji: '🔦', barcode: '628100200020' },
        { id: '1003', nameEN: 'Direct Thermal Receipt Printer', nameAR: 'طابعة فواتير حرارية مباشرة', price: 320, cost: 210, stock: 15, category: 'electronics', emoji: '🖨️', barcode: '628100300030' },
        { id: '1004', nameEN: 'Leather Executive Chair', nameAR: 'كرسي مكتب جلد فخم', price: 420, cost: 280, stock: 4, category: 'office', emoji: '💺', barcode: '628100400040' },
        { id: '1005', nameEN: 'Organic Coffee Beans 1kg', nameAR: 'حبوب قهوة عضوية 1 كجم', price: 75, cost: 48, stock: 30, category: 'groceries', emoji: '☕', barcode: '628100500050' },
        { id: '1006', nameEN: 'Saudi Classic Thobe (White)', nameAR: 'ثوب سعودي كلاسيك أبيض', price: 180, cost: 110, stock: 45, category: 'apparel', emoji: '👔', barcode: '628100600060' },
        { id: '1007', nameEN: 'Luxury Shemagh (Red)', nameAR: 'شماغ أحمر ملكي فاخر', price: 220, cost: 140, stock: 30, category: 'apparel', emoji: '🧣', barcode: '628100700070' },
        { id: '1008', nameEN: 'Premium Black Abaya', nameAR: 'عباءة سوداء فاخرة مطرزة', price: 350, cost: 220, stock: 25, category: 'apparel', emoji: '👘', barcode: '628100800080' },
        { id: '1009', nameEN: 'Casual Formal Suit (Blue)', nameAR: 'بدلة رسمية كلاسيكية زرقاء', price: 650, cost: 420, stock: 10, category: 'apparel', emoji: '🧥', barcode: '628100900090' },
        { id: '1010', nameEN: 'Mechanical Keyboard (RGB)', nameAR: 'لوحة مفاتيح ميكانيكية ملونة', price: 150, cost: 90, stock: 20, category: 'electronics', emoji: '⌨️', barcode: '628101000100' },
        { id: '1011', nameEN: 'Ergonomic Standing Desk', nameAR: 'مكتب وقوف مرن مريح', price: 1200, cost: 850, stock: 5, category: 'office', emoji: '🎚️', barcode: '628101100110' },
        { id: '1012', nameEN: 'Automatic Water Dispenser', nameAR: 'موزع مياه أوتوماتيكي', price: 95, cost: 60, stock: 15, category: 'groceries', emoji: '🥛', barcode: '628101200120' }
    ],
    invoices: [
        { id: 'INV-100001', uuid: '6338b0be-0987-4321-bcde-54a7cda98e6a', csn: 1, pih: 'NWZlY2Q1Y2QyODgyY2NmYTE5YTY1ODIzMDYyMzA5MTRmYmJhYmQ2YmQxMTBiYTkyYTk4YmM0ZTc0Y2Y5MmQ2ZQ==', xmlHashBase64: 'NWZlY2Q1Y2QyODgyY2NmYTE5YTY1ODIzMDYyMzA5MTRmYmJhYmQ2YmQxMTBiYTkyYTk4YmM0ZTc0Y2Y5MmQ2ZQ==', customer: 'خليل الغامدي', items: [{ id: '1001', name: 'شاشة ذكية فاخرة 27 بوصة', price: 950, qty: 1 }], discount: 0, vat: 142.5, total: 1092.5, date: '2026-06-20 10:30', zatcaStatus: 'REPORTED' },
        { id: 'INV-100002', uuid: '6338b0be-0987-4321-bcde-54a7cda98e6b', csn: 2, pih: 'NWZlY2Q1Y2QyODgyY2NmYTE5YTY1ODIzMDYyMzA5MTRmYmJhYmQ2YmQxMTBiYTkyYTk4YmM0ZTc0Y2Y5MmQ2ZQ==', xmlHashBase64: 'NWZlY2Q1Y2QyODgyY2NmYTE5YTY1ODIzMDYyMzA5MTRmYmJhYmQ2YmQxMTBiYTkyYTk4YmM0ZTc0Y2Y5MmQ2ZQ==', customer: 'عميل نقدي', items: [{ id: '1002', name: 'Wireless Laser Scanner', price: 250, qty: 2 }], discount: 0, vat: 75.0, total: 575.0, date: '2026-06-21 11:15', zatcaStatus: 'REPORTED' },
        { id: 'INV-100003', uuid: '6338b0be-0987-4321-bcde-54a7cda98e6c', csn: 3, pih: 'NWZlY2Q1Y2QyODgyY2NmYTE5YTY1ODIzMDYyMzA5MTRmYmJhYmQ2YmQxMTBiYTkyYTk4YmM0ZTc0Y2Y5MmQ2ZQ==', xmlHashBase64: 'NWZlY2Q1Y2QyODgyY2NmYTE5YTY1ODIzMDYyMzA5MTRmYmJhYmQ2YmQxMTBiYTkyYTk4YmM0ZTc0Y2Y5MmQ2ZQ==', customer: 'فهد العتيبي', items: [{ id: '1003', name: 'Direct Thermal Receipt Printer', price: 320, qty: 1 }], discount: 10, vat: 46.5, total: 356.5, date: '2026-06-21 14:00', zatcaStatus: 'REPORTED' },
        { id: 'INV-100004', uuid: '6338b0be-0987-4321-bcde-54a7cda98e6d', csn: 4, pih: 'NWZlY2Q1Y2QyODgyY2NmYTE5YTY1ODIzMDYyMzA5MTRmYmJhYmQ2YmQxMTBiYTkyYTk4YmM0ZTc0Y2Y5MmQ2ZQ==', xmlHashBase64: 'NWZlY2Q1Y2QyODgyY2NmYTE5YTY1ODIzMDYyMzA5MTRmYmJhYmQ2YmQxMTBiYTkyYTk4YmM0ZTc0Y2Y5MmQ2ZQ==', customer: 'عميل نقدي', items: [{ id: '1005', name: 'Organic Coffee Beans 1kg', price: 75, qty: 4 }], discount: 0, vat: 45.0, total: 345.0, date: '2026-06-22 09:30', zatcaStatus: 'REPORTED' },
        { id: 'INV-100005', uuid: '6338b0be-0987-4321-bcde-54a7cda98e6e', csn: 5, pih: 'NWZlY2Q1Y2QyODgyY2NmYTE5YTY1ODIzMDYyMzA5MTRmYmJhYmQ2YmQxMTBiYTkyYTk4YmM0ZTc0Y2Y5MmQ2ZQ==', xmlHashBase64: 'NWZlY2Q1Y2QyODgyY2NmYTE5YTY1ODIzMDYyMzA5MTRmYmJhYmQ2YmQxMTBiYTkyYTk4YmM0ZTc0Y2Y5MmQ2ZQ==', customer: 'سارة سالم', items: [{ id: '1006', name: 'Saudi Classic Thobe (White)', price: 180, qty: 2 }], discount: 0, vat: 54.0, total: 414.0, date: '2026-06-22 15:45', zatcaStatus: 'REPORTED' },
        { id: 'INV-100006', uuid: '6338b0be-0987-4321-bcde-54a7cda98e6f', csn: 6, pih: 'NWZlY2Q1Y2QyODgyY2NmYTE5YTY1ODIzMDYyMzA5MTRmYmJhYmQ2YmQxMTBiYTkyYTk4YmM0ZTc0Y2Y5MmQ2ZQ==', xmlHashBase64: 'NWZlY2Q1Y2QyODgyY2NmYTE5YTY1ODIzMDYyMzA5MTRmYmJhYmQ2YmQxMTBiYTkyYTk4YmM0ZTc0Y2Y5MmQ2ZQ==', customer: 'خليل الغامدي', items: [{ id: '1008', name: 'Premium Black Abaya', price: 350, qty: 1 }], discount: 5, vat: 51.75, total: 396.75, date: '2026-06-23 10:00', zatcaStatus: 'REPORTED' },
        { id: 'INV-100007', uuid: '6338b0be-0987-4321-bcde-54a7cda98e70', csn: 7, pih: 'NWZlY2Q1Y2QyODgyY2NmYTE5YTY1ODIzMDYyMzA5MTRmYmJhYmQ2YmQxMTBiYTkyYTk4YmM0ZTc0Y2Y5MmQ2ZQ==', xmlHashBase64: 'NWZlY2Q1Y2QyODgyY2NmYTE5YTY1ODIzMDYyMzA5MTRmYmJhYmQ2YmQxMTBiYTkyYTk4YmM0ZTc0Y2Y5MmQ2ZQ==', customer: 'عميل نقدي', items: [{ id: '1004', name: 'Leather Executive Chair', price: 420, qty: 1 }], discount: 0, vat: 63.0, total: 483.0, date: '2026-06-23 13:20', zatcaStatus: 'REPORTED' },
        { id: 'INV-100008', uuid: '6338b0be-0987-4321-bcde-54a7cda98e71', csn: 8, pih: 'NWZlY2Q1Y2QyODgyY2NmYTE5YTY1ODIzMDYyMzA5MTRmYmJhYmQ2YmQxMTBiYTkyYTk4YmM0ZTc0Y2Y5MmQ2ZQ==', xmlHashBase64: 'NWZlY2Q1Y2QyODgyY2NmYTE5YTY1ODIzMDYyMzA5MTRmYmJhYmQ2YmQxMTBiYTkyYTk4YmM0ZTc0Y2Y5MmQ2ZQ==', customer: 'أحمد علي', items: [{ id: '1007', name: 'Luxury Shemagh (Red)', price: 220, qty: 2 }], discount: 0, vat: 66.0, total: 506.0, date: '2026-06-24 11:10', zatcaStatus: 'REPORTED' },
        { id: 'INV-100009', uuid: '6338b0be-0987-4321-bcde-54a7cda98e72', csn: 9, pih: 'NWZlY2Q1Y2QyODgyY2NmYTE5YTY1ODIzMDYyMzA5MTRmYmJhYmQ2YmQxMTBiYTkyYTk4YmM0ZTc0Y2Y5MmQ2ZQ==', xmlHashBase64: 'NWZlY2Q1Y2QyODgyY2NmYTE5YTY1ODIzMDYyMzA5MTRmYmJhYmQ2YmQxMTBiYTkyYTk4YmM0ZTc0Y2Y5MmQ2ZQ==', customer: 'عميل نقدي', items: [{ id: '1009', name: 'Casual Formal Suit (Blue)', price: 650, qty: 1 }], discount: 0, vat: 97.5, total: 747.5, date: '2026-06-24 16:30', zatcaStatus: 'REPORTED' },
        { id: 'INV-100010', uuid: '6338b0be-0987-4321-bcde-54a7cda98e73', csn: 10, pih: 'NWZlY2Q1Y2QyODgyY2NmYTE5YTY1ODIzMDYyMzA5MTRmYmJhYmQ2YmQxMTBiYTkyYTk4YmM0ZTc0Y2Y5MmQ2ZQ==', xmlHashBase64: 'NWZlY2Q1Y2QyODgyY2NmYTE5YTY1ODIzMDYyMzA5MTRmYmJhYmQ2YmQxMTBiYTkyYTk4YmM0ZTc0Y2Y5MmQ2ZQ==', customer: 'فهد العتيبي', items: [{ id: '1001', name: 'Premium Smart Monitor 27"', price: 950, qty: 2 }], discount: 50, vat: 277.5, total: 2127.5, date: '2026-06-25 09:00', zatcaStatus: 'REPORTED' }
    ],
    quotations: [
        { id: 'QTN-2001', date: '2026-06-24 10:00', customer: 'خليل الغامدي', items: [{ name: 'Monitor x1', price: 950, qty: 1 }], discount: 0, total: 1092.5, vat: 142.5 },
        { id: 'QTN-2002', date: '2026-06-24 11:30', customer: 'فهد العتيبي', items: [{ name: 'Scanner x2', price: 250, qty: 2 }], discount: 0, total: 575.0, vat: 75.0 },
        { id: 'QTN-2003', date: '2026-06-24 12:45', customer: 'عميل نقدي', items: [{ name: 'Printer x1', price: 320, qty: 1 }], discount: 0, total: 368.0, vat: 48.0 },
        { id: 'QTN-2004', date: '2026-06-24 14:15', customer: 'مستشفى الفهد', items: [{ name: 'Office Chair x4', price: 420, qty: 4 }], discount: 0, total: 1932.0, vat: 252.0 },
        { id: 'QTN-2005', date: '2026-06-24 16:00', customer: 'أحمد علي', items: [{ name: 'Coffee x10', price: 75, qty: 10 }], discount: 0, total: 862.5, vat: 112.5 },
        { id: 'QTN-2006', date: '2026-06-25 08:30', customer: 'مدرسة المنار', items: [{ name: 'White Thobe x30', price: 180, qty: 30 }], discount: 0, total: 6210.0, vat: 810.0 },
        { id: 'QTN-2007', date: '2026-06-25 09:15', customer: 'سارة سالم', items: [{ name: 'Red Shemagh x5', price: 220, qty: 5 }], discount: 0, total: 1265.0, vat: 165.0 },
        { id: 'QTN-2008', date: '2026-06-25 10:00', customer: 'مؤسسة التقنية', items: [{ name: 'Black Abaya x15', price: 350, qty: 15 }], discount: 0, total: 6037.5, vat: 787.5 },
        { id: 'QTN-2009', date: '2026-06-25 11:20', customer: 'خالد محمد', items: [{ name: 'Blue Suit x8', price: 650, qty: 8 }], discount: 0, total: 5980.0, vat: 780.0 },
        { id: 'QTN-2010', date: '2026-06-25 13:00', customer: 'الشركة العربية', items: [{ name: 'Keyboard x12', price: 150, qty: 12 }], discount: 0, total: 2070.0, vat: 270.0 }
    ],
    expenses: [
        { id: 'EXP-5001', date: '2026-06-01', category: 'rent', amount: 3000, description: 'Office Rent / إيجار المكتب الرئيسي' },
        { id: 'EXP-5002', date: '2026-06-10', category: 'marketing', amount: 500, description: 'Google Ads / إعلانات جوجل' },
        { id: 'EXP-5003', date: '2026-06-12', category: 'salaries', amount: 15000, description: 'Monthly Employees Salaries / رواتب الموظفين لشهر يونيو' },
        { id: 'EXP-5004', date: '2026-06-14', category: 'shipping', amount: 320, description: 'Aramex Delivery Fees / رسوم توصيل أرامكس' },
        { id: 'EXP-5005', date: '2026-06-15', category: 'other', amount: 180, description: 'Office Pantry Items / مستلزمات ضيافة مكتبية' },
        { id: 'EXP-5006', date: '2026-06-18', category: 'rent', amount: 450, description: 'Internet & Landline / فاتورة الإنترنت والهاتف' },
        { id: 'EXP-5007', date: '2026-06-20', category: 'marketing', amount: 750, description: 'Snapchat Marketing Campaign / حملة سناب شات' },
        { id: 'EXP-5008', date: '2026-06-21', category: 'other', amount: 120, description: 'Electricity Bill / فاتورة الكهرباء' },
        { id: 'EXP-5009', date: '2026-06-22', category: 'shipping', amount: 450, description: 'DHL Custom Clearance / رسوم تخليص جمركي دي إتش إل' },
        { id: 'EXP-5010', date: '2026-06-24', category: 'salaries', amount: 4000, description: 'Contractor Commissions / عمولات مناديب المبيعات' }
    ],
    customers: [
        { id: 'CUST-8001', name: 'Khalil Al-Ghamdi / خليل الغامدي', phone: '0501234567', email: 'khalil@26i.uk', points: 150, spent: 1725 },
        { id: 'CUST-8002', name: 'Fahad Al-Otaibi / فهد العتيبي', phone: '0557654321', email: 'fahad@kamysoft.com', points: 45, spent: 480 },
        { id: 'CUST-8003', name: 'Sami Al-Harbi / سامي الحربي', phone: '0567890123', email: 'sami@example.com', points: 30, spent: 320 },
        { id: 'CUST-8004', name: 'Aisha Al-Subaie / عائشة السبيعي', phone: '0543210987', email: 'aisha@example.com', points: 280, spent: 3450 },
        { id: 'CUST-8005', name: 'Yousef Al-Mutairi / يوسف المطيري', phone: '0534567890', email: 'yousef@example.com', points: 90, spent: 1200 },
        { id: 'CUST-8006', name: 'Reem Al-Dosari / ريم الدوسري', phone: '0578901234', email: 'reem@example.com', points: 15, spent: 150 },
        { id: 'CUST-8007', name: 'Majed Al-Anazi / ماجد العنزي', phone: '0590123456', email: 'majed@example.com', points: 110, spent: 1450 },
        { id: 'CUST-8008', name: 'Sarah Al-Qahtani / سارة القحطاني', phone: '0587654321', email: 'sarah@example.com', points: 65, spent: 780 },
        { id: 'CUST-8009', name: 'Bandar Al-Shahrani / بندر الشهراني', phone: '0554321098', email: 'bandar@example.com', points: 200, spent: 2500 },
        { id: 'CUST-8010', name: 'Noura Al-Shehri / نورة الشهري', phone: '0532109876', email: 'noura@example.com', points: 350, spent: 4890 }
    ],
    employees: [
        { id: 'EMP-3001', name: 'Khalil Al-Ghamdi / خليل الغامدي', dept: 'IT Operations' },
        { id: 'EMP-3002', name: 'Ahmad Ali / أحمد علي', dept: 'Finance' },
        { id: 'EMP-3003', name: 'Sarah Salem / سارة سالم', dept: 'Administration' },
        { id: 'EMP-3004', name: 'Sultan Salem / سلطان سالم', dept: 'Sales' },
        { id: 'EMP-3005', name: 'Layla Ahmad / ليلى أحمد', dept: 'Customer Support' },
        { id: 'EMP-3006', name: 'Mansour Ali / منصور علي', dept: 'Logistics' },
        { id: 'EMP-3007', name: 'Hoda Fahad / هدى فهد', dept: 'Human Resources' },
        { id: 'EMP-3008', name: 'Turki Khalid / تركي خالد', dept: 'Sales' },
        { id: 'EMP-3009', name: 'Fatimah Mohammad / فاطمة محمد', dept: 'Marketing' },
        { id: 'EMP-3010', name: 'Saad Abdallah / سعد عبدالله', dept: 'Procurement' }
    ],
    suppliers: [
        { id: 'SUPP-9001', company: 'Rawaa Supplies Co. / شركة رواء للتوريد', contact: 'Ahmad Ali', phone: '0599998888', items: 'Smart Monitors, POS printers' },
        { id: 'SUPP-9002', company: 'Saudi Tech Importers / مستوردي التقنية السعودية', contact: 'Sami Salem', phone: '0544443333', items: 'Barcode scanners, office equipment' },
        { id: 'SUPP-9003', company: 'Modern Office Furniture / أثاث المكتب الحديث', contact: 'Fahad Al-Sami', phone: '0533332222', items: 'Ergonomic chairs, standing desks' },
        { id: 'SUPP-9004', company: 'Jazeera Trading House / دار الجزيرة التجارية', contact: 'Omar Khalid', phone: '0522221111', items: 'Apparel accessories, raw materials' },
        { id: 'SUPP-9005', company: 'Global Coffee Importers / مستوردي البن العالمي', contact: 'Tariq Ali', phone: '0511110000', items: 'Organic coffee beans, syrups' },
        { id: 'SUPP-9006', company: 'Unified Stationery / المكتبة الموحدة', contact: 'Adel Ahmad', phone: '0500009999', items: 'Office stationery, paper goods' },
        { id: 'SUPP-9007', company: 'Pioneers Electronic / رواد الإلكترونيات', contact: 'Nasser Salem', phone: '0599997777', items: 'Thermal printers, cash drawers' },
        { id: 'SUPP-9008', company: 'Premium Textile Co. / شركة المنسوجات المتميزة', contact: 'Waleed Ali', phone: '0588886666', items: 'Classic white thobes, shemaghs' },
        { id: 'SUPP-9009', company: 'Raw Food Distributors / موزعي الغذاء الخام', contact: 'Ziyad Salem', phone: '0577775555', items: 'Packaged groceries, snacks' },
        { id: 'SUPP-9010', company: 'Elite Fashion Hub / مركز النخبة للأزياء', contact: 'Majed Al-Fahad', phone: '0566664444', items: 'Luxury abayas, suits' }
    ],
    orders: [
        { id: 'ORD-7001', date: '2026-06-24 12:00', customer: 'خليل الغامدي', items: 'طابعة فواتير حرارية مباشرة x1', total: 368.0, status: 'Preparing' },
        { id: 'ORD-7002', date: '2026-06-24 13:00', customer: 'عميل نقدي', items: 'حبوب قهوة عضوية 1 كجم x3', total: 258.75, status: 'Ready' },
        { id: 'ORD-7003', date: '2026-06-24 15:45', customer: 'فهد العتيبي', items: 'قارئ باركود لاسلكي ليزري x2', total: 575.0, status: 'Completed' },
        { id: 'ORD-7004', date: '2026-06-24 17:00', customer: 'سارة سالم', items: 'شاشة ذكية فاخرة 27 بوصة x1', total: 1092.5, status: 'Delivered' },
        { id: 'ORD-7005', date: '2026-06-24 19:20', customer: 'عميل نقدي', items: 'بدلة رسمية كلاسيكية زرقاء x1', total: 747.5, status: 'Pending' },
        { id: 'ORD-7006', date: '2026-06-25 09:30', customer: 'سامي الحربي', items: 'كرسي مكتب جلد فخم x2', total: 966.0, status: 'Preparing' },
        { id: 'ORD-7007', date: '2026-06-25 10:15', customer: 'عائشة السبيعي', items: 'شماغ أحمر ملكي فاخر x10', total: 2530.0, status: 'Ready' },
        { id: 'ORD-7008', date: '2026-06-25 11:00', customer: 'يوسف المطيري', items: 'ثوب سعودي كلاسيك أبيض x5', total: 1035.0, status: 'Completed' },
        { id: 'ORD-7009', date: '2026-06-25 12:15', customer: 'عميل نقدي', items: 'عباءة سوداء فاخرة مطرزة x3', total: 1207.5, status: 'Pending' },
        { id: 'ORD-7010', date: '2026-06-25 13:40', customer: 'نورة الشهري', items: 'لوحة مفاتيح ميكانيكية ملونة x5', total: 862.5, status: 'Preparing' }
    ],
    assets: [
        { id: 'AST-2001', name: 'Server Host B Machine', cost: 4500, salvage: 500, life: 5, date: '2025-01-15', status: 'active', department: 'IT / Operations', serial: 'SN-76543A', supplier: 'Saudi Tech Importers', assignedTo: 'EMP-3001' },
        { id: 'AST-2002', name: 'Laser Printer HP LaserJet', cost: 1200, salvage: 200, life: 4, date: '2025-03-10', status: 'active', department: 'Administration', serial: 'SN-99881P', supplier: 'Rawaa Supplies Co.', assignedTo: 'EMP-3003' },
        { id: 'AST-2003', name: 'ERP Backend Server AWS EC2', cost: 6000, salvage: 0, life: 3, date: '2025-05-01', status: 'active', department: 'IT / Operations', serial: 'AWS-EC2-ERP', supplier: 'Amazon Web Services', assignedTo: 'EMP-3001' },
        { id: 'AST-2004', name: 'Office Workstation Laptops (Dell)', cost: 15000, salvage: 1500, life: 4, date: '2025-06-01', status: 'active', department: 'IT / Operations', serial: 'SN-DELL-IT', supplier: 'Saudi Tech Importers', assignedTo: 'EMP-3001' },
        { id: 'AST-2005', name: 'IT Staff Laptops (Apple MacBook)', cost: 18000, salvage: 2000, life: 4, date: '2025-07-15', status: 'active', department: 'IT / Operations', serial: 'SN-MAC-01', supplier: 'Saudi Tech Importers', assignedTo: 'EMP-3001' },
        { id: 'AST-2006', name: 'Conference Room Smart Screen 85"', cost: 8500, salvage: 500, life: 5, date: '2025-08-20', status: 'active', department: 'Sales / Marketing', serial: 'SN-SCREEN-85', supplier: 'Rawaa Supplies Co.', assignedTo: 'EMP-3004' },
        { id: 'AST-2007', name: 'Office Main Air Conditioning Unit', cost: 11000, salvage: 1000, life: 8, date: '2024-05-10', status: 'active', department: 'Administration', serial: 'SN-AC-MAIN', supplier: 'Saudi Tech Importers', assignedTo: 'EMP-3003' },
        { id: 'AST-2008', name: 'Warehouse Delivery Forklift', cost: 35000, salvage: 5000, life: 10, date: '2024-01-15', status: 'active', department: 'Logistics', serial: 'SN-FORK-09', supplier: 'Saudi Tech Importers', assignedTo: 'EMP-3006' },
        { id: 'AST-2009', name: 'Reception Desk Furniture Set', cost: 3800, salvage: 300, life: 7, date: '2024-03-01', status: 'active', department: 'Administration', serial: 'SN-FURN-REC', supplier: 'Modern Office Furniture', assignedTo: 'EMP-3005' },
        { id: 'AST-2010', name: 'Kitchen Breakroom Refrigerator', cost: 2500, salvage: 100, life: 5, date: '2024-04-10', status: 'active', department: 'Administration', serial: 'SN-REF-01', supplier: 'Raw Food Distributors', assignedTo: 'EMP-3003' }
    ],
    settings: {
        businessName: 'KamySoft ERP & POS',
        fullName: 'خليل الغامدي / Khalil Al-Ghamdi',
        vatNumber: '310123456700003',
        taxRate: 15,
        baseCurrency: 'SAR',
        businessAddress: 'الرياض، المملكة العربية السعودية / Riyadh, Saudi Arabia',
        crNumber: '1010123456',
        contactNumber: '+966 50 123 4567',
        exchangeRates: {
            SAR: 1,
            USD: 0.27,
            EUR: 0.25,
            EGP: 12.8,
            AED: 0.99
        },
        branches: [
            { name: 'Main Branch - Riyadh', address: 'Olaya District, Riyadh', phone: '+966 50 123 4567' },
            { name: 'Jeddah Branch', address: 'Tahlia St, Jeddah', phone: '+966 50 765 4321' }
        ],
        currentBranch: 'Main Branch - Riyadh',
        businessType: 'retail',
        enableTables: false,
        enableServiceDuration: false
    },
    inquiries: []
};

// Pre-populate mockDb items with tenantId: 'default'
Object.keys(mockDb).forEach(key => {
    if (Array.isArray(mockDb[key])) {
        mockDb[key].forEach(item => {
            if (item && typeof item === 'object' && !item.tenantId) {
                item.tenantId = 'default';
            }
        });
    } else if (mockDb[key] && typeof mockDb[key] === 'object') {
        if (!mockDb[key].tenantId) mockDb[key].tenantId = 'default';
    }
});

// ----------------------------------------------------
// MONGOOSE SCHEMAS (If connected)
// ----------------------------------------------------
const { User, Product, Invoice, Quotation, Expense, Asset, Customer, Employee, Supplier, Order, Settings, Inquiry, Warehouse, InventoryTx, JournalEntry, Voucher, Salary, PurchaseInvoice, ReturnInvoice } = require('./models');

async function seedDatabase() {
    try {
        // Dynamic Migration: Ensure all pre-existing documents without tenantId get tenantId: 'default'
        const models = [User, Product, Invoice, Quotation, Expense, Asset, Customer, Employee, Supplier, Order, Settings];
        for (const model of models) {
            await model.updateMany(
                { tenantId: { $exists: false } },
                { $set: { tenantId: 'default' } }
            );
        }
        console.log('Database migration complete: Added tenantId to pre-existing documents.');

        // Settings — scoped to default tenant
        const settingsCount = await Settings.countDocuments({ tenantId: 'default' });
        if (settingsCount === 0) {
            await Settings.create({ ...mockDb.settings, tenantId: 'default' });
            console.log('Database seeded: Settings.');
        }

        // Users — scoped to default tenant
        for (const u of mockDb.users.filter(u => u.tenantId === 'default')) {
            const exists = await User.findOne({ username: u.username, tenantId: 'default' });
            if (!exists) {
                await User.create(u);
                console.log(`Database seeded user: ${u.username}`);
            }
        }

        // Products — scoped to default tenant
        const productCount = await Product.countDocuments({ tenantId: 'default' });
        if (productCount === 0) {
            await Product.insertMany(mockDb.products.filter(p => p.tenantId === 'default'));
            console.log('Database seeded: Products.');
        }

        // Invoices — scoped to default tenant
        const invoiceCount = await Invoice.countDocuments({ tenantId: 'default' });
        if (invoiceCount === 0) {
            await Invoice.insertMany(mockDb.invoices.filter(i => i.tenantId === 'default'));
            console.log('Database seeded: Invoices.');
        }

        // Quotations — scoped to default tenant
        const quotationCount = await Quotation.countDocuments({ tenantId: 'default' });
        if (quotationCount === 0) {
            await Quotation.insertMany(mockDb.quotations.filter(q => q.tenantId === 'default'));
            console.log('Database seeded: Quotations.');
        }

        // Expenses — scoped to default tenant
        const expenseCount = await Expense.countDocuments({ tenantId: 'default' });
        if (expenseCount === 0) {
            await Expense.insertMany(mockDb.expenses.filter(e => e.tenantId === 'default'));
            console.log('Database seeded: Expenses.');
        }

        // Assets — scoped to default tenant
        const assetCount = await Asset.countDocuments({ tenantId: 'default' });
        if (assetCount === 0) {
            await Asset.insertMany(mockDb.assets.filter(a => a.tenantId === 'default'));
            console.log('Database seeded: Assets.');
        }

        // Customers — scoped to default tenant
        const customerCount = await Customer.countDocuments({ tenantId: 'default' });
        if (customerCount === 0) {
            await Customer.insertMany(mockDb.customers.filter(c => c.tenantId === 'default'));
            console.log('Database seeded: Customers.');
        }

        // Employees — scoped to default tenant
        const employeeCount = await Employee.countDocuments({ tenantId: 'default' });
        if (employeeCount === 0) {
            await Employee.insertMany(mockDb.employees.filter(e => e.tenantId === 'default'));
            console.log('Database seeded: Employees.');
        }

        // Suppliers — scoped to default tenant
        const supplierCount = await Supplier.countDocuments({ tenantId: 'default' });
        if (supplierCount === 0) {
            await Supplier.insertMany(mockDb.suppliers.filter(s => s.tenantId === 'default'));
            console.log('Database seeded: Suppliers.');
        }

        // Orders — scoped to default tenant
        const orderCount = await Order.countDocuments({ tenantId: 'default' });
        if (orderCount === 0) {
            await Order.insertMany(mockDb.orders.filter(o => o.tenantId === 'default'));
            console.log('Database seeded: Orders.');
        }
    } catch (err) {
        console.error('Error seeding database:', err.message);
    }
}


// AUTH MIDDLEWARE
// ----------------------------------------------------
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: 'Access token required' });
    
    jwt.verify(token, JWT_SECRET, async (err, user) => {
        if (err) return res.status(403).json({ error: 'Token expired or invalid' });
        
        const tenantId = getTenantId(req);
        if (user.tenantId !== tenantId) {
            return res.status(403).json({ error: 'Tenant access mismatch' });
        }
        
        // --- License Validation Check ---
        if (tenantId !== 'default' && tenantId !== 'demo') {
            let tenantSettings;
            if (isMongoConnected) {
                tenantSettings = await Settings.findOne({ tenantId });
            } else {
                tenantSettings = mockDb.settingsTenant[tenantId];
            }
            
            if (tenantSettings && tenantSettings.licenseExpiresAt) {
                if (new Date() > new Date(tenantSettings.licenseExpiresAt)) {
                    return res.status(403).json({ error: 'LICENSE_EXPIRED', message: 'Your store license has expired. Please renew your subscription.' });
                }
            }
        }
        // --------------------------------
        
        req.user = user;
        next();
    });
}

// ----------------------------------------------------
// CRYPTOGRAPHIC SHA-256 IN NODE
// ----------------------------------------------------
const crypto = require('crypto');
function sha256Node(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}
function signHashNode(hashHex) {
    const hash = crypto.createHash('sha256').update(hashHex + 'KamySoftPrivateKeySecp256k1_2026').digest('base64');
    return hash;
}

// Generate ZATCA UBL 2.1 XML
function generateZATCAXML(invoice, settings) {
    const datePart = invoice.date.split(' ')[0];
    const timePart = invoice.date.split(' ')[1] ? invoice.date.split(' ')[1] + ":00" : "12:00:00";
    
    let itemsXML = "";
    invoice.items.forEach((item, index) => {
        const itemTax = (item.price * item.qty) * (settings.taxRate / 100);
        const itemLineTotal = (item.price * item.qty) + itemTax;
        itemsXML += `    <cac:InvoiceLine>
        <cbc:ID>${index + 1}</cbc:ID>
        <cbc:InvoicedQuantity unitCode="PCE">${item.qty}</cbc:InvoicedQuantity>
        <cbc:LineExtensionAmount currencyID="SAR">${(item.price * item.qty).toFixed(2)}</cbc:LineExtensionAmount>
        <cac:TaxTotal>
            <cbc:TaxAmount currencyID="SAR">${itemTax.toFixed(2)}</cbc:TaxAmount>
            <cbc:RoundingAmount currencyID="SAR">${itemLineTotal.toFixed(2)}</cbc:RoundingAmount>
        </cac:TaxTotal>
        <cac:Item>
            <cbc:Name>${item.name}</cbc:Name>
            <cac:ClassifiedTaxCategory>
                <cbc:ID>S</cbc:ID>
                <cbc:Percent>${settings.taxRate}</cbc:Percent>
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:ClassifiedTaxCategory>
        </cac:Item>
        <cac:Price>
            <cbc:PriceAmount currencyID="SAR">${item.price.toFixed(2)}</cbc:PriceAmount>
        </cac:Price>
    </cac:InvoiceLine>\n`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" 
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" 
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
    <cbc:ProfileID>urn:fdc:zatca.gov.sa:invoice:r1:20210729</cbc:ProfileID>
    <cbc:ID>${invoice.id}</cbc:ID>
    <cbc:UUID>${invoice.uuid}</cbc:UUID>
    <cbc:IssueDate>${datePart}</cbc:IssueDate>
    <cbc:IssueTime>${timePart}</cbc:IssueTime>
    <cbc:InvoiceTypeCode name="0111000">388</cbc:InvoiceTypeCode>
    <cbc:DocumentCurrencyCode>SAR</cbc:DocumentCurrencyCode>
    <cbc:TaxCurrencyCode>SAR</cbc:TaxCurrencyCode>
    <cac:AdditionalDocumentReference>
        <cbc:ID>PIH</cbc:ID>
        <cac:Attachment>
            <cbc:EmbeddedDocumentBinaryObject mimeCode="text/plain">${invoice.pih}</cbc:EmbeddedDocumentBinaryObject>
        </cac:Attachment>
    </cac:AdditionalDocumentReference>
    <cac:AdditionalDocumentReference>
        <cbc:ID>ICV</cbc:ID>
        <cbc:UUID>${invoice.csn}</cbc:UUID>
    </cac:AdditionalDocumentReference>
    <cac:AccountingSupplierParty>
        <cac:Party>
            <cac:PartyIdentification>
                <cbc:ID schemeID="CRN">1010123456</cbc:ID>
            </cac:PartyIdentification>
            <cac:PostalAddress>
                <cbc:StreetName>Olaya St</cbc:StreetName>
                <cbc:BuildingNumber>1234</cbc:BuildingNumber>
                <cbc:CitySubdivisionName>Al-Olaya</cbc:CitySubdivisionName>
                <cbc:CityName>Riyadh</cbc:CityName>
                <cbc:PostalZone>12211</cbc:PostalZone>
                <cac:Country>
                    <cbc:IdentificationCode>SA</cbc:IdentificationCode>
                </cac:Country>
            </cac:PostalAddress>
            <cac:PartyTaxScheme>
                <cbc:CompanyID>${settings.vatNumber}</cbc:CompanyID>
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:PartyTaxScheme>
            <cac:PartyLegalEntity>
                <cbc:RegistrationName>${settings.businessName}</cbc:RegistrationName>
            </cac:PartyLegalEntity>
        </cac:Party>
    </cac:AccountingSupplierParty>
    <cac:AccountingCustomerParty>
        <cac:Party>
            <cac:PartyLegalEntity>
                <cbc:RegistrationName>${invoice.customer}</cbc:RegistrationName>
            </cac:PartyLegalEntity>
        </cac:Party>
    </cac:AccountingCustomerParty>
    <cac:TaxTotal>
        <cbc:TaxAmount currencyID="SAR">${invoice.vat.toFixed(2)}</cbc:TaxAmount>
    </cac:TaxTotal>
    <cac:LegalMonetaryTotal>
        <cbc:LineExtensionAmount currencyID="SAR">${(invoice.total - invoice.vat).toFixed(2)}</cbc:LineExtensionAmount>
        <cbc:TaxExclusiveAmount currencyID="SAR">${(invoice.total - invoice.vat).toFixed(2)}</cbc:TaxExclusiveAmount>
        <cbc:TaxInclusiveAmount currencyID="SAR">${invoice.total.toFixed(2)}</cbc:TaxInclusiveAmount>
        <cbc:PayableAmount currencyID="SAR">${invoice.total.toFixed(2)}</cbc:PayableAmount>
    </cac:LegalMonetaryTotal>
${itemsXML}</Invoice>`;

    return xml.trim();
}

// Initialize seed invoices with ZATCA metadata
if (mockDb.invoices.length === 0) {
    const seed1 = { id: 'INV-1001', date: '2026-06-24 10:30', customer: 'Walk-in Customer / عميل نقدي', items: [{ id: '1001', name: 'شاشة ذكية فاخرة 27 بوصة', price: 950, qty: 1 }], total: 1092.5, vat: 142.5, discount: 0 };
    const seed2 = { id: 'INV-1002', date: '2026-06-24 11:15', customer: 'Khalil Al-Ghamdi', items: [{ id: '1002', name: 'قارئ باركود لاسلكي ليزري', price: 250, qty: 2 }], total: 575, vat: 75, discount: 0 };
    
    [seed1, seed2].forEach((inv, index) => {
        inv.uuid = crypto.randomUUID();
        inv.csn = index + 1;
        inv.pih = "NWZlY2Q1Y2QyODgyY2NmYTE5YTY1ODIzMDYyMzA5MTRmYmJhYmQ2YmQxMTBiYTkyYTk4YmM0ZTc0Y2Y5MmQ2ZQ==";
        inv.xml = generateZATCAXML(inv, mockDb.settings);
        inv.xmlHash = sha256Node(inv.xml);
        inv.xmlHashBase64 = Buffer.from(inv.xmlHash, 'hex').toString('base64');
        inv.signature = signHashNode(inv.xmlHash);
        inv.publicKey = "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEbE08C8wK7zH6r2wR3pS1a1gD4o6H4L8T1F3E2W1Q2A3B4C5D6E7F8G9H0I1J2K3L4M5N6O7P8Q9R0S1T2U3V4W5X6Y7Z==";
        inv.certSignature = "MEQCIDz/R+x6T/T42/yvF1w67r81m4F/X27+z36/S/23s/Y1AiAC/S/z8E8r6Q81/t23/9+x7r23/X71/+1287/r+x612w==";
        inv.zatcaStatus = 'PENDING';
        mockDb.invoices.push(inv);
    });
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// AUTHENTICATION
const defaultProductsBySector = {
    appliances: [
        { nameEN: 'Smart Split AC 18000 BTU', nameAR: 'مكيف سبليت ذكي 18000 وحدة', price: 2400, cost: 1700, stock: 10, category: 'appliances', emoji: '❄️', barcode: '728100100010' },
        { nameEN: 'Double Door Refrigerator 450L', nameAR: 'ثلاجة دولابي 450 لتر', price: 3500, cost: 2600, stock: 5, category: 'appliances', emoji: '🎛️', barcode: '728100100011' },
        { nameEN: 'Fully Automatic Washing Machine', nameAR: 'غسالة ملابس أوتوماتيكية بالكامل', price: 1800, cost: 1300, stock: 8, category: 'appliances', emoji: '🧺', barcode: '728100100012' },
        { nameEN: 'Digital Microwave Oven 30L', nameAR: 'ميكروويف رقمي 30 لتر', price: 450, cost: 310, stock: 15, category: 'appliances', emoji: '🍳', barcode: '728100100013' }
    ],
    furniture: [
        { nameEN: 'Luxury L-Shape Sofa Set', nameAR: 'طقم كنب فاخر على شكل حرف L', price: 4500, cost: 3200, stock: 4, category: 'furniture', emoji: '🛋️', barcode: '728200100020' },
        { nameEN: 'King Size Bed Frame with Headboard', nameAR: 'سرير مقاس كينج خشبي فخم', price: 2800, cost: 1900, stock: 6, category: 'furniture', emoji: '🛏️', barcode: '728200100021' },
        { nameEN: 'Solid Oak Dining Table (6 Chairs)', nameAR: 'طاولة طعام خشب بلوط مع 6 كراسي', price: 3200, cost: 2200, stock: 3, category: 'furniture', emoji: '🪑', barcode: '728200100022' },
        { nameEN: 'Modern Wooden Coffee Table', nameAR: 'طاولة قهوة خشبية مودرن', price: 650, cost: 420, stock: 12, category: 'furniture', emoji: '☕', barcode: '728200100023' }
    ],
    spareparts: [
        { nameEN: 'Brake Pad Set (Front)', nameAR: 'قماش فرامل أمامي', price: 180, cost: 120, stock: 25, category: 'spareparts', emoji: '🚗', barcode: '728300100030' },
        { nameEN: 'Engine Oil Filter (Synthetic)', nameAR: 'فلتر زيت محرك تخليقي', price: 35, cost: 20, stock: 60, category: 'spareparts', emoji: '🛢️', barcode: '728300100031' },
        { nameEN: 'Copper Plumbing Elbow 1/2"', nameAR: 'كوع نحاس للسباكة 1/2 بوصة', price: 12, cost: 7, stock: 150, category: 'spareparts', emoji: '🔧', barcode: '728300100032' },
        { nameEN: 'Heavy Duty HVAC Capacitor 45uF', nameAR: 'كابستور مكيف شديد التحمل 45 ميكرو', price: 45, cost: 25, stock: 40, category: 'spareparts', emoji: '⚡', barcode: '728300100033' },
        { nameEN: 'LED Circuit Board Panel', nameAR: 'لوحة دارة إلكترونية LED', price: 95, cost: 60, stock: 20, category: 'spareparts', emoji: '🔌', barcode: '728300100034' }
    ],
    retail: [
        { nameEN: 'Premium Smart Monitor 27"', nameAR: 'شاشة ذكية فاخرة 27 بوصة', price: 950, cost: 650, stock: 12, category: 'electronics', emoji: '🖥️', barcode: '628100100010' },
        { nameEN: 'Wireless Laser Scanner', nameAR: 'قارئ باركود لاسلكي ليزري', price: 250, cost: 170, stock: 8, category: 'electronics', emoji: '🔦', barcode: '628100200020' },
        { nameEN: 'Leather Executive Chair', nameAR: 'كرسي مكتب جلد فخم', price: 420, cost: 280, stock: 4, category: 'office', emoji: '💺', barcode: '628100400040' }
    ]
};

// Function to update Cloudflare Zero Trust Tunnel configuration dynamically
async function updateCloudflareTunnelConfig(tenantDomain) {
    const cfAccountId = process.env.CF_ACCOUNT_ID;
    const cfTunnelId = process.env.CF_TUNNEL_ID;
    const cfApiToken = process.env.CF_API_TOKEN;

    if (!cfAccountId || !cfTunnelId || !cfApiToken) {
        console.warn('Cloudflare credentials missing. Skipping Tunnel update.');
        return;
    }

    try {
        const headers = {
            'Authorization': `Bearer ${cfApiToken}`,
            'Content-Type': 'application/json'
        };

        // 1. Get Zone ID for the base domain
        const baseDomain = tenantDomain.split('.').slice(1).join('.');
        let cfZoneId = null;
        
        const zoneRes = await fetch(`https://api.cloudflare.com/client/v4/zones?name=${baseDomain}`, { headers });
        const zoneData = await zoneRes.json();
        
        if (zoneData.success && zoneData.result.length > 0) {
            cfZoneId = zoneData.result[0].id;
        } else {
            console.error('Failed to fetch Zone ID for', baseDomain, zoneData.errors);
        }

        // 2. Create DNS CNAME record for the tenant
        if (cfZoneId) {
            const dnsPayload = {
                type: 'CNAME',
                name: tenantDomain,
                content: `${cfTunnelId}.cfargotunnel.com`,
                ttl: 1, // Auto
                proxied: true
            };
            
            const dnsRes = await fetch(`https://api.cloudflare.com/client/v4/zones/${cfZoneId}/dns_records`, {
                method: 'POST',
                headers,
                body: JSON.stringify(dnsPayload)
            });
            const dnsData = await dnsRes.json();
            
            if (dnsData.success) {
                console.log(`Successfully created CNAME record for ${tenantDomain}`);
            } else {
                // If it already exists, that's fine (code 81053)
                const exists = dnsData.errors.some(e => e.code === 81053 || e.message.includes('already exists'));
                if (exists) {
                    console.log(`CNAME record for ${tenantDomain} already exists.`);
                } else {
                    console.error('Failed to create CNAME record:', dnsData.errors);
                }
            }
        }

        // 3. Fetch existing Tunnel configuration
        const url = `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/cfd_tunnel/${cfTunnelId}/configurations`;
        const fetchResponse = await fetch(url, { headers });
        const fetchData = await fetchResponse.json();

        if (!fetchData.success) {
            console.error('Failed to fetch CF Tunnel config:', fetchData.errors);
            return;
        }

        const config = fetchData.result.config;
        if (!config || !config.ingress) {
            console.error('CF Tunnel config is malformed.');
            return;
        }

        // 4. Check if route already exists in Tunnel
        const routeExists = config.ingress.some(route => route.hostname === tenantDomain);
        if (routeExists) {
            console.log(`Route for ${tenantDomain} already exists in Cloudflare Tunnel.`);
            return;
        }

        // 5. Add new route to Tunnel
        const newRoute = {
            hostname: tenantDomain,
            service: "http://127.0.0.1:30184"
        };
        
        // Find index of catch-all rule to insert before it
        const catchAllIndex = config.ingress.findIndex(route => !route.hostname || route.service === 'http_status:404');
        if (catchAllIndex !== -1) {
            config.ingress.splice(catchAllIndex, 0, newRoute);
        } else {
            config.ingress.push(newRoute);
        }

        // 6. Update the Tunnel configuration
        const updateResponse = await fetch(url, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ config })
        });
        const updateData = await updateResponse.json();

        if (updateData.success) {
            console.log(`Successfully added Cloudflare Tunnel route for ${tenantDomain}`);
        } else {
            console.error('Failed to update CF Tunnel config:', updateData.errors);
        }
    } catch (err) {
        console.error('Error updating Cloudflare Tunnel:', err);
    }
}


const apiRoutes = require('./routes/api');
app.use('/', apiRoutes);

const frontendBuild = path.join(__dirname, 'frontend', 'dist');
app.use(express.static(frontendBuild));

app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuild, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`KamySoft POS & ERP server running on http://localhost:${PORT}`);
});
