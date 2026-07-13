import React, { useState } from 'react';

// Landing Page translations dictionary
const landingTranslations = {
    en: {
        brandName: "26i ERP",
        heroTagline: "The Next-Generation POS & ERP for Smart Businesses",
        heroSubtagline: "Unify your cashier, sales, capital assets, ZATCA e-invoicing, and multi-branch inventory into a single state-of-the-art cloud dashboard.",
        launchDemo: "Launch Live Demo",
        contactSales: "Request Demo / Purchase",
        viewPricing: "View Pricing Plans",
        features: "Features",
        pricing: "Pricing",
        faq: "FAQ",
        contact: "Contact",
        businessTypes: "Business Sectors",
        
        // Stats
        statStores: "12,000+ Active Retailers",
        statInvoices: "15M+ Invoices Processed",
        statUptime: "99.99% Cloud Uptime",
        statVat: "100% ZATCA Compliant",
        
        // Business Simulator Section
        simTitle: "Tailored to Your Business Model",
        simSub: "Choose your business type below to preview custom interface features and specialized modules pre-loaded in our system.",
        sectorRetail: "Retail Store",
        sectorSupermarket: "Supermarket & Grocery",
        sectorRestaurant: "Restaurant & Cafe",
        sectorApparel: "Garments & Apparel",
        sectorAppliances: "Home Appliances & Electronics",
        sectorFurniture: "Furniture Store",
        sectorSpareParts: "Spare Parts (Auto/HVAC/Plumbing/Electric)",
        
        simBarcodes: "Automated Barcode Scans",
        simTables: "Table & Guest Mapping",
        simDepreciation: "Capital Asset Depreciation",
        simMultiBranch: "Multi-Branch Sync",
        simVatScan: "ZATCA simplified tax invoices with QR codes generated instantly.",
        
        // Multi-Branch HQ
        hqTitle: "Centralized Multi-Branch Headquarters",
        hqSub: "Manage operations across multiple locations, warehouses, or business types from a single centralized manager account.",
        hqFeature1: "Aggregate Sales Reports: View live revenues across Riyadh, Jeddah, and Dammam branches.",
        hqFeature2: "Inter-Branch Stock Transfers: Move inventory between stores to avoid stockouts.",
        hqFeature3: "Role-Based Permissions: Restrict cashiers to their local POS while managers see the complete ERP.",
        
        // ZATCA Section
        zatcaTitle: "Official Saudi ZATCA Phase 2 Compliance",
        zatcaSub: "Generate compliant Simplified Tax Invoices with cryptographic signatures and automatic QR codes required by the ZATCA Developer Portal.",
        zatcaStep1: "Private Key & CSR Generation",
        zatcaStep2: "CCSID/PCSID Sandbox Registration",
        zatcaStep3: "Direct Cryptographic Signing & Validation",
        
        // Pricing
        pricingTitle: "Flexible, Worldwide Licensing",
        pricingSub: "Choose a plan designed to grow with your business. All plans support Arabic/English interfaces.",
        monthly: "Monthly",
        yearly: "Yearly (Save 20%)",
        currency: "SAR",
        perMonth: "/mo",
        recommend: "Recommended",
        starterName: "Starter Tier",
        starterDesc: "For small kiosks, single-register mini supermarkets, and start-ups.",
        profName: "Professional ERP",
        profDesc: "Perfect for growing mid-sized retail, restaurants, and apparel chains.",
        entName: "Enterprise Cloud",
        entDesc: "For multi-branch corporations requiring deep integrations and ZATCA APIs.",
        starterPrice: "99",
        profPrice: "249",
        entPrice: "499",
        
        starterFeats: [
            "1 Register POS / Cashier app",
            "Local Offline Fallback Mode",
            "Basic Inventory with Barcodes",
            "Capital Asset Tracking",
            "Bilingual Receipts (A4/Thermal)"
        ],
        profFeats: [
            "Unlimited Cashier Registers",
            "Multi-Branch HQ Management",
            "Multi-Business Sector Config",
            "Expense & Capital Depreciation",
            "Loyalty Points & CRM Modules",
            "Supplier & Purchase Orders Tracking"
        ],
        entFeats: [
            "Everything in Professional Plan",
            "Live ZATCA Phase 2 API Sync",
            "Sandbox Device CSR Generation",
            "Dedicated Account Manager",
            "24/7 Priority Support SLAs",
            "Custom Domain (x.26i.uk)"
        ],
        buyNow: "Get Started Now",
        
        // Contact Form
        formTitle: "Schedule a Guided Demo",
        formSub: "Fill out the details below and our worldwide deployment team will get in touch with you within 24 hours.",
        formName: "Full Name",
        formEmail: "Email Address",
        formPhone: "Phone Number",
        formBizName: "Business Name",
        formBizType: "Business Sector",
        formBranches: "Number of Branches",
        formMsg: "Tell us about your requirements",
        formSubmit: "Submit Demo Request",
        formSuccess: "Thank you! Your request has been successfully registered. We will contact you soon.",
        formError: "An error occurred. Please verify your entries.",
        
        // FAQs
        faqTitle: "Frequently Asked Questions",
        faqQ1: "Does the software support local offline operation?",
        faqA1: "Yes! 26i ERP includes a local cache fallback. Cashiers can continue processing sales and printing receipts even if the internet connection is temporarily lost, syncing all data to the cloud once online.",
        faqQ2: "How does the multi-branch system work?",
        faqA2: "The system automatically aggregates inventory and sales data. A central manager can allocate stock to specific branches, run unified tax reports, and control individual permissions of cashiers based on location.",
        faqQ3: "Is the ZATCA compliance approved for Saudi Arabia?",
        faqA3: "Absolutely. Our e-invoicing system implements standard XML invoice specifications, generates base64 QR codes, and connects with the ZATCA sandbox/production API for Phase 2 registration.",
        faqQ4: "Can I host this on my own private servers?",
        faqA4: "Yes, we support private deployment via Docker containers or IIS Web Servers on Windows Server. Contact our Enterprise team for dedicated licensing fees.",
        faqQ5: "How are currency conversions and VAT managed?",
        faqA5: "The system uses SAR as base currency but includes real-time exchange rates (USD, EUR, AED, EGP). VAT is pre-configured to 15% but can be modified in settings to comply with other global tax laws.",
        
        footerText: "© 2026 26i Global Technologies. All rights reserved. Powering commerce worldwide."
    },
    ar: {
        brandName: "26i ERP",
        heroTagline: "نظام نقاط البيع وإدارة الموارد للجيل القادم من الأعمال",
        heroSubtagline: "وحد الكاشير، المبيعات، الأصول الثابتة، الفوترة الإلكترونية لهيئة الزكاة والدخل، ومخزون الفروع المتعددة في لوحة تحكم سحابية موحدة.",
        launchDemo: "إطلاق نسخة تجريبية",
        contactSales: "طلب تجربة / شراء",
        viewPricing: "عرض خطط الأسعار",
        features: "المميزات",
        pricing: "الأسعار",
        faq: "الأسئلة الشائعة",
        contact: "اتصل بنا",
        businessTypes: "قطاعات الأعمال",
        
        // Stats
        statStores: "أكثر من 12,000 تاجر نشط",
        statInvoices: "أكثر من 15 مليون فاتورة",
        statUptime: "نسبة تشغيل سحابية 99.99%",
        statVat: "متوافق 100% مع هيئة الزكاة",
        
        // Business Simulator Section
        simTitle: "مخصص لنموذج عملك التجاري",
        simSub: "اختر نوع نشاطك التجاري أدناه لمعاينة واجهة البيع المخصصة والموديولات المسبقة التهيئة المتوفرة في نظامنا.",
        sectorRetail: "متجر تجزئة",
        sectorSupermarket: "سوبرماركت وبقالة",
        sectorRestaurant: "مطعم ومقهى",
        sectorApparel: "ملابس وأزياء",
        sectorAppliances: "الأجهزة المنزلية والإلكترونيات",
        sectorFurniture: "معارض الأثاث",
        sectorSpareParts: "قطع الغيار (سيارات/تكييف/سباكة/كهرباء)",
        
        simBarcodes: "قراءة الباركود التلقائية",
        simTables: "تخطيط الطاولات والضيوف",
        simDepreciation: "إهلاك الأصول الثابتة",
        simMultiBranch: "مزامنة الفروع المتعددة",
        simVatScan: "فواتير ضريبية مبسطة مع رمز الاستجابة السريعة (QR) يتم إنشاؤها فوراً.",
        
        // Multi-Branch HQ
        hqTitle: "إدارة الفروع المتعددة والمركز الرئيسي",
        hqSub: "أدر عملياتك عبر مواقع متعددة، أو مستودعات، أو أنشطة تجارية مختلفة من حساب مدير مركزي واحد.",
        hqFeature1: "تقارير مبيعات مجمعة: عرض المبيعات المباشرة لفروع الرياض، جدة، والدمام.",
        hqFeature2: "تحويل المخزون بين الفروع: نقل البضائع بين الفروع لمنع نفاد المخزون.",
        hqFeature3: "صلاحيات المستخدمين: قصر الكاشير على فرعه المحلي بينما يرى المدير النظام كاملاً.",
        
        // ZATCA Section
        zatcaTitle: "التكامل مع المرحلة الثانية لهيئة الزكاة والدخل (فاتورة)",
        zatcaSub: "أنشئ فواتير ضريبية مبسطة متوافقة بالكامل تحتوي على التوقيع الرقمي ورموز الـ QR المطلوبة لبوابة المطورين للهيئة.",
        zatcaStep1: "إنشاء المفتاح الخاص وطلب التوقيع (CSR)",
        zatcaStep2: "تسجيل الأجهزة في البيئة التجريبية (CCSID/PCSID)",
        zatcaStep3: "التوقيع والتشفير والتحقق المباشر من الفواتير",
        
        // Pricing
        pricingTitle: "تراخيص مرنة لكافة أنحاء العالم",
        pricingSub: "اختر الباقة المناسبة لنمو عملك. جميع الباقات تدعم الواجهتين العربية والإنجليزية.",
        monthly: "شهري",
        yearly: "سنوي (توفير 20%)",
        currency: "ريال",
        perMonth: "/شهرياً",
        recommend: "موصى به",
        starterName: "الباقة الأساسية",
        starterDesc: "للاكشاك الصغيرة، السوبرماركت الفردي الصغير، والمشاريع الناشئة.",
        profName: "نظام ERP للمحترفين",
        profDesc: "مثالي للمتاجر المتوسطة، والمطاعم، وسلاسل محلات الملابس والأزياء.",
        entName: "المؤسسات الكبرى",
        entDesc: "للشركات الكبرى ذات الفروع المتعددة والتي تحتاج ربط API مباشر مع هيئة الزكاة.",
        starterPrice: "99",
        profPrice: "249",
        entPrice: "499",
        
        starterFeats: [
            "نقطة بيع واحدة (كاشير)",
            "وضع العمل المحلي عند انقطاع الإنترنت",
            "مخزون أساسي مع دعم الباركود",
            "متابعة الأصول الثابتة والرأسمالية",
            "فواتير ثنائية اللغة (A4 وحرارية)"
        ],
        profFeats: [
            "عدد غير محدود من أجهزة الكاشير",
            "إدارة مركزية للفروع المتعددة",
            "تهيئة أنشطة تجارية متعددة",
            "إدارة المصروفات وإهلاك الأصول",
            "نظام نقاط الولاء وإدارة العملاء CRM",
            "إدارة الموردين وأوامر الشراء"
        ],
        entFeats: [
            "كل ما تضمنته باقة المحترفين",
            "ربط API مباشر مع هيئة الزكاة والجمارك",
            "توليد ملفات CSR للأجهزة وتسجيلها",
            "مدير حساب مخصص للمنشأة",
            "دعم فني وتوافر على مدار الساعة 24/7",
            "نطاق مخصص للعميل (x.26i.uk)"
        ],
        buyNow: "ابدأ الآن",
        
        // Contact Form
        formTitle: "احجز عرضاً تجريبياً مباشراً",
        formSub: "املأ البيانات أدناه وسيتواصل معك فريق الدعم والتركيب العالمي لدينا خلال 24 ساعة.",
        formName: "الاسم الكامل",
        formEmail: "البريد الإلكتروني",
        formPhone: "رقم الجوال",
        formBizName: "اسم المنشأة",
        formBizType: "نوع النشاط",
        formBranches: "عدد الفروع",
        formMsg: "أخبرنا عن متطلبات عملك",
        formSubmit: "إرسال طلب الديمو",
        formSuccess: "شكرًا لك! تم تسجيل طلبك بنجاح. سنتواصل معك في أقرب وقت ممكن.",
        formError: "حدث خطأ ما. يرجى التحقق من المدخلات.",
        
        // FAQs
        faqTitle: "الأسئلة الشائعة",
        faqQ1: "هل يدعم البرنامج العمل بدون إنترنت؟",
        faqA1: "نعم! يحتوي 26i ERP على ميزة التخزين المؤقت المحلي. يستطيع الكاشير إتمام المبيعات وطباعة الفواتير حتى في حال انقطاع الإنترنت، وسيقوم النظام بمزامنة المبيعات تلقائياً فور عودة الاتصال.",
        faqQ2: "كيف تعمل ميزة إدارة الفروع المتعددة؟",
        faqA2: "يقوم النظام بتجميع بيانات المخازن والمبيعات بشكل لحظي. يمكن للمدير الرئيسي تحويل البضائع بين الفروع، وإصدار تقارير الضريبة الموحدة، وتحديد صلاحيات موظفي الكاشير بناءً على فرعهم المحدد.",
        faqQ3: "هل الفواتير الإلكترونية متوافقة مع هيئة الزكاة والدخل بالسعودية؟",
        faqA3: "بكل تأكيد. يتوافق نظام الفوترة بالكامل مع متطلبات الهيئة للمرحلة الثانية (فاتورة)، حيث ينشئ ملفات XML المشفرة ورموز الاستجابة السريعة (QR) المدعمة بالبيانات الرقمية المطلوبة ويقوم بالربط مع البيئة التجريبية للهيئة.",
        faqQ4: "هل يمكنني تثبيت النظام على خوادمي الخاصة؟",
        faqA4: "نعم، ندعم التثبيت الخاص للمؤسسات عبر حاويات Docker أو خوادم ويب IIS على أنظمة تشغيل Windows Server. يرجى التواصل معنا للاستعلام عن تراخيص التثبيت الداخلي.",
        faqQ5: "كيف يتم حساب الضريبة وتغيير العملات؟",
        faqA5: "العملة الأساسية للنظام هي الريال السعودي (SAR)، ولكنه يدعم أسعار صرف متعددة ومباشرة (الدولار، اليورو، الدرهم الإماراتي، الجنيه المصري). الضريبة مهيأة مسبقاً بنسبة 15% ويمكن تعديلها من الإعدادات بسهولة لتناسب القوانين الضريبية الأخرى.",
        
        footerText: "© 2026 26i للحلول التقنية العالمية. جميع الحقوق محفوظة."
    }
};

export default function LandingPage({ currentLanguage, setCurrentLanguage, theme, setTheme, onLaunchApp, onRegisterSuccess, baseDomain = '26i.uk' }) {
    const t = landingTranslations[currentLanguage];
    const isRtl = currentLanguage === 'ar';
    
    // States
    const [billingCycle, setBillingCycle] = useState('yearly'); // 'monthly' or 'yearly'
    const [activeSector, setActiveSector] = useState('retail'); // 'retail', 'grocery', 'restaurant', 'apparel'
    
    // Custom SaaS Store Registration states
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [registerForm, setRegisterForm] = useState({
        tenantId: '',
        businessName: '',
        fullName: '',
        businessType: 'retail',
        adminUsername: 'admin',
        adminPassword: '',
        email: '',
        mobile: '',
        nationalAddress: '',
        vatNumber: '',
        crNumber: ''
    });
    const [registerStatus, setRegisterStatus] = useState(null); // 'submitting', 'success', 'error'
    const [registerError, setRegisterError] = useState('');
    const [registeredTenantId, setRegisteredTenantId] = useState('');
    const [generatedLicenseKey, setGeneratedLicenseKey] = useState('');

    const openRegisterModal = () => {
        setRegisterForm({
            tenantId: '',
            businessName: '',
            businessType: 'retail',
            adminUsername: 'admin',
            adminPassword: '',
            email: '',
            mobile: '',
            nationalAddress: '',
            vatNumber: '',
            crNumber: ''
        });
        setRegisterStatus(null);
        setRegisterError('');
        setRegisteredTenantId('');
        setGeneratedLicenseKey('');
        setShowRegisterModal(true);
    };

    const handleRegisterChange = (e) => {
        setRegisterForm({
            ...registerForm,
            [e.target.name]: e.target.value
        });
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setRegisterStatus('submitting');
        setRegisterError('');
        try {
            // Clean tenantId to lowercase alphanumeric and dash
            const cleanTenantId = registerForm.tenantId.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
            if (!cleanTenantId) {
                setRegisterStatus('error');
                setRegisterError(isRtl ? 'الرابط الفرعي غير صالح' : 'Invalid subdomain format');
                return;
            }
            
            const response = await fetch('/api/auth/register-tenant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...registerForm,
                    tenantId: cleanTenantId,
                    billingCycle: billingCycle
                })
            });
            const data = await response.json();
            if (response.ok) {
                setRegisterStatus('success');
                setRegisteredTenantId(cleanTenantId);
                localStorage.setItem('lastRegisteredUsername', registerForm.adminUsername);
                if (data.licenseKey) {
                    setGeneratedLicenseKey(data.licenseKey);
                }
                // Store cleanTenantId so the "Launch My Store" button can use it
                // (onRegisterSuccess is called from the button, not here, so the success screen stays visible)

            } else {
                setRegisterStatus('error');
                setRegisterError(data.error || (isRtl ? 'حدث خطأ أثناء الإنشاء' : 'Error creating store'));
            }
        } catch (err) {
            setRegisterStatus('error');
            setRegisterError(isRtl ? 'خطأ في الاتصال بالخادم' : 'Server connection failed');
        }
    };
    
    // Contact Form States
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        businessName: '',
        businessType: 'retail',
        branches: 1,
        message: ''
    });
    const [formStatus, setFormStatus] = useState(null); // 'submitting', 'success', 'error'
    
    // Accordion State
    const [openFaq, setOpenFaq] = useState(null);
    
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormStatus('submitting');
        try {
            const response = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setFormStatus('success');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    businessName: '',
                    businessType: 'retail',
                    branches: 1,
                    message: ''
                });
            } else {
                setFormStatus('error');
            }
        } catch (err) {
            setFormStatus('error');
        }
    };
    
    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };
    
    const getPrice = (basePrice) => {
        const priceNum = parseInt(basePrice);
        if (billingCycle === 'yearly') {
            // Apply 20% discount and show monthly equivalence
            return Math.round(priceNum * 0.8);
        }
        return priceNum;
    };
    
    return (
        <div style={{ width: '100%', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }} dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Ambient Background Glows */}
            <div className="hero-glow-1"></div>
            <div className="hero-glow-2"></div>
            
            {/* Navigation Header */}
            <header className="landing-nav glass-card" style={{ 
                position: 'sticky', 
                top: '16px', 
                margin: '16px auto', 
                width: 'calc(100% - 32px)', 
                maxWidth: '1200px', 
                zIndex: 100, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '12px 24px',
                borderRadius: '8px'
            }}>
                <div className="brand" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <i className="ri-store-2-line"></i>
                    <span>{t.brandName}</span>
                </div>
                
                <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }} className="landing-nav-links">
                    <a href="#features" className="nav-item-link">{t.features}</a>
                    <a href="#sectors" className="nav-item-link">{t.businessTypes}</a>
                    <a href="#pricing" className="nav-item-link">{t.pricing}</a>
                    <a href="#faq" className="nav-item-link">{t.faq}</a>
                    <a href="#contact" className="nav-item-link">{t.contact}</a>
                </nav>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Theme Toggler */}
                    <button 
                        className="btn btn-secondary" 
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
                        style={{ padding: '8px 12px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
                        title="Toggle Theme"
                    >
                        <i className={theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line'} style={{ fontSize: '14px', color: 'var(--accent-gold)' }}></i>
                    </button>
                    
                    {/* Language Toggler */}
                    <button 
                        className="btn btn-secondary" 
                        onClick={() => setCurrentLanguage(currentLanguage === 'ar' ? 'en' : 'ar')} 
                        style={{ padding: '8px 12px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
                    >
                        <i className="ri-translate" style={{ fontSize: '14px', color: 'var(--accent-cyan)' }}></i>
                        <span style={{ fontSize: '12px', fontWeight: '500' }}>{currentLanguage === 'ar' ? 'English' : 'العربية'}</span>
                    </button>
                    
                    {/* App CTA */}
                    <button 
                        className="btn btn-primary" 
                        onClick={openRegisterModal}
                        style={{ padding: '8px 16px', fontSize: '13px', background: 'var(--accent-cyan)' }}
                    >
                        <i className="ri-add-box-line"></i>
                        <span>{currentLanguage === 'ar' ? 'أنشئ متجرك' : 'Create Store'}</span>
                    </button>
                    
                    <button 
                        className="btn btn-primary glow-button" 
                        onClick={onLaunchApp}
                        style={{ padding: '8px 16px', fontSize: '13px' }}
                    >
                        <i className="ri-rocket-2-line"></i>
                        <span>{t.launchDemo}</span>
                    </button>
                </div>
            </header>
            
            {/* HERO SECTION */}
            <section style={{ 
                maxWidth: '1200px', 
                margin: '80px auto 40px auto', 
                padding: '0 20px', 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '40px',
                alignItems: 'center'
            }} className="landing-hero-grid">
                <div>
                    <span className="glow-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
                        <span className="pulse-dot"></span>
                        {currentLanguage === 'ar' ? 'إطلاق الإصدار الجديد 2026' : 'New 2026 Version Released'}
                    </span>
                    <h1 style={{ 
                        fontSize: '48px', 
                        fontWeight: '800', 
                        lineHeight: '1.15', 
                        marginBottom: '20px',
                        background: 'linear-gradient(135deg, #ffffff, var(--text-secondary))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }} className="hero-heading">
                        {t.heroTagline}
                    </h1>
                    <p style={{ 
                        fontSize: '16px', 
                        lineHeight: '1.6', 
                        color: 'var(--text-secondary)', 
                        marginBottom: '32px',
                        maxWidth: '520px'
                    }}>
                        {t.heroSubtagline}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }} className="hero-ctas">
                        <button className="btn btn-primary glow-button" style={{ padding: '14px 28px', fontSize: '15px' }} onClick={openRegisterModal}>
                            <i className="ri-store-2-line" style={{ fontSize: '18px' }}></i>
                            <span>{currentLanguage === 'ar' ? 'أنشئ متجرك الخاص' : 'Create My Store'}</span>
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '15px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }} onClick={onLaunchApp}>
                            <i className="ri-play-circle-line" style={{ fontSize: '18px' }}></i>
                            <span>{t.launchDemo}</span>
                        </button>
                        <a href="#contact" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '15px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                            <i className="ri-mail-send-line" style={{ fontSize: '18px' }}></i>
                            <span>{t.contactSales}</span>
                        </a>
                    </div>
                    
                    {/* Trust badges */}
                    <div style={{ display: 'flex', gap: '30px', marginTop: '48px', opacity: 0.8 }} className="hero-trust">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="ri-shield-check-line" style={{ color: 'var(--accent-success)', fontSize: '20px' }}></i>
                            <span style={{ fontSize: '13px' }}>{t.statVat}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="ri-server-line" style={{ color: 'var(--accent-cyan)', fontSize: '20px' }}></i>
                            <span style={{ fontSize: '13px' }}>{t.statUptime}</span>
                        </div>
                    </div>
                </div>
                
                {/* Stunning Interactive Mockup Frame */}
                <div style={{ position: 'relative' }}>
                    <div className="glass-card feature-card-glow" style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
                                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
                                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>demo.{baseDomain}/cashier</span>
                        </div>
                        
                        {/* Mock Cashier Layout */}
                        <div style={{ background: '#07070b', borderRadius: '6px', padding: '12px', fontSize: '12px' }}>
                            {/* POS Top */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontWeight: '600' }}>{currentLanguage === 'ar' ? 'سلة المشتريات الحالية' : 'Current Cart'}</span>
                                <span style={{ color: 'var(--accent-purple)', fontSize: '11px' }}>{currentLanguage === 'ar' ? 'رقم الكاشير: #03' : 'Cashier ID: #03'}</span>
                            </div>
                            
                            {/* POS Cart items list */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '120px', overflowY: 'hidden', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', marginBottom: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '4px' }}>
                                    <div>
                                        <span style={{ marginRight: '6px', color: 'var(--accent-purple)' }}>2x</span>
                                        <span>{currentLanguage === 'ar' ? 'شاشة ذكية فاخرة' : 'Premium Smart Monitor'}</span>
                                    </div>
                                    <span>1,900.00 {t.currency}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '4px' }}>
                                    <div>
                                        <span style={{ marginRight: '6px', color: 'var(--accent-purple)' }}>1x</span>
                                        <span>{currentLanguage === 'ar' ? 'قارئ باركود لاسلكي' : 'Wireless Laser Scanner'}</span>
                                    </div>
                                    <span>250.00 {t.currency}</span>
                                </div>
                            </div>
                            
                            {/* POS Summary */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                    <span>{currentLanguage === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                                    <span>2,150.00 {t.currency}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                    <span>{currentLanguage === 'ar' ? 'ضريبة القيمة المضافة (15%)' : 'VAT (15%)'}</span>
                                    <span>322.50 {t.currency}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderTop: '1px dashed var(--glass-border)', paddingTop: '6px', color: 'var(--accent-cyan)' }}>
                                    <span>{currentLanguage === 'ar' ? 'الإجمالي النهائي' : 'Grand Total'}</span>
                                    <span>2,472.50 {t.currency}</span>
                                </div>
                            </div>
                            
                            {/* Mock Buttons */}
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px' }}>
                                <button className="btn btn-primary" style={{ padding: '8px', fontSize: '11px', height: '30px' }} onClick={onLaunchApp}>
                                    <i className="ri-printer-line"></i>
                                    {currentLanguage === 'ar' ? 'الدفع وطباعة الفاتورة' : 'Pay & Print Invoice'}
                                </button>
                                <button className="btn btn-secondary" style={{ padding: '8px', fontSize: '11px', height: '30px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                                    {currentLanguage === 'ar' ? 'تأجيل' : 'Hold'}
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Float cards for aesthetics */}
                    <div className="glass-card" style={{ position: 'absolute', bottom: '-20px', left: isRtl ? 'auto' : '-30px', right: isRtl ? '-30px' : 'auto', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)' }} id="hero-float-card">
                        <i className="ri-qr-code-line" style={{ fontSize: '24px', color: 'var(--accent-success)' }}></i>
                        <div>
                            <div style={{ fontSize: '12px', fontWeight: '600' }}>{currentLanguage === 'ar' ? 'متوافق مع المرحلة الثانية' : 'Phase 2 Compliant'}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{currentLanguage === 'ar' ? 'توليد فوري للـ QR المرمز' : 'Instant Signed QR Codes'}</div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* STATS STRIP */}
            <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', padding: '24px 0', margin: '60px 0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }} className="stats-strip">
                    <div style={{ textAlign: 'center', flex: 1, minWidth: '150px' }}>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-purple)' }}>12,000+</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{currentLanguage === 'ar' ? 'متاجر نشطة عالمياً' : 'Global Active Stores'}</div>
                    </div>
                    <div style={{ textAlign: 'center', flex: 1, minWidth: '150px' }}>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-cyan)' }}>15,000,000+</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{currentLanguage === 'ar' ? 'فاتورة تمت معالجتها' : 'Invoices Processed'}</div>
                    </div>
                    <div style={{ textAlign: 'center', flex: 1, minWidth: '150px' }}>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-gold)' }}>99.99%</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{currentLanguage === 'ar' ? 'جاهزية سحابية' : 'Cloud Uptime'}</div>
                    </div>
                    <div style={{ textAlign: 'center', flex: 1, minWidth: '150px' }}>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-success)' }}>100%</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{currentLanguage === 'ar' ? 'متوافق مع هيئة الزكاة' : 'ZATCA Compliance'}</div>
                    </div>
                </div>
            </section>
            
            {/* BUSINESS SIMULATOR SECTION */}
            <section id="sectors" style={{ maxWidth: '1200px', margin: '80px auto', padding: '0 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>{t.simTitle}</h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '14px' }}>{t.simSub}</p>
                </div>
                
                {/* Sector Switcher Tabs */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
                    <button 
                        className={`btn ${activeSector === 'retail' ? 'btn-primary' : 'btn-secondary'}`} 
                        onClick={() => setActiveSector('retail')}
                        style={activeSector !== 'retail' ? { background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' } : {}}
                    >
                        <i className="ri-shopping-bag-3-line"></i>
                        <span>{t.sectorRetail}</span>
                    </button>
                    <button 
                        className={`btn ${activeSector === 'grocery' ? 'btn-primary' : 'btn-secondary'}`} 
                        onClick={() => setActiveSector('grocery')}
                        style={activeSector !== 'grocery' ? { background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' } : {}}
                    >
                        <i className="ri-store-line"></i>
                        <span>{t.sectorSupermarket}</span>
                    </button>
                    <button 
                        className={`btn ${activeSector === 'restaurant' ? 'btn-primary' : 'btn-secondary'}`} 
                        onClick={() => setActiveSector('restaurant')}
                        style={activeSector !== 'restaurant' ? { background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' } : {}}
                    >
                        <i className="ri-restaurant-line"></i>
                        <span>{t.sectorRestaurant}</span>
                    </button>
                    <button 
                        className={`btn ${activeSector === 'apparel' ? 'btn-primary' : 'btn-secondary'}`} 
                        onClick={() => setActiveSector('apparel')}
                        style={activeSector !== 'apparel' ? { background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' } : {}}
                    >
                        <i className="ri-shirt-line"></i>
                        <span>{t.sectorApparel}</span>
                    </button>
                    <button 
                        className={`btn ${activeSector === 'appliances' ? 'btn-primary' : 'btn-secondary'}`} 
                        onClick={() => setActiveSector('appliances')}
                        style={activeSector !== 'appliances' ? { background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' } : {}}
                    >
                        <i className="ri-tv-2-line"></i>
                        <span>{t.sectorAppliances}</span>
                    </button>
                    <button 
                        className={`btn ${activeSector === 'furniture' ? 'btn-primary' : 'btn-secondary'}`} 
                        onClick={() => setActiveSector('furniture')}
                        style={activeSector !== 'furniture' ? { background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' } : {}}
                    >
                        <i className="ri-home-office-line"></i>
                        <span>{t.sectorFurniture}</span>
                    </button>
                    <button 
                        className={`btn ${activeSector === 'spareparts' ? 'btn-primary' : 'btn-secondary'}`} 
                        onClick={() => setActiveSector('spareparts')}
                        style={activeSector !== 'spareparts' ? { background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' } : {}}
                    >
                        <i className="ri-settings-5-line"></i>
                        <span>{t.sectorSpareParts}</span>
                    </button>
                </div>
                
                {/* Simulation Features Panel */}
                <div className="glass-card" style={{ padding: '32px', borderRadius: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }} id="sector-preview-box">
                    <div>
                        <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: 'var(--accent-cyan)' }}>
                            {activeSector === 'retail' && (currentLanguage === 'ar' ? 'تجارة التجزئة والمحلات العامة' : 'General Retail Commerce')}
                            {activeSector === 'grocery' && (currentLanguage === 'ar' ? 'السوبرماركت ومحلات البقالة' : 'Supermarket & Grocery POS')}
                            {activeSector === 'restaurant' && (currentLanguage === 'ar' ? 'إدارة المطاعم والمقاهي الذكية' : 'Smart Restaurant & Cafe Management')}
                            {activeSector === 'apparel' && (currentLanguage === 'ar' ? 'محلات الملابس والأحذية والأزياء' : 'Garments, Shoes & Apparel POS')}
                            {activeSector === 'appliances' && (currentLanguage === 'ar' ? 'الأجهزة المنزلية والتكييف والإلكترونيات' : 'Electrical, HVAC & Home Appliances')}
                            {activeSector === 'furniture' && (currentLanguage === 'ar' ? 'معارض ومحلات الأثاث والمفروشات' : 'Furniture & Home Decor Store')}
                            {activeSector === 'spareparts' && (currentLanguage === 'ar' ? 'قطع غيار السيارات والسباكة والتكييف والإلكترونيات' : 'Auto, Plumbing, HVAC & Electric Spare Parts')}
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px', fontSize: '14px' }}>
                            {activeSector === 'retail' && (currentLanguage === 'ar' ? 'يمنحك 26i السيطرة الكاملة على مخازنك، ومشترياتك، وإهلاك أصولك، ومتابعة مصروفاتك اليومية بطريقة سهلة ومبسطة.' : '26i provides complete control over your multi-category stocks, supplier purchase orders, capital asset depreciation, and daily cash expenses.')}
                            {activeSector === 'grocery' && (currentLanguage === 'ar' ? 'مصمم للتعامل مع آلاف الأصناف والباركودات بسرعة متناهية مع دعم موازين الباركود الذكية وتنبيهات قرب انتهاء صلاحيات المنتجات والطلب التلقائي.' : 'Built to handle thousands of items with ultra-fast barcode scanning, weight-scale barcode integration, stock level alerts, and batch expiry tracking.')}
                            {activeSector === 'restaurant' && (currentLanguage === 'ar' ? 'نظام متكامل لتخطيط الطاولات وصالات الجلوس، ومتابعة طلبات المطبخ، وتأجيل الفواتير، وتقسيم الفواتير بين الضيوف بكل سهولة.' : 'Complete visual floor layout mapping, kitchen order ticket (KOT) workflows, hold receipts capability, and seamless bill splitting between customers.')}
                            {activeSector === 'apparel' && (currentLanguage === 'ar' ? 'يسمح لك النظام بتهيئة شبكة المنتجات ذات القياسات والألوان المختلفة، وتوليد باركودات مخصصة لكل حجم، وطباعة ملصقات الأسعار.' : 'Allows configuring matrix products with custom size/color variables, generating unique barcodes per SKU, and printing localized price labels.')}
                            {activeSector === 'appliances' && (currentLanguage === 'ar' ? 'مخصص لمبيعات الأجهزة الكهربائية والتكييف، يدعم تتبع الأرقام التسلسلية الفريدة لكل جهاز لمنع تداخل الضمانات، مع جدولة مواعيد التركيب المنزلي للـ HVAC.' : 'Designed for appliances and HVAC sales. Tracks unique serial numbers per unit to prevent warranty overlap, with built-in scheduling for home installations.')}
                            {activeSector === 'furniture' && (currentLanguage === 'ar' ? 'يسهل إدارة الطلبات المخصصة وعربون الحجز، وتتبع حالة تجميع غرف النوم والمطابخ بالمستودعات، وجدولة مسارات شاحنات التوصيل والتركيب.' : 'Eases custom orders and deposit collections, tracks assembly progress of items inside the warehouse, and schedules delivery routing and technicians.')}
                            {activeSector === 'spareparts' && (currentLanguage === 'ar' ? 'ابحث فوراً بترميز OEM أو الكود الأصلي، وتتبع توافقية قطع الغيار مع موديلات السيارات وماركات التكييف والسباكة، مع ترميز باركود رفوف المستودع.' : 'Instantly search by OEM parts or interchangeably coded items. Track compatibility across models/brands (Auto or HVAC) and scan shelf bins.')}
                        </p>
                        
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="ri-checkbox-circle-fill" style={{ color: 'var(--accent-success)' }}></i>
                                <span>{t.simBarcodes}</span>
                            </li>
                            {activeSector === 'restaurant' && (
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="ri-checkbox-circle-fill" style={{ color: 'var(--accent-success)' }}></i>
                                    <span>{t.simTables}</span>
                                </li>
                            )}
                            {activeSector === 'appliances' && (
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="ri-checkbox-circle-fill" style={{ color: 'var(--accent-success)' }}></i>
                                    <span>{currentLanguage === 'ar' ? 'تتبع الأرقام التسلسلية والضمان والعهود' : 'Unique Serial, Warranty & Asset Logs'}</span>
                                </li>
                            )}
                            {activeSector === 'furniture' && (
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="ri-checkbox-circle-fill" style={{ color: 'var(--accent-success)' }}></i>
                                    <span>{currentLanguage === 'ar' ? 'إدارة عربون الحجز والتركيب واللوجستيات' : 'Deposit Control & Installation Routing'}</span>
                                </li>
                            )}
                            {activeSector === 'spareparts' && (
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="ri-checkbox-circle-fill" style={{ color: 'var(--accent-success)' }}></i>
                                    <span>{currentLanguage === 'ar' ? 'البحث بأكواد OEM وتوافق الأجهزة والموديلات' : 'OEM Interchangeable Code & Model Mapping'}</span>
                                </li>
                            )}
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="ri-checkbox-circle-fill" style={{ color: 'var(--accent-success)' }}></i>
                                <span>{t.simDepreciation}</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="ri-checkbox-circle-fill" style={{ color: 'var(--accent-success)' }}></i>
                                <span>{t.simMultiBranch}</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="ri-checkbox-circle-fill" style={{ color: 'var(--accent-success)' }}></i>
                                <span>{t.simVatScan}</span>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Simulated view representation */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '11px', background: 'var(--accent-purple)', padding: '2px 8px', borderRadius: '2px' }}>
                                {activeSector.toUpperCase()} MODULE
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                {currentLanguage === 'ar' ? 'حالة النظام: متصل وجاهز' : 'System: Connected & Ready'}
                            </span>
                        </div>
                        
                        {activeSector === 'retail' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '4px', background: 'rgba(255,255,255,0.01)' }}>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>{currentLanguage === 'ar' ? 'إجمالي قيمة أصول الشركة' : 'Total Capital Assets Cost'}</div>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>145,000.00 {t.currency}</div>
                                </div>
                                <div style={{ border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '4px', background: 'rgba(255,255,255,0.01)' }}>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>{currentLanguage === 'ar' ? 'الإهلاك السنوي للأصول' : 'Annual Assets Depreciation'}</div>
                                    <div style={{ fontSize: '14px', fontWeight: '600' }}>14,500.00 {t.currency} / {currentLanguage === 'ar' ? 'سنة' : 'year'}</div>
                                </div>
                            </div>
                        )}
                        
                        {activeSector === 'grocery' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '6px' }}>
                                    <span>{currentLanguage === 'ar' ? 'قارئ باركود' : 'Barcode Scanner'}</span>
                                    <span style={{ color: 'var(--accent-success)' }}>ACTIVE</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '6px' }}>
                                    <span>{currentLanguage === 'ar' ? 'تنبيه المخزون المتدني' : 'Low Stock Threshold'}</span>
                                    <span style={{ color: 'var(--accent-gold)' }}>&lt; 5 UNITS</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{currentLanguage === 'ar' ? 'حساب الوزن التلقائي' : 'Auto Scale Weight Math'}</span>
                                    <span>ENABLED</span>
                                </div>
                            </div>
                        )}
                        
                        {activeSector === 'restaurant' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
                                <div style={{ border: '1px solid var(--accent-success)', background: 'rgba(16,185,129,0.1)', padding: '8px', borderRadius: '4px' }}>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>T-01</div>
                                    <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>{currentLanguage === 'ar' ? 'متاحة' : 'Free'}</div>
                                </div>
                                <div style={{ border: '1px solid var(--accent-danger)', background: 'rgba(239,68,68,0.1)', padding: '8px', borderRadius: '4px' }}>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>T-02</div>
                                    <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>{currentLanguage === 'ar' ? 'مشغولة' : 'Busy'}</div>
                                </div>
                                <div style={{ border: '1px solid var(--accent-gold)', background: 'rgba(245,158,11,0.1)', padding: '8px', borderRadius: '4px' }}>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>T-03</div>
                                    <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>{currentLanguage === 'ar' ? 'حساب' : 'Check'}</div>
                                </div>
                            </div>
                        )}
                        
                        {activeSector === 'apparel' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                                    <span>SKU SIZE/COLOR</span>
                                    <span>STOCK QTY</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.01)', padding: '4px 8px', borderRadius: '2px' }}>
                                    <span>Size M - Red Shemagh</span>
                                    <span style={{ fontWeight: 'bold' }}>18 {currentLanguage === 'ar' ? 'حبة' : 'pcs'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.01)', padding: '4px 8px', borderRadius: '2px' }}>
                                    <span>Size L - Red Shemagh</span>
                                    <span style={{ fontWeight: 'bold' }}>12 {currentLanguage === 'ar' ? 'حبة' : 'pcs'}</span>
                                </div>
                            </div>
                        )}

                        {activeSector === 'appliances' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                                    <span>SERIAL NO / ITEM</span>
                                    <span>WARRANTY STATUS</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.01)', padding: '6px 8px', borderRadius: '2px' }}>
                                    <span>SN-HVAC-90812 / 18k Split AC</span>
                                    <span style={{ color: 'var(--accent-success)', fontWeight: 'bold' }}>2 YRS ACTIVE</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.01)', padding: '6px 8px', borderRadius: '2px' }}>
                                    <span>SN-APP-20932 / Smart Fridge</span>
                                    <span style={{ color: 'var(--accent-success)', fontWeight: 'bold' }}>5 YRS ACTIVE</span>
                                </div>
                            </div>
                        )}

                        {activeSector === 'furniture' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '6px' }}>
                                    <span>{currentLanguage === 'ar' ? 'عربون الحجز المدفوع' : 'Order Deposit Paid'}</span>
                                    <span style={{ color: 'var(--accent-cyan)' }}>1,500.00 {t.currency}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '6px' }}>
                                    <span>{currentLanguage === 'ar' ? 'المبلغ المتبقي للتحصيل' : 'Remaining Balance Due'}</span>
                                    <span style={{ color: 'var(--accent-gold)' }}>3,500.00 {t.currency}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{currentLanguage === 'ar' ? 'حالة التجميع والتوصيل' : 'Assembly & Delivery Routing'}</span>
                                    <span style={{ color: 'var(--accent-success)' }}>SCHEDULED</span>
                                </div>
                            </div>
                        )}

                        {activeSector === 'spareparts' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '6px' }}>
                                    <span>OEM Code Lookup</span>
                                    <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>OEM-90321-A</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '6px' }}>
                                    <span>{currentLanguage === 'ar' ? 'توافقية القطعة' : 'Compatibility'}</span>
                                    <span>Toyota Camry / Carrier AC</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{currentLanguage === 'ar' ? 'موقع الرف والمستودع' : 'Warehouse Shelf Bin'}</span>
                                    <span style={{ color: 'var(--accent-cyan)' }}>Shelf B - Row 4 - Box 12</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            
            {/* MULTI-BRANCH HQ FEATURE SECTION */}
            <section style={{ background: 'var(--bg-secondary)', padding: '80px 0', borderTop: '1px solid var(--glass-border)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }} className="landing-hq-grid">
                    <div className="glass-card" style={{ padding: '24px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                        <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: 'var(--accent-purple)' }}>
                            <i className="ri-git-merge-line" style={{ marginRight: '8px' }}></i>
                            {currentLanguage === 'ar' ? 'فروع الشركة الحالية' : 'Live Branch Network'}
                        </h4>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid var(--accent-purple)' }}>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '13px' }}>Main Branch - Riyadh</div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Olaya District, Riyadh</div>
                                </div>
                                <span style={{ fontSize: '11px', color: 'var(--accent-success)', fontWeight: 'bold' }}>ACTIVE</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid var(--accent-cyan)' }}>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '13px' }}>Jeddah Branch</div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Tahlia St, Jeddah</div>
                                </div>
                                <span style={{ fontSize: '11px', color: 'var(--accent-success)', fontWeight: 'bold' }}>ACTIVE</span>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>{t.hqTitle}</h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '32px', fontSize: '14px' }}>{t.hqSub}</p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <i className="ri-line-chart-line" style={{ fontSize: '24px', color: 'var(--accent-purple)' }}></i>
                                <div>
                                    <h5 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>{currentLanguage === 'ar' ? 'تقارير فورية مجمعة' : 'Consolidated Performance Data'}</h5>
                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t.hqFeature1}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <i className="ri-refresh-line" style={{ fontSize: '24px', color: 'var(--accent-cyan)' }}></i>
                                <div>
                                    <h5 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>{currentLanguage === 'ar' ? 'طلبات نقل المخزون' : 'Inter-Branch Stock Controls'}</h5>
                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t.hqFeature2}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <i className="ri-shield-user-line" style={{ fontSize: '24px', color: 'var(--accent-gold)' }}></i>
                                <div>
                                    <h5 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>{currentLanguage === 'ar' ? 'صلاحيات مستقلة' : 'Decentralized Staff Roles'}</h5>
                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t.hqFeature3}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* PRICING MATRIX */}
            <section id="pricing" style={{ maxWidth: '1200px', margin: '80px auto', padding: '0 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>{t.pricingTitle}</h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '14px' }}>{t.pricingSub}</p>
                    
                    {/* Monthly / Yearly Switcher */}
                    <div style={{ display: 'inline-flex', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '4px', border: '1px solid var(--glass-border)', marginTop: '24px' }}>
                        <button 
                            className={`btn ${billingCycle === 'monthly' ? 'btn-primary' : ''}`} 
                            style={{ padding: '6px 16px', fontSize: '12px', borderRadius: '2px' }}
                            onClick={() => setBillingCycle('monthly')}
                        >
                            {t.monthly}
                        </button>
                        <button 
                            className={`btn ${billingCycle === 'yearly' ? 'btn-primary' : ''}`} 
                            style={{ padding: '6px 16px', fontSize: '12px', borderRadius: '2px' }}
                            onClick={() => setBillingCycle('yearly')}
                        >
                            {t.yearly}
                        </button>
                    </div>
                </div>
                
                {/* Pricing Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="pricing-grid">
                    {/* Starter Card */}
                    <div className="glass-card" style={{ padding: '32px', borderRadius: '12px', display: 'flex', flexDirection: 'column', border: '1px solid var(--glass-border)' }}>
                        <h4 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>{t.starterName}</h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '24px' }}>{t.starterDesc}</p>
                        
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '32px' }}>
                            <span style={{ fontSize: '36px', fontWeight: '800', color: 'var(--accent-purple)' }}>{getPrice(t.starterPrice)}</span>
                            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{t.currency}{t.perMonth}</span>
                        </div>
                        
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px', flexGrow: 1 }}>
                            {t.starterFeats.map((feat, idx) => (
                                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                                    <i className="ri-check-line" style={{ color: 'var(--accent-purple)' }}></i>
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>
                        
                        <a href="#contact" className="btn btn-secondary" style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                            {t.buyNow}
                        </a>
                    </div>
                    
                    {/* Professional (Featured) Card */}
                    <div className="glass-card pricing-card-featured" style={{ padding: '32px', borderRadius: '12px', display: 'flex', flexDirection: 'column', border: '2px solid var(--accent-purple)', position: 'relative' }}>
                        <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-purple)', color: 'white', padding: '2px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                            {t.recommend.toUpperCase()}
                        </span>
                        
                        <h4 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>{t.profName}</h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '24px' }}>{t.profDesc}</p>
                        
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '32px' }}>
                            <span style={{ fontSize: '36px', fontWeight: '800', color: 'var(--accent-purple)' }}>{getPrice(t.profPrice)}</span>
                            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{t.currency}{t.perMonth}</span>
                        </div>
                        
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px', flexGrow: 1 }}>
                            {t.profFeats.map((feat, idx) => (
                                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '500' }}>
                                    <i className="ri-checkbox-circle-fill" style={{ color: 'var(--accent-purple)' }}></i>
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>
                        
                        <a href="#contact" className="btn btn-primary" style={{ width: '100%' }}>
                            {t.buyNow}
                        </a>
                    </div>
                    
                    {/* Enterprise Card */}
                    <div className="glass-card" style={{ padding: '32px', borderRadius: '12px', display: 'flex', flexDirection: 'column', border: '1px solid var(--glass-border)' }}>
                        <h4 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>{t.entName}</h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '24px' }}>{t.entDesc}</p>
                        
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '32px' }}>
                            <span style={{ fontSize: '36px', fontWeight: '800', color: 'var(--accent-purple)' }}>{getPrice(t.entPrice)}</span>
                            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{t.currency}{t.perMonth}</span>
                        </div>
                        
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px', flexGrow: 1 }}>
                            {t.entFeats.map((feat, idx) => (
                                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                                    <i className="ri-check-line" style={{ color: 'var(--accent-cyan)' }}></i>
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>
                        
                        <a href="#contact" className="btn btn-secondary" style={{ width: '100%', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                            {t.buyNow}
                        </a>
                    </div>
                </div>
            </section>
            
            {/* DEMO REQUEST / CONTACT FORM */}
            <section id="contact" style={{ maxWidth: '600px', margin: '80px auto', padding: '0 20px' }}>
                <div className="glass-card" style={{ padding: '40px', borderRadius: '12px', border: '1px solid var(--glass-border)', position: 'relative' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>{t.formTitle}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{t.formSub}</p>
                    </div>
                    
                    {formStatus === 'success' ? (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <i className="ri-checkbox-circle-line" style={{ fontSize: '64px', color: 'var(--accent-success)', display: 'block', marginBottom: '16px' }}></i>
                            <p style={{ fontSize: '15px', fontWeight: '600' }}>{t.formSuccess}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleFormSubmit}>
                            {formStatus === 'error' && (
                                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--accent-danger)', color: 'var(--accent-danger)', padding: '12px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px', textAlign: 'center' }}>
                                    {t.formError}
                                </div>
                            )}
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="form-row-2">
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>{t.formName} *</label>
                                    <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required style={{ height: '38px' }} />
                                </div>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>{t.formEmail} *</label>
                                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleInputChange} required style={{ height: '38px' }} />
                                </div>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="form-row-2">
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>{t.formPhone}</label>
                                    <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleInputChange} style={{ height: '38px' }} />
                                </div>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>{t.formBizName}</label>
                                    <input type="text" name="businessName" className="form-control" value={formData.businessName} onChange={handleInputChange} style={{ height: '38px' }} />
                                </div>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="form-row-2">
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>{t.formBizType}</label>
                                    <select name="businessType" className="form-control" value={formData.businessType} onChange={handleInputChange} style={{ height: '38px', padding: '0 8px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}>
                                        <option value="retail">{t.sectorRetail}</option>
                                        <option value="grocery">{t.sectorSupermarket}</option>
                                        <option value="restaurant">{t.sectorRestaurant}</option>
                                        <option value="apparel">{t.sectorApparel}</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>{t.formBranches}</label>
                                    <input type="number" name="branches" className="form-control" min="1" value={formData.branches} onChange={handleInputChange} style={{ height: '38px' }} />
                                </div>
                            </div>
                            
                            <div className="form-group" style={{ marginBottom: '24px' }}>
                                <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>{t.formMsg}</label>
                                <textarea name="message" className="form-control" value={formData.message} onChange={handleInputChange} style={{ minHeight: '80px', resize: 'vertical' }}></textarea>
                            </div>
                            
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={formStatus === 'submitting'}>
                                {formStatus === 'submitting' ? (
                                    <span>
                                        <i className="ri-loader-4-line ri-spin"></i> Submitting...
                                    </span>
                                ) : (
                                    <span>{t.formSubmit}</span>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </section>
            
            {/* FAQ ACCORDION */}
            <section id="faq" style={{ maxWidth: '800px', margin: '80px auto', padding: '0 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>{t.faqTitle}</h2>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                        { q: t.faqQ1, a: t.faqA1 },
                        { q: t.faqQ2, a: t.faqA2 },
                        { q: t.faqQ3, a: t.faqA3 },
                        { q: t.faqQ4, a: t.faqA4 },
                        { q: t.faqQ5, a: t.faqA5 }
                    ].map((item, index) => {
                        const isOpen = openFaq === index;
                        return (
                            <div 
                                key={index} 
                                className="glass-card" 
                                style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)', transition: 'all 0.2s ease' }}
                            >
                                <button 
                                    style={{ 
                                        width: '100%', 
                                        padding: '18px 24px', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'space-between',
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        textAlign: isRtl ? 'right' : 'left'
                                    }}
                                    onClick={() => toggleFaq(index)}
                                >
                                    <span>{item.q}</span>
                                    <i className={isOpen ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} style={{ fontSize: '18px', color: 'var(--accent-purple)' }}></i>
                                </button>
                                
                                {isOpen && (
                                    <div style={{ 
                                        padding: '0 24px 18px 24px', 
                                        color: 'var(--text-secondary)', 
                                        fontSize: '13px', 
                                        lineHeight: '1.6', 
                                        borderTop: '1px solid rgba(255,255,255,0.02)' 
                                    }}>
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
            
            {/* FOOTER */}
            <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--glass-border)', padding: '40px 0', textAlign: 'center' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }} className="landing-footer">
                    <div className="brand" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="ri-store-2-line"></i>
                        <span>{t.brandName}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t.footerText}</p>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '18px', color: 'var(--text-secondary)' }}>
                        <i className="ri-twitter-x-fill" style={{ cursor: 'pointer' }}></i>
                        <i className="ri-linkedin-box-fill" style={{ cursor: 'pointer' }}></i>
                        <i className="ri-github-fill" style={{ cursor: 'pointer' }}></i>
                    </div>
                </div>
            </footer>

            {/* Store Registration Onboarding Modal */}
            {showRegisterModal && (
                <div className="modal-overlay" onClick={() => registerStatus !== 'submitting' && setShowRegisterModal(false)}>
                    <div className="modal glass-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>
                                {registerStatus === 'success' 
                                    ? (isRtl ? 'تم تهيئة المتجر بنجاح!' : 'Store Provisioned!') 
                                    : (isRtl ? 'أنشئ متجرك السحابي الخاص' : 'Create Your Cloud Store')}
                            </h3>
                            {registerStatus !== 'submitting' && (
                                <button onClick={() => setShowRegisterModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--text-secondary)' }}>
                                    <i className="ri-close-line"></i>
                                </button>
                            )}
                        </div>

                        {registerStatus === 'success' ? (
                            <div style={{ textAlign: 'center', padding: '10px 0' }}>
                                <div style={{ fontSize: '64px', color: 'var(--accent-success)', marginBottom: '16px' }}>
                                    <i className="ri-checkbox-circle-line"></i>
                                </div>
                                <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>
                                    {isRtl ? 'تم إنشاء متجرك وتخصيصه!' : 'Your Store is Ready!'}
                                </h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
                                    {isRtl 
                                        ? `تم إنشاء قاعدة بيانات معزولة لمتجرك وتعبئته بالمنتجات التجريبية.`
                                        : `Your isolated database workspace is ready and loaded with demo products.`}
                                </p>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                                     {isRtl ? 'اسم مستخدم المدير:' : 'Admin Username:'} <strong style={{ color: '#fff' }}>{registerForm.adminUsername}</strong>
                                </div>
                                <div style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '8px', padding: '10px 16px', marginBottom: '12px', fontFamily: 'monospace', fontSize: '14px', color: '#a78bfa', wordBreak: 'break-all' }}>
                                    https://{registerForm.tenantId.toLowerCase()}.{baseDomain}
                                </div>
                                {generatedLicenseKey && (
                                    <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px' }}>
                                        <div style={{ fontSize: '12px', color: '#34d399', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>{isRtl ? 'حالة المتجر' : 'Store Status'}</div>
                                        <div style={{ fontFamily: 'sans-serif', fontSize: '18px', color: '#10b981', fontWeight: 'bold' }}>{isRtl ? 'تجربة مجانية لمدة 14 يومًا' : '14-Day Free Trial Active'}</div>
                                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{isRtl ? 'تم إرسال تفاصيل الدخول إلى بريدك الإلكتروني.' : 'Login details have been sent to your email.'}</div>
                                    </div>
                                )}
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button 
                                        className="btn btn-primary glow-button" 
                                        onClick={() => {
                                            setShowRegisterModal(false);
                                            if (onRegisterSuccess) onRegisterSuccess(registeredTenantId || registerForm.tenantId.toLowerCase());
                                        }}
                                        style={{ flex: 1, padding: '12px', fontSize: '15px' }}
                                    >
                                        <i className="ri-rocket-2-line"></i>
                                        <span>{isRtl ? 'الدخول إلى متجري الآن' : 'Launch My Store'}</span>
                                    </button>
                                    <button 
                                        onClick={() => setShowRegisterModal(false)}
                                        style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px' }}
                                    >
                                        {isRtl ? 'إغلاق' : 'Close'}
                                    </button>
                                </div>
                            </div>

                        ) : (
                            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {registerStatus === 'error' && (
                                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-danger)', borderRadius: '4px', padding: '10px 14px', color: 'var(--accent-danger)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <i className="ri-error-warning-line"></i>
                                        <span>{registerError}</span>
                                    </div>
                                )}
                                
                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                        {isRtl ? 'رابط المتجر الفرعي (الأحرف اللاتينية والأرقام والشرطة فقط)' : 'Store Subdomain (Alphanumeric/hyphen only)'}
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '6px', overflow: 'hidden' }}>
                                        <input 
                                            type="text" 
                                            name="tenantId"
                                            value={registerForm.tenantId}
                                            onChange={handleRegisterChange}
                                            required
                                            placeholder="my-store"
                                            style={{ flexGrow: 1, background: 'none', border: 'none', outline: 'none', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '14px' }}
                                        />
                                        <span style={{ padding: '0 12px', fontSize: '13px', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', borderLeft: isRtl ? 'none' : '1px solid var(--glass-border)', borderRight: isRtl ? '1px solid var(--glass-border)' : 'none' }}>.{baseDomain}</span>
                                    </div>
                                </div>

                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                        {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
                                    </label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={registerForm.email}
                                        onChange={handleRegisterChange}
                                        required
                                        placeholder="owner@mystore.com"
                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '6px', outline: 'none', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '14px' }}
                                    />
                                </div>

                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                        {isRtl ? 'رقم الجوال' : 'Mobile Number'}
                                    </label>
                                    <input 
                                        type="tel" 
                                        name="mobile"
                                        value={registerForm.mobile}
                                        onChange={handleRegisterChange}
                                        required
                                        placeholder="+966 5X XXX XXXX"
                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '6px', outline: 'none', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '14px' }}
                                    />
                                </div>

                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                        {isRtl ? 'الاسم الكامل للمالك' : 'Owner Full Name'}
                                    </label>
                                    <input 
                                        type="text" 
                                        name="fullName"
                                        value={registerForm.fullName}
                                        onChange={handleRegisterChange}
                                        required
                                        placeholder={isRtl ? 'خليل الغامدي' : 'Khalil Al-Ghamdi'}
                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '6px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}
                                    />
                                </div>

                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                        {isRtl ? 'اسم المتجر / المنشأة' : 'Store / Business Name'}
                                    </label>
                                    <input 
                                        type="text" 
                                        name="businessName"
                                        value={registerForm.businessName}
                                        onChange={handleRegisterChange}
                                        required
                                        placeholder={isRtl ? 'معرض الأمل للأجهزة' : 'Al-Amal Store'}
                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '6px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}
                                    />
                                </div>

                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                        {isRtl ? 'نوع النشاط التجاري' : 'Business Sector'}
                                    </label>
                                    <select 
                                        name="businessType"
                                        value={registerForm.businessType}
                                        onChange={handleRegisterChange}
                                        style={{ background: '#0a0a12', border: '1px solid var(--glass-border)', borderRadius: '6px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', width: '100%' }}
                                    >
                                        <option value="retail">{isRtl ? 'تجارة تجزئة عامة' : 'General Retail'}</option>
                                        <option value="grocery">{isRtl ? 'سوبرماركت ومواد غذائية' : 'Supermarket & Grocery'}</option>
                                        <option value="restaurant">{isRtl ? 'مطعم ومقهى' : 'Restaurant & Cafe'}</option>
                                        <option value="apparel">{isRtl ? 'ملابس وأزياء' : 'Apparel & Garments'}</option>
                                        <option value="appliances">{isRtl ? 'أجهزة منزلية وإلكترونيات' : 'Home Appliances & Electronics'}</option>
                                        <option value="furniture">{isRtl ? 'معرض أثاث ومفروشات' : 'Furniture & Home Decor'}</option>
                                        <option value="spareparts">{isRtl ? 'قطع غيار (سيارات/تكييف/سباكة/كهرباء)' : 'Spare Parts (Auto/HVAC/Plumbing)'}</option>
                                    </select>
                                </div>

                                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                        {isRtl ? 'العنوان الوطني' : 'National Address'}
                                    </label>
                                    <input 
                                        type="text" 
                                        name="nationalAddress"
                                        value={registerForm.nationalAddress}
                                        onChange={handleRegisterChange}
                                        required
                                        placeholder={isRtl ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}
                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '6px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                            {isRtl ? 'الرقم الضريبي (VAT)' : 'VAT Number'}
                                        </label>
                                        <input 
                                            type="text" 
                                            name="vatNumber"
                                            value={registerForm.vatNumber}
                                            onChange={handleRegisterChange}
                                            required
                                            placeholder="310..."
                                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '6px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}
                                        />
                                    </div>

                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                            {isRtl ? 'السجل التجاري (CR)' : 'CR Number'}
                                        </label>
                                        <input 
                                            type="text" 
                                            name="crNumber"
                                            value={registerForm.crNumber}
                                            onChange={handleRegisterChange}
                                            required
                                            placeholder="1010..."
                                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '6px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                            {isRtl ? 'اسم مستخدم المدير' : 'Admin Username'}
                                        </label>
                                        <input 
                                            type="text" 
                                            name="adminUsername"
                                            value={registerForm.adminUsername}
                                            onChange={handleRegisterChange}
                                            required
                                            placeholder="admin"
                                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '6px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}
                                        />
                                    </div>

                                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                            {isRtl ? 'كلمة مرور المدير' : 'Admin Password'}
                                        </label>
                                        <input 
                                            type="password" 
                                            name="adminPassword"
                                            value={registerForm.adminPassword}
                                            onChange={handleRegisterChange}
                                            required
                                            placeholder="••••••••"
                                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '6px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary glow-button"
                                    disabled={registerStatus === 'submitting'}
                                    style={{ marginTop: '12px', padding: '12px', fontSize: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', width: '100%' }}
                                >
                                    {registerStatus === 'submitting' ? (
                                        <>
                                            <span style={{ width: '16px', height: '16px', border: '2px solid', borderRightColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.75s linear infinite' }}></span>
                                            <span>{isRtl ? 'جاري تهيئة النظام...' : 'Provisioning store...'}</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="ri-checkbox-circle-line"></i>
                                            <span>{isRtl ? 'إنشاء متجري وتفعيله' : 'Create & Activate My Store'}</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
            
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
