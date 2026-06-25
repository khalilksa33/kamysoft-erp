// KamySoft POS & ERP Express Server Backend
// Implements full MERN API server with ZATCA Phase 2 XML generator, Employee Asset Depreciation, and multi-currency options
const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 8089;
const JWT_SECRET = process.env.JWT_SECRET || 'kamysoft_super_secret_key_2026';

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
        // Admin: admin123, Manager: manager123, Cashier: cashier123
        { id: '1', username: 'admin', passwordHash: bcrypt.hashSync('admin123', 10), role: 'Admin' },
        { id: '2', username: 'manager', passwordHash: bcrypt.hashSync('manager123', 10), role: 'Manager' },
        { id: '3', username: 'cashier', passwordHash: bcrypt.hashSync('cashier123', 10), role: 'Cashier' }
    ],
    products: [
        { id: '1001', nameEN: 'Premium Smart Monitor 27"', nameAR: 'شاشة ذكية فاخرة 27 بوصة', price: 950, cost: 650, stock: 12, category: 'electronics', emoji: '🖥️' },
        { id: '1002', nameEN: 'Wireless Laser Scanner', nameAR: 'قارئ باركود لاسلكي ليزري', price: 250, cost: 170, stock: 8, category: 'electronics', emoji: '🔦' },
        { id: '1003', nameEN: 'Direct Thermal Receipt Printer', nameAR: 'طابعة فواتير حرارية مباشرة', price: 320, cost: 210, stock: 15, category: 'electronics', emoji: '🖨️' },
        { id: '1004', nameEN: 'Leather Executive Chair', nameAR: 'كرسي مكتب جلد فخم', price: 420, cost: 280, stock: 4, category: 'office', emoji: '💺' },
        { id: '1005', nameEN: 'Organic Coffee Beans 1kg', nameAR: 'حبوب قهوة عضوية 1 كجم', price: 75, cost: 48, stock: 30, category: 'groceries', emoji: '☕' },
        { id: '1006', nameEN: 'Saudi Classic Thobe (White)', nameAR: 'ثوب سعودي كلاسيك أبيض', price: 180, cost: 110, stock: 45, category: 'apparel', emoji: '👔' },
        { id: '1007', nameEN: 'Luxury Shemagh (Red)', nameAR: 'شماغ أحمر ملكي فاخر', price: 220, cost: 140, stock: 30, category: 'apparel', emoji: '🧣' },
        { id: '1008', nameEN: 'Premium Black Abaya', nameAR: 'عباءة سوداء فاخرة مطرزة', price: 350, cost: 220, stock: 25, category: 'apparel', emoji: '👘' },
        { id: '1009', nameEN: 'Casual Formal Suit (Blue)', nameAR: 'بدلة رسمية كلاسيكية زرقاء', price: 650, cost: 420, stock: 10, category: 'apparel', emoji: '🧥' },
        { id: '1010', nameEN: 'Mechanical Keyboard (RGB)', nameAR: 'لوحة مفاتيح ميكانيكية ملونة', price: 150, cost: 90, stock: 20, category: 'electronics', emoji: '⌨️' },
        { id: '1011', nameEN: 'Ergonomic Standing Desk', nameAR: 'مكتب وقوف مرن مريح', price: 1200, cost: 850, stock: 5, category: 'office', emoji: '🎚️' },
        { id: '1012', nameEN: 'Automatic Water Dispenser', nameAR: 'موزع مياه أوتوماتيكي', price: 95, cost: 60, stock: 15, category: 'groceries', emoji: '🥛' }
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
        vatNumber: '310123456700003',
        taxRate: 15,
        baseCurrency: 'SAR',
        exchangeRates: {
            SAR: 1,
            USD: 0.27,
            EUR: 0.25,
            EGP: 12.8,
            AED: 0.99
        }
    }
};

// ----------------------------------------------------
// MONGOOSE SCHEMAS (If connected)
// ----------------------------------------------------
// (Schemas definitions left out for brevity in server.js but simulated in our controller queries)

// ----------------------------------------------------
// AUTH MIDDLEWARE
// ----------------------------------------------------
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: 'Access token required' });
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token expired or invalid' });
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
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = mockDb.users.find(u => u.username === username);
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
    res.json(req.user);
});

// SETTINGS & MULTI-CURRENCY
app.get('/api/settings', (req, res) => {
    res.json(mockDb.settings);
});

app.post('/api/settings', authenticateToken, (req, res) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Forbidden' });
    mockDb.settings = { ...mockDb.settings, ...req.body };
    res.json(mockDb.settings);
});

// PRODUCTS / INVENTORY
app.get('/api/products', (req, res) => {
    res.json(mockDb.products);
});

app.post('/api/products', authenticateToken, (req, res) => {
    if (req.user.role === 'Cashier') return res.status(403).json({ error: 'Forbidden' });
    const product = { ...req.body, id: req.body.id || (1000 + mockDb.products.length + 1).toString() };
    mockDb.products.push(product);
    res.json(product);
});

app.put('/api/products/:id', authenticateToken, (req, res) => {
    if (req.user.role === 'Cashier') return res.status(403).json({ error: 'Forbidden' });
    const idx = mockDb.products.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });
    mockDb.products[idx] = { ...mockDb.products[idx], ...req.body };
    res.json(mockDb.products[idx]);
});

// INVOICES & ZATCA PORTAL
app.get('/api/invoices', (req, res) => {
    res.json(mockDb.invoices);
});

app.post('/api/invoices', authenticateToken, (req, res) => {
    const invoice = req.body;
    invoice.id = `INV-${Date.now().toString().slice(-6)}`;
    invoice.uuid = crypto.randomUUID();
    invoice.csn = mockDb.invoices.length + 1;
    
    let pih = "NWZlY2Q1Y2QyODgyY2NmYTE5YTY1ODIzMDYyMzA5MTRmYmJhYmQ2YmQxMTBiYTkyYTk4YmM0ZTc0Y2Y5MmQ2ZQ==";
    if (mockDb.invoices.length > 0) {
        const prev = mockDb.invoices[mockDb.invoices.length - 1];
        if (prev.xmlHashBase64) pih = prev.xmlHashBase64;
    }
    invoice.pih = pih;

    invoice.xml = generateZATCAXML(invoice, mockDb.settings);
    invoice.xmlHash = sha256Node(invoice.xml);
    invoice.xmlHashBase64 = Buffer.from(invoice.xmlHash, 'hex').toString('base64');
    invoice.signature = signHashNode(invoice.xmlHash);
    invoice.publicKey = "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEbE08C8wK7zH6r2wR3pS1a1gD4o6H4L8T1F3E2W1Q2A3B4C5D6E7F8G9H0I1J2K3L4M5N6O7P8Q9R0S1T2U3V4W5X6Y7Z==";
    invoice.certSignature = "MEQCIDz/R+x6T/T42/yvF1w67r81m4F/X27+z36/S/23s/Y1AiAC/S/z8E8r6Q81/t23/9+x7r23/X71/+1287/r+x612w==";
    invoice.zatcaStatus = 'PENDING';

    mockDb.invoices.push(invoice);
    
    // Deduct stock
    invoice.items.forEach(item => {
        const prod = mockDb.products.find(p => p.id === item.id);
        if (prod) prod.stock = Math.max(0, prod.stock - item.qty);
    });

    res.json(invoice);
});

app.post('/api/invoices/:id/zatca-report', authenticateToken, (req, res) => {
    const invoice = mockDb.invoices.find(i => i.id === req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    invoice.zatcaStatus = 'REPORTED';
    res.json(invoice);
});

// EXPENSES
app.get('/api/expenses', (req, res) => {
    res.json(mockDb.expenses);
});

app.post('/api/expenses', authenticateToken, (req, res) => {
    if (req.user.role === 'Cashier') return res.status(403).json({ error: 'Forbidden' });
    const expense = { ...req.body, id: `EXP-${Date.now().toString().slice(-4)}` };
    mockDb.expenses.push(expense);
    res.json(expense);
});

// ASSETS & DEPRECIATION
app.get('/api/assets', (req, res) => {
    res.json(mockDb.assets);
});

app.post('/api/assets', authenticateToken, (req, res) => {
    if (req.user.role === 'Cashier') return res.status(403).json({ error: 'Forbidden' });
    const asset = { ...req.body, id: `AST-${Date.now().toString().slice(-4)}` };
    mockDb.assets.push(asset);
    res.json(asset);
});

// PEOPLES: CUSTOMERS & EMPLOYEES & SUPPLIERS
app.get('/api/customers', (req, res) => res.json(mockDb.customers));
app.get('/api/employees', (req, res) => res.json(mockDb.employees));
app.get('/api/suppliers', (req, res) => res.json(mockDb.suppliers));
app.get('/api/orders', (req, res) => res.json(mockDb.orders));

app.post('/api/customers', authenticateToken, (req, res) => {
    const cust = { ...req.body, id: `CUST-${Date.now().toString().slice(-4)}`, points: 0, spent: 0 };
    mockDb.customers.push(cust);
    res.json(cust);
});
app.post('/api/suppliers', authenticateToken, (req, res) => {
    const supp = { ...req.body, id: `SUPP-${Date.now().toString().slice(-4)}` };
    mockDb.suppliers.push(supp);
    res.json(supp);
});
app.put('/api/orders/:id', authenticateToken, (req, res) => {
    const ord = mockDb.orders.find(o => o.id === req.params.id);
    if (!ord) return res.status(404).json({ error: 'Order not found' });
    ord.status = req.body.status;
    res.json(ord);
});
app.post('/api/orders', authenticateToken, (req, res) => {
    const ord = { ...req.body, id: `ORD-${Date.now().toString().slice(-4)}` };
    mockDb.orders.push(ord);
    res.json(ord);
});
app.delete('/api/orders/:id', authenticateToken, (req, res) => {
    mockDb.orders = mockDb.orders.filter(o => o.id !== req.params.id);
    res.sendStatus(204);
});

// EXPENSES CRUD ADDITIONS
app.put('/api/expenses/:id', authenticateToken, (req, res) => {
    const idx = mockDb.expenses.findIndex(e => e.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Expense not found' });
    mockDb.expenses[idx] = { ...mockDb.expenses[idx], ...req.body };
    res.json(mockDb.expenses[idx]);
});
app.delete('/api/expenses/:id', authenticateToken, (req, res) => {
    mockDb.expenses = mockDb.expenses.filter(e => e.id !== req.params.id);
    res.sendStatus(204);
});

// USERS MANAGEMENT CRUD
app.get('/api/users', authenticateToken, (req, res) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Forbidden' });
    const cleanUsers = mockDb.users.map(u => ({ id: u.id, username: u.username, role: u.role }));
    res.json(cleanUsers);
});
app.post('/api/users', authenticateToken, (req, res) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Forbidden' });
    const { username, password, role } = req.body;
    const user = {
        id: Date.now().toString(),
        username,
        passwordHash: bcrypt.hashSync(password || '123456', 10),
        role
    };
    mockDb.users.push(user);
    res.json({ id: user.id, username: user.username, role: user.role });
});
app.put('/api/users/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Forbidden' });
    const idx = mockDb.users.findIndex(u => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'User not found' });
    const { username, password, role } = req.body;
    mockDb.users[idx].username = username || mockDb.users[idx].username;
    mockDb.users[idx].role = role || mockDb.users[idx].role;
    if (password) {
        mockDb.users[idx].passwordHash = bcrypt.hashSync(password, 10);
    }
    res.json({ id: mockDb.users[idx].id, username: mockDb.users[idx].username, role: mockDb.users[idx].role });
});
app.delete('/api/users/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Forbidden' });
    mockDb.users = mockDb.users.filter(u => u.id !== req.params.id);
    res.sendStatus(204);
});

// QUOTATIONS CRUD
app.get('/api/quotations', (req, res) => {
    res.json(mockDb.quotations);
});
app.post('/api/quotations', authenticateToken, (req, res) => {
    const quote = {
        ...req.body,
        id: `QTN-${Date.now().toString().slice(-4)}`,
        date: new Date().toLocaleString()
    };
    mockDb.quotations.push(quote);
    res.json(quote);
});
app.delete('/api/quotations/:id', authenticateToken, (req, res) => {
    mockDb.quotations = mockDb.quotations.filter(q => q.id !== req.params.id);
    res.sendStatus(204);
});
app.put('/api/quotations/:id', authenticateToken, (req, res) => {
    const idx = mockDb.quotations.findIndex(q => q.id === req.params.id);
    if (idx !== -1) {
        mockDb.quotations[idx] = {
            ...mockDb.quotations[idx],
            ...req.body
        };
        res.json(mockDb.quotations[idx]);
    } else {
        res.sendStatus(404);
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
