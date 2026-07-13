
const mongoose = require('mongoose');

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
    enabledModules: { type: Object, default: {} },
    smtp: {
        provider: { type: String, default: 'smtp' }, // 'smtp' or 'sendgrid'
        host: { type: String },
        port: { type: Number },
        user: { type: String },
        password: { type: String },
        fromEmail: { type: String },
        sendgridApiKey: { type: String }
    },
    
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

// --- NEW SCHEMAS FOR MODERNIZATION ---

const warehouseSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    location: { type: String },
    manager: { type: String },
    tenantId: { type: String, default: 'default', index: true }
});
const Warehouse = mongoose.model('Warehouse', warehouseSchema);

const inventoryTxSchema = new mongoose.Schema({
    txId: { type: String, required: true },
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ['IN', 'OUT', 'TRANSFER'], required: true },
    productId: { type: String, required: true },
    qty: { type: Number, required: true },
    warehouseId: { type: String, required: true },
    toWarehouseId: { type: String }, // For transfers
    tenantId: { type: String, default: 'default', index: true }
});
const InventoryTx = mongoose.model('InventoryTx', inventoryTxSchema);

const journalEntrySchema = new mongoose.Schema({
    entryId: { type: String, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String, required: true },
    account: { type: String, required: true },
    debit: { type: Number, default: 0 },
    credit: { type: Number, default: 0 },
    tenantId: { type: String, default: 'default', index: true }
});
const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

const voucherSchema = new mongoose.Schema({
    voucherId: { type: String, required: true },
    type: { type: String, enum: ['RECEIPT', 'PAYMENT'], required: true },
    date: { type: Date, default: Date.now },
    entityType: { type: String, enum: ['CUSTOMER', 'SUPPLIER', 'OTHER'], required: true },
    entityId: { type: String },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    description: { type: String },
    tenantId: { type: String, default: 'default', index: true }
});
const Voucher = mongoose.model('Voucher', voucherSchema);

const salarySchema = new mongoose.Schema({
    salaryId: { type: String, required: true },
    employeeId: { type: String, required: true },
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    deductions: { type: Number, default: 0 },
    bonuses: { type: Number, default: 0 },
    netPay: { type: Number, required: true },
    month: { type: String, required: true },
    tenantId: { type: String, default: 'default', index: true }
});
const Salary = mongoose.model('Salary', salarySchema);

const purchaseInvoiceSchema = new mongoose.Schema({
    invoiceId: { type: String, required: true },
    supplierId: { type: String, required: true },
    date: { type: Date, default: Date.now },
    items: [
        {
            productId: { type: String, required: true },
            qty: { type: Number, required: true },
            cost: { type: Number, required: true }
        }
    ],
    subtotal: { type: Number, required: true },
    vat: { type: Number, required: true },
    total: { type: Number, required: true },
    tenantId: { type: String, default: 'default', index: true }
});
const PurchaseInvoice = mongoose.model('PurchaseInvoice', purchaseInvoiceSchema);

const returnInvoiceSchema = new mongoose.Schema({
    returnId: { type: String, required: true },
    originalInvoiceId: { type: String, required: true },
    type: { type: String, enum: ['SALES', 'PURCHASE'], required: true },
    date: { type: Date, default: Date.now },
    items: [
        {
            productId: { type: String, required: true },
            qty: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalReturn: { type: Number, required: true },
    tenantId: { type: String, default: 'default', index: true }
});
const ReturnInvoice = mongoose.model('ReturnInvoice', returnInvoiceSchema);

module.exports = {
    User, Product, Invoice, Quotation, Expense, Asset, Customer, Employee, Supplier, Order, Settings, Inquiry,
    Warehouse, InventoryTx, JournalEntry, Voucher, Salary, PurchaseInvoice, ReturnInvoice
};
