
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { User, Product, Invoice, Quotation, Expense, Asset, Customer, Employee, Supplier, Order, Settings, Inquiry, Warehouse, InventoryTx, JournalEntry, Voucher, Salary, PurchaseInvoice, ReturnInvoice } = require('../models');

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
            sendLicenseEmail(email, normalizedTenantId, businessName, licenseKey, expirationDate, baseDomain);
        }
        
        // Update Cloudflare Tunnel asynchronously
        if (process.env.CF_ACCOUNT_ID && baseDomain) {
            updateCloudflareTunnelConfig(`${normalizedTenantId}.${baseDomain}`).catch(err => console.error(err));
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

router.get('/api/inquiries', authenticateToken, async (req, res) => {
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
router.get('/api/settings', async (req, res) => {
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

router.post('/api/settings', authenticateToken, async (req, res) => {
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
router.get('/api/products', async (req, res) => {
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

router.post('/api/products', authenticateToken, async (req, res) => {
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

router.put('/api/products/:id', authenticateToken, async (req, res) => {
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

router.delete('/api/products/:id', authenticateToken, async (req, res) => {
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
router.get('/api/invoices', async (req, res) => {
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

router.post('/api/invoices', authenticateToken, async (req, res) => {
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

router.post('/api/invoices/:id/zatca-report', authenticateToken, async (req, res) => {
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

router.post('/api/invoices/:id/refund', authenticateToken, async (req, res) => {
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
router.get('/api/expenses', async (req, res) => {
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

router.post('/api/expenses', authenticateToken, async (req, res) => {
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
router.get('/api/assets', async (req, res) => {
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

router.post('/api/assets', authenticateToken, async (req, res) => {
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
router.get('/api/customers', async (req, res) => {
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

router.get('/api/employees', async (req, res) => {
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

router.get('/api/suppliers', async (req, res) => {
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

router.get('/api/orders', async (req, res) => {
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

router.post('/api/customers', authenticateToken, async (req, res) => {
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

router.post('/api/suppliers', authenticateToken, async (req, res) => {
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

router.put('/api/orders/:id', authenticateToken, async (req, res) => {
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

router.post('/api/orders', authenticateToken, async (req, res) => {
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

router.delete('/api/orders/:id', authenticateToken, async (req, res) => {
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
router.put('/api/expenses/:id', authenticateToken, async (req, res) => {
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

router.delete('/api/expenses/:id', authenticateToken, async (req, res) => {
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
router.get('/api/users', authenticateToken, async (req, res) => {
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

router.post('/api/users', authenticateToken, async (req, res) => {
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

router.put('/api/users/:id', authenticateToken, async (req, res) => {
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

router.delete('/api/users/:id', authenticateToken, async (req, res) => {
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
router.get('/api/quotations', async (req, res) => {
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

router.post('/api/quotations', authenticateToken, async (req, res) => {
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

router.delete('/api/quotations/:id', authenticateToken, async (req, res) => {
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

router.put('/api/quotations/:id', authenticateToken, async (req, res) => {
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
router.get('/api/saas/stores', requireSaasAdmin, async (req, res) => {
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
router.delete('/api/saas/stores/:tenantId', requireSaasAdmin, async (req, res) => {
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
router.patch('/api/saas/stores/:tenantId/status', requireSaasAdmin, async (req, res) => {
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
router.get('/api/saas/inquiries', requireSaasAdmin, async (req, res) => {
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
router.get('/api/saas/stats', requireSaasAdmin, async (req, res) => {
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

router.post('/api/quotations', authenticateToken, async (req, res) => {
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

router.delete('/api/quotations/:id', authenticateToken, async (req, res) => {
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

router.put('/api/quotations/:id', authenticateToken, async (req, res) => {
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
router.get('/api/saas/stores', requireSaasAdmin, async (req, res) => {
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
router.delete('/api/saas/stores/:tenantId', requireSaasAdmin, async (req, res) => {
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
router.patch('/api/saas/stores/:tenantId/status', requireSaasAdmin, async (req, res) => {
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
router.get('/api/saas/inquiries', requireSaasAdmin, async (req, res) => {
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
router.get('/api/saas/stats', requireSaasAdmin, async (req, res) => {
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

module.exports = router;
