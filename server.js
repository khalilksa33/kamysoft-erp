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

const sendLicenseEmail = async (tenantEmail, tenantId, businessName, licenseKey, expiresAt) => {
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
                <p>Your store has been successfully created. You can access it at: <b>https://${tenantId}.26i.uk</b></p>
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
    let match = host.match(/^([a-zA-Z0-9-]+)\.26i\.uk$/);
    if (match && match[1] !== 'www' && match[1] !== 'demo') return match[1];
    
    match = host.match(/^([a-zA-Z0-9-]+)\.localhost$/);
    if (match && match[1] !== 'www' && match[1] !== 'demo') return match[1];
    
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
const userSchema = new mongoose.Schema({
    id: { type: String, required: true },
    username: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true },
    tenantId: { type: String, default: 'default', index: true }
});
userSchema.index({ id: 1, tenantId: 1 }, { unique: true });
userSchema.index({ username: 1, tenantId: 1 }, { unique: true });
const User = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
    id: { type: String, required: true },
    nameEN: { type: String, required: true },
    nameAR: { type: String, required: true },
    price: { type: Number, required: true },
    cost: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    emoji: { type: String },
    barcode: { type: String },
    tenantId: { type: String, default: 'default', index: true }
});
productSchema.index({ id: 1, tenantId: 1 }, { unique: true });
const Product = mongoose.model('Product', productSchema);

const invoiceItemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true }
});
const invoiceSchema = new mongoose.Schema({
    id: { type: String, required: true },
    uuid: { type: String, required: true },
    csn: { type: Number, required: true },
    pih: { type: String, required: true },
    xmlHashBase64: { type: String },
    xmlHash: { type: String },
    xml: { type: String },
    signature: { type: String },
    publicKey: { type: String },
    certSignature: { type: String },
    customer: { type: String, required: true },
    items: [invoiceItemSchema],
    discount: { type: Number, default: 0 },
    vat: { type: Number, required: true },
    total: { type: Number, required: true },
    date: { type: String, required: true },
    zatcaStatus: { type: String, required: true },
    tenantId: { type: String, default: 'default', index: true }
});
invoiceSchema.index({ id: 1, tenantId: 1 }, { unique: true });
const Invoice = mongoose.model('Invoice', invoiceSchema);

const quotationItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true }
});
const quotationSchema = new mongoose.Schema({
    id: { type: String, required: true },
    date: { type: String, required: true },
    customer: { type: String, required: true },
    items: [quotationItemSchema],
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    vat: { type: Number, required: true },
    tenantId: { type: String, default: 'default', index: true }
});
quotationSchema.index({ id: 1, tenantId: 1 }, { unique: true });
const Quotation = mongoose.model('Quotation', quotationSchema);

const expenseSchema = new mongoose.Schema({
    id: { type: String, required: true },
    date: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    tenantId: { type: String, default: 'default', index: true }
});
expenseSchema.index({ id: 1, tenantId: 1 }, { unique: true });
const Expense = mongoose.model('Expense', expenseSchema);

const assetSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    cost: { type: Number, required: true },
    salvage: { type: Number, default: 0 },
    life: { type: Number, required: true },
    date: { type: String, required: true },
    status: { type: String, required: true },
    department: { type: String, required: true },
    serial: { type: String },
    supplier: { type: String },
    assignedTo: { type: String },
    tenantId: { type: String, default: 'default', index: true }
});
assetSchema.index({ id: 1, tenantId: 1 }, { unique: true });
const Asset = mongoose.model('Asset', assetSchema);

const customerSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    points: { type: Number, default: 0 },
    spent: { type: Number, default: 0 },
    tenantId: { type: String, default: 'default', index: true }
});
customerSchema.index({ id: 1, tenantId: 1 }, { unique: true });
const Customer = mongoose.model('Customer', customerSchema);

const employeeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    dept: { type: String, required: true },
    tenantId: { type: String, default: 'default', index: true }
});
employeeSchema.index({ id: 1, tenantId: 1 }, { unique: true });
const Employee = mongoose.model('Employee', employeeSchema);

const supplierSchema = new mongoose.Schema({
    id: { type: String, required: true },
    company: { type: String, required: true },
    contact: { type: String },
    phone: { type: String },
    items: { type: String },
    tenantId: { type: String, default: 'default', index: true }
});
supplierSchema.index({ id: 1, tenantId: 1 }, { unique: true });
const Supplier = mongoose.model('Supplier', supplierSchema);

const orderSchema = new mongoose.Schema({
    id: { type: String, required: true },
    date: { type: String, required: true },
    customer: { type: String, required: true },
    items: { type: String, required: true },
    total: { type: Number, required: true },
    status: { type: String, required: true },
    tenantId: { type: String, default: 'default', index: true }
});
orderSchema.index({ id: 1, tenantId: 1 }, { unique: true });
const Order = mongoose.model('Order', orderSchema);

const settingsSchema = new mongoose.Schema({
    tenantId: { type: String, default: 'default', index: true, unique: true },
    businessName: { type: String, required: true },
    vatNumber: { type: String, required: true },
    taxRate: { type: Number, required: true },
    baseCurrency: { type: String, required: true },
    businessAddress: { type: String },
    crNumber: { type: String },
    contactNumber: { type: String },
    exchangeRates: {
        type: Map,
        of: Number
    },
    branches: [
        {
            name: String,
            address: String,
            phone: String
        }
    ],
    currentBranch: { type: String, default: 'Main Branch - Riyadh' },
    businessType: { type: String, default: 'retail' },
    enableTables: { type: Boolean, default: false },
    enableServiceDuration: { type: Boolean, default: false },
    
    // SaaS Registration Details
    email: { type: String },
    fullName: { type: String },
    mobile: { type: String },
    nationalAddress: { type: String },
    
    // License Tracking
    licenseKey: { type: String },
    licenseStatus: { type: String, default: 'active' }, // 'active', 'expired'
    licenseExpiresAt: { type: Date }
});
const Settings = mongoose.model('Settings', settingsSchema);

const inquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    businessName: { type: String },
    businessType: { type: String },
    branches: { type: Number, default: 1 },
    message: { type: String },
    createdAt: { type: Date, default: Date.now }
});
const Inquiry = mongoose.model('Inquiry', inquirySchema);

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

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const tenantId = getTenantId(req);
        let user;
        if (isMongoConnected) {
            user = await User.findOne({ username, tenantId });
        } else {
            user = mockDb.users.find(u => u.username === username && u.tenantId === tenantId);
        }
        
        if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role, tenantId }, JWT_SECRET, { expiresIn: '12h' });
        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/register-tenant', async (req, res) => {
    try {
        const { tenantId, businessName, businessType, adminUsername, adminPassword, email, mobile, nationalAddress, vatNumber, crNumber, billingCycle, fullName } = req.body;
        
        if (!tenantId || !businessName || !businessType || !adminUsername || !adminPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        // Normalize tenantId (lowercase alphanumeric and dash only)
        const normalizedTenantId = tenantId.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
        if (!normalizedTenantId) {
            return res.status(400).json({ error: 'Invalid subdomain format' });
        }
        
        // Check uniqueness of tenantId
        if (isMongoConnected) {
            const existingSettings = await Settings.findOne({ tenantId: normalizedTenantId });
            if (existingSettings) {
                return res.status(400).json({ error: 'Store subdomain is already registered' });
            }
        } else {
            if (mockDb.settingsTenant && mockDb.settingsTenant[normalizedTenantId]) {
                return res.status(400).json({ error: 'Store subdomain is already registered' });
            }
        }
        
        // Generate License Key & Expiration
        const crypto = require('crypto');
        const licenseKey = 'SME-' + crypto.randomUUID().toUpperCase().split('-').slice(1, 4).join('-');
        
        // Expiration Logic (Monthly vs Yearly)
        const expirationDate = new Date();
        if (billingCycle === 'yearly') {
            expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        } else {
            expirationDate.setMonth(expirationDate.getMonth() + 1);
        }

        // 1. Create Tenant-Specific Settings
        const settingsData = {
            tenantId: normalizedTenantId,
            businessName: businessName,
            businessType: businessType,
            vatNumber: vatNumber || '310' + Math.floor(100000000000 + Math.random() * 900000000000).toString(),
            taxRate: 15,
            baseCurrency: 'SAR',
            businessAddress: nationalAddress || 'Saudi Arabia / المملكة العربية السعودية',
            crNumber: crNumber || Math.floor(1010000000 + Math.random() * 900000000).toString(),
            contactNumber: mobile || '+966 50 000 0000',
            exchangeRates: { SAR: 1, USD: 0.27, EUR: 0.25, EGP: 12.8, AED: 0.99 },
            branches: [{ name: 'Main Branch', address: 'Main St', phone: mobile || '+966 50 000 0000' }],
            currentBranch: 'Main Branch',
            enableTables: businessType === 'restaurant',
            enableServiceDuration: businessType === 'salon',
            email: email,
            fullName: fullName,
            mobile: mobile,
            nationalAddress: nationalAddress,
            licenseKey: licenseKey,
            licenseStatus: 'active',
            licenseExpiresAt: expirationDate
        };
        
        if (isMongoConnected) {
            await Settings.create(settingsData);
        } else {
            if (!mockDb.settingsTenant) {
                mockDb.settingsTenant = { 'default': { ...mockDb.settings, tenantId: 'default' } };
            }
            mockDb.settingsTenant[normalizedTenantId] = settingsData;
        }
        
        // 2. Create Tenant-Specific Admin User
        const passwordHash = bcrypt.hashSync(adminPassword, 10);
        const adminUser = {
            id: 'u-' + Date.now().toString(),
            username: adminUsername,
            passwordHash,
            role: 'Admin',
            tenantId: normalizedTenantId
        };
        
        if (isMongoConnected) {
            await User.create(adminUser);
        } else {
            mockDb.users.push(adminUser);
        }
        
        // 3. Seed initial products based on businessType
        const productsToSeed = defaultProductsBySector[businessType] || defaultProductsBySector.retail;
        const seedBase = Date.now();
        const seedProducts = productsToSeed.map((p, idx) => ({
            id: `${normalizedTenantId}-p${seedBase + idx}`,
            nameEN: p.nameEN,
            nameAR: p.nameAR,
            price: p.price,
            cost: p.cost,
            stock: p.stock,
            category: p.category,
            emoji: p.emoji,
            barcode: p.barcode,
            tenantId: normalizedTenantId
        }));
        
        if (isMongoConnected) {
            await Product.insertMany(seedProducts);
        } else {
            mockDb.products.push(...seedProducts);
        }
        
        // Send email asynchronously (don't block the response)
        if (email) {
            sendLicenseEmail(email, normalizedTenantId, businessName, licenseKey, expirationDate);
        }
        
        res.status(201).json({ 
            success: true, 
            tenantId: normalizedTenantId,
            licenseKey: licenseKey 
        });
    } catch (err) {
        console.error('Error registering tenant:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
    res.json(req.user);
});

// PUBLIC INQUIRIES & DEMO REQUESTS
app.post('/api/inquiries', async (req, res) => {
    try {
        const { name, email, phone, businessName, businessType, branches, message } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and Email are required.' });
        }
        const inquiryData = {
            name,
            email,
            phone: phone || '',
            businessName: businessName || '',
            businessType: businessType || 'retail',
            branches: Number(branches) || 1,
            message: message || '',
            createdAt: new Date()
        };

        if (isMongoConnected) {
            const inquiry = new Inquiry(inquiryData);
            await inquiry.save();
        } else {
            mockDb.inquiries = mockDb.inquiries || [];
            mockDb.inquiries.push({ id: String(mockDb.inquiries.length + 1), ...inquiryData });
            console.log('In-memory Mock Inquiry Saved:', inquiryData);
        }
        res.status(201).json({ success: true, message: 'Inquiry submitted successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/inquiries', authenticateToken, async (req, res) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Forbidden' });
    try {
        if (isMongoConnected) {
            const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
            res.json(inquiries);
        } else {
            res.json(mockDb.inquiries || []);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SETTINGS & MULTI-CURRENCY
// SETTINGS & MULTI-CURRENCY
app.get('/api/settings', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (isMongoConnected) {
            let settings = await Settings.findOne({ tenantId });
            if (!settings) {
                if (tenantId === 'default') {
                    settings = await Settings.create({ ...mockDb.settings, tenantId: 'default' });
                } else {
                    settings = await Settings.create({
                        tenantId,
                        businessName: `${tenantId.toUpperCase()} Store`,
                        vatNumber: '310' + Math.floor(100000000000 + Math.random() * 900000000000).toString(),
                        taxRate: 15,
                        baseCurrency: 'SAR',
                        businessAddress: 'Saudi Arabia / المملكة العربية السعودية',
                        crNumber: Math.floor(1010000000 + Math.random() * 900000000).toString(),
                        contactNumber: '+966 50 000 0000',
                        exchangeRates: { SAR: 1, USD: 0.27, EUR: 0.25, EGP: 12.8, AED: 0.99 },
                        branches: [{ name: 'Main Branch', address: 'Main St', phone: '+966 50 000 0000' }],
                        currentBranch: 'Main Branch',
                        businessType: 'retail'
                    });
                }
            }
            res.json(settings);
        } else {
            if (!mockDb.settingsTenant) {
                mockDb.settingsTenant = { 'default': { ...mockDb.settings, tenantId: 'default' } };
            }
            if (!mockDb.settingsTenant[tenantId]) {
                mockDb.settingsTenant[tenantId] = {
                    tenantId,
                    businessName: `${tenantId.toUpperCase()} Store`,
                    vatNumber: '310' + Math.floor(100000000000 + Math.random() * 900000000000).toString(),
                    taxRate: 15,
                    baseCurrency: 'SAR',
                    businessAddress: 'Saudi Arabia / المملكة العربية السعودية',
                    crNumber: Math.floor(1010000000 + Math.random() * 900000000).toString(),
                    contactNumber: '+966 50 000 0000',
                    exchangeRates: { SAR: 1, USD: 0.27, EUR: 0.25, EGP: 12.8, AED: 0.99 },
                    branches: [{ name: 'Main Branch', address: 'Main St', phone: '+966 50 000 0000' }],
                    currentBranch: 'Main Branch',
                    businessType: 'retail'
                };
            }
            res.json(mockDb.settingsTenant[tenantId]);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/settings', authenticateToken, async (req, res) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Forbidden' });
    try {
        const tenantId = getTenantId(req);
        if (isMongoConnected) {
            let settings = await Settings.findOne({ tenantId });
            if (settings) {
                Object.assign(settings, req.body);
                await settings.save();
            } else {
                settings = new Settings({ ...req.body, tenantId });
                await settings.save();
            }
            res.json(settings);
        } else {
            if (!mockDb.settingsTenant) {
                mockDb.settingsTenant = { 'default': { ...mockDb.settings, tenantId: 'default' } };
            }
            mockDb.settingsTenant[tenantId] = { ...mockDb.settingsTenant[tenantId], ...req.body, tenantId };
            res.json(mockDb.settingsTenant[tenantId]);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PRODUCTS / INVENTORY
app.get('/api/products', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (isMongoConnected) {
            const products = await Product.find({ tenantId });
            res.json(products);
        } else {
            const products = mockDb.products.filter(p => p.tenantId === tenantId);
            res.json(products);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/products', authenticateToken, async (req, res) => {
    if (req.user.role === 'Cashier') return res.status(403).json({ error: 'Forbidden' });
    try {
        const tenantId = getTenantId(req);
        if (isMongoConnected) {
            const count = await Product.countDocuments({ tenantId });
            const product = new Product({
                ...req.body,
                id: req.body.id || (1000 + count + 1).toString(),
                tenantId
            });
            await product.save();
            res.json(product);
        } else {
            const product = { ...req.body, id: req.body.id || (1000 + mockDb.products.length + 1).toString(), tenantId };
            mockDb.products.push(product);
            res.json(product);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
    if (req.user.role === 'Cashier') return res.status(403).json({ error: 'Forbidden' });
    try {
        const tenantId = getTenantId(req);
        if (isMongoConnected) {
            const product = await Product.findOneAndUpdate({ id: req.params.id, tenantId }, req.body, { new: true });
            if (!product) return res.status(404).json({ error: 'Product not found' });
            res.json(product);
        } else {
            const idx = mockDb.products.findIndex(p => p.id === req.params.id && p.tenantId === tenantId);
            if (idx === -1) return res.status(404).json({ error: 'Product not found' });
            mockDb.products[idx] = { ...mockDb.products[idx], ...req.body, tenantId };
            res.json(mockDb.products[idx]);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
    if (req.user.role === 'Cashier') return res.status(403).json({ error: 'Forbidden' });
    try {
        const tenantId = getTenantId(req);
        if (isMongoConnected) {
            const result = await Product.findOneAndDelete({ id: req.params.id, tenantId });
            if (!result) return res.status(404).json({ error: 'Product not found' });
            res.sendStatus(204);
        } else {
            const originalLength = mockDb.products.length;
            mockDb.products = mockDb.products.filter(p => !(p.id === req.params.id && p.tenantId === tenantId));
            if (mockDb.products.length === originalLength) return res.status(404).json({ error: 'Product not found' });
            res.sendStatus(204);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// INVOICES & ZATCA PORTAL
app.get('/api/invoices', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (isMongoConnected) {
            const invoices = await Invoice.find({ tenantId });
            res.json(invoices);
        } else {
            const invoices = mockDb.invoices.filter(i => i.tenantId === tenantId);
            res.json(invoices);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/invoices', authenticateToken, async (req, res) => {
    const invoice = req.body;
    invoice.id = `INV-${Date.now().toString().slice(-6)}`;
    invoice.uuid = crypto.randomUUID();
    const tenantId = getTenantId(req);
    invoice.tenantId = tenantId;
    
    try {
        if (isMongoConnected) {
            const count = await Invoice.countDocuments({ tenantId });
            invoice.csn = count + 1;
            
            let pih = "NWZlY2Q1Y2QyODgyY2NmYTE5YTY1ODIzMDYyMzA5MTRmYmJhYmQ2YmQxMTBiYTkyYTk4YmM0ZTc0Y2Y5MmQ2ZQ==";
            const lastInvs = await Invoice.find({ tenantId }).sort({ csn: -1 }).limit(1);
            if (lastInvs.length > 0 && lastInvs[0].xmlHashBase64) {
                pih = lastInvs[0].xmlHashBase64;
            }
            invoice.pih = pih;

            let settings = await Settings.findOne({ tenantId });
            if (!settings) settings = mockDb.settings;

            invoice.xml = generateZATCAXML(invoice, settings);
            invoice.xmlHash = sha256Node(invoice.xml);
            invoice.xmlHashBase64 = Buffer.from(invoice.xmlHash, 'hex').toString('base64');
            invoice.signature = signHashNode(invoice.xmlHash);
            invoice.publicKey = "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEbE08C8wK7zH6r2wR3pS1a1gD4o6H4L8T1F3E2W1Q2A3B4C5D6E7F8G9H0I1J2K3L4M5N6O7P8Q9R0S1T2U3V4W5X6Y7Z==";
            invoice.certSignature = "MEQCIDz/R+x6T/T42/yvF1w67r81m4F/X27+z36/S/23s/Y1AiAC/S/z8E8r6Q81/t23/9+x7r23/X71/+1287/r+x612w==";
            invoice.zatcaStatus = 'PENDING';

            const newInvoice = new Invoice(invoice);
            await newInvoice.save();
            
            // Deduct stock
            for (const item of invoice.items) {
                const prod = await Product.findOne({ id: item.id, tenantId });
                if (prod) {
                    prod.stock = Math.max(0, prod.stock - item.qty);
                    await prod.save();
                }
            }

            res.json(newInvoice);
        } else {
            const tenantInvs = mockDb.invoices.filter(i => i.tenantId === tenantId);
            invoice.csn = tenantInvs.length + 1;
            
            let pih = "NWZlY2Q1Y2QyODgyY2NmYTE5YTY1ODIzMDYyMzA5MTRmYmJhYmQ2YmQxMTBiYTkyYTk4YmM0ZTc0Y2Y5MmQ2ZQ==";
            if (tenantInvs.length > 0) {
                const prev = tenantInvs[tenantInvs.length - 1];
                if (prev.xmlHashBase64) pih = prev.xmlHashBase64;
            }
            invoice.pih = pih;

            const settings = (mockDb.settingsTenant && mockDb.settingsTenant[tenantId]) || mockDb.settings;
            invoice.xml = generateZATCAXML(invoice, settings);
            invoice.xmlHash = sha256Node(invoice.xml);
            invoice.xmlHashBase64 = Buffer.from(invoice.xmlHash, 'hex').toString('base64');
            invoice.signature = signHashNode(invoice.xmlHash);
            invoice.publicKey = "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEbE08C8wK7zH6r2wR3pS1a1gD4o6H4L8T1F3E2W1Q2A3B4C5D6E7F8G9H0I1J2K3L4M5N6O7P8Q9R0S1T2U3V4W5X6Y7Z==";
            invoice.certSignature = "MEQCIDz/R+x6T/T42/yvF1w67r81m4F/X27+z36/S/23s/Y1AiAC/S/z8E8r6Q81/t23/9+x7r23/X71/+1287/r+x612w==";
            invoice.zatcaStatus = 'PENDING';

            mockDb.invoices.push(invoice);
            
            // Deduct stock
            invoice.items.forEach(item => {
                const prod = mockDb.products.find(p => p.id === item.id && p.tenantId === tenantId);
                if (prod) prod.stock = Math.max(0, prod.stock - item.qty);
            });

            res.json(invoice);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/invoices/:id/zatca-report', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (isMongoConnected) {
            const invoice = await Invoice.findOneAndUpdate({ id: req.params.id, tenantId }, { zatcaStatus: 'REPORTED' }, { new: true });
            if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
            res.json(invoice);
        } else {
            const invoice = mockDb.invoices.find(i => i.id === req.params.id && i.tenantId === tenantId);
            if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
            invoice.zatcaStatus = 'REPORTED';
            res.json(invoice);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/invoices/:id/refund', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (isMongoConnected) {
            const invoice = await Invoice.findOne({ id: req.params.id, tenantId });
            if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
            if (invoice.zatcaStatus === 'REFUNDED') return res.status(400).json({ error: 'Invoice already refunded' });
            
            invoice.zatcaStatus = 'REFUNDED';
            await invoice.save();
            
            // Restore stock
            for (const item of invoice.items) {
                const prod = await Product.findOne({ id: item.id, tenantId });
                if (prod) {
                    prod.stock = prod.stock + item.qty;
                    await prod.save();
                }
            }
            res.json(invoice);
        } else {
            const invoice = mockDb.invoices.find(i => i.id === req.params.id && i.tenantId === tenantId);
            if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
            if (invoice.zatcaStatus === 'REFUNDED') return res.status(400).json({ error: 'Invoice already refunded' });
            
            invoice.zatcaStatus = 'REFUNDED';
            
            // Restore stock
            invoice.items.forEach(item => {
                const prod = mockDb.products.find(p => p.id === item.id && p.tenantId === tenantId);
                if (prod) prod.stock = prod.stock + item.qty;
            });
            res.json(invoice);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// EXPENSES
app.get('/api/expenses', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (isMongoConnected) {
            const expenses = await Expense.find({ tenantId });
            res.json(expenses);
        } else {
            const expenses = mockDb.expenses.filter(e => e.tenantId === tenantId);
            res.json(expenses);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/expenses', authenticateToken, async (req, res) => {
    if (req.user.role === 'Cashier') return res.status(403).json({ error: 'Forbidden' });
    try {
        const tenantId = getTenantId(req);
        const id = `EXP-${Date.now().toString().slice(-4)}`;
        if (isMongoConnected) {
            const expense = new Expense({ ...req.body, id, tenantId });
            await expense.save();
            res.json(expense);
        } else {
            const expense = { ...req.body, id, tenantId };
            mockDb.expenses.push(expense);
            res.json(expense);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ASSETS & DEPRECIATION
app.get('/api/assets', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (isMongoConnected) {
            const assets = await Asset.find({ tenantId });
            res.json(assets);
        } else {
            const assets = mockDb.assets.filter(a => a.tenantId === tenantId);
            res.json(assets);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/assets', authenticateToken, async (req, res) => {
    if (req.user.role === 'Cashier') return res.status(403).json({ error: 'Forbidden' });
    try {
        const tenantId = getTenantId(req);
        const id = `AST-${Date.now().toString().slice(-4)}`;
        if (isMongoConnected) {
            const asset = new Asset({ ...req.body, id, tenantId });
            await asset.save();
            res.json(asset);
        } else {
            const asset = { ...req.body, id, tenantId };
            mockDb.assets.push(asset);
            res.json(asset);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PEOPLES: CUSTOMERS & EMPLOYEES & SUPPLIERS
app.get('/api/customers', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (isMongoConnected) {
            const customers = await Customer.find({ tenantId });
            res.json(customers);
        } else {
            const customers = mockDb.customers.filter(c => c.tenantId === tenantId);
            res.json(customers);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/employees', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (isMongoConnected) {
            const employees = await Employee.find({ tenantId });
            res.json(employees);
        } else {
            const employees = mockDb.employees.filter(e => e.tenantId === tenantId);
            res.json(employees);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/suppliers', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (isMongoConnected) {
            const suppliers = await Supplier.find({ tenantId });
            res.json(suppliers);
        } else {
            const suppliers = mockDb.suppliers.filter(s => s.tenantId === tenantId);
            res.json(suppliers);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (isMongoConnected) {
            const orders = await Order.find({ tenantId });
            res.json(orders);
        } else {
            const orders = mockDb.orders.filter(o => o.tenantId === tenantId);
            res.json(orders);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/customers', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        const id = `CUST-${Date.now().toString().slice(-4)}`;
        if (isMongoConnected) {
            const cust = new Customer({ ...req.body, id, points: 0, spent: 0, tenantId });
            await cust.save();
            res.json(cust);
        } else {
            const cust = { ...req.body, id, points: 0, spent: 0, tenantId };
            mockDb.customers.push(cust);
            res.json(cust);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/suppliers', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        const id = `SUPP-${Date.now().toString().slice(-4)}`;
        if (isMongoConnected) {
            const supp = new Supplier({ ...req.body, id, tenantId });
            await supp.save();
            res.json(supp);
        } else {
            const supp = { ...req.body, id, tenantId };
            mockDb.suppliers.push(supp);
            res.json(supp);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/orders/:id', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (isMongoConnected) {
            const ord = await Order.findOneAndUpdate({ id: req.params.id, tenantId }, req.body, { new: true });
            if (!ord) return res.status(404).json({ error: 'Order not found' });
            res.json(ord);
        } else {
            const ord = mockDb.orders.find(o => o.id === req.params.id && o.tenantId === tenantId);
            if (!ord) return res.status(404).json({ error: 'Order not found' });
            ord.status = req.body.status;
            res.json(ord);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/orders', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        const id = `ORD-${Date.now().toString().slice(-4)}`;
        if (isMongoConnected) {
            const ord = new Order({ ...req.body, id, tenantId });
            await ord.save();
            res.json(ord);
        } else {
            const ord = { ...req.body, id, tenantId };
            mockDb.orders.push(ord);
            res.json(ord);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/orders/:id', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (isMongoConnected) {
            const result = await Order.findOneAndDelete({ id: req.params.id, tenantId });
            if (!result) return res.status(404).json({ error: 'Order not found' });
            res.sendStatus(204);
        } else {
            const originalLength = mockDb.orders.length;
            mockDb.orders = mockDb.orders.filter(o => !(o.id === req.params.id && o.tenantId === tenantId));
            if (mockDb.orders.length === originalLength) return res.status(404).json({ error: 'Order not found' });
            res.sendStatus(204);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// EXPENSES CRUD ADDITIONS
app.put('/api/expenses/:id', authenticateToken, async (req, res) => {
    if (req.user.role === 'Cashier') return res.status(403).json({ error: 'Forbidden' });
    try {
        const tenantId = getTenantId(req);
        if (isMongoConnected) {
            const expense = await Expense.findOneAndUpdate({ id: req.params.id, tenantId }, req.body, { new: true });
            if (!expense) return res.status(404).json({ error: 'Expense not found' });
            res.json(expense);
        } else {
            const idx = mockDb.expenses.findIndex(e => e.id === req.params.id && e.tenantId === tenantId);
            if (idx === -1) return res.status(404).json({ error: 'Expense not found' });
            mockDb.expenses[idx] = { ...mockDb.expenses[idx], ...req.body, tenantId };
            res.json(mockDb.expenses[idx]);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/expenses/:id', authenticateToken, async (req, res) => {
    if (req.user.role === 'Cashier') return res.status(403).json({ error: 'Forbidden' });
    try {
        const tenantId = getTenantId(req);
        if (isMongoConnected) {
            const result = await Expense.findOneAndDelete({ id: req.params.id, tenantId });
            if (!result) return res.status(404).json({ error: 'Expense not found' });
            res.sendStatus(204);
        } else {
            const originalLength = mockDb.expenses.length;
            mockDb.expenses = mockDb.expenses.filter(e => !(e.id === req.params.id && e.tenantId === tenantId));
            if (mockDb.expenses.length === originalLength) return res.status(404).json({ error: 'Expense not found' });
            res.sendStatus(204);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// USERS MANAGEMENT CRUD
app.get('/api/users', authenticateToken, async (req, res) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Forbidden' });
    try {
        const tenantId = getTenantId(req);
        if (isMongoConnected) {
            const users = await User.find({ tenantId });
            const cleanUsers = users.map(u => ({ id: u.id, username: u.username, role: u.role }));
            res.json(cleanUsers);
        } else {
            const cleanUsers = mockDb.users.filter(u => u.tenantId === tenantId).map(u => ({ id: u.id, username: u.username, role: u.role }));
            res.json(cleanUsers);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/users', authenticateToken, async (req, res) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Forbidden' });
    try {
        const tenantId = getTenantId(req);
        const { username, password, role } = req.body;
        const passwordHash = bcrypt.hashSync(password || '123456', 10);
        const id = Date.now().toString();
        
        if (isMongoConnected) {
            const user = new User({ id, username, passwordHash, role, tenantId });
            await user.save();
            res.json({ id: user.id, username: user.username, role: user.role });
        } else {
            const user = { id, username, passwordHash, role, tenantId };
            mockDb.users.push(user);
            res.json({ id: user.id, username: user.username, role: user.role });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/users/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Forbidden' });
    try {
        const tenantId = getTenantId(req);
        const { username, password, role } = req.body;
        const updates = {};
        if (username) updates.username = username;
        if (role) updates.role = role;
        if (password) updates.passwordHash = bcrypt.hashSync(password, 10);

        if (isMongoConnected) {
            const user = await User.findOneAndUpdate({ id: req.params.id, tenantId }, updates, { new: true });
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json({ id: user.id, username: user.username, role: user.role });
        } else {
            const idx = mockDb.users.findIndex(u => u.id === req.params.id && u.tenantId === tenantId);
            if (idx === -1) return res.status(404).json({ error: 'User not found' });
            mockDb.users[idx].username = username || mockDb.users[idx].username;
            mockDb.users[idx].role = role || mockDb.users[idx].role;
            if (password) {
                mockDb.users[idx].passwordHash = bcrypt.hashSync(password, 10);
            }
            res.json({ id: mockDb.users[idx].id, username: mockDb.users[idx].username, role: mockDb.users[idx].role });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Forbidden' });
    try {
        const tenantId = getTenantId(req);
        if (isMongoConnected) {
            const result = await User.findOneAndDelete({ id: req.params.id, tenantId });
            if (!result) return res.status(404).json({ error: 'User not found' });
            res.sendStatus(204);
        } else {
            const originalLength = mockDb.users.length;
            mockDb.users = mockDb.users.filter(u => !(u.id === req.params.id && u.tenantId === tenantId));
            if (mockDb.users.length === originalLength) return res.status(404).json({ error: 'User not found' });
            res.sendStatus(204);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// QUOTATIONS CRUD
app.get('/api/quotations', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (isMongoConnected) {
            const quotations = await Quotation.find({ tenantId });
            res.json(quotations);
        } else {
            const quotations = mockDb.quotations.filter(q => q.tenantId === tenantId);
            res.json(quotations);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/quotations', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        const quote = {
            ...req.body,
            id: `QTN-${Date.now().toString().slice(-4)}`,
            date: new Date().toLocaleString(),
            tenantId
        };
        if (isMongoConnected) {
            const newQuote = new Quotation(quote);
            await newQuote.save();
            res.json(newQuote);
        } else {
            mockDb.quotations.push(quote);
            res.json(quote);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/quotations/:id', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (isMongoConnected) {
            const result = await Quotation.findOneAndDelete({ id: req.params.id, tenantId });
            if (!result) return res.status(404).json({ error: 'Quotation not found' });
            res.sendStatus(204);
        } else {
            const originalLength = mockDb.quotations.length;
            mockDb.quotations = mockDb.quotations.filter(q => !(q.id === req.params.id && q.tenantId === tenantId));
            if (mockDb.quotations.length === originalLength) return res.status(404).json({ error: 'Quotation not found' });
            res.sendStatus(204);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/quotations/:id', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (isMongoConnected) {
            const quotation = await Quotation.findOneAndUpdate({ id: req.params.id, tenantId }, req.body, { new: true });
            if (!quotation) return res.status(404).json({ error: 'Quotation not found' });
            res.json(quotation);
        } else {
            const idx = mockDb.quotations.findIndex(q => q.id === req.params.id && q.tenantId === tenantId);
            if (idx !== -1) {
                mockDb.quotations[idx] = {
                    ...mockDb.quotations[idx],
                    ...req.body,
                    tenantId
                };
                res.json(mockDb.quotations[idx]);
            } else {
                res.sendStatus(404);
            }
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ====================================================
// SAAS PROVIDER ADMIN ROUTES  (protected by SAAS_ADMIN_KEY)
// ====================================================
const SAAS_ADMIN_KEY = process.env.SAAS_ADMIN_KEY || 'kamysoft-saas-admin-2026';

const requireSaasAdmin = (req, res, next) => {
    const key = req.headers['x-saas-admin-key'] || req.query.key;
    if (!key || key !== SAAS_ADMIN_KEY) {
        return res.status(403).json({ error: 'Forbidden: invalid admin key' });
    }
    next();
};

// GET all tenants with stats
app.get('/api/saas/stores', requireSaasAdmin, async (req, res) => {
    try {
        if (isMongoConnected) {
            const stores = await Settings.find({}).lean();
            const enriched = await Promise.all(stores.map(async (s) => {
                const [invoiceCount, productCount, userCount] = await Promise.all([
                    Invoice.countDocuments({ tenantId: s.tenantId }),
                    Product.countDocuments({ tenantId: s.tenantId }),
                    User.countDocuments({ tenantId: s.tenantId })
                ]);
                return { ...s, invoiceCount, productCount, userCount };
            }));
            res.json(enriched);
        } else {
            const stores = Object.values(mockDb.settingsTenant || { default: mockDb.settings });
            res.json(stores.map(s => ({ ...s, invoiceCount: 0, productCount: 0, userCount: 0 })));
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE a tenant store and all its data
app.delete('/api/saas/stores/:tenantId', requireSaasAdmin, async (req, res) => {
    try {
        const { tenantId } = req.params;
        if (tenantId === 'default') return res.status(400).json({ error: 'Cannot delete the default demo store' });
        if (isMongoConnected) {
            await Promise.all([
                Settings.deleteOne({ tenantId }),
                User.deleteMany({ tenantId }),
                Product.deleteMany({ tenantId }),
                Invoice.deleteMany({ tenantId }),
                Quotation.deleteMany({ tenantId }),
                Expense.deleteMany({ tenantId }),
                Asset.deleteMany({ tenantId }),
                Customer.deleteMany({ tenantId }),
                Employee.deleteMany({ tenantId }),
                Supplier.deleteMany({ tenantId }),
                Order.deleteMany({ tenantId })
            ]);
        } else {
            if (mockDb.settingsTenant) delete mockDb.settingsTenant[tenantId];
        }
        res.json({ success: true, message: `Store ${tenantId} deleted.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH suspend or activate a tenant
app.patch('/api/saas/stores/:tenantId/status', requireSaasAdmin, async (req, res) => {
    try {
        const { tenantId } = req.params;
        const { suspended } = req.body;
        if (isMongoConnected) {
            await Settings.updateOne({ tenantId }, { $set: { suspended: !!suspended } });
        }
        res.json({ success: true, tenantId, suspended: !!suspended });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET inquiries list
app.get('/api/saas/inquiries', requireSaasAdmin, async (req, res) => {
    try {
        if (isMongoConnected) {
            const inquiries = await Inquiry.find({}).sort({ createdAt: -1 }).lean();
            res.json(inquiries);
        } else {
            res.json(mockDb.inquiries || []);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET platform-wide stats
app.get('/api/saas/stats', requireSaasAdmin, async (req, res) => {
    try {
        if (isMongoConnected) {
            const [storeCount, invoiceCount, userCount, inquiryCount] = await Promise.all([
                Settings.countDocuments({}),
                Invoice.countDocuments({}),
                User.countDocuments({}),
                Inquiry.countDocuments({})
            ]);
            res.json({ storeCount, invoiceCount, userCount, inquiryCount });
        } else {
            res.json({ storeCount: 1, invoiceCount: 0, userCount: 1, inquiryCount: 0 });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ----------------------------------------------------
// FRONTEND SERVING (Vite production assets build)
// ----------------------------------------------------
const frontendBuild = path.join(__dirname, 'frontend', 'dist');
app.use(express.static(frontendBuild));

app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuild, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`KamySoft POS & ERP server running on http://localhost:${PORT}`);
});
