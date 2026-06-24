// KamySoft POS & ERP Controller

// Multi-language Translation Dictionaries
const translations = {
    en: {
        dashboard: "Dashboard",
        posCashier: "POS / Cashier",
        inventory: "Inventory",
        invoices: "Invoices",
        settings: "Settings",
        salesReport: "Sales Report",
        
        // Dashboard Stats
        totalSales: "Total Sales",
        activeProducts: "Active Products",
        invoicesGenerated: "Invoices Generated",
        netRevenue: "Net Revenue",
        lowStockAlert: "Low Stock Alert",
        recentTransactions: "Recent Transactions",
        salesSummary: "Sales Summary",
        weeklyProgress: "Weekly Progress",
        
        // POS interface
        searchPlaceholder: "Search products by name or code...",
        allCategories: "All Categories",
        electronics: "Electronics",
        groceries: "Groceries",
        apparel: "Apparel",
        stationery: "Stationery",
        cartTitle: "Current Cart",
        cartEmpty: "Your cart is empty",
        subtotal: "Subtotal",
        vat: "VAT (15%)",
        discount: "Discount",
        grandTotal: "Grand Total",
        payCheckout: "Pay & Print Invoice",
        clearCart: "Clear Cart",
        
        // Inventory
        addProduct: "Add New Product",
        prodId: "Product ID",
        prodName: "Product Name",
        prodCategory: "Category",
        prodStock: "Stock",
        prodPrice: "Price (SAR)",
        actions: "Actions",
        saveProduct: "Save Product",
        editProduct: "Edit Product",
        
        // Invoices
        invoiceNum: "Invoice #",
        invoiceDate: "Date",
        invoiceCustomer: "Customer",
        invoiceTotal: "Total Amount",
        invoiceStatus: "Status",
        invoicePaid: "Paid",
        invoiceUnpaid: "Unpaid",
        viewInvoice: "View Details",
        taxReport: "Tax & Financial Report",
        taxableSales: "Taxable Sales Amount",
        taxCollected: "Total Tax Collected",
        netEarnings: "Net Profit",
        
        // Invoicing print preview modal
        invoiceDetails: "Electronic Invoice Receipt",
        taxInvoice: "Simplified Tax Invoice",
        printedOn: "Date Printed",
        billedTo: "Billed To",
        cashier: "Cashier",
        vatNumber: "VAT Registered No.",
        close: "Close",
        print: "Print & Finalize",
        
        // Settings
        generalSettings: "General Configuration",
        businessName: "Business Name",
        taxRateLabel: "Tax Rate (%)",
        currencyLabel: "Currency",
        themeLabel: "Theme Color Scheme",
        saveSettings: "Save Settings",
        
        currencySymbol: "SAR"
    },
    ar: {
        dashboard: "لوحة التحكم",
        posCashier: "الكاشير والمبيعات",
        inventory: "إدارة المخزون",
        invoices: "الفواتير والتقارير",
        settings: "الإعدادات",
        salesReport: "تقرير المبيعات",
        
        // Dashboard Stats
        totalSales: "إجمالي المبيعات",
        activeProducts: "المنتجات النشطة",
        invoicesGenerated: "الفواتير المصدرة",
        netRevenue: "صافي الأرباح",
        lowStockAlert: "تنبيهات انخفاض المخزون",
        recentTransactions: "أحدث العمليات",
        salesSummary: "ملخص المبيعات",
        weeklyProgress: "التقدم الأسبوعي",
        
        // POS interface
        searchPlaceholder: "ابحث عن منتج بالاسم أو الرمز المالي...",
        allCategories: "جميع الفئات",
        electronics: "إلكترونيات",
        groceries: "مواد غذائية",
        apparel: "ملابس",
        stationery: "قرطاسية",
        cartTitle: "السلة الحالية",
        cartEmpty: "السلة فارغة حالياً",
        subtotal: "المجموع الفرعي",
        vat: "ضريبة القيمة المضافة (15%)",
        discount: "الخصم",
        grandTotal: "المجموع الكلي",
        payCheckout: "دفع وإصدار الفاتورة",
        clearCart: "تفريغ السلة",
        
        // Inventory
        addProduct: "إضافة منتج جديد",
        prodId: "رمز المنتج",
        prodName: "اسم المنتج",
        prodCategory: "الفئة",
        prodStock: "الكمية بالمخزن",
        prodPrice: "السعر (ريال)",
        actions: "الإجراءات",
        saveProduct: "حفظ المنتج",
        editProduct: "تعديل المنتج",
        
        // Invoices
        invoiceNum: "رقم الفاتورة",
        invoiceDate: "التاريخ",
        invoiceCustomer: "العميل",
        invoiceTotal: "المبلغ الإجمالي",
        invoiceStatus: "الحالة",
        invoicePaid: "مدفوعة",
        invoiceUnpaid: "غير مدفوعة",
        viewInvoice: "عرض التفاصيل",
        taxReport: "التقرير الضريبي والمالي",
        taxableSales: "المبيعات الخاضعة للضريبة",
        taxCollected: "ضريبة القيمة المضافة المحصلة",
        netEarnings: "صافي الأرباح",
        
        // Invoicing print preview modal
        invoiceDetails: "إيصال الفاتورة الإلكترونية",
        taxInvoice: "فاتورة ضريبية مبسطة",
        printedOn: "تاريخ الطباعة",
        billedTo: "مفوتر إلى",
        cashier: "الكاشير",
        vatNumber: "الرقم الضريبي للمنشأة",
        close: "إغلاق",
        print: "طباعة واعتماد الفاتورة",
        
        // Settings
        generalSettings: "الإعدادات العامة للنظام",
        businessName: "اسم المنشأة",
        taxRateLabel: "نسبة ضريبة القيمة المضافة (%)",
        currencyLabel: "العملة المستخدمة",
        themeLabel: "مظهر لوحة النظام",
        saveSettings: "حفظ التغييرات",
        
        currencySymbol: "ر.س"
    }
};

// Default App State
let appState = {
    currentLanguage: 'ar', // Default Arabic per image context
    theme: 'dark',
    taxRate: 15,
    businessName: 'KamySoft ERP & POS',
    vatNumber: '310123456700003', // Example Saudi VAT Registration Number
    products: [
        { id: '1001', nameEN: 'Premium Smart Monitor 27"', nameAR: 'شاشة ذكية فاخرة 27 بوصة', price: 950, stock: 12, category: 'electronics', emoji: '🖥️' },
        { id: '1002', nameEN: 'Wireless Laser Scanner', nameAR: 'قارئ باركود لاسلكي ليزري', price: 250, stock: 8, category: 'electronics', emoji: '🔦' },
        { id: '1003', nameEN: 'Direct Thermal Receipt Printer', nameAR: 'طابعة فواتير حرارية مباشرة', price: 320, stock: 15, category: 'electronics', emoji: '🖨️' },
        { id: '1004', nameEN: 'Leather Executive Chair', nameAR: 'كرسي مكتب جلد فخم', price: 420, stock: 4, category: 'office', emoji: '💺' },
        { id: '1005', nameEN: 'Organic Coffee Beans 1kg', nameAR: 'حبوب قهوة عضوية 1 كجم', price: 75, stock: 30, category: 'groceries', emoji: '☕' }
    ],
    cart: [],
    invoices: [
        { id: 'INV-1001', date: '2026-06-24 10:30', customer: 'Walk-in Customer / عميل نقدي', items: [{ id: '1001', name: 'شاشة ذكية فاخرة 27 بوصة', price: 950, qty: 1 }], total: 1092.5, vat: 142.5 },
        { id: 'INV-1002', date: '2026-06-24 11:15', customer: 'KamySoft Client', items: [{ id: '1002', name: 'قارئ باركود لاسلكي ليزري', price: 250, qty: 2 }], total: 575, vat: 75 }
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
    renderInvoicesTable();
    updateDashboardMetrics();
    initCharts();
    setupEventListeners();
});

// Settings Management
function loadSettings() {
    const saved = localStorage.getItem("kamysoft_erp_state");
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            appState = { ...appState, ...parsed };
        } catch (e) { console.error("Error loading state", e); }
    }
}

function saveState() {
    localStorage.setItem("kamysoft_erp_state", JSON.stringify(appState));
}

// Multi-language Application Engine
function applyLanguage(lang) {
    appState.currentLanguage = lang;
    document.body.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    document.body.setAttribute('lang', lang);
    
    // Select elements with data-i18n attribute
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

    // Handle elements requiring composite updates or custom formatting
    updateCurrencyDisplays();
    renderProducts();
    renderCart();
    renderInventory();
    renderInvoicesTable();
    updateDashboardMetrics();
    saveState();
}

function toggleLanguage() {
    const nextLang = (appState.currentLanguage === 'ar') ? 'en' : 'ar';
    applyLanguage(nextLang);
}

// Theme Engine
function applyTheme(theme) {
    appState.theme = theme;
    document.body.setAttribute("data-theme", theme);
    document.getElementById("themeToggleIcon").className = (theme === 'dark') ? 'ri-sun-line' : 'ri-moon-line';
    saveState();
}

function toggleTheme() {
    const nextTheme = (appState.theme === 'dark') ? 'light' : 'dark';
    applyTheme(nextTheme);
}

// Update Currency values in dynamic locations
function updateCurrencyDisplays() {
    const symbol = translations[appState.currentLanguage].currencySymbol;
    document.querySelectorAll(".currency-lbl").forEach(el => el.textContent = symbol);
}

// Render POS Products View
function renderProducts() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;
    grid.innerHTML = "";
    
    const searchVal = document.getElementById("productSearch").value.toLowerCase();
    const isAr = appState.currentLanguage === 'ar';

    const filtered = appState.products.filter(p => {
        const matchesCategory = (appState.currentFilter === 'all' || p.category === appState.currentFilter);
        const name = (isAr ? p.nameAR : p.nameEN).toLowerCase();
        const matchesSearch = name.includes(searchVal) || p.id.includes(searchVal);
        return matchesCategory && matchesSearch;
    });

    filtered.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.onclick = () => addToCart(p.id);

        const productName = isAr ? p.nameAR : p.nameEN;
        const lowStock = p.stock <= 5 ? `style="color: var(--accent-danger); font-weight: bold;"` : "";

        card.innerHTML = `
            <div class="product-img">${p.emoji || '📦'}</div>
            <div class="product-title">${productName}</div>
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
        if (cartItem.qty < product.stock) {
            cartItem.qty++;
        }
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

function clearCart() {
    appState.cart = [];
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
        updateCartTotals(0, 0, 0);
        return;
    }

    let subtotal = 0;

    appState.cart.forEach(item => {
        const itemTotal = item.product.price * item.qty;
        subtotal += itemTotal;

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

    const vat = subtotal * (appState.taxRate / 100);
    const grandTotal = subtotal + vat;

    updateCartTotals(subtotal, vat, grandTotal);
}

function updateCartTotals(subtotal, vat, grandTotal) {
    const currency = translations[appState.currentLanguage].currencySymbol;
    document.getElementById("cartSubtotal").textContent = `${subtotal.toFixed(2)} ${currency}`;
    document.getElementById("cartVat").textContent = `${vat.toFixed(2)} ${currency}`;
    document.getElementById("cartGrandTotal").textContent = `${grandTotal.toFixed(2)} ${currency}`;
}

// POS Checkout & e-Invoice QR Code Standard
function processCheckout() {
    if (appState.cart.length === 0) return;

    // Generate Invoice Data
    const invId = `INV-${Date.now().toString().slice(-6)}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    
    let subtotal = 0;
    const items = appState.cart.map(item => {
        subtotal += item.product.price * item.qty;
        // Deduct Inventory Stock
        const prod = appState.products.find(p => p.id === item.product.id);
        if (prod) prod.stock -= item.qty;
        return {
            id: item.product.id,
            name: appState.currentLanguage === 'ar' ? item.product.nameAR : item.product.nameEN,
            price: item.product.price,
            qty: item.qty
        };
    });

    const vat = subtotal * (appState.taxRate / 100);
    const grandTotal = subtotal + vat;

    const newInvoice = {
        id: invId,
        date: formattedDate,
        customer: appState.currentLanguage === 'ar' ? 'عميل نقدي' : 'Walk-in Cash Customer',
        items: items,
        total: grandTotal,
        vat: vat
    };

    appState.invoices.push(newInvoice);
    saveState();

    // Show Invoice Modal
    openInvoiceModal(newInvoice);

    // Reset checkout state
    clearCart();
    renderProducts();
    renderInventory();
    renderInvoicesTable();
    updateDashboardMetrics();
    updateSalesChartData();
}

// Saudi ZATCA e-Invoicing QR Code Generator (Simplified TLV format base64 encoder)
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
    
    // Tag 1: Seller Name
    const t1 = toTLV(1, seller);
    // Tag 2: VAT Number
    const t2 = toTLV(2, vatNum);
    // Tag 3: Timestamp
    const t3 = toTLV(3, timestamp);
    // Tag 4: Invoice Total
    const t4 = toTLV(4, total.toString());
    // Tag 5: VAT Amount
    const t5 = toTLV(5, vat.toString());

    const totalLength = t1.length + t2.length + t3.length + t4.length + t5.length;
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    [t1, t2, t3, t4, t5].forEach(arr => {
        combined.set(arr, offset);
        offset += arr.length;
    });

    // Base64 encoding
    return btoa(String.fromCharCode.apply(null, combined));
}

function openInvoiceModal(invoice) {
    const modal = document.getElementById("invoiceModal");
    const printArea = document.getElementById("invoicePrintArea");
    if (!modal || !printArea) return;

    const isAr = appState.currentLanguage === 'ar';
    const currency = translations[appState.currentLanguage].currencySymbol;

    let itemsRows = "";
    invoice.items.forEach(item => {
        itemsRows += `
            <tr>
                <td>${item.name}</td>
                <td style="text-align: center;">${item.qty}</td>
                <td style="text-align: right;">${item.price} ${currency}</td>
                <td style="text-align: right;">${(item.price * item.qty).toFixed(2)} ${currency}</td>
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

    printArea.innerHTML = `
        <div class="invoice-print">
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
                <div style="font-size: 10px; color: #666;">FATOORA Compliant QR / فاتورة إلكترونية</div>
            </div>
        </div>
    `;

    modal.style.display = "flex";

    // Generate Visual QR Code inside modal using library
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

// Inventory CRUD & management
function renderInventory() {
    const list = document.getElementById("inventoryTableBody");
    if (!list) return;
    list.innerHTML = "";

    const isAr = appState.currentLanguage === 'ar';
    const currency = translations[appState.currentLanguage].currencySymbol;

    appState.products.forEach(p => {
        const row = document.createElement("tr");

        let badge = `<span style="background: rgba(16, 185, 129, 0.15); color: var(--accent-success); padding: 4px 8px; border-radius: var(--radius-sm); font-size: 12px;">${isAr ? 'ممتاز' : 'Healthy'}</span>`;
        if (p.stock === 0) {
            badge = `<span style="background: rgba(239, 68, 68, 0.15); color: var(--accent-danger); padding: 4px 8px; border-radius: var(--radius-sm); font-size: 12px;">${isAr ? 'نفذت الكمية' : 'Out of Stock'}</span>`;
        } else if (p.stock <= 5) {
            badge = `<span style="background: rgba(245, 158, 11, 0.15); color: var(--accent-gold); padding: 4px 8px; border-radius: var(--radius-sm); font-size: 12px;">${isAr ? 'مخزون منخفض' : 'Low Stock'}</span>`;
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

function openAddProductModal() {
    document.getElementById("productModalTitle").textContent = translations[appState.currentLanguage].addProduct;
    document.getElementById("prodFormId").value = "";
    document.getElementById("prodFormNameEN").value = "";
    document.getElementById("prodFormNameAR").value = "";
    document.getElementById("prodFormCategory").value = "electronics";
    document.getElementById("prodFormStock").value = "";
    document.getElementById("prodFormPrice").value = "";
    document.getElementById("productEditModal").style.display = "flex";
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
        // Edit Mode
        const prod = appState.products.find(p => p.id === id);
        if (prod) {
            prod.nameEN = nameEN;
            prod.nameAR = nameAR;
            prod.category = category;
            prod.stock = stock;
            prod.price = price;
        }
    } else {
        // Add Mode
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
            <td><span style="background: rgba(16, 185, 129, 0.15); color: var(--accent-success); padding: 4px 8px; border-radius: var(--radius-sm); font-size: 12px;">${isAr ? 'مدفوعة' : 'Paid'}</span></td>
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

// Dashboard calculations
function updateDashboardMetrics() {
    let salesVal = 0;
    appState.invoices.forEach(i => salesVal += i.total);
    
    const activeProducts = appState.products.length;
    const invoicesGenerated = appState.invoices.length;
    
    // Low stock warnings
    const lowStockCount = appState.products.filter(p => p.stock <= 5).length;

    const currency = translations[appState.currentLanguage].currencySymbol;

    document.getElementById("metricSales").textContent = `${salesVal.toFixed(2)} ${currency}`;
    document.getElementById("metricProducts").textContent = activeProducts;
    document.getElementById("metricInvoices").textContent = invoicesGenerated;
    document.getElementById("metricRevenue").textContent = `${(salesVal * 0.85).toFixed(2)} ${currency}`; // 85% profit example

    // Low stock panel updates
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
                div.style.justify = "space-between";
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
}

// Dynamic Interactive Chart Config
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
    // Dynamic sample update depending on invoices list size
    const salesTotal = appState.invoices.reduce((acc, current) => acc + current.total, 0);
    const chartData = [1200, 1900, 3000, 2500, 4200, salesTotal > 0 ? salesTotal : 3500, salesTotal + 500];
    salesChartInstance.data.datasets[0].data = chartData;
    salesChartInstance.update();
}

// System settings controls
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

    if (tabName === 'settings') {
        initSettingsPage();
    }
}

// Event Listeners setup
function setupEventListeners() {
    // POS filter chips
    document.querySelectorAll(".filter-chip").forEach(chip => {
        chip.addEventListener("click", (e) => {
            document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
            e.target.classList.add("active");
            appState.currentFilter = e.target.getAttribute("data-category");
            renderProducts();
        });
    });

    // Product search input
    document.getElementById("productSearch").addEventListener("input", renderProducts);
}
