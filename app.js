// KamySoft POS & ERP Controller - Comprehensive & Fixed Version
// Fully implements 15 flyer specifications, Asset Depreciation, and fixed translations

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
        
        currencySymbol: "ر.س"
    }
};

// Default App State
let appState = {
    currentLanguage: 'ar',
    theme: 'dark',
    taxRate: 15,
    businessName: 'KamySoft ERP & POS',
    vatNumber: '310123456700003',
    currentRole: 'Admin',
    activeCustomer: 'walk-in',
    activeCoupon: null,
    
    products: [
        { id: '1001', nameEN: 'Premium Smart Monitor 27"', nameAR: 'شاشة ذكية فاخرة 27 بوصة', price: 950, stock: 12, category: 'electronics', emoji: '🖥️' },
        { id: '1002', nameEN: 'Wireless Laser Scanner', nameAR: 'قارئ باركود لاسلكي ليزري', price: 250, stock: 8, category: 'electronics', emoji: '🔦' },
        { id: '1003', nameEN: 'Direct Thermal Receipt Printer', nameAR: 'طابعة فواتير حرارية مباشرة', price: 320, stock: 15, category: 'electronics', emoji: '🖨️' },
        { id: '1004', nameEN: 'Leather Executive Chair', nameAR: 'كرسي مكتب جلد فخم', price: 420, stock: 4, category: 'office', emoji: '💺' },
        { id: '1005', nameEN: 'Organic Coffee Beans 1kg', nameAR: 'حبوب قهوة عضوية 1 كجم', price: 75, stock: 30, category: 'groceries', emoji: '☕' }
    ],
    cart: [],
    heldCarts: [],
    
    invoices: [
        { id: 'INV-1001', date: '2026-06-24 10:30', customer: 'Walk-in Customer / عميل نقدي', items: [{ id: '1001', name: 'شاشة ذكية فاخرة 27 بوصة', price: 950, qty: 1 }], total: 1092.5, vat: 142.5, discount: 0 },
        { id: 'INV-1002', date: '2026-06-24 11:15', customer: 'Khalil Al-Ghamdi', items: [{ id: '1002', name: 'قارئ باركود لاسلكي ليزري', price: 250, qty: 2 }], total: 575, vat: 75, discount: 0 }
    ],
    
    expenses: [
        { id: 'EXP-5001', date: '2026-06-01', category: 'rent', amount: 3000, description: 'Office Rent / إيجار المكتب الرئيسي' },
        { id: 'EXP-5002', date: '2026-06-10', category: 'marketing', amount: 500, description: 'Google Ads / إعلانات جوجل' }
    ],
    
    customers: [
        { id: 'CUST-8001', name: 'Khalil Al-Ghamdi / خليل الغامدي', phone: '0501234567', email: 'khalil@26i.uk', points: 150, spent: 1725 },
        { id: 'CUST-8002', name: 'Fahad Al-Otaibi / فهد العتيبي', phone: '0557654321', email: 'fahad@kamysoft.com', points: 45, spent: 480 }
    ],
    
    suppliers: [
        { id: 'SUPP-9001', company: 'Rawaa Supplies Co. / شركة رواء للتوريد', contact: 'Ahmad Ali', phone: '0599998888', items: 'Smart Monitors, POS printers' },
        { id: 'SUPP-9002', company: 'Saudi Tech Importers / مستوردي التقنية السعودية', contact: 'Sami Salem', phone: '0544443333', items: 'Barcode scanners, office equipment' }
    ],
    
    orders: [
        { id: 'ORD-7001', date: '2026-06-24 12:00', customer: 'خليل الغامدي', items: 'طابعة فواتير حرارية مباشرة x1', total: 368, status: 'Preparing' },
        { id: 'ORD-7002', date: '2026-06-24 13:00', customer: 'عميل نقدي', items: 'حبوب قهوة عضوية 1 كجم x3', total: 258.75, status: 'Ready' }
    ],

    assets: [
        { id: 'AST-2001', name: 'Server Host B Machine', cost: 4500, salvage: 500, life: 5, date: '2025-01-15', status: 'active', department: 'IT / Operations', serial: 'SN-76543A', supplier: 'Saudi Tech Importers' },
        { id: 'AST-2002', name: 'Laser Printer HP LaserJet', cost: 1200, salvage: 200, life: 4, date: '2025-03-10', status: 'active', department: 'Administration', serial: 'SN-99881P', supplier: 'Rawaa Supplies Co.' }
    ],
    
    currentFilter: 'all'
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    loadSettings();
    applyLanguage(appState.currentLanguage);
    applyTheme(appState.theme);
    renderProducts();
    renderInventory();
    renderExpenses();
    renderCustomers();
    renderSuppliers();
    renderOrders();
    renderAssets();
    renderInvoicesTable();
    updateDashboardMetrics();
    initCharts();
    setupEventListeners();
    applyPermissions();
});

function loadSettings() {
    const saved = localStorage.getItem("kamysoft_erp_state_v4");
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            appState = { ...appState, ...parsed };
        } catch (e) { console.error("Error loading state v4", e); }
    }
}

function saveState() {
    localStorage.setItem("kamysoft_erp_state_v4", JSON.stringify(appState));
}

// Permissions Manager
function applyPermissions() {
    const role = appState.currentRole;
    document.getElementById("activeRoleDisplay").textContent = translations[appState.currentLanguage][`role${role}`];

    document.querySelectorAll(".nav-item[onclick]").forEach(item => {
        const targetTab = item.getAttribute("onclick").match(/'([^']+)'/)[1];
        let allowed = true;
        if (role === 'Cashier') {
            if (['inventory', 'expenses', 'customers', 'suppliers', 'assets', 'permissions', 'reports', 'settings'].includes(targetTab)) {
                allowed = false;
            }
        } else if (role === 'Manager') {
            if (['permissions', 'settings'].includes(targetTab)) {
                allowed = false;
            }
        }
        item.style.display = allowed ? 'flex' : 'none';
    });
}

function setRole(role) {
    appState.currentRole = role;
    saveState();
    applyPermissions();
    switchTab('dashboard');
}

function applyLanguage(lang) {
    appState.currentLanguage = lang;
    document.body.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    document.body.setAttribute('lang', lang);
    
    document.querySelectorAll("[data-i18n]").forEach(elem => {
        const key = elem.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            if (elem.tagName === 'INPUT' && elem.hasAttribute('placeholder')) {
                elem.setAttribute('placeholder', translations[lang][key]);
            } else {
                elem.textContent = translations[lang][key];
            }
        }
    });

    updateCurrencyDisplays();
    renderProducts();
    renderCart();
    renderInventory();
    renderExpenses();
    renderCustomers();
    renderSuppliers();
    renderOrders();
    renderAssets();
    renderInvoicesTable();
    updateDashboardMetrics();
    applyPermissions();
    saveState();
}

function toggleLanguage() {
    applyLanguage(appState.currentLanguage === 'ar' ? 'en' : 'ar');
}

function applyTheme(theme) {
    appState.theme = theme;
    document.body.setAttribute("data-theme", theme);
    document.getElementById("themeToggleIcon").className = (theme === 'dark') ? 'ri-sun-line' : 'ri-moon-line';
    saveState();
}

function toggleTheme() {
    applyTheme(appState.theme === 'dark' ? 'light' : 'dark');
}

function updateCurrencyDisplays() {
    const symbol = translations[appState.currentLanguage].currencySymbol;
    document.querySelectorAll(".currency-lbl").forEach(el => el.textContent = symbol);
}

// POS grid rendering
function renderProducts() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;
    grid.innerHTML = "";
    
    const searchVal = document.getElementById("productSearch").value.toLowerCase();
    const isAr = appState.currentLanguage === 'ar';

    const filtered = appState.products.filter(p => {
        const matchesCategory = (appState.currentFilter === 'all' || p.category === appState.currentFilter);
        const name = (isAr ? p.nameAR : p.nameEN).toLowerCase();
        return matchesCategory && (name.includes(searchVal) || p.id.includes(searchVal));
    });

    filtered.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.onclick = () => addToCart(p.id);

        const name = isAr ? p.nameAR : p.nameEN;
        const lowStock = p.stock <= 5 ? `style="color: var(--accent-danger); font-weight: bold;"` : "";

        card.innerHTML = `
            <div class="product-img">${p.emoji || '📦'}</div>
            <div class="product-title">${name}</div>
            <div class="product-stock" ${lowStock}>
                ${isAr ? `المخزن: ${p.stock}` : `Stock: ${p.stock}`}
            </div>
            <div class="product-price">${p.price} ${translations[appState.currentLanguage].currencySymbol}</div>
        `;
        grid.appendChild(card);
    });
}

// Cart Mechanics
function addToCart(productId) {
    const product = appState.products.find(p => p.id === productId);
    if (!product || product.stock <= 0) return;

    const cartItem = appState.cart.find(item => item.product.id === productId);
    if (cartItem) {
        if (cartItem.qty < product.stock) cartItem.qty++;
    } else {
        appState.cart.push({ product, qty: 1 });
    }
    renderCart();
}

function updateCartQty(productId, delta) {
    const cartItem = appState.cart.find(item => item.product.id === productId);
    if (!cartItem) return;

    cartItem.qty += delta;
    if (cartItem.qty <= 0) {
        appState.cart = appState.cart.filter(item => item.product.id !== productId);
    } else if (cartItem.qty > cartItem.product.stock) {
        cartItem.qty = cartItem.product.stock;
    }
    renderCart();
}

function applyLoyaltyCoupon() {
    const code = document.getElementById("cartCouponInput").value.trim().toUpperCase();
    const isAr = appState.currentLanguage === 'ar';
    if (code === 'KAMY50' || code === 'BONAT50') {
        appState.activeCoupon = { code: code, rate: 0.50 };
        alert(isAr ? "تم تطبيق خصم بونات 50% بنجاح!" : "Bonat 50% discount coupon applied successfully!");
    } else if (code) {
        alert(isAr ? "كوبون غير صالح" : "Invalid coupon code");
        appState.activeCoupon = null;
    } else {
        appState.activeCoupon = null;
    }
    renderCart();
}

function renderCart() {
    const cartContainer = document.getElementById("cartItems");
    if (!cartContainer) return;
    cartContainer.innerHTML = "";

    const isAr = appState.currentLanguage === 'ar';
    const currency = translations[appState.currentLanguage].currencySymbol;

    if (appState.cart.length === 0) {
        cartContainer.innerHTML = `<div style="text-align: center; color: var(--text-secondary); margin-top: 40px;" data-i18n="cartEmpty">${translations[appState.currentLanguage].cartEmpty}</div>`;
        updateCartTotals(0, 0, 0, 0);
        return;
    }

    let subtotal = 0;
    appState.cart.forEach(item => {
        subtotal += item.product.price * item.qty;
        const name = isAr ? item.product.nameAR : item.product.nameEN;
        const row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `
            <div class="cart-item-info">
                <div class="product-title">${name}</div>
                <div style="font-size: 13px; color: var(--accent-cyan); font-weight: 600;">${item.product.price} ${currency}</div>
            </div>
            <div class="cart-item-qty">
                <button class="qty-btn" onclick="updateCartQty('${item.product.id}', -1)">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn" onclick="updateCartQty('${item.product.id}', 1)">+</button>
            </div>
        `;
        cartContainer.appendChild(row);
    });

    let discount = 0;
    if (appState.activeCoupon) {
        discount = subtotal * appState.activeCoupon.rate;
    }

    const taxableAmount = subtotal - discount;
    const vat = taxableAmount * (appState.taxRate / 100);
    const grandTotal = taxableAmount + vat;

    updateCartTotals(subtotal, discount, vat, grandTotal);
}

function updateCartTotals(subtotal, discount, vat, grandTotal) {
    const currency = translations[appState.currentLanguage].currencySymbol;
    document.getElementById("cartSubtotal").textContent = `${subtotal.toFixed(2)} ${currency}`;
    document.getElementById("cartDiscount").textContent = `-${discount.toFixed(2)} ${currency}`;
    document.getElementById("cartVat").textContent = `${vat.toFixed(2)} ${currency}`;
    document.getElementById("cartGrandTotal").textContent = `${grandTotal.toFixed(2)} ${currency}`;
}

function holdCart() {
    if (appState.cart.length === 0) return;
    appState.heldCarts.push({
        id: `HOLD-${Date.now().toString().slice(-4)}`,
        cart: [...appState.cart],
        customer: appState.activeCustomer
    });
    clearCart();
    alert(appState.currentLanguage === 'ar' ? 'تم تعليق سلة المشتريات بنجاح!' : 'Cart suspended on hold successfully!');
}

function clearCart() {
    appState.cart = [];
    appState.activeCoupon = null;
    document.getElementById("cartCouponInput").value = "";
    renderCart();
}

// Checkout & e-Invoicing
function processCheckout() {
    if (appState.cart.length === 0) return;

    const invId = `INV-${Date.now().toString().slice(-6)}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    
    let subtotal = 0;
    const items = appState.cart.map(item => {
        subtotal += item.product.price * item.qty;
        const prod = appState.products.find(p => p.id === item.product.id);
        if (prod) prod.stock -= item.qty;
        return {
            id: item.product.id,
            name: appState.currentLanguage === 'ar' ? item.product.nameAR : item.product.nameEN,
            price: item.product.price,
            qty: item.qty
        };
    });

    let discount = 0;
    if (appState.activeCoupon) {
        discount = subtotal * appState.activeCoupon.rate;
    }

    const taxableAmount = subtotal - discount;
    const vat = taxableAmount * (appState.taxRate / 100);
    const grandTotal = taxableAmount + vat;

    const pointsEarned = Math.floor(grandTotal / 10);
    const custSelect = document.getElementById("cartCustomerSelect").value;
    let customerName = appState.currentLanguage === 'ar' ? 'عميل نقدي' : 'Walk-in Cashier Customer';
    
    if (custSelect !== 'walk-in') {
        const cObj = appState.customers.find(c => c.id === custSelect);
        if (cObj) {
            cObj.points += pointsEarned;
            cObj.spent += grandTotal;
            customerName = cObj.name;
        }
    }

    const newInvoice = {
        id: invId,
        date: formattedDate,
        customer: customerName,
        items: items,
        discount: discount,
        total: grandTotal,
        vat: vat
    };

    appState.invoices.push(newInvoice);

    appState.orders.push({
        id: `ORD-${Date.now().toString().slice(-4)}`,
        date: formattedDate,
        customer: customerName,
        items: items.map(i => `${i.name} x${i.qty}`).join(', '),
        total: grandTotal,
        status: 'Pending'
    });

    saveState();
    openInvoiceModal(newInvoice, pointsEarned);
    clearCart();
    renderProducts();
    renderInventory();
    renderOrders();
    renderInvoicesTable();
    updateDashboardMetrics();
    updateSalesChartData();
}

// ZATCA e-Invoicing QR Code Generator (TLV standard)
function generateSaudiTLV(seller, vatNum, timestamp, total, vat) {
    function toTLV(tag, value) {
        const valBytes = new TextEncoder().encode(value);
        const tagByte = tag;
        const lengthByte = valBytes.length;
        const tlv = new Uint8Array(2 + valBytes.length);
        tlv[0] = tagByte;
        tlv[1] = lengthByte;
        tlv.set(valBytes, 2);
        return tlv;
    }
    const t1 = toTLV(1, seller);
    const t2 = toTLV(2, vatNum);
    const t3 = toTLV(3, timestamp);
    const t4 = toTLV(4, total.toString());
    const t5 = toTLV(5, vat.toString());

    const totalLength = t1.length + t2.length + t3.length + t4.length + t5.length;
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    [t1, t2, t3, t4, t5].forEach(arr => {
        combined.set(arr, offset);
        offset += arr.length;
    });
    return btoa(String.fromCharCode.apply(null, combined));
}

let activeInvoiceObj = null;

function openInvoiceModal(invoice, pointsEarned = 0) {
    activeInvoiceObj = invoice;
    const modal = document.getElementById("invoiceModal");
    if (!modal) return;
    renderInvoiceLayout('thermal');
    modal.style.display = "flex";
}

function renderInvoiceLayout(format) {
    const printArea = document.getElementById("invoicePrintArea");
    if (!printArea || !activeInvoiceObj) return;

    const invoice = activeInvoiceObj;
    const isAr = appState.currentLanguage === 'ar';
    const currency = translations[appState.currentLanguage].currencySymbol;

    let itemsRows = "";
    invoice.items.forEach((item, index) => {
        itemsRows += `
            <tr>
                <td>${format === 'a4' ? index + 1 : ''} ${item.name}</td>
                <td style="text-align: center;">${item.qty}</td>
                <td style="text-align: right;">${item.price.toFixed(2)}</td>
                <td style="text-align: right;">${(item.price * item.qty).toFixed(2)}</td>
            </tr>
        `;
    });

    const qrBase64 = generateSaudiTLV(
        appState.businessName, 
        appState.vatNumber, 
        invoice.date, 
        invoice.total.toFixed(2), 
        invoice.vat.toFixed(2)
    );

    printArea.className = format === 'a4' ? 'invoice-a4-layout' : 'invoice-thermal-layout';

    if (format === 'a4') {
        printArea.innerHTML = `
            <div style="padding: 40px; color: #333; min-height: 250mm;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #8b5cf6; padding-bottom: 20px;">
                    <div>
                        <h1 style="font-size: 28px; margin: 0; color: #8b5cf6;">${appState.businessName}</h1>
                        <p style="font-size: 13px; color: #666; margin: 5px 0 0 0;">${isAr ? translations.ar.taxInvoice : translations.en.taxInvoice}</p>
                    </div>
                    <div style="text-align: right;">
                        <h2 style="font-size: 20px; color: #666; margin: 0;">${isAr ? 'فاتورة ضريبية مبسطة' : 'Simplified Tax Invoice'}</h2>
                        <p style="font-size: 12px; color: #888; margin: 5px 0 0 0;">VAT Number / الرقم الضريبي: ${appState.vatNumber}</p>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 30px; font-size: 13px;">
                    <div>
                        <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 5px; color: #555;">${isAr ? 'العميل مفوتر إلى:' : 'Billed To:'}</h3>
                        <p style="margin-top: 8px; font-weight: bold;">${invoice.customer}</p>
                    </div>
                    <div style="text-align: right;">
                        <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 5px; color: #555; text-align: right;">${isAr ? 'تفاصيل الفاتورة:' : 'Invoice Details:'}</h3>
                        <p style="margin-top: 8px;"><strong>${isAr ? 'رقم الفاتورة:' : 'Invoice No:'}</strong> ${invoice.id}</p>
                        <p><strong>${isAr ? 'التاريخ والوقت:' : 'Date & Time:'}</strong> ${invoice.date}</p>
                    </div>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-top: 40px; font-size: 13px;">
                    <thead>
                        <tr style="background: #8b5cf6; color: white;">
                            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;"># البيان</th>
                            <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">الكمية / Qty</th>
                            <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">السعر / Rate</th>
                            <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">المجموع / Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsRows}
                    </tbody>
                </table>

                <div style="margin-top: 40px; display: grid; grid-template-columns: 2fr 1fr; gap: 40px; font-size: 13px;">
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px dashed #ccc; padding: 20px; border-radius: 8px;">
                        <div id="invoiceQrCode"></div>
                        <div style="font-size: 10px; color: #666; margin-top: 10px; text-align: center;">FATOORA ZATCA Compliant QR Code / فاتورة إلكترونية معتمدة</div>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>${isAr ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                            <span>${(invoice.total - invoice.vat + invoice.discount).toFixed(2)} ${currency}</span>
                        </div>
                        ${invoice.discount > 0 ? `
                        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; color: #d32f2f;">
                            <span>${isAr ? 'الخصم:' : 'Discount:'}</span>
                            <span>-${invoice.discount.toFixed(2)} ${currency}</span>
                        </div>` : ''}
                        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>${isAr ? 'ضريبة القيمة المضافة (15%):' : 'VAT (15%):'}</span>
                            <span>${invoice.vat.toFixed(2)} ${currency}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 12px 0; font-size: 18px; font-weight: bold; color: #8b5cf6;">
                            <span>${isAr ? 'المجموع الكلي:' : 'Total Amount:'}</span>
                            <span>${invoice.total.toFixed(2)} ${currency}</span>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 60px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 20px;">
                    شكراً لتعاملكم معنا | Thank you for your business
                </div>
            </div>
        `;
    } else {
        printArea.innerHTML = `
            <div class="invoice-print" style="padding: 10px; color: black;">
                <div class="invoice-header">
                    <h2>${appState.businessName}</h2>
                    <div style="font-size: 13px; color: #555;">${isAr ? translations.ar.taxInvoice : translations.en.taxInvoice}</div>
                </div>
                <div class="invoice-details">
                    <div>
                        <strong>${isAr ? 'الفاتورة:' : 'Invoice:'}</strong> ${invoice.id}<br>
                        <strong>${isAr ? 'التاريخ:' : 'Date:'}</strong> ${invoice.date}
                    </div>
                    <div style="text-align: right;">
                        <strong>${isAr ? 'الرقم الضريبي:' : 'VAT No:'}</strong> ${appState.vatNumber}<br>
                        <strong>${isAr ? 'العميل:' : 'Customer:'}</strong> ${invoice.customer}
                    </div>
                </div>
                <table style="width: 100%; text-align: left; margin-top: 15px;">
                    <thead>
                        <tr style="background: #f8f9fa;">
                            <th>${isAr ? 'البيان' : 'Item'}</th>
                            <th style="text-align: center;">${isAr ? 'الكمية' : 'Qty'}</th>
                            <th style="text-align: right;">${isAr ? 'السعر' : 'Rate'}</th>
                            <th style="text-align: right;">${isAr ? 'المجموع' : 'Total'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsRows}
                    </tbody>
                </table>
                <div style="margin-top: 15px; border-top: 1px solid #ddd; padding-top: 10px; font-size: 13px;">
                    ${invoice.discount > 0 ? `
                    <div style="display: flex; justify-content: space-between; color: var(--accent-danger);">
                        <span>${isAr ? 'الخصم / بونات:' : 'Discount / Bonat:'}</span>
                        <strong>-${invoice.discount.toFixed(2)} ${currency}</strong>
                    </div>` : ''}
                    <div style="display: flex; justify-content: space-between;">
                        <span>${isAr ? 'الضريبة (15%):' : 'VAT (15%):'}</span>
                        <strong>${invoice.vat.toFixed(2)} ${currency}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 16px; margin-top: 5px; border-top: 1px solid #eee; padding-top: 5px;">
                        <span>${isAr ? 'المجموع الكلي:' : 'Total Amount:'}</span>
                        <strong style="color: #8b5cf6;">${invoice.total.toFixed(2)} ${currency}</strong>
                    </div>
                </div>
                <div class="invoice-qr">
                    <div id="invoiceQrCode"></div>
                    <div style="font-size: 10px; color: #666; margin-top: 8px;">FATOORA Compliant QR / فاتورة إلكترونية</div>
                </div>
            </div>
        `;
    }

    setTimeout(() => {
        new QRCode(document.getElementById("invoiceQrCode"), {
            text: qrBase64,
            width: 128,
            height: 128,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
        });
    }, 100);
}

function closeInvoiceModal() {
    document.getElementById("invoiceModal").style.display = "none";
}

// Asset Management with straight line depreciation calculation
function renderAssets() {
    const list = document.getElementById("assetsTableBody");
    if (!list) return;
    list.innerHTML = "";

    const isAr = appState.currentLanguage === 'ar';
    const currency = translations[appState.currentLanguage].currencySymbol;
    const currentYear = new Date().getFullYear();

    appState.assets.forEach(a => {
        const row = document.createElement("tr");

        let statusClass = "green";
        if (a.status === 'maintenance') statusClass = "gold";
        if (a.status === 'disposed') statusClass = "danger";

        const statusLabel = translations[appState.currentLanguage][a.status] || a.status;

        // Straight-line Depreciation Calculations
        const annualDep = (a.cost - a.salvage) / a.life;
        const purchaseYear = new Date(a.date).getFullYear();
        const yearsElapsed = Math.max(0, currentYear - purchaseYear);
        const accumulatedDep = annualDep * yearsElapsed;
        const currentBookValue = Math.max(a.salvage, a.cost - accumulatedDep);

        row.innerHTML = `
            <td>${a.id}</td>
            <td style="font-weight: 600;">🖥️ ${a.name}</td>
            <td style="font-size: 12px; color: var(--text-secondary);">${a.serial || 'N/A'}</td>
            <td>${a.date}</td>
            <td style="font-weight: 700;">${a.cost.toFixed(2)} ${currency}</td>
            <td style="color: var(--accent-danger); font-weight: 600;">${annualDep.toFixed(2)} ${currency}</td>
            <td style="color: var(--accent-success); font-weight: 700;">${currentBookValue.toFixed(2)} ${currency}</td>
            <td><span class="badge ${statusClass}">${statusLabel}</span></td>
            <td>${a.department}</td>
            <td>
                <button class="btn btn-danger" style="padding: 6px 12px;" onclick="deleteAsset('${a.id}')">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </td>
        `;
        list.appendChild(row);
    });
}

function openAddAssetModal() {
    document.getElementById("assetModal").style.display = "flex";
}

function closeAssetModal() {
    document.getElementById("assetModal").style.display = "none";
}

function saveAsset(e) {
    e.preventDefault();
    const name = document.getElementById("assetFormName").value;
    const cost = parseFloat(document.getElementById("assetFormCost").value) || 0;
    const salvage = parseFloat(document.getElementById("assetFormSalvage").value) || 0;
    const life = parseInt(document.getElementById("assetFormLife").value) || 5;
    const date = document.getElementById("assetFormDate").value || new Date().toISOString().split('T')[0];
    const status = document.getElementById("assetFormStatus").value;
    const department = document.getElementById("assetFormDept").value;
    const serial = document.getElementById("assetFormSerial").value;
    const supplier = document.getElementById("assetFormSupplier").value;

    if (!name || cost <= 0 || life <= 0) return;

    appState.assets.push({
        id: `AST-${2000 + appState.assets.length + 1}`,
        name,
        cost,
        salvage,
        life,
        date,
        status,
        department,
        serial,
        supplier
    });

    saveState();
    closeAssetModal();
    renderAssets();
    updateDashboardMetrics();
}

function deleteAsset(id) {
    if (confirm(appState.currentLanguage === 'ar' ? 'هل أنت متأكد من حذف هذا الأصل؟' : 'Are you sure you want to delete this asset?')) {
        appState.assets = appState.assets.filter(a => a.id !== id);
        saveState();
        renderAssets();
        updateDashboardMetrics();
    }
}

// Expenses Management
function renderExpenses() {
    const body = document.getElementById("expensesTableBody");
    if (!body) return;
    body.innerHTML = "";

    const currency = translations[appState.currentLanguage].currencySymbol;
    const isAr = appState.currentLanguage === 'ar';

    appState.expenses.forEach(exp => {
        const row = document.createElement("tr");
        const categoryName = translations[appState.currentLanguage][exp.category] || exp.category;
        row.innerHTML = `
            <td>${exp.id}</td>
            <td>${exp.date}</td>
            <td><span class="badge purple">${categoryName}</span></td>
            <td>${exp.description}</td>
            <td style="font-weight: 700; color: var(--accent-danger);">${exp.amount.toFixed(2)} ${currency}</td>
            <td>
                <button class="btn btn-danger" style="padding: 6px 12px;" onclick="deleteExpense('${exp.id}')">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </td>
        `;
        body.appendChild(row);
    });
}

function openAddExpenseModal() {
    document.getElementById("expenseModal").style.display = "flex";
}

function closeExpenseModal() {
    document.getElementById("expenseModal").style.display = "none";
}

function saveExpense(e) {
    e.preventDefault();
    const category = document.getElementById("expFormCategory").value;
    const amount = parseFloat(document.getElementById("expFormAmount").value) || 0;
    const description = document.getElementById("expFormDesc").value;
    const date = document.getElementById("expFormDate").value || new Date().toISOString().split('T')[0];

    if (amount <= 0 || !description) return;

    appState.expenses.push({
        id: `EXP-${Date.now().toString().slice(-4)}`,
        date,
        category,
        amount,
        description
    });

    saveState();
    closeExpenseModal();
    renderExpenses();
    updateDashboardMetrics();
}

function deleteExpense(id) {
    if (confirm(appState.currentLanguage === 'ar' ? 'هل أنت متأكد من حذف هذا المصروف؟' : 'Are you sure you want to delete this expense?')) {
        appState.expenses = appState.expenses.filter(e => e.id !== id);
        saveState();
        renderExpenses();
        updateDashboardMetrics();
    }
}

// CRM - Customers & Suppliers
function renderCustomers() {
    const list = document.getElementById("customersTableBody");
    const select = document.getElementById("cartCustomerSelect");
    if (!list) return;
    list.innerHTML = "";
    
    if (select) {
        select.innerHTML = `<option value="walk-in" data-i18n="walkIn">${translations[appState.currentLanguage].walkIn}</option>`;
    }

    const currency = translations[appState.currentLanguage].currencySymbol;

    appState.customers.forEach(c => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${c.id}</td>
            <td style="font-weight: 600;">${c.name}</td>
            <td>${c.phone}</td>
            <td>${c.email}</td>
            <td><span class="badge green">+${c.points} pts</span></td>
            <td style="font-weight: 700;">${c.spent.toFixed(2)} ${currency}</td>
        `;
        list.appendChild(row);

        if (select) {
            const opt = document.createElement("option");
            opt.value = c.id;
            opt.textContent = c.name;
            select.appendChild(opt);
        }
    });
}

function openAddCustomerModal() {
    document.getElementById("customerModal").style.display = "flex";
}

function closeCustomerModal() {
    document.getElementById("customerModal").style.display = "none";
}

function saveCustomer(e) {
    e.preventDefault();
    const name = document.getElementById("custFormName").value;
    const phone = document.getElementById("custFormPhone").value;
    const email = document.getElementById("custFormEmail").value;

    if (!name || !phone) return;

    appState.customers.push({
        id: `CUST-${8000 + appState.customers.length + 1}`,
        name,
        phone,
        email,
        points: 0,
        spent: 0
    });

    saveState();
    closeCustomerModal();
    renderCustomers();
}

function renderSuppliers() {
    const list = document.getElementById("suppliersTableBody");
    if (!list) return;
    list.innerHTML = "";

    appState.suppliers.forEach(s => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${s.id}</td>
            <td style="font-weight: 600;">${s.company}</td>
            <td>${s.contact}</td>
            <td>${s.phone}</td>
            <td>${s.items}</td>
        `;
        list.appendChild(row);
    });
}

function openAddSupplierModal() {
    document.getElementById("supplierModal").style.display = "flex";
}

function closeSupplierModal() {
    document.getElementById("supplierModal").style.display = "none";
}

function saveSupplier(e) {
    e.preventDefault();
    const company = document.getElementById("suppFormCompany").value;
    const contact = document.getElementById("suppFormContact").value;
    const phone = document.getElementById("suppFormPhone").value;
    const items = document.getElementById("suppFormItems").value;

    if (!company || !phone) return;

    appState.suppliers.push({
        id: `SUPP-${9000 + appState.suppliers.length + 1}`,
        company,
        contact,
        phone,
        items
    });

    saveState();
    closeSupplierModal();
    renderSuppliers();
}

// Orders Management
function renderOrders() {
    const body = document.getElementById("ordersTableBody");
    if (!body) return;
    body.innerHTML = "";

    const currency = translations[appState.currentLanguage].currencySymbol;

    appState.orders.forEach(ord => {
        const row = document.createElement("tr");
        let statusClass = "gold";
        if (ord.status === 'Completed' || ord.status === 'Delivered') statusClass = "green";
        if (ord.status === 'Cancelled') statusClass = "danger";

        const statusLabel = translations[appState.currentLanguage][`status${ord.status}`] || ord.status;

        row.innerHTML = `
            <td>${ord.id}</td>
            <td>${ord.date}</td>
            <td>${ord.customer}</td>
            <td style="font-size: 13px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${ord.items}</td>
            <td style="font-weight: 700;">${ord.total.toFixed(2)} ${currency}</td>
            <td><span class="badge ${statusClass}">${statusLabel}</span></td>
            <td>
                <select onchange="updateOrderStatus('${ord.id}', this.value)" style="padding: 4px; border-radius: var(--radius-sm); background: var(--glass-bg); color: white; border: 1px solid var(--glass-border);">
                    <option value="Pending" ${ord.status === 'Pending' ? 'selected' : ''}>${translations[appState.currentLanguage].statusPending}</option>
                    <option value="Preparing" ${ord.status === 'Preparing' ? 'selected' : ''}>${translations[appState.currentLanguage].statusPreparing}</option>
                    <option value="Ready" ${ord.status === 'Ready' ? 'selected' : ''}>${translations[appState.currentLanguage].statusReady}</option>
                    <option value="Delivered" ${ord.status === 'Delivered' ? 'selected' : ''}>${translations[appState.currentLanguage].statusDelivered}</option>
                    <option value="Completed" ${ord.status === 'Completed' ? 'selected' : ''}>${translations[appState.currentLanguage].statusCompleted}</option>
                    <option value="Cancelled" ${ord.status === 'Cancelled' ? 'selected' : ''}>${translations[appState.currentLanguage].statusCancelled}</option>
                </select>
            </td>
        `;
        body.appendChild(row);
    });
}

function updateOrderStatus(orderId, newStatus) {
    const ord = appState.orders.find(o => o.id === orderId);
    if (ord) {
        ord.status = newStatus;
        saveState();
        renderOrders();
    }
}

// Invoices List & reports
function renderInvoicesTable() {
    const list = document.getElementById("invoicesTableBody");
    if (!list) return;
    list.innerHTML = "";

    const currency = translations[appState.currentLanguage].currencySymbol;
    const isAr = appState.currentLanguage === 'ar';

    appState.invoices.forEach(inv => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${inv.id}</td>
            <td>${inv.date}</td>
            <td>${inv.customer}</td>
            <td style="font-weight: 700;">${inv.total.toFixed(2)} ${currency}</td>
            <td><span class="badge green">${isAr ? 'مدفوعة' : 'Paid'}</span></td>
            <td>
                <button class="btn btn-secondary" style="padding: 6px 12px;" onclick="reprintInvoice('${inv.id}')">
                    <i class="ri-printer-line"></i>
                </button>
            </td>
        `;
        list.appendChild(row);
    });
}

function reprintInvoice(invId) {
    const invoice = appState.invoices.find(i => i.id === invId);
    if (invoice) {
        openInvoiceModal(invoice);
    }
}

// Dashboard metrics calculations
function updateDashboardMetrics() {
    let salesTotal = 0;
    appState.invoices.forEach(i => salesTotal += i.total);
    
    let expensesTotal = 0;
    appState.expenses.forEach(e => expensesTotal += e.amount);

    let assetsCostTotal = 0;
    let annualDepTotal = 0;
    let netBookValueTotal = 0;
    const currentYear = new Date().getFullYear();

    appState.assets.forEach(a => {
        assetsCostTotal += a.cost;
        const annualDep = (a.cost - a.salvage) / a.life;
        annualDepTotal += annualDep;
        
        const purchaseYear = new Date(a.date).getFullYear();
        const yearsElapsed = Math.max(0, currentYear - purchaseYear);
        const currentBookVal = Math.max(a.salvage, a.cost - (annualDep * yearsElapsed));
        netBookValueTotal += currentBookVal;
    });

    const currency = translations[appState.currentLanguage].currencySymbol;

    document.getElementById("metricSales").textContent = `${salesTotal.toFixed(2)} ${currency}`;
    document.getElementById("metricProducts").textContent = appState.products.length;
    document.getElementById("metricInvoices").textContent = appState.invoices.length;
    
    const netRevenue = salesTotal - expensesTotal;
    const revElement = document.getElementById("metricRevenue");
    revElement.textContent = `${netRevenue.toFixed(2)} ${currency}`;
    revElement.style.color = netRevenue >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)';

    // Dynamic Low stock warnings
    const lowStockContainer = document.getElementById("lowStockAlertList");
    if (lowStockContainer) {
        lowStockContainer.innerHTML = "";
        const isAr = appState.currentLanguage === 'ar';
        const lowStockItems = appState.products.filter(p => p.stock <= 5);

        if (lowStockItems.length === 0) {
            lowStockContainer.innerHTML = `<div style="color: var(--accent-success); font-weight: 500; font-size: 14px;">${isAr ? 'جميع المنتجات بمستويات ممتازة' : 'All stocks are healthy!'}</div>`;
        } else {
            lowStockItems.forEach(p => {
                const div = document.createElement("div");
                div.style.display = "flex";
                div.style.justifyContent = "space-between";
                div.style.padding = "8px 0";
                div.style.borderBottom = "1px solid var(--glass-border)";
                div.style.fontSize = "14px";
                div.innerHTML = `
                    <span>${p.emoji} ${isAr ? p.nameAR : p.nameEN}</span>
                    <span style="color: var(--accent-danger); font-weight: 600;">${isAr ? 'المخزن:' : 'Qty:'} ${p.stock}</span>
                `;
                lowStockContainer.appendChild(div);
            });
        }
    }

    // Reports summary
    const taxOnSales = salesTotal * (15 / 115);
    const taxableSalesAmount = salesTotal - taxOnSales;
    const taxOnExpenses = expensesTotal * 0.15;
    const netTaxPayable = taxOnSales - taxOnExpenses;

    document.getElementById("taxSales").textContent = `${taxableSalesAmount.toFixed(2)} ${currency}`;
    document.getElementById("taxCollected").textContent = `${taxOnSales.toFixed(2)} ${currency}`;
    document.getElementById("taxExpenses").textContent = `${expensesTotal.toFixed(2)} ${currency}`;
    document.getElementById("taxPaid").textContent = `${taxOnExpenses.toFixed(2)} ${currency}`;
    
    const dueElement = document.getElementById("taxDue");
    dueElement.textContent = `${netTaxPayable.toFixed(2)} ${currency}`;
    dueElement.style.color = netTaxPayable >= 0 ? 'var(--accent-gold)' : 'var(--accent-success)';

    document.getElementById("taxNetRevenue").textContent = `${netRevenue.toFixed(2)} ${currency}`;
    
    // Asset cost metric displays (Depreciation focus cards)
    const assetValDisplay = document.getElementById("taxAssetTotal");
    if (assetValDisplay) {
        assetValDisplay.textContent = `${assetsCostTotal.toFixed(2)} ${currency}`;
    }

    const depValDisplay = document.getElementById("taxAssetDep");
    if (depValDisplay) {
        depValDisplay.textContent = `${annualDepTotal.toFixed(2)} ${currency}`;
    }

    const nbValueDisplay = document.getElementById("taxAssetBook");
    if (nbValueDisplay) {
        nbValueDisplay.textContent = `${netBookValueTotal.toFixed(2)} ${currency}`;
    }
}

// Chart
let salesChartInstance = null;
function initCharts() {
    const ctx = document.getElementById("salesAnalyticsChart");
    if (!ctx) return;
    const isAr = appState.currentLanguage === 'ar';

    salesChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{
                label: isAr ? 'المبيعات اليومية (ريال)' : 'Daily Sales (SAR)',
                data: [1200, 1900, 3000, 2500, 4200, 3500, 4800],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#9aa0a6' }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#9aa0a6' }
                }
            }
        }
    });
}

function updateSalesChartData() {
    if (!salesChartInstance) return;
    const salesTotal = appState.invoices.reduce((acc, current) => acc + current.total, 0);
    const chartData = [1200, 1900, 3000, 2500, 4200, salesTotal > 0 ? salesTotal : 3500, salesTotal + 600];
    salesChartInstance.data.datasets[0].data = chartData;
    salesChartInstance.update();
}

// Inventory CRUD
function renderInventory() {
    const list = document.getElementById("inventoryTableBody");
    if (!list) return;
    list.innerHTML = "";

    const isAr = appState.currentLanguage === 'ar';
    const currency = translations[appState.currentLanguage].currencySymbol;

    appState.products.forEach(p => {
        const row = document.createElement("tr");
        let badge = `<span class="badge green">${isAr ? 'ممتاز' : 'Healthy'}</span>`;
        if (p.stock === 0) {
            badge = `<span class="badge danger">${isAr ? 'نفذت الكمية' : 'Out of Stock'}</span>`;
        } else if (p.stock <= 5) {
            badge = `<span class="badge gold">${isAr ? 'مخزون منخفض' : 'Low Stock'}</span>`;
        }

        const name = isAr ? p.nameAR : p.nameEN;

        row.innerHTML = `
            <td>${p.id}</td>
            <td style="font-weight: 600;">${p.emoji || '📦'} ${name}</td>
            <td>${translations[appState.currentLanguage][p.category] || p.category}</td>
            <td><strong>${p.stock}</strong> ${badge}</td>
            <td>${p.price} ${currency}</td>
            <td>
                <button class="btn btn-secondary" style="padding: 6px 12px;" onclick="openProductEditModal('${p.id}')">
                    <i class="ri-edit-line"></i>
                </button>
                <button class="btn btn-danger" style="padding: 6px 12px; margin-left: 4px;" onclick="deleteProduct('${p.id}')">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </td>
        `;
        list.appendChild(row);
    });
}

function openProductEditModal(id) {
    const prod = appState.products.find(p => p.id === id);
    if (!prod) return;

    document.getElementById("productModalTitle").textContent = translations[appState.currentLanguage].editProduct;
    document.getElementById("prodFormId").value = prod.id;
    document.getElementById("prodFormNameEN").value = prod.nameEN;
    document.getElementById("prodFormNameAR").value = prod.nameAR;
    document.getElementById("prodFormCategory").value = prod.category;
    document.getElementById("prodFormStock").value = prod.stock;
    document.getElementById("prodFormPrice").value = prod.price;
    document.getElementById("productEditModal").style.display = "flex";
}

function closeProductModal() {
    document.getElementById("productEditModal").style.display = "none";
}

function saveProduct(event) {
    event.preventDefault();
    const id = document.getElementById("prodFormId").value;
    const nameEN = document.getElementById("prodFormNameEN").value;
    const nameAR = document.getElementById("prodFormNameAR").value;
    const category = document.getElementById("prodFormCategory").value;
    const stock = parseInt(document.getElementById("prodFormStock").value) || 0;
    const price = parseFloat(document.getElementById("prodFormPrice").value) || 0;

    if (!nameEN || !nameAR || price <= 0) return;

    if (id) {
        const prod = appState.products.find(p => p.id === id);
        if (prod) {
            prod.nameEN = nameEN;
            prod.nameAR = nameAR;
            prod.category = category;
            prod.stock = stock;
            prod.price = price;
        }
    } else {
        const newId = (1000 + appState.products.length + 1).toString();
        appState.products.push({
            id: newId,
            nameEN,
            nameAR,
            category,
            stock,
            price,
            emoji: category === 'electronics' ? '🖥️' : category === 'groceries' ? '☕' : '📦'
        });
    }

    saveState();
    closeProductModal();
    renderProducts();
    renderInventory();
    updateDashboardMetrics();
}

function deleteProduct(id) {
    if (confirm(appState.currentLanguage === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
        appState.products = appState.products.filter(p => p.id !== id);
        saveState();
        renderProducts();
        renderInventory();
        updateDashboardMetrics();
    }
}

// Settings
function initSettingsPage() {
    document.getElementById("settingsBusinessName").value = appState.businessName;
    document.getElementById("settingsTaxRate").value = appState.taxRate;
    document.getElementById("settingsVatNo").value = appState.vatNumber;
}

function saveSystemSettings(event) {
    event.preventDefault();
    appState.businessName = document.getElementById("settingsBusinessName").value;
    appState.taxRate = parseFloat(document.getElementById("settingsTaxRate").value) || 0;
    appState.vatNumber = document.getElementById("settingsVatNo").value;
    saveState();
    
    applyLanguage(appState.currentLanguage);
    alert(appState.currentLanguage === 'ar' ? 'تم حفظ الإعدادات بنجاح!' : 'Settings saved successfully!');
}

// Navigation Layout switcher
function switchTab(tabName) {
    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });
    document.querySelectorAll(".tab-content").forEach(content => {
        content.classList.remove("active");
    });

    const activeLink = document.querySelector(`.nav-item[onclick*="${tabName}"]`);
    const activeTab = document.getElementById(`${tabName}Tab`);
    
    if (activeLink) activeLink.classList.add("active");
    if (activeTab) activeTab.classList.add("active");

    const pageTitleMap = translations[appState.currentLanguage];
    document.getElementById("pageTitle").textContent = pageTitleMap[tabName] || tabName;

    if (tabName === 'settings') {
        initSettingsPage();
    }
}

// Event Listeners setup
function setupEventListeners() {
    document.querySelectorAll(".filter-chip").forEach(chip => {
        chip.addEventListener("click", (e) => {
            document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
            e.target.classList.add("active");
            appState.currentFilter = e.target.getAttribute("data-category");
            renderProducts();
        });
    });
    document.getElementById("productSearch").addEventListener("input", renderProducts);
}
