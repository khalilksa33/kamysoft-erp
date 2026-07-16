
const express = require('express');
const zatcaApi = require('../utils/zatcaApi');
const zatcaCrypto = require('../utils/zatcaCrypto');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { User, Product, Invoice, Quotation, Expense, Asset, Customer, Employee, Supplier, Order, Settings, Inquiry, Warehouse, InventoryTx, JournalEntry, Voucher, Salary, PurchaseInvoice, ReturnInvoice, Account } = require('../models');

// Mock in-memory DB fallback for serverless environments (if MongoDB is disconnected)
const mockDb = {
    users: [], products: [], invoices: [], quotations: [], expenses: [], assets: [],
    customers: [], employees: [], suppliers: [], orders: [], settings: [],
    warehouses: [], inventoryTxs: [], journalEntries: [], vouchers: [],
    salaries: [], purchaseInvoices: [], returnInvoices: [], accounts: []
};

// Middleware from server.js for auth
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

router.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const tenantId = getTenantId(req);
        let user;
        if (global.isMongoConnected) {
            user = await User.findOne({ username, tenantId });
        } else {
            user = mockDb.users.find(u => u.username === username && u.tenantId === tenantId);
        }
        
        if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        if (user.isActive === false) {
            return res.status(403).json({ error: 'Your account has been deactivated. Please contact support.' });
        }
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role, tenantId }, JWT_SECRET, { expiresIn: '12h' });
        res.json({ token, user: { id: user.id, username: user.username, role: user.role, isActive: user.isActive } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
const getBaseDomain = (host) => {
    host = host.toLowerCase();
    if (host.endsWith('ssh-erp.26i.uk')) return 'ssh-erp.26i.uk';
    if (host.endsWith('26i.uk')) return '26i.uk';
    if (host.endsWith('localhost')) return 'localhost';
    return host;
};

router.post('/api/auth/register-tenant', async (req, res) => {
    try {
        const { tenantId, businessName, businessType, adminUsername, adminPassword, email, mobile, nationalAddress, vatNumber, crNumber, billingCycle, fullName } = req.body;
        const host = (req.headers.host || '').split(':')[0].toLowerCase();
        const baseDomain = getBaseDomain(host);
        
        if (!tenantId || !businessName || !businessType || !adminUsername || !adminPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        // Normalize tenantId (lowercase alphanumeric and dash only)
        const normalizedTenantId = tenantId.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
        if (!normalizedTenantId) {
            return res.status(400).json({ error: 'Invalid subdomain format' });
        }
        
        // Check uniqueness of tenantId
        if (global.isMongoConnected) {
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
        
        if (global.isMongoConnected) {
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
        
        if (global.isMongoConnected) {
            await User.create(adminUser);
        } else {
            mockDb.users.push(adminUser);
        }
        
        // 3. Seed initial products based on businessType
        const productsToSeed = global.defaultProductsBySector[businessType] || global.defaultProductsBySector.retail;
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
        
        if (global.isMongoConnected) {
            await Product.insertMany(seedProducts);
        } else {
            mockDb.products.push(...seedProducts);
        }
        
        // 4. Seed Standard Chart of Accounts
        const standardAccounts = [
            { code: '1000', nameEN: 'Cash', nameAR: 'نقد', type: 'Asset' },
            { code: '1010', nameEN: 'Bank Account', nameAR: 'حساب بنكي', type: 'Asset' },
            { code: '1200', nameEN: 'Accounts Receivable', nameAR: 'الذمم المدينة', type: 'Asset' },
            { code: '1300', nameEN: 'Inventory', nameAR: 'المخزون', type: 'Asset' },
            { code: '2000', nameEN: 'Accounts Payable', nameAR: 'الذمم الدائنة', type: 'Liability' },
            { code: '2100', nameEN: 'VAT Payable', nameAR: 'ضريبة القيمة المضافة المستحقة', type: 'Liability' },
            { code: '3000', nameEN: 'Owner Equity', nameAR: 'حقوق المالك', type: 'Equity' },
            { code: '4000', nameEN: 'Sales Revenue', nameAR: 'إيرادات المبيعات', type: 'Revenue' },
            { code: '5000', nameEN: 'Cost of Goods Sold', nameAR: 'تكلفة البضاعة المباعة', type: 'Expense' },
            { code: '5100', nameEN: 'Salaries Expense', nameAR: 'مصروفات الرواتب', type: 'Expense' },
            { code: '5200', nameEN: 'Rent Expense', nameAR: 'مصروفات الإيجار', type: 'Expense' },
            { code: '5300', nameEN: 'Utilities Expense', nameAR: 'مصروفات المنافع', type: 'Expense' },
            { code: '5400', nameEN: 'Miscellaneous Expense', nameAR: 'مصروفات متنوعة', type: 'Expense' }
        ].map(acc => ({ ...acc, tenantId: normalizedTenantId, balance: 0 }));

        if (global.isMongoConnected) {
            await Account.insertMany(standardAccounts);
        } else {
            mockDb.accounts = mockDb.accounts || [];
            mockDb.accounts.push(...standardAccounts);
        }
        
        // Send email asynchronously (don't block the response)
        if (email) {
            sendLicenseEmail(email, normalizedTenantId, businessName, licenseKey, expirationDate, baseDomain);
        }
        
        // Update Cloudflare Tunnel asynchronously
        if (process.env.CF_ACCOUNT_ID && baseDomain) {
            global.updateCloudflareTunnelConfig(`${normalizedTenantId}.${baseDomain}`).catch(err => console.error(err));
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

router.get('/api/auth/me', authenticateToken, (req, res) => {
    res.json(req.user);
});

// PUBLIC INQUIRIES & DEMO REQUESTS
router.post('/api/inquiries', async (req, res) => {
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

        if (global.isMongoConnected) {
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

router.get('/api/inquiries', authenticateToken, async (req, res) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Forbidden' });
    try {
        if (global.isMongoConnected) {
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
router.get('/api/settings', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (global.isMongoConnected) {
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


router.post('/api/send-email', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        let settings = null;
        if (global.isMongoConnected) {
            settings = await Settings.findOne({ tenantId });
        } else {
            settings = mockDb.settingsTenant[tenantId] || mockDb.settings;
        }

        if (!settings || !settings.smtp || !settings.smtp.host && settings.smtp.provider !== 'sendgrid') {
            return res.status(400).json({ error: 'SMTP settings not configured' });
        }

        const { to, subject, html } = req.body;
        const smtp = settings.smtp;

        if (smtp.provider === 'sendgrid') {
            if (!smtp.sendgridApiKey) return res.status(400).json({ error: 'SendGrid API key not configured' });
            sgMail.setApiKey(smtp.sendgridApiKey);
            const msg = {
                to,
                from: smtp.fromEmail || 'test@example.com',
                subject,
                html,
            };
            await sgMail.send(msg);
        } else {
            let transporter = nodemailer.createTransport({
                host: smtp.host,
                port: smtp.port,
                secure: smtp.port == 465, // true for 465, false for other ports
                auth: {
                    user: smtp.user,
                    pass: smtp.password,
                },
            });
            await transporter.sendMail({
                from: smtp.fromEmail || smtp.user,
                to,
                subject,
                html,
            });
        }
        res.json({ success: true, message: 'Email sent successfully' });
    } catch (err) {
        console.error('Email sending error:', err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/api/settings', authenticateToken, async (req, res) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Forbidden' });
    try {
        const tenantId = getTenantId(req);
        if (global.isMongoConnected) {
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
router.get('/api/products', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (global.isMongoConnected) {
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

router.post('/api/products', authenticateToken, async (req, res) => {
    if (req.user.role === 'Cashier') return res.status(403).json({ error: 'Forbidden' });
    try {
        const tenantId = getTenantId(req);
        if (global.isMongoConnected) {
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

router.put('/api/products/:id', authenticateToken, async (req, res) => {
    if (req.user.role === 'Cashier') return res.status(403).json({ error: 'Forbidden' });
    try {
        const tenantId = getTenantId(req);
        if (global.isMongoConnected) {
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

router.delete('/api/products/:id', authenticateToken, async (req, res) => {
    if (req.user.role === 'Cashier') return res.status(403).json({ error: 'Forbidden' });
    try {
        const tenantId = getTenantId(req);
        if (global.isMongoConnected) {
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
router.get('/api/invoices', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (global.isMongoConnected) {
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

router.post('/api/invoices', authenticateToken, async (req, res) => {
    const invoice = req.body;
    invoice.id = `INV-${Date.now().toString().slice(-6)}`;
    invoice.uuid = crypto.randomUUID();
    const tenantId = getTenantId(req);
    invoice.tenantId = tenantId;
    
    try {
        if (global.isMongoConnected) {
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

router.post('/api/zatca/onboard', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        const { otp, env } = req.body;
        
        // 1. Generate local ECDSA keys
        const keys = zatcaCrypto.onboardDevice(tenantId);
        
        // 2. Simulate ZATCA CSR response
        let zatcaRes = { certificate: 'SIMULATED_CERT', secret: 'SIMULATED_SECRET' };
        
        try {
            if (otp && otp !== '123456') {
                // Try real ZATCA API if they provided an OTP
                // zatcaRes = await zatcaApi.registerDevice(otp, "mock-csr", env || 'sandbox');
            }
        } catch(e) {
            console.error('ZATCA Registration failed', e.message);
        }

        res.json({ message: 'Device keys generated and registered successfully', keys, zatca: zatcaRes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/api/invoices/:id/zatca-report', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        let invoice;
        if (req.app.locals.isSaas) {
            invoice = await Invoice.findOne({ id: req.params.id, tenantId });
        } else {
            invoice = mockDb.invoices.find(i => i.id === req.params.id && i.tenantId === tenantId);
        }

        if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

        // Call real ZATCA Reporting API
        try {
            const apiRes = await zatcaApi.reportInvoice(invoice.xmlBase64 || "mock-xml", invoice.xmlHashHex || "mock-hash", "MOCK_CERT", "MOCK_SECRET", 'sandbox');
            console.log('ZATCA Reporting Success', apiRes);
        } catch(e) {
            console.error('ZATCA Reporting API Error', e.message);
        }

        if (req.app.locals.isSaas) {
            invoice.zatcaStatus = 'REPORTED';
            await invoice.save();
        } else {
            invoice.zatcaStatus = 'REPORTED';
        }

        res.json({ message: 'Reported to ZATCA' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/api/invoices/:id/refund', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (global.isMongoConnected) {
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
router.get('/api/expenses', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (global.isMongoConnected) {
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

// FINANCIAL TRANSACTIONS (COMBINED INVOICES & EXPENSES)
router.get('/api/transactions', authenticateToken, async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        let invoices = [];
        let expenses = [];
        
        if (mongoose.connection.readyState === 1) {
            invoices = await Invoice.find({ tenantId });
            expenses = await Expense.find({ tenantId });
        } else {
            invoices = mockDb.invoices.filter(i => i.tenantId === tenantId);
            expenses = mockDb.expenses.filter(e => e.tenantId === tenantId);
        }
        
        const transactions = [
            ...invoices.map(inv => ({
                id: inv.id,
                date: inv.date,
                type: 'Sale',
                ref: inv.id,
                description: `Customer: ${inv.customer}`,
                income: inv.total,
                expense: 0
            })),
            ...expenses.map(exp => ({
                id: exp.id,
                date: exp.date,
                type: 'Expense',
                ref: exp.id,
                description: `Category: ${exp.category} - ${exp.description || ''}`,
                income: 0,
                expense: exp.amount
            }))
        ];
        
        // Sort chronologically
        transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Calculate running balance
        let balance = 0;
        transactions.forEach(t => {
            balance += t.income - t.expense;
            t.balance = balance;
        });
        
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CHART OF ACCOUNTS
router.get('/api/accounts', authenticateToken, async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        if (mongoose.connection.readyState === 1) {
            const accounts = await Account.find({ tenantId });
            res.json(accounts);
        } else {
            const accounts = mockDb.accounts.filter(a => a.tenantId === tenantId);
            res.json(accounts);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/api/accounts', authenticateToken, async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        if (mongoose.connection.readyState === 1) {
            const account = new Account({ ...req.body, tenantId });
            await account.save();
            res.json(account);
        } else {
            const account = { ...req.body, tenantId };
            mockDb.accounts.push(account);
            res.json(account);
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/api/accounts/:code', authenticateToken, async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        if (mongoose.connection.readyState === 1) {
            const account = await Account.findOneAndUpdate({ code: req.params.code, tenantId }, req.body, { new: true });
            if (!account) return res.status(404).json({ error: 'Account not found' });
            res.json(account);
        } else {
            const idx = mockDb.accounts.findIndex(a => a.code === req.params.code && a.tenantId === tenantId);
            if (idx === -1) return res.status(404).json({ error: 'Account not found' });
            mockDb.accounts[idx] = { ...mockDb.accounts[idx], ...req.body, tenantId };
            res.json(mockDb.accounts[idx]);
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/api/accounts/:code', authenticateToken, async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        if (mongoose.connection.readyState === 1) {
            const result = await Account.findOneAndDelete({ code: req.params.code, tenantId });
            if (!result) return res.status(404).json({ error: 'Account not found' });
            res.json({ message: 'Deleted' });
        } else {
            const originalLength = mockDb.accounts.length;
            mockDb.accounts = mockDb.accounts.filter(a => !(a.code === req.params.code && a.tenantId === tenantId));
            if (mockDb.accounts.length === originalLength) return res.status(404).json({ error: 'Account not found' });
            res.json({ message: 'Deleted' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// JOURNAL ENTRIES
router.get('/api/journal', authenticateToken, async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        if (mongoose.connection.readyState === 1) {
            const entries = await JournalEntry.find({ tenantId }).sort({ date: -1 });
            res.json(entries);
        } else {
            const entries = mockDb.journalEntries.filter(e => e.tenantId === tenantId).sort((a, b) => new Date(b.date) - new Date(a.date));
            res.json(entries);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/api/journal', authenticateToken, async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        const entryId = `JE-${Date.now().toString().slice(-6)}`;
        if (mongoose.connection.readyState === 1) {
            const entry = new JournalEntry({ ...req.body, entryId, tenantId });
            await entry.save();
            res.json(entry);
        } else {
            const entry = { ...req.body, entryId, tenantId };
            mockDb.journalEntries.push(entry);
            res.json(entry);
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/api/expenses', authenticateToken, async (req, res) => {
    if (req.user.role === 'Cashier') return res.status(403).json({ error: 'Forbidden' });
    try {
        const tenantId = getTenantId(req);
        const id = `EXP-${Date.now().toString().slice(-4)}`;
        if (global.isMongoConnected) {
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
router.get('/api/assets', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (global.isMongoConnected) {
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

router.post('/api/assets', authenticateToken, async (req, res) => {
    if (req.user.role === 'Cashier') return res.status(403).json({ error: 'Forbidden' });
    try {
        const tenantId = getTenantId(req);
        const id = `AST-${Date.now().toString().slice(-4)}`;
        if (global.isMongoConnected) {
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
router.get('/api/customers', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (global.isMongoConnected) {
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

router.get('/api/employees', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (global.isMongoConnected) {
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

router.get('/api/suppliers', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (global.isMongoConnected) {
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

router.get('/api/orders', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (global.isMongoConnected) {
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

router.post('/api/customers', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        const id = `CUST-${Date.now().toString().slice(-4)}`;
        if (global.isMongoConnected) {
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

router.post('/api/suppliers', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        const id = `SUPP-${Date.now().toString().slice(-4)}`;
        if (global.isMongoConnected) {
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

router.put('/api/orders/:id', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (global.isMongoConnected) {
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

router.post('/api/orders', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        const id = `ORD-${Date.now().toString().slice(-4)}`;
        if (global.isMongoConnected) {
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

router.delete('/api/orders/:id', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (global.isMongoConnected) {
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
router.put('/api/expenses/:id', authenticateToken, async (req, res) => {
    if (req.user.role === 'Cashier') return res.status(403).json({ error: 'Forbidden' });
    try {
        const tenantId = getTenantId(req);
        if (global.isMongoConnected) {
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

router.delete('/api/expenses/:id', authenticateToken, async (req, res) => {
    if (req.user.role === 'Cashier') return res.status(403).json({ error: 'Forbidden' });
    try {
        const tenantId = getTenantId(req);
        if (global.isMongoConnected) {
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
router.get('/api/users', authenticateToken, async (req, res) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Forbidden' });
    try {
        const tenantId = getTenantId(req);
        if (global.isMongoConnected) {
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

router.post('/api/users', authenticateToken, async (req, res) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Forbidden' });
    try {
        const tenantId = getTenantId(req);
        const { username, password, role } = req.body;
        const passwordHash = bcrypt.hashSync(password || '123456', 10);
        const id = Date.now().toString();
        
        if (global.isMongoConnected) {
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

router.put('/api/users/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Forbidden' });
    try {
        const tenantId = getTenantId(req);
        const { username, password, role } = req.body;
        const updates = {};
        if (username) updates.username = username;
        if (role) updates.role = role;
        if (password) updates.passwordHash = bcrypt.hashSync(password, 10);

        if (global.isMongoConnected) {
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

router.delete('/api/users/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Forbidden' });
    try {
        const tenantId = getTenantId(req);
        if (global.isMongoConnected) {
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
router.get('/api/quotations', async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (global.isMongoConnected) {
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

router.post('/api/quotations', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        const quote = {
            ...req.body,
            id: `QTN-${Date.now().toString().slice(-4)}`,
            date: new Date().toLocaleString(),
            tenantId
        };
        if (global.isMongoConnected) {
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

router.delete('/api/quotations/:id', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (global.isMongoConnected) {
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

router.put('/api/quotations/:id', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        if (global.isMongoConnected) {
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
router.get('/api/saas/stores', requireSaasAdmin, async (req, res) => {
    try {
        if (global.isMongoConnected) {
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
router.delete('/api/saas/stores/:tenantId', requireSaasAdmin, async (req, res) => {
    try {
        const { tenantId } = req.params;
        if (tenantId === 'default') return res.status(400).json({ error: 'Cannot delete the default demo store' });
        if (global.isMongoConnected) {
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
        if (global.removeCloudflareTunnelConfig) {
            await global.removeCloudflareTunnelConfig(tenantId);
        }
        res.json({ success: true, message: `Store ${tenantId} deleted.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH suspend or activate a tenant
router.patch('/api/saas/stores/:tenantId/status', requireSaasAdmin, async (req, res) => {
    try {
        const { tenantId } = req.params;
        const { suspended } = req.body;
        if (global.isMongoConnected) {
            await Settings.updateOne({ tenantId }, { $set: { suspended: !!suspended } });
        }
        res.json({ success: true, tenantId, suspended: !!suspended });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET inquiries list
router.get('/api/saas/inquiries', requireSaasAdmin, async (req, res) => {
    try {
        if (global.isMongoConnected) {
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
router.get('/api/saas/stats', requireSaasAdmin, async (req, res) => {
    try {
        if (global.isMongoConnected) {
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
router.get('/api/saas/stores/:tenantId/modules', requireSaasAdmin, async (req, res) => {
    try {
        const { tenantId } = req.params;
        const storeSettings = await Settings.findOne({ tenantId });
        if (!storeSettings) return res.status(404).json({ error: 'Store not found' });
        res.json(storeSettings.enabledModules || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/api/saas/stores/:tenantId/modules', requireSaasAdmin, async (req, res) => {
    try {
        const { tenantId } = req.params;
        const { modules } = req.body; // e.g., { pos: true, inventory: false }
        if (global.isMongoConnected) {
            await Settings.updateOne({ tenantId }, { $set: { enabledModules: modules } });
        } else {
            if (mockDb.settingsTenant[tenantId]) mockDb.settingsTenant[tenantId].enabledModules = modules;
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/api/saas/payments', requireSaasAdmin, async (req, res) => {
    try {
        if (global.isMongoConnected) {
            const payments = await SubscriptionPayment.find().sort({ date: -1 });
            res.json(payments);
        } else {
            res.json([]); // Mock db payments not fully implemented
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/api/saas/payments', requireSaasAdmin, async (req, res) => {
    try {
        if (global.isMongoConnected) {
            const payment = new SubscriptionPayment(req.body);
            await payment.save();
            res.json(payment);
        } else {
            res.json({ ...req.body, _id: Date.now().toString() });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/api/tenant/close', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ error: 'Only Admins can close the account.' });
        }
        const tenantId = req.user.tenantId;
        if (tenantId === 'default' || tenantId === 'demo.kamysoft.com') {
            return res.status(400).json({ error: 'Cannot delete the demo store.' });
        }
        if (global.isMongoConnected) {
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
        if (global.removeCloudflareTunnelConfig) {
            await global.removeCloudflareTunnelConfig(tenantId);
        }
        res.json({ success: true, message: `Account closed successfully.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/api/reports/trial-balance', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        let accounts = [];
        let journals = [];
        
        if (mongoose.connection.readyState === 1) {
            accounts = await Account.find({ tenantId }).lean();
            journals = await JournalEntry.find({ tenantId }).lean();
        } else {
            accounts = (mockDb.accounts || []).filter(a => a.tenantId === tenantId);
            journals = (mockDb.journalEntries || []).filter(j => j.tenantId === tenantId);
        }

        let tb = accounts.map(a => ({ code: a.code, nameEN: a.nameEN, nameAR: a.nameAR, type: a.type, debit: 0, credit: 0 }));
        
        journals.forEach(j => {
            let acc = tb.find(a => a.code === j.account);
            if (acc) {
                if (j.debit > 0) acc.debit += j.debit;
                if (j.credit > 0) acc.credit += j.credit;
            }
        });

        tb = tb.map(a => {
            let net = a.debit - a.credit;
            if (['Asset', 'Expense'].includes(a.type)) {
                return { ...a, balance: net };
            } else {
                return { ...a, balance: -net }; 
            }
        });

        res.json(tb);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/api/reports/balance-sheet', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        let accounts = [];
        let journals = [];
        
        if (mongoose.connection.readyState === 1) {
            accounts = await Account.find({ tenantId }).lean();
            journals = await JournalEntry.find({ tenantId }).lean();
        } else {
            accounts = (mockDb.accounts || []).filter(a => a.tenantId === tenantId);
            journals = (mockDb.journalEntries || []).filter(j => j.tenantId === tenantId);
        }

        let balances = {};
        accounts.forEach(a => balances[a.code] = { ...a, balance: 0, _id: undefined });

        journals.forEach(j => {
            if (balances[j.account]) {
                if (['Asset', 'Expense'].includes(balances[j.account].type)) {
                    balances[j.account].balance += (j.debit || 0) - (j.credit || 0);
                } else {
                    balances[j.account].balance += (j.credit || 0) - (j.debit || 0);
                }
            }
        });

        let assets = Object.values(balances).filter(a => a.type === 'Asset');
        let liabilities = Object.values(balances).filter(a => a.type === 'Liability');
        let equity = Object.values(balances).filter(a => a.type === 'Equity');

        let totalAssets = assets.reduce((sum, a) => sum + a.balance, 0);
        let totalLiabilities = liabilities.reduce((sum, a) => sum + a.balance, 0);
        let totalEquity = equity.reduce((sum, a) => sum + a.balance, 0);

        let revenue = Object.values(balances).filter(a => a.type === 'Revenue').reduce((sum, a) => sum + a.balance, 0);
        let expenses = Object.values(balances).filter(a => a.type === 'Expense').reduce((sum, a) => sum + a.balance, 0);
        let netIncome = revenue - expenses;
        totalEquity += netIncome;

        res.json({ assets, liabilities, equity, totalAssets, totalLiabilities, totalEquity, netIncome });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/api/reports/income-statement', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        const { startDate, endDate } = req.query;
        let accounts = [];
        let journals = [];
        
        let dateFilter = { tenantId };
        if (startDate && endDate) {
            dateFilter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        
        if (mongoose.connection.readyState === 1) {
            accounts = await Account.find({ tenantId, type: { $in: ['Revenue', 'Expense'] } }).lean();
            journals = await JournalEntry.find(dateFilter).lean();
        } else {
            accounts = (mockDb.accounts || []).filter(a => a.tenantId === tenantId && ['Revenue', 'Expense'].includes(a.type));
            journals = (mockDb.journalEntries || []).filter(j => j.tenantId === tenantId);
            if (startDate && endDate) {
                const s = new Date(startDate);
                const e = new Date(endDate);
                journals = journals.filter(j => new Date(j.date) >= s && new Date(j.date) <= e);
            }
        }

        let balances = {};
        accounts.forEach(a => balances[a.code] = { ...a, balance: 0, _id: undefined });

        journals.forEach(j => {
            if (balances[j.account]) {
                if (balances[j.account].type === 'Expense') {
                    balances[j.account].balance += (j.debit || 0) - (j.credit || 0);
                } else if (balances[j.account].type === 'Revenue') {
                    balances[j.account].balance += (j.credit || 0) - (j.debit || 0);
                }
            }
        });

        let revenues = Object.values(balances).filter(a => a.type === 'Revenue' && a.balance !== 0);
        let expenses = Object.values(balances).filter(a => a.type === 'Expense' && a.balance !== 0);
        
        let cogs = expenses.filter(a => a.nameEN.toLowerCase().includes('cost of goods') || a.code === '5000');
        let operatingExpenses = expenses.filter(a => !a.nameEN.toLowerCase().includes('cost of goods') && a.code !== '5000');

        let totalRevenue = revenues.reduce((sum, a) => sum + a.balance, 0);
        let totalCogs = cogs.reduce((sum, a) => sum + a.balance, 0);
        let grossProfit = totalRevenue - totalCogs;
        
        let totalOperatingExpenses = operatingExpenses.reduce((sum, a) => sum + a.balance, 0);
        let netIncome = grossProfit - totalOperatingExpenses;

        res.json({ revenues, cogs, operatingExpenses, totalRevenue, totalCogs, grossProfit, totalOperatingExpenses, netIncome });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/api/reports/cash-flow', authenticateToken, async (req, res) => {
    try {
        const tenantId = getTenantId(req);
        const { startDate, endDate } = req.query;
        let accounts = [];
        let journals = [];
        
        let dateFilter = { tenantId };
        if (startDate && endDate) {
            dateFilter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        
        if (mongoose.connection.readyState === 1) {
            accounts = await Account.find({ tenantId, type: 'Asset' }).lean(); // Cash and Bank are assets
            journals = await JournalEntry.find(dateFilter).lean();
        } else {
            accounts = (mockDb.accounts || []).filter(a => a.tenantId === tenantId && a.type === 'Asset');
            journals = (mockDb.journalEntries || []).filter(j => j.tenantId === tenantId);
            if (startDate && endDate) {
                const s = new Date(startDate);
                const e = new Date(endDate);
                journals = journals.filter(j => new Date(j.date) >= s && new Date(j.date) <= e);
            }
        }

        // Identify cash-equivalent accounts
        const cashAccounts = accounts.filter(a => a.code === '1000' || a.code === '1010' || a.nameEN.toLowerCase().includes('cash') || a.nameEN.toLowerCase().includes('bank'));
        const cashAccountCodes = cashAccounts.map(a => a.code);

        let cashInflows = [];
        let cashOutflows = [];
        let netChange = 0;

        journals.forEach(j => {
            if (cashAccountCodes.includes(j.account)) {
                if (j.debit > 0) {
                    cashInflows.push(j);
                    netChange += j.debit;
                }
                if (j.credit > 0) {
                    cashOutflows.push(j);
                    netChange -= j.credit;
                }
            }
        });

        const totalInflows = cashInflows.reduce((sum, j) => sum + j.debit, 0);
        const totalOutflows = cashOutflows.reduce((sum, j) => sum + j.credit, 0);

        res.json({ cashInflows, cashOutflows, totalInflows, totalOutflows, netChange });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
