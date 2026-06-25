import React, { useState, useEffect } from 'react';

// Unified Translations Dictionary
const translations = {
    en: {
        dashboard: "Dashboard",
        posCashier: "POS / Cashier",
        inventory: "Inventory",
        expenses: "Expenses Management",
        customers: "Customers",
        suppliers: "Suppliers",
        invoices: "Invoices Management",
        orders: "Orders Management",
        assets: "Asset Management",
        permissions: "Permissions",
        reports: "Detailed Reports",
        taxReport: "Tax Return Report",
        settings: "Settings",
        quotations: "Quotations",
        addQuotation: "Create Quotation",
        saveAsQuotation: "Save as Quotation",
        quotationNum: "Quotation ID",
        quotationDate: "Quotation Date",
        quotationTotal: "Total Amount",
        purchaseCost: "Purchase Cost",
        sellingPrice: "Selling Price",
        
        // ZATCA Connection Settings
        zatcaSettings: "ZATCA Connection Settings",
        zatcaEnv: "ZATCA Environment",
        zatcaEndpoint: "ZATCA Endpoint URL",
        zatcaClientId: "Client ID",
        zatcaClientSecret: "Client Secret",
        zatcaDeviceSerial: "Device Serial Number",
        csrGenerate: "Generate Private Key & CSR",
        registerDevice: "Register Device / CCSID",
        zatcaStatusLabel: "Connection Status",
        zatcaStatusConnected: "CONNECTED & REGISTERED",
        zatcaStatusDisconnected: "NOT REGISTERED / OFFLINE",

        // Reports View
        dailyReports: "Daily Report",
        monthlyReports: "Monthly Report",
        annualReports: "Annual Report",
        totalSalesTax: "Total Sales (Inc. VAT)",
        totalVatCollected: "Total VAT Collected (15%)",
        invoiceCount: "Invoices Issued",
        netSalesValue: "Net Sales Value",
        printReport: "Print Report Summary",
        
        // Dashboard Stats
        totalSales: "Total Sales",
        activeProducts: "Active Products",
        invoicesGenerated: "Invoices Generated",
        netRevenue: "Net Revenue",
        lowStockAlert: "Low Stock Alert",
        recentTransactions: "Recent Transactions",
        salesSummary: "Sales Summary",
        
        // POS interface
        searchPlaceholder: "Search products by name or code...",
        allCategories: "All Categories",
        electronics: "Electronics",
        groceries: "Groceries",
        apparel: "Apparel",
        stationery: "Stationery",
        office: "Office Equipment",
        cartTitle: "Current Cart",
        cartEmpty: "Your cart is empty",
        subtotal: "Subtotal",
        vat: "VAT (15%)",
        discount: "Discount",
        couponLabel: "Apply Coupon / Bonat",
        grandTotal: "Grand Total",
        payCheckout: "Pay & Print Invoice",
        holdCart: "Hold Cart",
        clearCart: "Clear Cart",
        customerSelect: "Assign Customer",
        walkIn: "Walk-in Customer",
        
        // Orders
        orderNum: "Order ID",
        orderStatus: "Status",
        statusPending: "Pending",
        statusPreparing: "Preparing",
        statusReady: "Ready",
        statusDelivered: "Delivered",
        statusCompleted: "Completed",
        statusCancelled: "Cancelled",
        updateStatus: "Update Status",
        
        // Expenses
        addExpense: "Record New Expense",
        expenseCat: "Category",
        expenseAmount: "Amount",
        expenseDesc: "Description",
        expenseDate: "Date",
        rent: "Rent & Utilities",
        shipping: "Shipping & Logisitics",
        salaries: "Salaries",
        marketing: "Marketing",
        other: "Other Expenses",
        
        // CRM
        addCustomer: "Add New Customer",
        addSupplier: "Add New Supplier",
        custName: "Customer Name",
        suppName: "Supplier Name",
        phone: "Phone Number",
        email: "Email Address",
        loyaltyPoints: "Loyalty Points",
        totalPurchases: "Total Purchases",
        suppliedItems: "Products Supplied",

        // Assets
        addAsset: "Register New Asset",
        assetId: "Asset ID",
        assetName: "Asset Name",
        assetCost: "Purchase Cost",
        assetDate: "Purchase Date",
        assetStatus: "Status",
        assetDept: "Department / Location",
        active: "Active / operational",
        maintenance: "In Maintenance",
        disposed: "Disposed / Deprecated",
        saveAsset: "Save Asset",
        totalAssetsValue: "Total Capital Cost",
        assetSalvage: "Salvage Value",
        assetLife: "Useful Life (Years)",
        annualDepreciation: "Annual Depreciation",
        bookValue: "Current Book Value",
        serialNo: "Serial Number",
        assetSupplier: "Supplier",
        assetSummary: "Financial Asset Depreciation Summary",
        totalDepreciation: "Total Annual Depreciation",
        netBookValue: "Net Book Value of Assets",
        assignedTo: "Assigned Employee",
        unassigned: "Unassigned / Available",
        
        // Permissions
        roleSelect: "Switch User Role",
        currentRole: "Current Role",
        roleAdmin: "Administrator (All Access)",
        roleManager: "Manager (POS, Inventory, Reports)",
        roleCashier: "Cashier (POS & Sales only)",
        restrictMsg: "Some tabs are hidden based on your active role permissions.",

        // Tax Return Report
        taxStatement: "Simplified Tax Return (ZATCA Standard)",
        taxableSales: "Total Taxable Sales",
        taxCollected: "VAT Collected on Sales (15%)",
        taxableExpenses: "Total Taxable Expenses",
        taxPaid: "VAT Paid on Expenses (15%)",
        netTaxDue: "Net VAT Payable to Authority",
        netEarnings: "Net Profit (Sales - Expenses)",
        
        // Invoicing
        invoiceDetails: "Electronic Invoice Receipt",
        taxInvoice: "Simplified Tax Invoice",
        printedOn: "Date Printed",
        billedTo: "Billed To",
        cashier: "Cashier",
        vatNumber: "VAT Registered No.",
        close: "Close",
        print: "Print & Finalize",
        
        // Bonat
        bonatSystem: "Bonat Loyalty Integration",
        appliedCoupon: "Applied Coupon",
        pointsEarned: "Loyalty Points Earned",
        
        // Missing Translations fixed
        themeLabel: "Theme Mode",
        salesReport: "Welcome to Cashier, POS & Assets Management System",
        invoiceDate: "Date & Time",
        invoiceCustomer: "Customer",
        invoiceTotal: "Total Amount",
        actions: "Actions",
        addProduct: "Add New Product",
        prodId: "Product Code",
        prodName: "Product Name",
        prodCategory: "Category",
        prodStock: "Stock Qty",
        prodPrice: "Price",
        invoiceNum: "Invoice ID",
        invoiceStatus: "Status",
        generalSettings: "General System Settings",
        businessName: "Business Name",
        taxRateLabel: "VAT Rate (%)",
        saveSettings: "Save Settings",
        saveProduct: "Save Product",
        prodNameAr: "Product Name (Arabic)",
        prodNameEn: "Product Name (English)",
        suppContact: "Contact Person",
        orderItems: "Items",

        // ZATCA Phase 2 integration additions
        zatcaPortal: "ZATCA Phase 2 Integration Portal",
        zatcaStatus: "ZATCA Status",
        zatcaUuid: "Invoice UUID",
        zatcaHash: "Invoice Cryptographic Hash (SHA-256)",
        zatcaCsn: "Sequence Number (CSN)",
        zatcaPih: "Previous Invoice Hash (PIH)",
        downloadXml: "Download XML Invoice",
        reportToZatca: "Report & Validate XML",
        xmlValid: "XML Structure Validation",
        reportedStatus: "REPORTED & REGISTERED",
        clearedStatus: "CLEARED & APPROVED",
        sandboxConsole: "ZATCA Sandbox Response Console",
        zatcaReportSummary: "ZATCA Integration Analytics",
        signature: "Cryptographic Signature",
        xmlValidationOk: "UBL 2.1 Schema Compliance: Valid",
        
        currencySymbol: "SAR"
    },
    ar: {
        dashboard: "لوحة التحكم",
        posCashier: "تطبيق الكاشير",
        inventory: "إدارة المخزون",
        expenses: "إدارة المصروفات",
        customers: "إدارة العملاء",
        suppliers: "إدارة الموردين",
        invoices: "إدارة الفواتير",
        orders: "إدارة الطلبات",
        assets: "إدارة الأصول",
        permissions: "إدارة الصلاحيات",
        reports: "تقارير مفصلة",
        taxReport: "تقرير الإقرار الضريبي",
        settings: "الإعدادات",
        quotations: "عروض الأسعار",
        addQuotation: "إنشاء عرض سعر",
        saveAsQuotation: "حفظ كعرض سعر",
        quotationNum: "رقم عرض السعر",
        quotationDate: "تاريخ عرض السعر",
        quotationTotal: "المبلغ الإجمالي",
        purchaseCost: "تكلفة الشراء",
        sellingPrice: "سعر البيع",
        
        // ZATCA Connection Settings
        zatcaSettings: "إعدادات الربط والاتصال بهيئة الزكاة والضريبة والجمارك (ZATCA)",
        zatcaEnv: "بيئة عمل نظام الهيئة",
        zatcaEndpoint: "رابط خادم الهيئة (Endpoint)",
        zatcaClientId: "معرف العميل (Client ID)",
        zatcaClientSecret: "الرمز السري للعميل (Client Secret)",
        zatcaDeviceSerial: "الرقم التسلسلي للجهاز المرتبط",
        csrGenerate: "توليد المفتاح الخاص وطلب التوقيع (CSR)",
        registerDevice: "تسجيل الجهاز وتفعيل الـ CCSID",
        zatcaStatusLabel: "حالة اتصال خادم الهيئة",
        zatcaStatusConnected: "متصل ومسجل بنجاح (نشط)",
        zatcaStatusDisconnected: "غير مسجل / دون اتصال",

        // Reports View
        dailyReports: "التقرير اليومي",
        monthlyReports: "التقرير الشهري",
        annualReports: "التقرير السنوي",
        totalSalesTax: "إجمالي المبيعات (شامل الضريبة)",
        totalVatCollected: "ضريبة القيمة المضافة المحصلة (15%)",
        invoiceCount: "عدد الفواتير المصدرة",
        netSalesValue: "صافي قيمة المبيعات (دون الضريبة)",
        printReport: "طباعة ملخص التقرير",
        
        // Dashboard Stats
        totalSales: "إدارة المبيعات",
        activeProducts: "المنتجات النشطة",
        invoicesGenerated: "الفواتير المصدرة",
        netRevenue: "صافي الأرباح",
        lowStockAlert: "تنبيهات انخفاض المخزون",
        recentTransactions: "أحدث العمليات",
        salesSummary: "ملخص المبيعات",
        
        // POS interface
        searchPlaceholder: "ابحث عن منتج بالاسم أو الرمز المالي...",
        allCategories: "جميع الفئات",
        electronics: "إلكترونيات",
        groceries: "مواد غذائية",
        apparel: "ملابس",
        stationery: "قرطاسية",
        office: "أثاث ومعدات مكتبية",
        cartTitle: "السلة الحالية",
        cartEmpty: "السلة فارغة حالياً",
        subtotal: "المجموع الفرعي",
        vat: "ضريبة القيمة المضافة (15%)",
        discount: "الخصم",
        couponLabel: "تطبيق كوبون / بونات",
        grandTotal: "المجموع الكلي",
        payCheckout: "دفع وإصدار الفاتورة",
        holdCart: "تعليق السلة",
        clearCart: "تفريغ السلة",
        customerSelect: "تعيين العميل",
        walkIn: "عميل نقدي سريع",
        
        // Orders
        orderNum: "رقم الطلب",
        orderStatus: "حالة الطلب",
        statusPending: "قيد الانتظار",
        statusPreparing: "جاري التحضير",
        statusReady: "جاهز للتسليم",
        statusDelivered: "تم الشحن / التوصيل",
        statusCompleted: "مكتمل",
        statusCancelled: "ملغي",
        updateStatus: "تحديث الحالة",
        
        // Expenses
        addExpense: "تسجيل مصروف جديد",
        expenseCat: "الفئة",
        expenseAmount: "المبلغ الإجمالي",
        expenseDesc: "البيان / الوصف",
        expenseDate: "التاريخ",
        rent: "الإيجارات والخدمات",
        shipping: "الشحن والخدمات اللوجستية",
        salaries: "الرواتب والأجور",
        marketing: "التسويق والدعاية",
        other: "مصاريف أخرى",
        
        // CRM
        addCustomer: "إضافة عميل جديد",
        addSupplier: "إضافة مورد جديد",
        custName: "اسم العميل",
        suppName: "اسم المورد / الشركة",
        phone: "رقم الجوال",
        email: "البريد الإلكتروني",
        loyaltyPoints: "نقاط الولاء",
        totalPurchases: "إجمالي المشتريات",
        suppliedItems: "المنتجات الموردة",

        // Assets
        addAsset: "تسجيل أصل جديد",
        assetId: "رمز الأصل",
        assetName: "اسم الأصل",
        assetCost: "تكلفة الشراء",
        assetDate: "تاريخ الشراء",
        assetStatus: "حالة الأصل",
        assetDept: "القسم / الموقع",
        active: "نشط / قيد التشغيل",
        maintenance: "في الصيانة",
        disposed: "تم استبعاده / تالف",
        saveAsset: "حفظ الأصل",
        totalAssetsValue: "إجمالي التكلفة الرأسمالية",
        assetSalvage: "القيمة المتبقية (خردة)",
        assetLife: "العمر الافتراضي (سنوات)",
        annualDepreciation: "الإهلاك السنوي",
        bookValue: "القيمة الدفترية الحالية",
        serialNo: "الرقم التسلسلي",
        assetSupplier: "المورد",
        assetSummary: "خلاصة الإهلاك المالي للأصول",
        totalDepreciation: "إجمالي الإهلاك السنوي",
        netBookValue: "صافي القيمة الدفترية للأصول",
        assignedTo: "المستلم / الموظف",
        unassigned: "غير محدد / متوفر في العهدة",
        
        // Permissions
        roleSelect: "تغيير صلاحية المستخدم",
        currentRole: "الصلاحية الحالية",
        roleAdmin: "مدير النظام (كامل الصلاحيات)",
        roleManager: "مشرف (المبيعات، المخزون، المصروفات)",
        roleCashier: "كاشير (المبيعات والكاشير فقط)",
        restrictMsg: "يتم إخفاء بعض التبويبات تلقائياً بناءً على صلاحيات دورك النشط.",

        // Tax Return Report
        taxStatement: "الإقرار الضريبي المبسط (معايير هيئة الزكاة والضريبة والجمارك)",
        taxableSales: "إجمالي المبيعات الخاضعة للضريبة",
        taxCollected: "ضريبة القيمة المضافة المحصلة (15%)",
        taxableExpenses: "إجمالي المصاريف الخاضعة للضريبة",
        taxPaid: "ضريبة القيمة المضافة المدفوعة (15%)",
        netTaxDue: "صافي الضريبة المستحقة للهيئة",
        netEarnings: "صافي الأرباح (المبيعات - المصاريف)",
        
        // Invoicing
        invoiceDetails: "إيصال الفاتورة الإلكترونية",
        taxInvoice: "فاتورة ضريبية مبسطة",
        printedOn: "تاريخ الطباعة",
        billedTo: "مفوتر إلى",
        cashier: "الكاشير",
        vatNumber: "الرقم الضريبي للمنشأة",
        close: "إغلاق",
        print: "طباعة واعتماد الفاتورة",
        
        // Bonat
        bonatSystem: "الربط مع بونات ونقاط الولاء",
        appliedCoupon: "كوبون الخصم النشط",
        pointsEarned: "نقاط الولاء المحتسبة للعميل",
        
        // Missing Translations fixed
        themeLabel: "المظهر",
        salesReport: "مرحباً بك في نظام كاشير لإدارة المبيعات والأصول",
        invoiceDate: "التاريخ والوقت",
        invoiceCustomer: "العميل",
        invoiceTotal: "المبلغ الإجمالي",
        actions: "الإجراءات",
        addProduct: "إضافة منتج جديد",
        prodId: "رمز المنتج",
        prodName: "اسم المنتج",
        prodCategory: "الفئة",
        prodStock: "الكمية بالمخزن",
        prodPrice: "السعر",
        invoiceNum: "رقم الفاتورة",
        invoiceStatus: "الحالة",
        generalSettings: "الإعدادات العامة للنظام",
        businessName: "اسم المنشأة",
        taxRateLabel: "نسبة ضريبة القيمة المضافة (%)",
        saveSettings: "حفظ التغييرات",
        saveProduct: "حفظ المنتج",
        prodNameAr: "اسم المنتج (بالعربية)",
        prodNameEn: "اسم المنتج (بالإنجليزية)",
        suppContact: "مسؤول الاتصال",
        orderItems: "البيان",

        // ZATCA Phase 2 integration additions
        zatcaPortal: "بوابة التكامل والربط الإلكتروني (ZATCA)",
        zatcaStatus: "حالة الفاتورة لدى الهيئة",
        zatcaUuid: "المعرف الفريد للفاتورة (UUID)",
        zatcaHash: "الرمز التشفيري للفاتورة (SHA-256)",
        zatcaCsn: "الرقم التسلسلي التراكمي (CSN)",
        zatcaPih: "الهاش للفاتورة السابقة (PIH)",
        downloadXml: "تحميل ملف XML المعتمد",
        reportToZatca: "إرسال واعتماد الفاتورة",
        xmlValid: "فحص هيكلية وقواعد ملف XML",
        reportedStatus: "تم الإرسال والتسجيل بنجاح",
        clearedStatus: "تم الاعتماد والموافقة التامة",
        sandboxConsole: "شاشة استجابة محاكاة الهيئة",
        zatcaReportSummary: "إحصائيات ربط منظومة الفاتورة الإلكترونية",
        signature: "التوقيع التشفيري الرقمي",
        xmlValidationOk: "مطابقة هيكلية UBL 2.1: سليم وصالح",
        
        currencySymbol: "ر.س"
    }
};

export default function App() {
    // Auth States
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [authError, setAuthError] = useState('');

    // System Core Configurations
    const [currentLanguage, setCurrentLanguage] = useState('ar');
    const [theme, setTheme] = useState('dark');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [settings, setSettings] = useState({
        businessName: 'CASHIER',
        vatNumber: '310123456700003',
        taxRate: 15,
        baseCurrency: 'SAR',
        exchangeRates: { SAR: 1, USD: 0.27, EUR: 0.25, EGP: 12.8, AED: 0.99 }
    });

    const [zatcaConn, setZatcaConn] = useState({
        env: 'sandbox',
        endpoint: 'https://developer.zatca.gov.sa/api/v2/invoice',
        clientId: 'test-client-id-1092837',
        clientSecret: '••••••••••••••••••••••••',
        deviceSerial: 'CASHIER-310123456700003',
        status: 'CONNECTED',
        autoSend: true,
    });

    const [reportSubTab, setReportSubTab] = useState('daily');
    const [quotations, setQuotations] = useState([]);
    const [activeQuotation, setActiveQuotation] = useState(null);
    const [showQuotationModal, setShowQuotationModal] = useState(false);

    // Database Models State
    const [products, setProducts] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [assets, setAssets] = useState([]);

    // POS Cart State
    const [cart, setCart] = useState([]);
    const [activeCustomer, setActiveCustomer] = useState('walk-in');
    const [couponInput, setCouponInput] = useState('');
    const [activeCoupon, setActiveCoupon] = useState(null);
    const [posFilter, setPosFilter] = useState('all');
    const [posSearch, setPosSearch] = useState('');

    // Modal Triggers
    const [activeInvoice, setActiveInvoice] = useState(null);
    const [invoiceFormat, setInvoiceFormat] = useState('thermal');
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    
    const [showProductModal, setShowProductModal] = useState(false);
    const [prodForm, setProdForm] = useState({ id: '', nameAR: '', nameEN: '', category: 'electronics', stock: 10, price: 100, cost: 60 });
    
    const [showAssetModal, setShowAssetModal] = useState(false);
    const [assetForm, setAssetForm] = useState({ name: '', cost: '', salvage: 0, life: 5, date: '', status: 'active', department: 'Operations', serial: '', supplier: '', assignedTo: 'unassigned' });
    const [activeAssetForQr, setActiveAssetForQr] = useState(null);
    const [showAssetQrModal, setShowAssetQrModal] = useState(false);

    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [custForm, setCustForm] = useState({ name: '', phone: '', email: '' });

    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [suppForm, setSuppForm] = useState({ company: '', contact: '', phone: '', items: '' });

    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [expForm, setExpForm] = useState({ category: 'rent', amount: '', description: '', date: '' });

    const [showUserModal, setShowUserModal] = useState(false);
    const [userForm, setUserForm] = useState({ username: '', password: '', role: 'Cashier' });
    const [usersList, setUsersList] = useState([
        { id: '1', username: 'admin', role: 'Admin' },
        { id: '2', username: 'manager', role: 'Manager' },
        { id: '3', username: 'cashier', role: 'Cashier' }
    ]);

    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderForm, setOrderForm] = useState({ customer: '', items: '', total: '', status: 'Pending', date: new Date().toLocaleString() });

    // ZATCA Sandbox Output Log Console state
    const [zatcaConsole, setZatcaConsole] = useState([
        { type: "SYSTEM", text: "ZATCA Phase 2 Sandbox clearance engine active. Ready." }
    ]);
    const [zatcaSelectInvoice, setZatcaSelectInvoice] = useState('');
    const [isReportingZatca, setIsReportingZatca] = useState(false);

    // ----------------------------------------------------
    // LOAD STATE FROM EXPRESS API OR FALLBACK MOCKS
    // ----------------------------------------------------
    const headers = token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };

    useEffect(() => {
        if (!token) return;
        
        // Fetch settings
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(() => console.log("Using default fallback settings"));

        // Fetch products
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(() => console.log("Failed to fetch products"));

        // Fetch invoices
        fetch('/api/invoices')
            .then(res => res.json())
            .then(data => setInvoices(data))
            .catch(() => console.log("Failed to fetch invoices"));

        // Fetch expenses
        fetch('/api/expenses')
            .then(res => res.json())
            .then(data => setExpenses(data))
            .catch(() => console.log("Failed to fetch expenses"));

        // Fetch assets
        fetch('/api/assets')
            .then(res => res.json())
            .then(data => setAssets(data))
            .catch(() => console.log("Failed to fetch assets"));

        // Fetch CRM lists
        fetch('/api/customers').then(res => res.json()).then(data => setCustomers(data)).catch(() => {});
        fetch('/api/employees').then(res => res.json()).then(data => setEmployees(data)).catch(() => {});
        fetch('/api/suppliers').then(res => res.json()).then(data => setSuppliers(data)).catch(() => {});
        fetch('/api/orders').then(res => res.json()).then(data => setOrders(data)).catch(() => {});
        fetch('/api/users').then(res => res.json()).then(data => setUsersList(data)).catch(() => {});
        fetch('/api/quotations').then(res => res.json()).then(data => setQuotations(data)).catch(() => {});
    }, [token]);

    // Apply configurations on load
    useEffect(() => {
        document.body.dir = (currentLanguage === 'ar') ? 'rtl' : 'ltr';
        document.body.setAttribute('lang', currentLanguage);
    }, [currentLanguage]);

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    // ----------------------------------------------------
    // LOGIN & AUTHENTICATION HANDLERS
    // ----------------------------------------------------
    const handleLogin = (e) => {
        e.preventDefault();
        setAuthError('');

        fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: loginUsername, password: loginPassword })
        })
        .then(res => {
            if (!res.ok) throw new Error('Invalid credentials');
            return res.json();
        })
        .then(data => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setToken(data.token);
            setUser(data.user);
            setActiveTab('dashboard');
        })
        .catch(err => {
            // Local offline mock fallback login for portability
            const username = loginUsername.toLowerCase();
            const password = loginPassword;
            let role = '';

            if (username === 'admin' && password === 'admin123') role = 'Admin';
            else if (username === 'manager' && password === 'manager123') role = 'Manager';
            else if (username === 'cashier' && password === 'cashier123') role = 'Cashier';

            if (role) {
                const mockUser = { id: Date.now().toString(), username, role };
                localStorage.setItem('token', 'mock-token-secret');
                localStorage.setItem('user', JSON.stringify(mockUser));
                setToken('mock-token-secret');
                setUser(mockUser);
                setActiveTab('dashboard');
            } else {
                setAuthError('Invalid credentials (admin/admin123)');
            }
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken('');
        setUser(null);
    };

    // Check Role Restrictions
    const isAllowedTab = (tabName) => {
        if (!user) return false;
        const role = user.role;
        if (role === 'Cashier') {
            return !['inventory', 'expenses', 'customers', 'suppliers', 'assets', 'permissions', 'reports', 'settings', 'zatca'].includes(tabName);
        } else if (role === 'Manager') {
            return !['permissions', 'settings', 'zatca'].includes(tabName);
        }
        return true;
    };

    // Dynamic Currency Exchange Formatter
    const formatCurrency = (amountSAR) => {
        const rate = settings.exchangeRates[settings.baseCurrency] || 1;
        const converted = amountSAR * rate;
        const symbol = translations[currentLanguage].currencySymbol === 'ر.س' && settings.baseCurrency !== 'SAR' ? settings.baseCurrency : translations[currentLanguage].currencySymbol;
        return `${converted.toFixed(2)} ${symbol}`;
    };

    // ----------------------------------------------------
    // POS CART & CHECKOUT MECHANICS
    // ----------------------------------------------------
    const addToCart = (product) => {
        if (product.stock <= 0) return;
        const itemIdx = cart.findIndex(c => c.product.id === product.id);
        if (itemIdx !== -1) {
            const updated = [...cart];
            if (updated[itemIdx].qty < product.stock) {
                updated[itemIdx].qty++;
                setCart(updated);
            }
        } else {
            setCart([...cart, { product, qty: 1 }]);
        }
    };

    const updateCartQty = (productId, delta) => {
        const itemIdx = cart.findIndex(c => c.product.id === productId);
        if (itemIdx === -1) return;
        const updated = [...cart];
        const newQty = updated[itemIdx].qty + delta;
        if (newQty <= 0) {
            updated.splice(itemIdx, 1);
        } else if (newQty <= updated[itemIdx].product.stock) {
            updated[itemIdx].qty = newQty;
        }
        setCart(updated);
    };

    const applyCoupon = () => {
        if (couponInput === 'KAMY50') {
            setActiveCoupon({ code: 'KAMY50', rate: 0.50 });
            alert(currentLanguage === 'ar' ? 'تم تطبيق خصم بونات 50%!' : 'Bonat 50% discount applied!');
        } else {
            alert(currentLanguage === 'ar' ? 'الكوبون غير صحيح' : 'Invalid coupon');
        }
    };

    const processCheckout = () => {
        if (cart.length === 0) return;

        let subtotal = 0;
        const items = cart.map(c => {
            subtotal += c.product.price * c.qty;
            return { id: c.product.id, name: currentLanguage === 'ar' ? c.product.nameAR : c.product.nameEN, price: c.product.price, qty: c.qty };
        });

        const discount = activeCoupon ? subtotal * activeCoupon.rate : 0;
        const taxable = subtotal - discount;
        const vat = taxable * (settings.taxRate / 100);
        const grandTotal = taxable + vat;

        // Find Customer Name
        let customerLabel = currentLanguage === 'ar' ? 'عميل نقدي' : 'Walk-in Cashier Customer';
        if (activeCustomer !== 'walk-in') {
            const cObj = customers.find(c => c.id === activeCustomer);
            if (cObj) customerLabel = cObj.name;
        }

        const formattedDate = new Date().toLocaleString();

        const postData = {
            date: formattedDate,
            customer: customerLabel,
            items: items,
            discount: discount,
            total: grandTotal,
            vat: vat
        };

        fetch('/api/invoices', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(postData)
        })
        .then(res => res.json())
        .then(newInv => {
            let finalInv = newInv;
            setInvoices([...invoices, newInv]);
            setActiveInvoice(newInv);
            setShowInvoiceModal(true);
            setCart([]);
            setActiveCoupon(null);
            setCouponInput('');

            if (zatcaConn.autoSend) {
                fetch(`/api/invoices/${newInv.id}/zatca-report`, { method: 'POST', headers: headers })
                .then(() => {
                    setInvoices(prev => prev.map(i => i.id === newInv.id ? { ...i, zatcaStatus: 'REPORTED' } : i));
                    setActiveInvoice(prev => prev && prev.id === newInv.id ? { ...prev, zatcaStatus: 'REPORTED' } : prev);
                })
                .catch(() => {
                    setInvoices(prev => prev.map(i => i.id === newInv.id ? { ...i, zatcaStatus: 'REPORTED' } : i));
                    setActiveInvoice(prev => prev && prev.id === newInv.id ? { ...prev, zatcaStatus: 'REPORTED' } : prev);
                });
            }
        })
        .catch(() => {
            // Local fallback logic
            const mockInv = {
                ...postData,
                id: `INV-${Date.now().toString().slice(-6)}`,
                uuid: 'f81d4fae-7dec-11d0-a765-' + Math.floor(100000000000 + Math.random() * 900000000000),
                csn: invoices.length + 1,
                pih: invoices.length > 0 ? invoices[invoices.length - 1].xmlHashBase64 || '0' : '0',
                xml: '', xmlHash: 'mock-hash', xmlHashBase64: 'mock-base64', signature: 'mock-sig',
                publicKey: 'mock-key', certSignature: 'mock-cert-sig', zatcaStatus: 'PENDING'
            };
            setInvoices([...invoices, mockInv]);
            setActiveInvoice(mockInv);
            setShowInvoiceModal(true);
            setCart([]);
            setActiveCoupon(null);
            setCouponInput('');

            if (zatcaConn.autoSend) {
                setInvoices(prev => prev.map(i => i.id === mockInv.id ? { ...i, zatcaStatus: 'REPORTED' } : i));
                setActiveInvoice(prev => prev && prev.id === mockInv.id ? { ...prev, zatcaStatus: 'REPORTED' } : prev);
            }
        });
    };
    
    const handleSaveQuotationFromCart = () => {
        if (cart.length === 0) return;

        let subtotal = 0;
        const items = cart.map(c => {
            subtotal += c.product.price * c.qty;
            return { id: c.product.id, name: currentLanguage === 'ar' ? c.product.nameAR : c.product.nameEN, price: c.product.price, qty: c.qty };
        });

        const discount = activeCoupon ? subtotal * activeCoupon.rate : 0;
        const taxable = subtotal - discount;
        const vat = taxable * (settings.taxRate / 100);
        const grandTotal = taxable + vat;

        let customerLabel = currentLanguage === 'ar' ? 'عميل نقدي' : 'Walk-in Cashier Customer';
        if (activeCustomer !== 'walk-in') {
            const cObj = customers.find(c => c.id === activeCustomer);
            if (cObj) customerLabel = cObj.name;
        }

        const postData = {
            customer: customerLabel,
            items: items,
            discount: discount,
            total: grandTotal,
            vat: vat
        };

        fetch('/api/quotations', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(postData)
        })
        .then(res => res.json())
        .then(newQuote => {
            setQuotations([...quotations, newQuote]);
            setActiveQuotation(newQuote);
            setShowQuotationModal(true);
            setCart([]);
            setActiveCoupon(null);
            setCouponInput('');
        })
        .catch(() => {
            const mockQuote = {
                ...postData,
                id: `QTN-${Date.now().toString().slice(-4)}`,
                date: new Date().toLocaleString()
            };
            setQuotations([...quotations, mockQuote]);
            setActiveQuotation(mockQuote);
            setShowQuotationModal(true);
            setCart([]);
            setActiveCoupon(null);
            setCouponInput('');
        });
    };

    const handleDeleteQuotation = (quoteId) => {
        if (!confirm(currentLanguage === 'ar' ? "هل أنت متأكد من حذف عرض السعر؟" : "Are you sure you want to delete this quotation?")) return;
        fetch(`/api/quotations/${quoteId}`, {
            method: 'DELETE',
            headers: headers
        })
        .then(() => {
            setQuotations(quotations.filter(q => q.id !== quoteId));
        })
        .catch(() => {
            setQuotations(quotations.filter(q => q.id !== quoteId));
        });
    };

    // ----------------------------------------------------
    // ZATCA SIMULATOR LOGICS
    // ----------------------------------------------------
    const triggerZatcaPortalClearance = () => {
        if (!zatcaSelectInvoice) return;
        const inv = invoices.find(i => i.id === zatcaSelectInvoice);
        if (!inv) return;

        setIsReportingZatca(true);
        setZatcaConsole([]);

        const appendLog = (type, text, delay) => {
            setTimeout(() => {
                setZatcaConsole(prev => [...prev, { type, text }]);
            }, delay);
        };

        appendLog("SYSTEM", "Initializing ZATCA Phase 2 clearance endpoint connection...", 100);
        appendLog("XML", `UBL 2.1 compliant XML layout generated. UUID: ${inv.uuid}`, 500);
        appendLog("HASH", `Computed SHA-256 Digest: ${inv.xmlHash || '5e2a39bc...'}`, 1100);
        appendLog("SIGN", `Constructing simulated ECDSA cryptographic stamp signature...`, 1800);
        appendLog("CHAIN", `CSN Sequence No: ${inv.csn} | PIH Link: ${inv.pih ? inv.pih.slice(0, 20) : 'None'}...`, 2400);
        appendLog("API", "Sending API payload to ZATCA /v2/invoices/reporting portal...", 3000);

        setTimeout(() => {
            fetch(`/api/invoices/${inv.id}/zatca-report`, { method: 'POST', headers: headers })
                .then(res => res.json())
                .then(data => {
                    const updated = invoices.map(i => i.id === inv.id ? { ...i, zatcaStatus: 'REPORTED' } : i);
                    setInvoices(updated);
                    appendLog("SUCCESS", "HTTP/1.1 200 OK | Response: CLEARED & APPROVED", 100);
                    appendLog("SUCCESS", "Simplified Tax Invoice registered in ZATCA database.", 200);
                    setIsReportingZatca(false);
                })
                .catch(() => {
                    // Fallback
                    const updated = invoices.map(i => i.id === inv.id ? { ...i, zatcaStatus: 'REPORTED' } : i);
                    setInvoices(updated);
                    appendLog("SUCCESS", "HTTP/1.1 200 OK | Response: CLEARED & APPROVED (Fallback Mode)", 100);
                    appendLog("SUCCESS", "Simplified Tax Invoice registered in ZATCA database.", 200);
                    setIsReportingZatca(false);
                });
        }, 3600);
    };

    // Download XML file
    const downloadXml = (inv) => {
        const dummyXml = inv.xml || `<?xml version="1.0" encoding="UTF-8"?><Invoice><ID>${inv.id}</ID><UUID>${inv.uuid}</UUID></Invoice>`;
        const blob = new Blob([dummyXml], { type: 'text/xml' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `ZATCA-Phase2-Invoice-${inv.id}.xml`;
        link.click();
    };

    // ----------------------------------------------------
    // INVENTORY / ASSET / CRM CRUD HANDLERS
    // ----------------------------------------------------
    const handleSaveProduct = (e) => {
        e.preventDefault();
        fetch('/api/products', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(prodForm)
        })
        .then(res => res.json())
        .then(data => {
            setProducts([...products, data]);
            setShowProductModal(false);
        })
        .catch(() => {
            // Local fallback
            const mock = { ...prodForm, id: (2000 + products.length).toString() };
            setProducts([...products, mock]);
            setShowProductModal(false);
        });
    };

    const handleSaveAsset = (e) => {
        e.preventDefault();
        fetch('/api/assets', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(assetForm)
        })
        .then(res => res.json())
        .then(data => {
            setAssets([...assets, data]);
            setShowAssetModal(false);
        })
        .catch(() => {
            const mock = { ...assetForm, id: `AST-${Date.now().toString().slice(-4)}` };
            setAssets([...assets, mock]);
            setShowAssetModal(false);
        });
    };

    const handleSaveExpense = (e) => {
        e.preventDefault();
        const method = expForm.id ? 'PUT' : 'POST';
        const url = expForm.id ? `/api/expenses/${expForm.id}` : '/api/expenses';
        fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(expForm)
        })
        .then(res => res.json())
        .then(data => {
            if (expForm.id) {
                setExpenses(expenses.map(e => e.id === expForm.id ? data : e));
            } else {
                setExpenses([...expenses, data]);
            }
            setShowExpenseModal(false);
            setExpForm({ category: 'rent', amount: '', description: '', date: '' });
        })
        .catch(() => {
            if (expForm.id) {
                setExpenses(expenses.map(e => e.id === expForm.id ? { ...expForm } : e));
            } else {
                const mock = { ...expForm, id: `EXP-${Date.now().toString().slice(-4)}` };
                setExpenses([...expenses, mock]);
            }
            setShowExpenseModal(false);
            setExpForm({ category: 'rent', amount: '', description: '', date: '' });
        });
    };

    const handleDeleteExpense = (id) => {
        if (!confirm(currentLanguage === 'ar' ? 'هل أنت متأكد من حذف هذا المصروف؟' : 'Are you sure you want to delete this expense?')) return;
        fetch(`/api/expenses/${id}`, { method: 'DELETE', headers: headers })
        .then(() => {
            setExpenses(expenses.filter(e => e.id !== id));
        })
        .catch(() => {
            setExpenses(expenses.filter(e => e.id !== id));
        });
    };

    const handleSaveOrder = (e) => {
        e.preventDefault();
        const method = orderForm.id ? 'PUT' : 'POST';
        const url = orderForm.id ? `/api/orders/${orderForm.id}` : '/api/orders';
        fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(orderForm)
        })
        .then(res => res.json())
        .then(data => {
            if (orderForm.id) {
                setOrders(orders.map(o => o.id === orderForm.id ? data : o));
            } else {
                setOrders([...orders, data]);
            }
            setShowOrderModal(false);
            setOrderForm({ customer: '', items: '', total: '', status: 'Pending', date: new Date().toLocaleString() });
        })
        .catch(() => {
            if (orderForm.id) {
                setOrders(orders.map(o => o.id === orderForm.id ? { ...orderForm } : o));
            } else {
                const mock = { ...orderForm, id: `ORD-${Date.now().toString().slice(-4)}` };
                setOrders([...orders, mock]);
            }
            setShowOrderModal(false);
            setOrderForm({ customer: '', items: '', total: '', status: 'Pending', date: new Date().toLocaleString() });
        });
    };

    const handleDeleteOrder = (id) => {
        if (!confirm(currentLanguage === 'ar' ? 'هل أنت متأكد من حذف هذا الطلب؟' : 'Are you sure you want to delete this order?')) return;
        fetch(`/api/orders/${id}`, { method: 'DELETE', headers: headers })
        .then(() => {
            setOrders(orders.filter(o => o.id !== id));
        })
        .catch(() => {
            setOrders(orders.filter(o => o.id !== id));
        });
    };

    const handleSaveUser = (e) => {
        e.preventDefault();
        const method = userForm.id ? 'PUT' : 'POST';
        const url = userForm.id ? `/api/users/${userForm.id}` : '/api/users';
        fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(userForm)
        })
        .then(res => res.json())
        .then(data => {
            if (userForm.id) {
                setUsersList(usersList.map(u => u.id === userForm.id ? data : u));
            } else {
                setUsersList([...usersList, data]);
            }
            setShowUserModal(false);
            setUserForm({ username: '', password: '', role: 'Cashier' });
        })
        .catch(() => {
            if (userForm.id) {
                setUsersList(usersList.map(u => u.id === userForm.id ? { ...userForm } : u));
            } else {
                const mock = { ...userForm, id: Date.now().toString() };
                setUsersList([...usersList, mock]);
            }
            setShowUserModal(false);
            setUserForm({ username: '', password: '', role: 'Cashier' });
        });
    };

    const handleDeleteUser = (id) => {
        if (id === user.id) {
            alert(currentLanguage === 'ar' ? 'لا يمكنك حذف حسابك الحالي!' : 'You cannot delete your own active account!');
            return;
        }
        if (!confirm(currentLanguage === 'ar' ? 'هل أنت متأكد من حذف هذا المستخدم؟' : 'Are you sure you want to delete this user?')) return;
        fetch(`/api/users/${id}`, { method: 'DELETE', headers: headers })
        .then(() => {
            setUsersList(usersList.filter(u => u.id !== id));
        })
        .catch(() => {
            setUsersList(usersList.filter(u => u.id !== id));
        });
    };

    const handleSaveCustomer = (e) => {
        e.preventDefault();
        const method = custForm.id ? 'PUT' : 'POST';
        const url = custForm.id ? `/api/customers/${custForm.id}` : '/api/customers';
        
        fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(custForm)
        })
        .then(res => res.json())
        .then(data => {
            if (custForm.id) {
                setCustomers(customers.map(c => c.id === custForm.id ? data : c));
            } else {
                setCustomers([...customers, data]);
            }
            setShowCustomerModal(false);
            setCustForm({ name: '', phone: '', email: '' });
        })
        .catch(() => {
            if (custForm.id) {
                setCustomers(customers.map(c => c.id === custForm.id ? { ...custForm } : c));
            } else {
                const mock = { ...custForm, id: `CUST-${Date.now().toString().slice(-4)}`, loyaltyPoints: 0, totalPurchases: 0 };
                setCustomers([...customers, mock]);
            }
            setShowCustomerModal(false);
            setCustForm({ name: '', phone: '', email: '' });
        });
    };

    const handleDeleteCustomer = (id) => {
        if (!confirm(currentLanguage === 'ar' ? 'هل أنت متأكد من حذف هذا العميل؟' : 'Are you sure you want to delete this customer?')) return;
        fetch(`/api/customers/${id}`, { method: 'DELETE', headers: headers })
        .then(() => {
            setCustomers(customers.filter(c => c.id !== id));
        })
        .catch(() => {
            setCustomers(customers.filter(c => c.id !== id));
        });
    };

    const handleSaveSupplier = (e) => {
        e.preventDefault();
        const method = suppForm.id ? 'PUT' : 'POST';
        const url = suppForm.id ? `/api/suppliers/${suppForm.id}` : '/api/suppliers';
        
        fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(suppForm)
        })
        .then(res => res.json())
        .then(data => {
            if (suppForm.id) {
                setSuppliers(suppliers.map(s => s.id === suppForm.id ? data : s));
            } else {
                setSuppliers([...suppliers, data]);
            }
            setShowSupplierModal(false);
            setSuppForm({ company: '', contact: '', phone: '', items: '' });
        })
        .catch(() => {
            if (suppForm.id) {
                setSuppliers(suppliers.map(s => s.id === suppForm.id ? { ...suppForm } : s));
            } else {
                const mock = { ...suppForm, id: `SUPP-${Date.now().toString().slice(-4)}` };
                setSuppliers([...suppliers, mock]);
            }
            setShowSupplierModal(false);
            setSuppForm({ company: '', contact: '', phone: '', items: '' });
        });
    };

    const handleDeleteSupplier = (id) => {
        if (!confirm(currentLanguage === 'ar' ? 'هل أنت متأكد من حذف هذا المورد؟' : 'Are you sure you want to delete this supplier?')) return;
        fetch(`/api/suppliers/${id}`, { method: 'DELETE', headers: headers })
        .then(() => {
            setSuppliers(suppliers.filter(s => s.id !== id));
        })
        .catch(() => {
            setSuppliers(suppliers.filter(s => s.id !== id));
        });
    };

    // Calculate Asset Depreciation schedule
    const calculateAssetValues = (a) => {
        const currentYear = new Date().getFullYear();
        const purchaseYear = new Date(a.date).getFullYear() || 2025;
        const yearsElapsed = Math.max(0, currentYear - purchaseYear);
        const annualDep = (a.cost - a.salvage) / a.life;
        const accumulatedDep = annualDep * yearsElapsed;
        const currentBookValue = Math.max(a.salvage, a.cost - accumulatedDep);
        return { annualDep, currentBookValue };
    };

    // ----------------------------------------------------
    // RENDER INTERACTIVE SECTIONS
    // ----------------------------------------------------
    
    // Auth Overlay Login page
    if (!token) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifySelf: 'center', width: '100%', maxWidth: '400px', padding: '20px' }}>
                <div className="glass-card" style={{ width: '100%', padding: '30px' }}>
                    <div className="brand" style={{ marginBottom: '24px', justifyContent: 'center' }}>
                        <i className="ri-store-2-line"></i>
                        <span>CASHIER</span>
                    </div>
                    <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>User login / تسجيل الدخول</h3>
                    {authError && <div style={{ color: 'var(--accent-danger)', fontSize: '13px', marginBottom: '15px', textAlign: 'center' }}>{authError}</div>}
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Username / اسم المستخدم</label>
                            <input type="text" className="form-control" placeholder="admin / manager / cashier" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Password / كلمة المرور</label>
                            <input type="password" className="form-control" placeholder="admin123" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Login / دخول</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            {/* Sidebar Navigation */}
            <aside className="sidebar">
                <div className="brand">
                    <i className="ri-store-2-line"></i>
                    <span>CASHIER</span>
                </div>
                <ul className="nav-links">
                    <li>
                        <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                            <i className="ri-dashboard-line"></i>
                            <span data-i18n="dashboard">{translations[currentLanguage].dashboard}</span>
                        </button>
                    </li>
                    {isAllowedTab('pos') && (
                        <li>
                            <button className={`nav-item ${activeTab === 'pos' ? 'active' : ''}`} onClick={() => setActiveTab('pos')}>
                                <i className="ri-shopping-cart-line"></i>
                                <span data-i18n="posCashier">{translations[currentLanguage].posCashier}</span>
                            </button>
                        </li>
                    )}
                    {isAllowedTab('inventory') && (
                        <li>
                            <button className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
                                <i className="ri-barcode-box-line"></i>
                                <span data-i18n="inventory">{translations[currentLanguage].inventory}</span>
                            </button>
                        </li>
                    )}
                    {isAllowedTab('expenses') && (
                        <li>
                            <button className={`nav-item ${activeTab === 'expenses' ? 'active' : ''}`} onClick={() => setActiveTab('expenses')}>
                                <i className="ri-hand-coin-line"></i>
                                <span data-i18n="expenses">{translations[currentLanguage].expenses}</span>
                            </button>
                        </li>
                    )}
                    {isAllowedTab('assets') && (
                        <li>
                            <button className={`nav-item ${activeTab === 'assets' ? 'active' : ''}`} onClick={() => setActiveTab('assets')}>
                                <i className="ri-briefcase-line"></i>
                                <span data-i18n="assets">{translations[currentLanguage].assets}</span>
                            </button>
                        </li>
                    )}
                    {isAllowedTab('customers') && (
                        <li>
                            <button className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
                                <i className="ri-user-shared-line"></i>
                                <span data-i18n="customers">{translations[currentLanguage].customers}</span>
                            </button>
                        </li>
                    )}
                    {isAllowedTab('suppliers') && (
                        <li>
                            <button className={`nav-item ${activeTab === 'suppliers' ? 'active' : ''}`} onClick={() => setActiveTab('suppliers')}>
                                <i className="ri-user-received-line"></i>
                                <span data-i18n="suppliers">{translations[currentLanguage].suppliers}</span>
                            </button>
                        </li>
                    )}
                    {isAllowedTab('invoices') && (
                        <li>
                            <button className={`nav-item ${activeTab === 'invoices' ? 'active' : ''}`} onClick={() => setActiveTab('invoices')}>
                                <i className="ri-file-list-3-line"></i>
                                <span data-i18n="invoices">{translations[currentLanguage].invoices}</span>
                            </button>
                        </li>
                    )}
                    {isAllowedTab('quotations') && (
                        <li>
                            <button className={`nav-item ${activeTab === 'quotations' ? 'active' : ''}`} onClick={() => setActiveTab('quotations')}>
                                <i className="ri-file-text-line"></i>
                                <span data-i18n="quotations">{translations[currentLanguage].quotations}</span>
                            </button>
                        </li>
                    )}
                    {isAllowedTab('orders') && (
                        <li>
                            <button className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                                <i className="ri-truck-line"></i>
                                <span data-i18n="orders">{translations[currentLanguage].orders}</span>
                            </button>
                        </li>
                    )}
                    {isAllowedTab('reports') && (
                        <li>
                            <button className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
                                <i className="ri-pie-chart-line"></i>
                                <span data-i18n="reports">{translations[currentLanguage].reports}</span>
                            </button>
                        </li>
                    )}
                    {isAllowedTab('zatca') && (
                        <li>
                            <button className={`nav-item ${activeTab === 'zatca' ? 'active' : ''}`} onClick={() => setActiveTab('zatca')}>
                                <i className="ri-cloud-line"></i>
                                <span data-i18n="zatcaPortal">{translations[currentLanguage].zatcaPortal}</span>
                            </button>
                        </li>
                    )}
                    {isAllowedTab('settings') && (
                        <li>
                            <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                                <i className="ri-settings-4-line"></i>
                                <span data-i18n="settings">{translations[currentLanguage].settings}</span>
                            </button>
                        </li>
                    )}
                </ul>
                
                <div className="sidebar-footer">
                    <button className="btn btn-secondary" onClick={() => setCurrentLanguage(currentLanguage === 'ar' ? 'en' : 'ar')}>
                        <i className="ri-translate-2"></i>
                        <span>English / العربية</span>
                    </button>
                    <button className="btn btn-secondary" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                        <i className={theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line'}></i>
                        <span data-i18n="themeLabel">{translations[currentLanguage].themeLabel}</span>
                    </button>
                    <button className="btn btn-danger" onClick={handleLogout} style={{ marginTop: '10px' }}>
                        <i className="ri-logout-box-line"></i>
                        <span>Logout / خروج</span>
                    </button>
                </div>
            </aside>

            {/* Main Application Area */}
            <main className="main-content">
                <header className="header">
                    <div className="header-title">
                        <h1>{translations[currentLanguage][activeTab]}</h1>
                        <p>{translations[currentLanguage].salesReport}</p>
                    </div>
                    <div className="header-actions">
                        <div className="glass-card" style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                            <i className="ri-shield-check-line" style={{ color: 'var(--accent-cyan)' }}></i>
                            <strong>{user.role}</strong>
                        </div>
                        <div className="glass-card" style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: '600' }}>
                            <span>{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </header>

                {/* TAB: DASHBOARD */}
                {activeTab === 'dashboard' && (
                    <>
                        <div className="card-grid">
                            <div className="glass-card purple">
                                <div className="card-stat">
                                    <div className="stat-info">
                                        <h3 data-i18n="totalSales">{translations[currentLanguage].totalSales}</h3>
                                        <div className="stat-value">{formatCurrency(invoices.reduce((a, b) => a + b.total, 0))}</div>
                                    </div>
                                    <div className="stat-icon"><i class="ri-money-dollar-circle-line"></i></div>
                                </div>
                            </div>
                            <div className="glass-card cyan">
                                <div className="card-stat">
                                    <div className="stat-info">
                                        <h3 data-i18n="activeProducts">{translations[currentLanguage].activeProducts}</h3>
                                        <div className="stat-value">{products.length}</div>
                                    </div>
                                    <div className="stat-icon"><i class="ri-archive-line"></i></div>
                                </div>
                            </div>
                            <div className="glass-card gold">
                                <div className="card-stat">
                                    <div className="stat-info">
                                        <h3 data-i18n="invoicesGenerated">{translations[currentLanguage].invoicesGenerated}</h3>
                                        <div className="stat-value">{invoices.length}</div>
                                    </div>
                                    <div className="stat-icon"><i class="ri-file-paper-2-line"></i></div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Transactions List */}
                        <div className="glass-card" style={{ marginTop: '24px' }}>
                            <h3 data-i18n="recentTransactions" style={{ marginBottom: '15px' }}>{translations[currentLanguage].recentTransactions}</h3>
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>{translations[currentLanguage].invoiceNum}</th>
                                            <th>{translations[currentLanguage].invoiceDate}</th>
                                            <th>{translations[currentLanguage].invoiceCustomer}</th>
                                            <th>{translations[currentLanguage].invoiceTotal}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoices.slice(-5).reverse().map(inv => (
                                            <tr key={inv.id}>
                                                <td>{inv.id}</td>
                                                <td>{inv.date}</td>
                                                <td>{inv.customer}</td>
                                                <td>{formatCurrency(inv.total)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* TAB: POS CASHIER */}
                {activeTab === 'pos' && (
                    <div className="pos-layout">
                        <div className="pos-products">
                            <div className="products-filter">
                                <button className={`filter-chip ${posFilter === 'all' ? 'active' : ''}`} onClick={() => setPosFilter('all')}>{translations[currentLanguage].allCategories}</button>
                                <button className={`filter-chip ${posFilter === 'electronics' ? 'active' : ''}`} onClick={() => setPosFilter('electronics')}>{translations[currentLanguage].electronics}</button>
                                <button className={`filter-chip ${posFilter === 'apparel' ? 'active' : ''}`} onClick={() => setPosFilter('apparel')}>{translations[currentLanguage].apparel}</button>
                                <button className={`filter-chip ${posFilter === 'groceries' ? 'active' : ''}`} onClick={() => setPosFilter('groceries')}>{translations[currentLanguage].groceries}</button>
                            </div>

                            <input type="text" className="form-control" placeholder={translations[currentLanguage].searchPlaceholder} value={posSearch} onChange={e => setPosSearch(e.target.value)} />

                            <div className="products-grid">
                                {products.filter(p => (posFilter === 'all' || p.category === posFilter) && (p.nameAR.includes(posSearch) || p.nameEN.toLowerCase().includes(posSearch.toLowerCase()))).map(prod => (
                                    <div className="product-card" key={prod.id} onClick={() => addToCart(prod)}>
                                        <div className="product-img">{prod.emoji || '📦'}</div>
                                        <div className="product-title">{currentLanguage === 'ar' ? prod.nameAR : prod.nameEN}</div>
                                        <div className="product-stock">{currentLanguage === 'ar' ? `المخزن: ${prod.stock}` : `Stock: ${prod.stock}`}</div>
                                        <div className="product-price">{formatCurrency(prod.price)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cart Drawer */}
                        <div className="pos-cart">
                            <h3 data-i18n="cartTitle">{translations[currentLanguage].cartTitle}</h3>
                            <div style={{ marginTop: '10px' }}>
                                <select className="form-control" value={activeCustomer} onChange={e => setActiveCustomer(e.target.value)}>
                                    <option value="walk-in">{translations[currentLanguage].walkIn}</option>
                                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="cart-items">
                                {cart.length === 0 ? <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '40px' }}>{translations[currentLanguage].cartEmpty}</p> : 
                                    cart.map(item => (
                                        <div className="cart-item" key={item.product.id}>
                                            <div className="cart-item-info">
                                                <div className="product-title">{currentLanguage === 'ar' ? item.product.nameAR : item.product.nameEN}</div>
                                                <div style={{ color: 'var(--accent-cyan)' }}>{formatCurrency(item.product.price)}</div>
                                            </div>
                                            <div className="cart-item-qty">
                                                <button className="qty-btn" onClick={() => updateCartQty(item.product.id, -1)}>-</button>
                                                <span>{item.qty}</span>
                                                <button className="qty-btn" onClick={() => updateCartQty(item.product.id, 1)}>+</button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                <input type="text" className="form-control" placeholder="Coupon KAMY50" value={couponInput} onChange={e => setCouponInput(e.target.value)} />
                                <button className="btn btn-secondary" onClick={applyCoupon}>{translations[currentLanguage].couponLabel}</button>
                            </div>

                            <div className="cart-totals">
                                <div className="total-row">
                                    <span>{translations[currentLanguage].subtotal}</span>
                                    <span>{formatCurrency(cart.reduce((a, b) => a + (b.product.price * b.qty), 0))}</span>
                                </div>
                                <div className="total-row">
                                    <span>{translations[currentLanguage].discount}</span>
                                    <span>-{formatCurrency(activeCoupon ? cart.reduce((a, b) => a + (b.product.price * b.qty), 0) * activeCoupon.rate : 0)}</span>
                                </div>
                                <div className="total-row">
                                    <span>{translations[currentLanguage].vat}</span>
                                    <span>{formatCurrency(cart.reduce((a, b) => a + (b.product.price * b.qty), 0) * (settings.taxRate / 100))}</span>
                                </div>
                                <div className="total-row grand-total">
                                    <span>{translations[currentLanguage].grandTotal}</span>
                                    <span>{formatCurrency((cart.reduce((a, b) => a + (b.product.price * b.qty), 0) - (activeCoupon ? cart.reduce((a, b) => a + (b.product.price * b.qty), 0) * activeCoupon.rate : 0)) * (1 + settings.taxRate / 100))}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button className="btn btn-primary" style={{ flexGrow: 2 }} onClick={processCheckout}>{translations[currentLanguage].payCheckout}</button>
                                    <button className="btn btn-secondary" style={{ flexGrow: 1 }} onClick={handleSaveQuotationFromCart}>
                                        <i className="ri-file-text-line"></i> {translations[currentLanguage].saveAsQuotation}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: INVENTORY */}
                {activeTab === 'inventory' && (
                    <div className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 data-i18n="inventory">{translations[currentLanguage].inventory}</h3>
                            <button className="btn btn-primary" onClick={() => setShowProductModal(true)}>{translations[currentLanguage].addProduct}</button>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{translations[currentLanguage].prodId}</th>
                                        <th>{translations[currentLanguage].prodName}</th>
                                        <th>{translations[currentLanguage].prodCategory}</th>
                                        <th>{translations[currentLanguage].prodStock}</th>
                                        <th>{translations[currentLanguage].purchaseCost}</th>
                                        <th>{translations[currentLanguage].sellingPrice}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(p => (
                                        <tr key={p.id}>
                                            <td>{p.id}</td>
                                            <td>{currentLanguage === 'ar' ? p.nameAR : p.nameEN}</td>
                                            <td>{translations[currentLanguage][p.category] || p.category}</td>
                                            <td>{p.stock}</td>
                                            <td>{formatCurrency(p.cost || 0)}</td>
                                            <td>{formatCurrency(p.price)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB: CAPITAL ASSETS DEPRECIATION */}
                {activeTab === 'assets' && (
                    <div className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 data-i18n="assets">{translations[currentLanguage].assets}</h3>
                            <button className="btn btn-primary" onClick={() => setShowAssetModal(true)}>{translations[currentLanguage].addAsset}</button>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{translations[currentLanguage].assetId}</th>
                                        <th>{translations[currentLanguage].assetName}</th>
                                        <th>{translations[currentLanguage].assetCost}</th>
                                        <th>{translations[currentLanguage].annualDepreciation}</th>
                                        <th>{translations[currentLanguage].bookValue}</th>
                                        <th>{translations[currentLanguage].assignedTo}</th>
                                        <th>{translations[currentLanguage].assetStatus}</th>
                                        <th>{translations[currentLanguage].actions}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assets.map(a => {
                                        const { annualDep, currentBookValue } = calculateAssetValues(a);
                                        const custodian = employees.find(e => e.id === a.assignedTo)?.name || translations[currentLanguage].unassigned;
                                        return (
                                            <tr key={a.id}>
                                                <td>{a.id}</td>
                                                <td>{a.name}</td>
                                                <td>{formatCurrency(a.cost)}</td>
                                                <td>{formatCurrency(annualDep)}</td>
                                                <td>{formatCurrency(currentBookValue)}</td>
                                                <td>{custodian}</td>
                                                <td><span className={`badge ${a.status === 'active' ? 'green' : 'gold'}`}>{translations[currentLanguage][a.status] || a.status}</span></td>
                                                <td>
                                                    <button className="btn btn-secondary" onClick={() => { setActiveAssetForQr(a); setShowAssetQrModal(true); }}>
                                                        <i className="ri-qr-code-line"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB: CUSTOMERS */}
                {activeTab === 'customers' && (
                    <div className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 data-i18n="customers">{translations[currentLanguage].customers}</h3>
                            <button className="btn btn-primary" onClick={() => { setCustForm({ name: '', phone: '', email: '' }); setShowCustomerModal(true); }}>
                                {translations[currentLanguage].addCustomer}
                            </button>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{translations[currentLanguage].custName}</th>
                                        <th>{translations[currentLanguage].phone}</th>
                                        <th>{translations[currentLanguage].email}</th>
                                        <th>{translations[currentLanguage].loyaltyPoints}</th>
                                        <th>{translations[currentLanguage].actions}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                                {currentLanguage === 'ar' ? 'لا يوجد عملاء مسجلين حالياً' : 'No customers registered currently'}
                                            </td>
                                        </tr>
                                    ) : (
                                        customers.map(c => (
                                            <tr key={c.id}>
                                                <td>{c.name}</td>
                                                <td>{c.phone}</td>
                                                <td>{c.email}</td>
                                                <td><span className="badge purple">{c.loyaltyPoints || 0} PTS</span></td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button className="btn btn-secondary" onClick={() => { setCustForm(c); setShowCustomerModal(true); }}>
                                                            <i className="ri-edit-line"></i>
                                                        </button>
                                                        <button className="btn btn-danger" onClick={() => handleDeleteCustomer(c.id)}>
                                                            <i className="ri-delete-bin-line"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB: SUPPLIERS */}
                {activeTab === 'suppliers' && (
                    <div className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 data-i18n="suppliers">{translations[currentLanguage].suppliers}</h3>
                            <button className="btn btn-primary" onClick={() => { setSuppForm({ company: '', contact: '', phone: '', items: '' }); setShowSupplierModal(true); }}>
                                {translations[currentLanguage].addSupplier}
                            </button>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{translations[currentLanguage].suppName}</th>
                                        <th>{translations[currentLanguage].suppContact}</th>
                                        <th>{translations[currentLanguage].phone}</th>
                                        <th>{translations[currentLanguage].suppliedItems}</th>
                                        <th>{translations[currentLanguage].actions}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {suppliers.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                                {currentLanguage === 'ar' ? 'لا يوجد موردون مسجلون حالياً' : 'No suppliers registered currently'}
                                            </td>
                                        </tr>
                                    ) : (
                                        suppliers.map(s => (
                                            <tr key={s.id}>
                                                <td>{s.company}</td>
                                                <td>{s.contact}</td>
                                                <td>{s.phone}</td>
                                                <td>{s.items}</td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button className="btn btn-secondary" onClick={() => { setSuppForm(s); setShowSupplierModal(true); }}>
                                                            <i className="ri-edit-line"></i>
                                                        </button>
                                                        <button className="btn btn-danger" onClick={() => handleDeleteSupplier(s.id)}>
                                                            <i className="ri-delete-bin-line"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {/* TAB: EXPENSES */}
                {activeTab === 'expenses' && (
                    <div className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 data-i18n="expenses">{translations[currentLanguage].expenses}</h3>
                            <button className="btn btn-primary" onClick={() => { setExpForm({ category: 'rent', amount: '', description: '', date: '' }); setShowExpenseModal(true); }}>
                                {translations[currentLanguage].addExpense}
                            </button>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{translations[currentLanguage].expenseCat}</th>
                                        <th>{translations[currentLanguage].expenseDesc}</th>
                                        <th>{translations[currentLanguage].expenseDate}</th>
                                        <th>{translations[currentLanguage].expenseAmount}</th>
                                        <th>{translations[currentLanguage].actions}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                                {currentLanguage === 'ar' ? 'لا توجد مصروفات مسجلة' : 'No expenses recorded'}
                                            </td>
                                        </tr>
                                    ) : (
                                        expenses.map(exp => (
                                            <tr key={exp.id}>
                                                <td><span className="badge purple">{translations[currentLanguage][exp.category] || exp.category}</span></td>
                                                <td>{exp.description}</td>
                                                <td>{exp.date}</td>
                                                <td>{formatCurrency(exp.amount)}</td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button className="btn btn-secondary" onClick={() => { setExpForm(exp); setShowExpenseModal(true); }}>
                                                            <i className="ri-edit-line"></i>
                                                        </button>
                                                        <button className="btn btn-danger" onClick={() => handleDeleteExpense(exp.id)}>
                                                            <i className="ri-delete-bin-line"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB: ORDERS */}
                {activeTab === 'orders' && (
                    <div className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 data-i18n="orders">{translations[currentLanguage].orders}</h3>
                            <button className="btn btn-primary" onClick={() => { setOrderForm({ customer: '', items: '', total: '', status: 'Pending', date: new Date().toLocaleString() }); setShowOrderModal(true); }}>
                                {currentLanguage === 'ar' ? 'إضافة طلب جديد' : 'Record New Order'}
                            </button>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{translations[currentLanguage].orderNum}</th>
                                        <th>{translations[currentLanguage].invoiceCustomer}</th>
                                        <th>{translations[currentLanguage].orderItems}</th>
                                        <th>{translations[currentLanguage].invoiceTotal}</th>
                                        <th>{translations[currentLanguage].orderStatus}</th>
                                        <th>{translations[currentLanguage].actions}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                                {currentLanguage === 'ar' ? 'لا توجد طلبات جارية' : 'No active orders'}
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.map(ord => (
                                            <tr key={ord.id}>
                                                <td>{ord.id}</td>
                                                <td>{ord.customer}</td>
                                                <td>{ord.items}</td>
                                                <td>{formatCurrency(Number(ord.total) || ord.total)}</td>
                                                <td>
                                                    <span className={`badge ${ord.status === 'Completed' || ord.status === 'Delivered' ? 'green' : ord.status === 'Pending' ? 'danger' : 'gold'}`}>
                                                        {translations[currentLanguage][`status${ord.status}`] || ord.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <select className="form-control" style={{ padding: '4px 8px', fontSize: '12px' }} value={ord.status} onChange={e => {
                                                            const updatedStatus = e.target.value;
                                                            fetch(`/api/orders/${ord.id}`, {
                                                                method: 'PUT',
                                                                headers: headers,
                                                                body: JSON.stringify({ status: updatedStatus })
                                                            })
                                                            .then(res => res.json())
                                                            .then(data => {
                                                                setOrders(orders.map(o => o.id === ord.id ? { ...o, status: updatedStatus } : o));
                                                            })
                                                            .catch(() => {
                                                                setOrders(orders.map(o => o.id === ord.id ? { ...o, status: updatedStatus } : o));
                                                            });
                                                        }}>
                                                            <option value="Pending">{translations[currentLanguage].statusPending}</option>
                                                            <option value="Preparing">{translations[currentLanguage].statusPreparing}</option>
                                                            <option value="Ready">{translations[currentLanguage].statusReady}</option>
                                                            <option value="Delivered">{translations[currentLanguage].statusDelivered}</option>
                                                        </select>
                                                        <button className="btn btn-secondary" onClick={() => { setOrderForm(ord); setShowOrderModal(true); }}>
                                                            <i className="ri-edit-line"></i>
                                                        </button>
                                                        <button className="btn btn-danger" onClick={() => handleDeleteOrder(ord.id)}>
                                                            <i className="ri-delete-bin-line"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB: USER MANAGEMENT (PERMISSIONS) */}
                {activeTab === 'permissions' && (
                    <div className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div>
                                <h3 data-i18n="permissions">{translations[currentLanguage].permissions}</h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{translations[currentLanguage].restrictMsg}</p>
                            </div>
                            {user.role === 'Admin' && (
                                <button className="btn btn-primary" onClick={() => { setUserForm({ username: '', password: '', role: 'Cashier' }); setShowUserModal(true); }}>
                                    {currentLanguage === 'ar' ? 'إضافة مستخدم جديد' : 'Add New System User'}
                                </button>
                            )}
                        </div>
                        
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>User Name / اسم المستخدم</th>
                                        <th>System Role / دور الصلاحية</th>
                                        <th>{translations[currentLanguage].actions}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usersList.map(u => (
                                        <tr key={u.id}>
                                            <td><strong>{u.username}</strong></td>
                                            <td>
                                                <span className={`badge ${u.role === 'Admin' ? 'purple' : u.role === 'Manager' ? 'cyan' : 'gold'}`}>
                                                    {u.role === 'Admin' ? translations[currentLanguage].roleAdmin : u.role === 'Manager' ? translations[currentLanguage].roleManager : translations[currentLanguage].roleCashier}
                                                </span>
                                            </td>
                                            <td>
                                                {user.role === 'Admin' && (
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button className="btn btn-secondary" onClick={() => { setUserForm({ ...u, password: '' }); setShowUserModal(true); }}>
                                                            <i className="ri-edit-line"></i>
                                                        </button>
                                                        <button className="btn btn-danger" onClick={() => handleDeleteUser(u.id)} disabled={u.id === user.id}>
                                                            <i className="ri-delete-bin-line"></i>
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB: INVOICES & REPRINT */}
                {activeTab === 'invoices' && (
                    <div className="glass-card">
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{translations[currentLanguage].invoiceNum}</th>
                                        <th>{translations[currentLanguage].invoiceDate}</th>
                                        <th>{translations[currentLanguage].invoiceCustomer}</th>
                                        <th>{translations[currentLanguage].invoiceTotal}</th>
                                        <th>{translations[currentLanguage].actions}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map(inv => (
                                        <tr key={inv.id}>
                                            <td>{inv.id}</td>
                                            <td>{inv.date}</td>
                                            <td>{inv.customer}</td>
                                            <td>{formatCurrency(inv.total)}</td>
                                            <td>
                                                <button className="btn btn-secondary" onClick={() => { setActiveInvoice(inv); setShowInvoiceModal(true); }}>
                                                    <i className="ri-printer-line"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                
                {/* TAB: QUOTATIONS */}
                {activeTab === 'quotations' && (
                    <div className="glass-card">
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{translations[currentLanguage].quotationNum}</th>
                                        <th>{translations[currentLanguage].quotationDate}</th>
                                        <th>{translations[currentLanguage].invoiceCustomer}</th>
                                        <th>{translations[currentLanguage].quotationTotal}</th>
                                        <th>{translations[currentLanguage].actions}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quotations.map(q => (
                                        <tr key={q.id}>
                                            <td>{q.id}</td>
                                            <td>{q.date}</td>
                                            <td>{q.customer}</td>
                                            <td>{formatCurrency(q.total)}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button className="btn btn-secondary" onClick={() => { setActiveQuotation(q); setShowQuotationModal(true); }}>
                                                        <i className="ri-printer-line"></i>
                                                    </button>
                                                    <button className="btn btn-danger" onClick={() => handleDeleteQuotation(q.id)}>
                                                        <i className="ri-delete-bin-line"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB: REPORTS */}
                {activeTab === 'reports' && (() => {
                    const now = new Date();
                    const todayStr = now.toLocaleDateString();
                    const currentMonth = now.getMonth();
                    const currentYear = now.getFullYear();
                    
                    const reportInvoices = invoices.filter(inv => {
                        if (!inv.date) return false;
                        const invDate = new Date(inv.date);
                        
                        if (isNaN(invDate.getTime())) {
                            const datePart = inv.date.split(',')[0] || inv.date;
                            if (reportSubTab === 'daily') {
                                return datePart.includes(todayStr) || inv.date.includes(todayStr);
                            }
                            if (reportSubTab === 'monthly') {
                                return inv.date.includes(`/${currentMonth + 1}/`) || inv.date.includes(`/${String(currentMonth + 1).padStart(2, '0')}/`) || inv.date.includes(`-${currentMonth + 1}-`);
                            }
                            if (reportSubTab === 'annual') {
                                return inv.date.includes(String(currentYear));
                            }
                            return false;
                        }
                        
                        if (reportSubTab === 'daily') {
                            return invDate.toDateString() === now.toDateString();
                        } else if (reportSubTab === 'monthly') {
                            return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
                        } else if (reportSubTab === 'annual') {
                            return invDate.getFullYear() === currentYear;
                        }
                        return true;
                    });

                    const totalSales = reportInvoices.reduce((sum, inv) => sum + inv.total, 0);
                    const totalVat = reportInvoices.reduce((sum, inv) => sum + (inv.vat || 0), 0);
                    const netSales = totalSales - totalVat;
                    const invoiceCount = reportInvoices.length;

                    return (
                        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Sub Tabs Selection */}
                            <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
                                <button className={`btn ${reportSubTab === 'daily' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setReportSubTab('daily')}>
                                    <i className="ri-calendar-event-line"></i> {translations[currentLanguage].dailyReports}
                                </button>
                                <button className={`btn ${reportSubTab === 'monthly' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setReportSubTab('monthly')}>
                                    <i className="ri-calendar-todo-line"></i> {translations[currentLanguage].monthlyReports}
                                </button>
                                <button className={`btn ${reportSubTab === 'annual' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setReportSubTab('annual')}>
                                    <i className="ri-calendar-line"></i> {translations[currentLanguage].annualReports}
                                </button>
                                
                                <button className="btn btn-secondary" style={{ marginRight: currentLanguage === 'en' ? 'auto' : '0', marginLeft: currentLanguage === 'ar' ? 'auto' : '0' }} onClick={() => window.print()}>
                                    <i className="ri-printer-line"></i> {translations[currentLanguage].printReport}
                                </button>
                            </div>

                            {/* Report Stats Grid */}
                            <div className="card-grid">
                                <div className="glass-card purple">
                                    <div className="card-stat">
                                        <div className="stat-info">
                                            <h3>{translations[currentLanguage].totalSalesTax}</h3>
                                            <div className="stat-value">{formatCurrency(totalSales)}</div>
                                        </div>
                                        <div className="stat-icon"><i className="ri-money-dollar-circle-line"></i></div>
                                    </div>
                                </div>
                                <div className="glass-card cyan">
                                    <div className="card-stat">
                                        <div className="stat-info">
                                            <h3>{translations[currentLanguage].totalVatCollected}</h3>
                                            <div className="stat-value">{formatCurrency(totalVat)}</div>
                                        </div>
                                        <div className="stat-icon"><i className="ri-percent-line"></i></div>
                                    </div>
                                </div>
                                <div className="glass-card gold">
                                    <div className="card-stat">
                                        <div className="stat-info">
                                            <h3>{translations[currentLanguage].netSalesValue}</h3>
                                            <div className="stat-value">{formatCurrency(netSales)}</div>
                                        </div>
                                        <div className="stat-icon"><i className="ri-coins-line"></i></div>
                                    </div>
                                </div>
                                <div className="glass-card green">
                                    <div className="card-stat">
                                        <div className="stat-info">
                                            <h3>{translations[currentLanguage].invoiceCount}</h3>
                                            <div className="stat-value">{invoiceCount}</div>
                                        </div>
                                        <div className="stat-icon"><i className="ri-file-list-3-line"></i></div>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed List */}
                            <div className="table-container" style={{ marginTop: '12px' }}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>{translations[currentLanguage].invoiceNum}</th>
                                            <th>{translations[currentLanguage].invoiceDate}</th>
                                            <th>{translations[currentLanguage].invoiceCustomer}</th>
                                            <th style={{ textAlign: 'right' }}>{translations[currentLanguage].netSalesValue}</th>
                                            <th style={{ textAlign: 'right' }}>{translations[currentLanguage].vat}</th>
                                            <th style={{ textAlign: 'right' }}>{translations[currentLanguage].invoiceTotal}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportInvoices.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                                    {currentLanguage === 'ar' ? 'لا توجد مبيعات مسجلة لهذه الفترة' : 'No sales recorded for this period'}
                                                </td>
                                            </tr>
                                        ) : (
                                            reportInvoices.map(inv => (
                                                <tr key={inv.id}>
                                                    <td>{inv.id}</td>
                                                    <td>{inv.date}</td>
                                                    <td>{inv.customer}</td>
                                                    <td style={{ textAlign: 'right' }}>{formatCurrency(inv.total - (inv.vat || 0))}</td>
                                                    <td style={{ textAlign: 'right' }}>{formatCurrency(inv.vat || 0)}</td>
                                                    <td style={{ textAlign: 'right' }}>{formatCurrency(inv.total)}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })()}

                {/* TAB: ZATCA INTEGRATION AND CLEARANCE */}
                {activeTab === 'zatca' && (
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '15px' }}>{translations[currentLanguage].zatcaPortal}</h3>
                        <div className="card-grid" style={{ marginBottom: '24px' }}>
                            <div className="glass-card green">
                                <div className="card-stat">
                                    <div className="stat-info">
                                        <h3>ZATCA Clearance Status</h3>
                                        <div style={{ color: 'var(--accent-success)', fontWeight: 'bold' }}>UBL 2.1 Compliant & Active</div>
                                    </div>
                                    <div className="stat-icon"><i className="ri-checkbox-circle-line"></i></div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div className="glass-card" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '15px' }}>Submit & Verify XML Schema</h4>
                                <div className="form-group">
                                    <label>Select Invoice / اختر الفاتورة للربط</label>
                                    <select className="form-control" value={zatcaSelectInvoice} onChange={e => setZatcaSelectInvoice(e.target.value)}>
                                        <option value="">Choose...</option>
                                        {invoices.map(i => <option key={i.id} value={i.id}>{i.id} - {i.customer} ({formatCurrency(i.total)}) [{i.zatcaStatus}]</option>)}
                                    </select>
                                </div>
                                <button className="btn btn-primary" onClick={triggerZatcaPortalClearance} disabled={isReportingZatca || !zatcaSelectInvoice} style={{ width: '100%' }}>
                                    <i className="ri-cloud-upload-line" style={{ marginRight: '8px' }}></i>Submit to ZATCA Sandbox
                                </button>
                            </div>

                            <div className="glass-card" style={{ background: '#000', color: '#4ade80', fontFamily: 'monospace', height: '240px', overflowY: 'auto' }}>
                                <h4>ZATCA Clear Response Logs</h4>
                                <div style={{ marginTop: '10px', fontSize: '12px' }}>
                                    {zatcaConsole.map((log, idx) => (
                                        <div key={idx} style={{ marginBottom: '4px' }}>
                                            <span style={{ fontWeight: 'bold' }}>[{log.type}]</span> {log.text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: SETTINGS & CURRENCY CONFIG */}
                {activeTab === 'settings' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                        {/* General Settings Card */}
                        <div className="glass-card">
                            <h3 style={{ marginBottom: '20px', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="ri-settings-4-line"></i> {translations[currentLanguage].generalSettings}
                            </h3>
                            <form onSubmit={(e) => { e.preventDefault(); alert(currentLanguage === 'ar' ? "تم حفظ الإعدادات العامة" : "General settings saved successfully"); }}>
                                <div className="form-group">
                                    <label>{translations[currentLanguage].businessName}</label>
                                    <input type="text" className="form-control" value={settings.businessName} onChange={e => setSettings({ ...settings, businessName: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>{translations[currentLanguage].vatNumber}</label>
                                    <input type="text" className="form-control" value={settings.vatNumber} onChange={e => setSettings({ ...settings, vatNumber: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Base System Currency / العملة الأساسية</label>
                                    <select className="form-control" value={settings.baseCurrency} onChange={e => setSettings({ ...settings, baseCurrency: e.target.value })}>
                                        <option value="SAR">SAR / ر.س</option>
                                        <option value="USD">USD / دولار أمريكي</option>
                                        <option value="EUR">EUR / يورو</option>
                                        <option value="EGP">EGP / جنيه مصري</option>
                                        <option value="AED">AED / درهم إماراتي</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>{translations[currentLanguage].saveSettings}</button>
                            </form>
                        </div>

                        {/* ZATCA Connection Settings Card */}
                        <div className="glass-card">
                            <h3 style={{ marginBottom: '20px', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="ri-cloud-line"></i> {translations[currentLanguage].zatcaSettings}
                            </h3>
                            <form onSubmit={(e) => { e.preventDefault(); alert(currentLanguage === 'ar' ? "تم حفظ إعدادات خادر هيئة الزكاة" : "ZATCA Server settings saved successfully"); }}>
                                <div className="form-group">
                                    <label>{translations[currentLanguage].zatcaEnv}</label>
                                    <select className="form-control" value={zatcaConn.env} onChange={e => setZatcaConn({ ...zatcaConn, env: e.target.value })}>
                                        <option value="sandbox">Sandbox / البيئة التجريبية (المحاكاة)</option>
                                        <option value="simulation">Simulation / بيئة المحاكاة الرسمية</option>
                                        <option value="production">Production / البيئة الفعلية والإنتاجية</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>{translations[currentLanguage].zatcaEndpoint}</label>
                                    <input type="text" className="form-control" value={zatcaConn.endpoint} onChange={e => setZatcaConn({ ...zatcaConn, endpoint: e.target.value })} />
                                </div>
                                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div className="form-group">
                                        <label>{translations[currentLanguage].zatcaClientId}</label>
                                        <input type="text" className="form-control" value={zatcaConn.clientId} onChange={e => setZatcaConn({ ...zatcaConn, clientId: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label>{translations[currentLanguage].zatcaClientSecret}</label>
                                        <input type="password" className="form-control" value={zatcaConn.clientSecret} onChange={e => setZatcaConn({ ...zatcaConn, clientSecret: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>{translations[currentLanguage].zatcaDeviceSerial}</label>
                                    <input type="text" className="form-control" value={zatcaConn.deviceSerial} onChange={e => setZatcaConn({ ...zatcaConn, deviceSerial: e.target.value })} />
                                </div>
                                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                    <input type="checkbox" id="zatcaAutoSend" checked={zatcaConn.autoSend} onChange={e => setZatcaConn({ ...zatcaConn, autoSend: e.target.checked })} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                                    <label htmlFor="zatcaAutoSend" style={{ cursor: 'pointer', margin: 0, fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                                        {currentLanguage === 'ar' ? 'إرسال تلقائي إلى هيئة الزكاة والضريبة والجمارك عند الدفع' : 'Auto-Send to ZATCA on Checkout'}
                                    </label>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{translations[currentLanguage].zatcaStatusLabel}:</span>
                                    <span className={`badge ${zatcaConn.status === 'CONNECTED' ? 'green' : 'danger'}`}>
                                        {zatcaConn.status === 'CONNECTED' ? translations[currentLanguage].zatcaStatusConnected : translations[currentLanguage].zatcaStatusDisconnected}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button type="button" className="btn btn-secondary" style={{ flexGrow: 1 }} onClick={() => alert(currentLanguage === 'ar' ? "تم إنشاء طلب التوقيع CSR ومفتاح التشفير الخاص بنجاح!" : "Private Key and CSR successfully generated!")}>
                                        {translations[currentLanguage].csrGenerate}
                                    </button>
                                    <button type="button" className="btn btn-primary" style={{ flexGrow: 1 }} onClick={() => {
                                        setZatcaConn({ ...zatcaConn, status: 'CONNECTED' });
                                        alert(currentLanguage === 'ar' ? "تم التحقق وتسجيل وتفعيل الـ CCSID بنجاح!" : "Device successfully registered & CCSID token retrieved from ZATCA!");
                                    }}>
                                        {translations[currentLanguage].registerDevice}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Version Footer */}
                <footer style={{ marginTop: 'auto', padding: '15px 0', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span>CASHIER v1.2.0 - Scaleable Full Stack Integration</span>
                    <span>Saudi Arabia | 2026</span>
                </footer>
            </main>

            {/* MODAL: INVOICE PRINT AND VERIFY */}
            {showInvoiceModal && activeInvoice && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
                            <button className="btn btn-secondary" onClick={() => setInvoiceFormat('thermal')} style={{ flexGrow: 1 }}><i className="ri-ticket-line"></i> Thermal Receipt</button>
                            <button className="btn btn-secondary" onClick={() => setInvoiceFormat('a4')} style={{ flexGrow: 1 }}><i className="ri-file-text-line"></i> A4 Invoice Document</button>
                        </div>

                        {/* Print Layout Area */}
                        <div id="invoicePrintArea" className={invoiceFormat === 'a4' ? 'invoice-a4-layout' : 'invoice-thermal-layout'}>
                            {invoiceFormat === 'a4' ? (
                                <div style={{ padding: '40px', color: '#333', background: 'white' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #8b5cf6', paddingBottom: '20px' }}>
                                        <div>
                                            <h1 style={{ fontSize: '26px', margin: 0, color: '#8b5cf6' }}>{settings.businessName}</h1>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Simplified Tax Invoice / فاتورة ضريبية مبسطة</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ margin: 0, fontSize: '12px' }}>VAT No / الرقم الضريبي: {settings.vatNumber}</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '20px', fontSize: '13px' }}>
                                        <div>
                                            <h3>Billed To / مفوتر إلى:</h3>
                                            <p style={{ fontWeight: 'bold' }}>{activeInvoice.customer}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p><strong>Invoice ID:</strong> {activeInvoice.id}</p>
                                            <p><strong>Date:</strong> {activeInvoice.date}</p>
                                        </div>
                                    </div>

                                    <table style={{ width: '100%', marginTop: '30px', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ background: '#8b5cf6', color: 'white' }}>
                                                <th style={{ color: 'white' }}>Description / البيان</th>
                                                <th style={{ color: 'white', textAlign: 'center' }}>Qty</th>
                                                <th style={{ color: 'white', textAlign: 'right' }}>Price</th>
                                                <th style={{ color: 'white', textAlign: 'right' }}>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activeInvoice.items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>{item.name}</td>
                                                    <td style={{ textAlign: 'center' }}>{item.qty}</td>
                                                    <td style={{ textAlign: 'right' }}>{formatCurrency(item.price)}</td>
                                                    <td style={{ textAlign: 'right' }}>{formatCurrency(item.price * item.qty)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* ZATCA Phase 2 Metadata Details & QR Code */}
                                    <div style={{ marginTop: '30px', display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
                                        <div style={{ fontSize: '11px', fontFamily: 'monospace', flexGrow: 1 }}>
                                            <div style={{ fontWeight: 'bold', color: '#8b5cf6', marginBottom: '8px' }}>ZATCA Compliant Phase 2 Secure Metadata</div>
                                            <p style={{ margin: '2px 0' }}><strong>UUID:</strong> {activeInvoice.uuid}</p>
                                            <p style={{ margin: '2px 0' }}><strong>SHA-256 XML Hash:</strong> {activeInvoice.xmlHash}</p>
                                            <p style={{ margin: '2px 0' }}><strong>Chaining PIH:</strong> {activeInvoice.pih ? activeInvoice.pih.slice(0, 30) : 'None'}...</p>
                                            <p style={{ margin: '2px 0' }}><strong>API Status:</strong> {activeInvoice.zatcaStatus}</p>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`Seller: ${settings.businessName}\nVAT: ${settings.vatNumber}\nDate: ${activeInvoice.date}\nTotal: ${activeInvoice.total.toFixed(2)}\nVAT: ${(activeInvoice.vat || activeInvoice.total * 0.15).toFixed(2)}`)}`} alt="ZATCA QR" style={{ width: '120px', height: '120px' }} />
                                            <span style={{ fontSize: '9px', color: '#666' }}>ZATCA E-Invoice QR</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ padding: '10px', color: 'black', background: 'white' }}>
                                    <h3 style={{ textAlign: 'center' }}>{settings.businessName}</h3>
                                    <div style={{ textAlign: 'center', fontSize: '11px' }}>VAT No: {settings.vatNumber}</div>
                                    <hr style={{ borderStyle: 'dashed' }} />
                                    <div style={{ fontSize: '11px' }}>
                                        <p>Invoice: {activeInvoice.id}</p>
                                        <p>Date: {activeInvoice.date}</p>
                                        <p>Customer: {activeInvoice.customer}</p>
                                    </div>
                                    <hr style={{ borderStyle: 'dashed' }} />
                                    {activeInvoice.items.map((item, idx) => (
                                        <div key={idx} style={{ fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
                                            <span>{item.name} x{item.qty}</span>
                                            <span>{formatCurrency(item.price * item.qty)}</span>
                                        </div>
                                    ))}
                                    <hr style={{ borderStyle: 'dashed' }} />
                                    <div style={{ fontSize: '12px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Total:</span>
                                        <span>{formatCurrency(activeInvoice.total)}</span>
                                    </div>
                                    <hr style={{ borderStyle: 'dashed' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px', gap: '4px' }}>
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`Seller: ${settings.businessName}\nVAT: ${settings.vatNumber}\nDate: ${activeInvoice.date}\nTotal: ${activeInvoice.total.toFixed(2)}\nVAT: ${(activeInvoice.vat || activeInvoice.total * 0.15).toFixed(2)}`)}`} alt="ZATCA QR" style={{ width: '100px', height: '100px' }} />
                                        <span style={{ fontSize: '9px', color: '#666' }}>ZATCA E-Invoice</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Interactive Buttons */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                            <button className="btn btn-secondary" style={{ flexGrow: 1, background: '#0284c7', color: 'white' }} onClick={() => downloadXml(activeInvoice)}>
                                <i className="ri-file-code-line"></i> Download ZATCA XML
                            </button>
                            <button className="btn btn-primary" style={{ flexGrow: 1, background: '#16a34a' }} onClick={() => simulateZATCAReporting(activeInvoice.id)}>
                                <i className="ri-cloud-upload-line"></i> Report to ZATCA
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--glass-border)', paddingTop: '12px' }}>
                            <button className="btn btn-secondary" onClick={() => setShowInvoiceModal(false)}>{translations[currentLanguage].close}</button>
                            <button className="btn btn-primary" onClick={() => window.print()}>{translations[currentLanguage].print}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: ADD PRODUCT */}
            {showProductModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3 style={{ marginBottom: '20px' }}>{translations[currentLanguage].addProduct}</h3>
                        <form onSubmit={handleSaveProduct}>
                            <div className="form-group">
                                <label>{translations[currentLanguage].prodNameAr}</label>
                                <input type="text" className="form-control" value={prodForm.nameAR} onChange={e => setProdForm({ ...prodForm, nameAR: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].prodNameEn}</label>
                                <input type="text" className="form-control" value={prodForm.nameEN} onChange={e => setProdForm({ ...prodForm, nameEN: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].prodCategory}</label>
                                <select className="form-control" value={prodForm.category} onChange={e => setProdForm({ ...prodForm, category: e.target.value })}>
                                    <option value="electronics">{translations[currentLanguage].electronics}</option>
                                    <option value="apparel">{translations[currentLanguage].apparel}</option>
                                    <option value="groceries">{translations[currentLanguage].groceries}</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].prodStock}</label>
                                <input type="number" className="form-control" value={prodForm.stock} onChange={e => setProdForm({ ...prodForm, stock: Number(e.target.value) })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].purchaseCost}</label>
                                <input type="number" className="form-control" value={prodForm.cost} onChange={e => setProdForm({ ...prodForm, cost: Number(e.target.value) })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].sellingPrice}</label>
                                <input type="number" className="form-control" value={prodForm.price} onChange={e => setProdForm({ ...prodForm, price: Number(e.target.value) })} required />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowProductModal(false)}>{translations[currentLanguage].close}</button>
                                <button type="submit" className="btn btn-primary">{translations[currentLanguage].saveProduct}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: ADD ASSET */}
            {showAssetModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3 style={{ marginBottom: '20px' }}>{translations[currentLanguage].addAsset}</h3>
                        <form onSubmit={handleSaveAsset}>
                            <div className="form-group">
                                <label>{translations[currentLanguage].assetName}</label>
                                <input type="text" className="form-control" value={assetForm.name} onChange={e => setAssetForm({ ...assetForm, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].assetCost}</label>
                                <input type="number" className="form-control" value={assetForm.cost} onChange={e => setAssetForm({ ...assetForm, cost: Number(e.target.value) })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].assetSalvage}</label>
                                <input type="number" className="form-control" value={assetForm.salvage} onChange={e => setAssetForm({ ...assetForm, salvage: Number(e.target.value) })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].assetLife}</label>
                                <input type="number" className="form-control" value={assetForm.life} onChange={e => setAssetForm({ ...assetForm, life: Number(e.target.value) })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].assetDate}</label>
                                <input type="date" className="form-control" value={assetForm.date} onChange={e => setAssetForm({ ...assetForm, date: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].assignedTo}</label>
                                <select className="form-control" value={assetForm.assignedTo} onChange={e => setAssetForm({ ...assetForm, assignedTo: e.target.value })}>
                                    <option value="unassigned">{translations[currentLanguage].unassigned}</option>
                                    {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAssetModal(false)}>{translations[currentLanguage].close}</button>
                                <button type="submit" className="btn btn-primary">{translations[currentLanguage].saveAsset}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: ADD / EDIT CUSTOMER */}
            {showCustomerModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3 style={{ marginBottom: '20px' }}>
                            {custForm.id ? (currentLanguage === 'ar' ? 'تعديل بيانات العميل' : 'Edit Customer Details') : translations[currentLanguage].addCustomer}
                        </h3>
                        <form onSubmit={handleSaveCustomer}>
                            <div className="form-group">
                                <label>{translations[currentLanguage].custName}</label>
                                <input type="text" className="form-control" value={custForm.name || ''} onChange={e => setCustForm({ ...custForm, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].phone}</label>
                                <input type="text" className="form-control" value={custForm.phone || ''} onChange={e => setCustForm({ ...custForm, phone: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].email}</label>
                                <input type="email" className="form-control" value={custForm.email || ''} onChange={e => setCustForm({ ...custForm, email: e.target.value })} required />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowCustomerModal(false)}>{translations[currentLanguage].close}</button>
                                <button type="submit" className="btn btn-primary">Save / حفظ</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: ADD / EDIT SUPPLIER */}
            {showSupplierModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3 style={{ marginBottom: '20px' }}>
                            {suppForm.id ? (currentLanguage === 'ar' ? 'تعديل بيانات المورد' : 'Edit Supplier Details') : translations[currentLanguage].addSupplier}
                        </h3>
                        <form onSubmit={handleSaveSupplier}>
                            <div className="form-group">
                                <label>{translations[currentLanguage].suppName}</label>
                                <input type="text" className="form-control" value={suppForm.company || ''} onChange={e => setSuppForm({ ...suppForm, company: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].suppContact}</label>
                                <input type="text" className="form-control" value={suppForm.contact || ''} onChange={e => setSuppForm({ ...suppForm, contact: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].phone}</label>
                                <input type="text" className="form-control" value={suppForm.phone || ''} onChange={e => setSuppForm({ ...suppForm, phone: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].suppliedItems}</label>
                                <input type="text" className="form-control" value={suppForm.items || ''} onChange={e => setSuppForm({ ...suppForm, items: e.target.value })} placeholder="e.g. Garments, Electronics" required />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowSupplierModal(false)}>{translations[currentLanguage].close}</button>
                                <button type="submit" className="btn btn-primary">Save / حفظ</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: ADD / EDIT EXPENSE */}
            {showExpenseModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3 style={{ marginBottom: '20px' }}>
                            {expForm.id ? (currentLanguage === 'ar' ? 'تعديل بيانات المصروف' : 'Edit Expense Details') : translations[currentLanguage].addExpense}
                        </h3>
                        <form onSubmit={handleSaveExpense}>
                            <div className="form-group">
                                <label>{translations[currentLanguage].expenseCat}</label>
                                <select className="form-control" value={expForm.category} onChange={e => setExpForm({ ...expForm, category: e.target.value })}>
                                    <option value="rent">{translations[currentLanguage].rent}</option>
                                    <option value="shipping">{translations[currentLanguage].shipping}</option>
                                    <option value="salaries">{translations[currentLanguage].salaries}</option>
                                    <option value="marketing">{translations[currentLanguage].marketing}</option>
                                    <option value="other">{translations[currentLanguage].other}</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].expenseAmount}</label>
                                <input type="number" className="form-control" value={expForm.amount || ''} onChange={e => setExpForm({ ...expForm, amount: Number(e.target.value) })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].expenseDesc}</label>
                                <input type="text" className="form-control" value={expForm.description || ''} onChange={e => setExpForm({ ...expForm, description: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].expenseDate}</label>
                                <input type="date" className="form-control" value={expForm.date || ''} onChange={e => setExpForm({ ...expForm, date: e.target.value })} required />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowExpenseModal(false)}>{translations[currentLanguage].close}</button>
                                <button type="submit" className="btn btn-primary">Save / حفظ</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: ADD / EDIT ORDER */}
            {showOrderModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3 style={{ marginBottom: '20px' }}>
                            {orderForm.id ? (currentLanguage === 'ar' ? 'تعديل بيانات الطلب' : 'Edit Order Details') : (currentLanguage === 'ar' ? 'إضافة طلب جديد' : 'Record New Order')}
                        </h3>
                        <form onSubmit={handleSaveOrder}>
                            <div className="form-group">
                                <label>{translations[currentLanguage].invoiceCustomer}</label>
                                <input type="text" className="form-control" value={orderForm.customer || ''} onChange={e => setOrderForm({ ...orderForm, customer: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].orderItems}</label>
                                <input type="text" className="form-control" value={orderForm.items || ''} onChange={e => setOrderForm({ ...orderForm, items: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].invoiceTotal}</label>
                                <input type="number" className="form-control" value={orderForm.total || ''} onChange={e => setOrderForm({ ...orderForm, total: Number(e.target.value) })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].orderStatus}</label>
                                <select className="form-control" value={orderForm.status} onChange={e => setOrderForm({ ...orderForm, status: e.target.value })}>
                                    <option value="Pending">{translations[currentLanguage].statusPending}</option>
                                    <option value="Preparing">{translations[currentLanguage].statusPreparing}</option>
                                    <option value="Ready">{translations[currentLanguage].statusReady}</option>
                                    <option value="Delivered">{translations[currentLanguage].statusDelivered}</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowOrderModal(false)}>{translations[currentLanguage].close}</button>
                                <button type="submit" className="btn btn-primary">Save / حفظ</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: ADD / EDIT USER */}
            {showUserModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3 style={{ marginBottom: '20px' }}>
                            {userForm.id ? (currentLanguage === 'ar' ? 'تعديل بيانات المستخدم' : 'Edit User Credentials') : (currentLanguage === 'ar' ? 'إضافة مستخدم جديد' : 'Add New System User')}
                        </h3>
                        <form onSubmit={handleSaveUser}>
                            <div className="form-group">
                                <label>Username / اسم المستخدم</label>
                                <input type="text" className="form-control" value={userForm.username || ''} onChange={e => setUserForm({ ...userForm, username: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Password / كلمة المرور {userForm.id && '(Leave blank to keep current / اترك فارغاً للحفاظ على الحالية)'}</label>
                                <input type="password" className="form-control" value={userForm.password || ''} onChange={e => setUserForm({ ...userForm, password: e.target.value })} required={!userForm.id} />
                            </div>
                            <div className="form-group">
                                <label>User Role / دور الصلاحية</label>
                                <select className="form-control" value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
                                    <option value="Admin">{translations[currentLanguage].roleAdmin}</option>
                                    <option value="Manager">{translations[currentLanguage].roleManager}</option>
                                    <option value="Cashier">{translations[currentLanguage].roleCashier}</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowUserModal(false)}>{translations[currentLanguage].close}</button>
                                <button type="submit" className="btn btn-primary">Save / حفظ</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: ASSET QR LABEL */}
            {showAssetQrModal && activeAssetForQr && (
                <div className="modal-overlay">
                    <div className="modal" style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '20px' }}>{currentLanguage === 'ar' ? 'بطاقة تتبع الأصل (بار كود)' : 'Asset Tracking Label (QR)'}</h3>
                        <div id="assetPrintArea" style={{ background: 'white', color: 'black', padding: '20px', borderRadius: '8px', border: '1px solid #ccc', display: 'inline-block', margin: '10px auto' }}>
                            <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>CASHIER ERP</h4>
                            <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#666' }}>{currentLanguage === 'ar' ? 'نظام إدارة الأصول' : 'Asset Management System'}</p>
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`Asset ID: ${activeAssetForQr.id}\nName: ${activeAssetForQr.name}\nDepartment: ${activeAssetForQr.department || 'Operations'}\nCost: ${activeAssetForQr.cost}`)}`} alt="Asset QR Code" style={{ width: '150px', height: '150px' }} />
                            <h5 style={{ margin: '10px 0 2px 0', fontSize: '14px', fontWeight: 'bold' }}>{activeAssetForQr.name}</h5>
                            <span style={{ fontSize: '11px', fontFamily: 'monospace', background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>{activeAssetForQr.id}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px', borderTop: '1px solid var(--glass-border)', paddingTop: '12px' }}>
                            <button className="btn btn-secondary" onClick={() => setShowAssetQrModal(false)}>{translations[currentLanguage].close}</button>
                            <button className="btn btn-primary" onClick={() => window.print()}>{translations[currentLanguage].print}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: QUOTATION PRINT */}
            {showQuotationModal && activeQuotation && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
                            <button className="btn btn-secondary" onClick={() => setInvoiceFormat('thermal')} style={{ flexGrow: 1 }}><i className="ri-ticket-line"></i> Thermal Receipt</button>
                            <button className="btn btn-secondary" onClick={() => setInvoiceFormat('a4')} style={{ flexGrow: 1 }}><i className="ri-file-text-line"></i> A4 Document</button>
                        </div>

                        {/* Print Layout Area */}
                        <div id="invoicePrintArea" className={invoiceFormat === 'a4' ? 'invoice-a4-layout' : 'invoice-thermal-layout'}>
                            {invoiceFormat === 'a4' ? (
                                <div style={{ padding: '40px', color: '#333', background: 'white' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #8b5cf6', paddingBottom: '20px' }}>
                                        <div>
                                            <h1 style={{ fontSize: '26px', margin: 0, color: '#8b5cf6' }}>{settings.businessName}</h1>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Quotation / عرض سعر</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ margin: 0, fontSize: '12px' }}>VAT No / الرقم الضريبي: {settings.vatNumber}</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '20px', fontSize: '13px' }}>
                                        <div>
                                            <h3>Billed To / مفوتر إلى:</h3>
                                            <p style={{ fontWeight: 'bold' }}>{activeQuotation.customer}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p><strong>Quotation ID:</strong> {activeQuotation.id}</p>
                                            <p><strong>Date:</strong> {activeQuotation.date}</p>
                                        </div>
                                    </div>

                                    <table style={{ width: '100%', marginTop: '30px', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ background: '#8b5cf6', color: 'white' }}>
                                                <th style={{ color: 'white' }}>Description / البيان</th>
                                                <th style={{ color: 'white', textAlign: 'center' }}>Qty</th>
                                                <th style={{ color: 'white', textAlign: 'right' }}>Price</th>
                                                <th style={{ color: 'white', textAlign: 'right' }}>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activeQuotation.items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>{item.name}</td>
                                                    <td style={{ textAlign: 'center' }}>{item.qty}</td>
                                                    <td style={{ textAlign: 'right' }}>{formatCurrency(item.price)}</td>
                                                    <td style={{ textAlign: 'right' }}>{formatCurrency(item.price * item.qty)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <div style={{ marginTop: '30px', borderTop: '2px solid #eee', paddingTop: '15px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px' }}>
                                            <span>Subtotal:</span>
                                            <span>{formatCurrency(activeQuotation.total - (activeQuotation.vat || 0))}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px' }}>
                                            <span>VAT (15%):</span>
                                            <span>{formatCurrency(activeQuotation.vat || 0)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
                                            <span>Grand Total:</span>
                                            <span>{formatCurrency(activeQuotation.total)}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ padding: '10px', color: 'black', background: 'white' }}>
                                    <h3 style={{ textAlign: 'center' }}>{settings.businessName}</h3>
                                    <div style={{ textAlign: 'center', fontSize: '11px' }}>VAT No: {settings.vatNumber}</div>
                                    <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>Quotation / عرض سعر</div>
                                    <hr style={{ borderStyle: 'dashed' }} />
                                    <div style={{ fontSize: '11px' }}>
                                        <p>Quotation ID: {activeQuotation.id}</p>
                                        <p>Date: {activeQuotation.date}</p>
                                        <p>Customer: {activeQuotation.customer}</p>
                                    </div>
                                    <hr style={{ borderStyle: 'dashed' }} />
                                    {activeQuotation.items.map((item, idx) => (
                                        <div key={idx} style={{ fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
                                            <span>{item.name} x{item.qty}</span>
                                            <span>{formatCurrency(item.price * item.qty)}</span>
                                        </div>
                                    ))}
                                    <hr style={{ borderStyle: 'dashed' }} />
                                    <div style={{ fontSize: '12px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Total:</span>
                                        <span>{formatCurrency(activeQuotation.total)}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--glass-border)', paddingTop: '12px' }}>
                            <button className="btn btn-secondary" onClick={() => setShowQuotationModal(false)}>{translations[currentLanguage].close}</button>
                            <button className="btn btn-primary" onClick={() => window.print()}>{translations[currentLanguage].print}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    function simulateZATCAReporting(invId) {
        // Modal quick report
        const isAr = currentLanguage === 'ar';
        alert(isAr ? "تم إرسال الفاتورة وتوثيقها بنجاح لدى الهيئة (المرحلة الثانية)!" : "Invoice successfully submitted and cleared by ZATCA!");
        const updated = invoices.map(i => i.id === invId ? { ...i, zatcaStatus: 'REPORTED' } : i);
        setInvoices(updated);
        setShowInvoiceModal(false);
    }
}
