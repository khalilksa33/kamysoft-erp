import React, { useState, useEffect } from 'react';

const Bookings = ({ currentLanguage, formatCurrency, defaultTab, settings, generateZatcaQR, invoices = [] }) => {
    const isAr = currentLanguage === 'ar';
    const [bookings, setBookings] = useState([]);
    const [units, setUnits] = useState([]);
    const [properties, setProperties] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [hotelServices, setHotelServices] = useState([]);

    // Reservation Wizard Form
    const [propertyId, setPropertyId] = useState('');
    const [unitId, setUnitId] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [newCustomerName, setNewCustomerName] = useState('');
    const [newCustomerPhone, setNewCustomerPhone] = useState('');
    const [checkInDate, setCheckInDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [checkOutDate, setCheckOutDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
    });
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [selectedServices, setSelectedServices] = useState([]);
    const [discount, setDiscount] = useState(0);
    const [notes, setNotes] = useState('');
    const [groupBlocks, setGroupBlocks] = useState([]);
    const [groupBlockId, setGroupBlockId] = useState('');
    const [billingRouting, setBillingRouting] = useState({ roomCharges: 'Guest', extraCharges: 'Guest', companyId: '' });

    // Room Swap Modal
    const [showSwapModal, setShowSwapModal] = useState(false);
    const [swapBooking, setSwapBooking] = useState(null);
    const [targetSwapUnitId, setTargetSwapUnitId] = useState('');

    // Folio / Invoice Modal State
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [invoiceBooking, setInvoiceBooking] = useState(null);
    const [invoiceSearch, setInvoiceSearch] = useState('');
    const [folioQr, setFolioQr] = useState('');
    const [invoiceQrLoading, setInvoiceQrLoading] = useState(false);

    const openInvoiceModal = async (b) => {
        setInvoiceBooking(b);
        setFolioQr('');
        setShowInvoiceModal(true);
        
        try {
            setInvoiceQrLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch('/api/bookings/folio-qr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    sellerName: settings?.businessName,
                    vatNumber: settings?.vatNumber,
                    timestamp: b.createdAt || b.checkInDate || new Date().toISOString(),
                    invoiceTotal: b.totalAmount,
                    vatTotal: b.vat || 0
                })
            });
            const data = await res.json();
            if (data.qrDataUrl) {
                setFolioQr(data.qrDataUrl);
            } else if (data.qrCode) {
                setFolioQr(data.qrCode);
            }
        } catch(e) {
            console.error('Error fetching folio QR', e);
        } finally {
            setInvoiceQrLoading(false);
        }
    };

    const handlePrintFolio = () => {
        const printContent = document.getElementById('printable-hotel-folio');
        if (!printContent) {
            window.print();
            return;
        }
        const win = window.open('', '_blank', 'width=950,height=850');
        if (!win) {
            window.print();
            return;
        }
        win.document.write(`
            <!DOCTYPE html>
            <html dir="${isAr ? 'rtl' : 'ltr'}" lang="${isAr ? 'ar' : 'en'}">
            <head>
                <meta charset="utf-8">
                <base href="${window.location.origin}/">
                <title>${isAr ? 'فاتورة إقامة فندقية' : 'Hotel Guest Folio'} - ${invoiceBooking ? (invoiceBooking.bookingNumber || invoiceBooking.id) : ''}</title>
                <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
                <style>
                    @page { size: A4 portrait; margin: 12mm; }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                        background: #ffffff !important;
                        color: #111827 !important;
                        margin: 0;
                        padding: 20px;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    * { box-sizing: border-box; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border-bottom: 1px solid #e2e8f0; }
                    .no-print { display: none !important; }
                </style>
            </head>
            <body>
                ${printContent.innerHTML}
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.focus();
                            window.print();
                        }, 250);
                    };
                </script>
            </body>
            </html>
        `);
        win.document.close();
    };

    const handleShareFolio = () => {
        if (!invoiceBooking) return;
        const text = isAr 
            ? `مرحباً بك.\nفاتورة الإقامة الفندقية رقم: ${invoiceBooking.bookingNumber || invoiceBooking.id}\nالإجمالي: ${invoiceBooking.totalAmount} SAR\nالنزيل: ${invoiceBooking.customerName || invoiceBooking.customerId}`
            : `Welcome.\nHotel Stay Folio #: ${invoiceBooking.bookingNumber || invoiceBooking.id}\nTotal: ${invoiceBooking.totalAmount} SAR\nGuest: ${invoiceBooking.customerName || invoiceBooking.customerId}`;
        
        if (navigator.share) {
            navigator.share({
                title: isAr ? 'فاتورة الإقامة' : 'Hotel Folio',
                text: text,
            }).catch(err => console.error(err));
        } else {
            const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
            window.open(waUrl, '_blank');
        }
    };

    // Active View Mode (Room Rack vs Table vs Invoices)
    const [viewMode, setViewMode] = useState(defaultTab || 'frontDesk'); // 'frontDesk' | 'table' | 'invoices'

    useEffect(() => {
        if (defaultTab) setViewMode(defaultTab);
    }, [defaultTab]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [bookRes, unitRes, propRes, custRes, srvRes, grpRes] = await Promise.all([
                fetch('/api/bookings', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/units', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/properties', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/customers', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/realestate/services', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/groups', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            const bookData = await bookRes.json();
            const unitData = await unitRes.json();
            const propData = await propRes.json();
            const custData = await custRes.json();
            const srvData = await srvRes.json();
            const grpData = await grpRes.json();
            
            if (Array.isArray(bookData)) setBookings(bookData); else setBookings([]);
            if (Array.isArray(unitData)) {
                setUnits(unitData);
                if (unitData.length > 0 && !unitId) setUnitId(unitData[0].id);
            } else setUnits([]);
            if (Array.isArray(propData)) {
                setProperties(propData);
                if (propData.length > 0 && !propertyId) setPropertyId(propData[0].id);
            } else setProperties([]);
            if (Array.isArray(custData)) setCustomers(custData); else setCustomers([]);
            if (Array.isArray(srvData)) setHotelServices(srvData); else setHotelServices([]);
            if (Array.isArray(grpData)) setGroupBlocks(grpData); else setGroupBlocks([]);
        } catch (err) { console.error('Error fetching data', err); }
    };

    const [seeding, setSeeding] = useState(false);
    const handleSeedSampleData = async () => {
        if (!window.confirm(isAr ? 'هل تريد تحميل بيانات فندقية وحجوزات تجريبية؟' : 'Load complete sample hotel, unit, and booking data?')) return;
        try {
            setSeeding(true);
            const token = localStorage.getItem('token');
            const res = await fetch('/api/realestate/seed', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                alert(isAr ? 'تم تحميل البيانات التجريبية بنجاح!' : 'Sample data loaded successfully!');
                fetchData();
            } else {
                alert(data.error || 'Failed to seed data');
            }
        } catch (err) {
            console.error('Error seeding data', err);
            alert('Error seeding data');
        } finally {
            setSeeding(false);
        }
    };

    // Calculate nights & prices
    const calcNights = () => {
        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 1;
    };

    const selectedUnitObj = units.find(u => u.id === unitId);
    const nights = calcNights();
    const roomRateSubtotal = selectedUnitObj ? (selectedUnitObj.dailyRate * nights) : 0;
    const servicesTotal = selectedServices.reduce((sum, s) => {
        const cost = s.priceType === 'PerNight' ? (s.price * nights * (s.qty || 1)) : (s.price * (s.qty || 1));
        return sum + cost;
    }, 0);
    const subtotal = Math.max(0, roomRateSubtotal + servicesTotal - Number(discount || 0));
    const vatAmount = subtotal * 0.15;
    const grandTotal = subtotal + vatAmount;

    const toggleExtraService = (srv) => {
        const exists = selectedServices.find(s => s.serviceId === srv.id);
        if (exists) {
            setSelectedServices(selectedServices.filter(s => s.serviceId !== srv.id));
        } else {
            setSelectedServices([...selectedServices, {
                serviceId: srv.id,
                name: isAr ? (srv.nameAR || srv.nameEN) : srv.nameEN,
                price: srv.price,
                priceType: srv.priceType,
                qty: 1
            }]);
        }
    };

    const handleCreateBooking = async (e) => {
        e.preventDefault();
        try {
            if (!unitId) return alert(isAr ? 'الرجاء اختيار الغرفة' : 'Please select a room');
            const token = localStorage.getItem('token');

            let assignedCustomerId = customerId;
            let assignedCustomerName = newCustomerName;

            if (customerId) {
                const c = customers.find(x => x.id === customerId);
                if (c) assignedCustomerName = c.name;
            } else if (newCustomerName) {
                // Register customer on the fly
                const cRes = await fetch('/api/customers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ name: newCustomerName, phone: newCustomerPhone })
                });
                const newC = await cRes.json();
                if (newC && newC.id) assignedCustomerId = newC.id;
            }

            const payload = {
                unitId,
                customerId: assignedCustomerId || 'CUST-GUEST',
                customerName: assignedCustomerName || (isAr ? 'نزيل فندقي' : 'Hotel Guest'),
                customerPhone: newCustomerPhone,
                groupBlockId: groupBlockId || undefined,
                billingRouting,
                checkInDate: new Date(checkInDate).toISOString(),
                checkOutDate: new Date(checkOutDate).toISOString(),
                adults: Number(adults),
                children: Number(children),
                extraServices: selectedServices,
                dailyRate: selectedUnitObj ? selectedUnitObj.dailyRate : 0,
                discount: Number(discount || 0),
                subtotal,
                vat: vatAmount,
                totalAmount: grandTotal,
                paidAmount: grandTotal,
                paymentStatus: 'Paid',
                status: 'Confirmed',
                notes
            };

            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            const newBooking = await res.json();

            // Auto-generate official ZATCA compliant Sales Invoice for POS & Financials
            await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    date: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
                    customer: assignedCustomerName || 'Hotel Guest',
                    items: [
                        { name: `Room #${selectedUnitObj?.unitNumber || ''} (${nights} nights)`, qty: nights, price: selectedUnitObj?.dailyRate || 0 },
                        ...selectedServices.map(s => ({ name: s.name, qty: s.qty || 1, price: s.price }))
                    ],
                    discount: Number(discount || 0),
                    vat: vatAmount,
                    total: grandTotal,
                    paymentMethod: 'Mada',
                    zatcaStatus: 'REPORTED'
                })
            });

            alert(isAr ? 'تم تأكيد الحجز وإنشاء الفاتورة الضريبية بنجاح!' : 'Booking confirmed & tax invoice generated!');
            setSelectedServices([]);
            setDiscount(0);
            setNotes('');
            fetchData();
        } catch (err) { console.error('Error creating booking', err); }
    };

    const handleCheckIn = async (b) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/bookings/${b.id}/checkin`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert(isAr ? 'تم تسجيل الدخول (Check-In) بنجاح!' : 'Guest Checked-In successfully!');
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleCheckOut = async (b) => {
        if (!window.confirm(isAr ? 'تأكيد تسجيل الخروج وتسليم الغرفة للتنظيف؟' : 'Confirm Check-Out and send room to Housekeeping?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/bookings/${b.id}/checkout`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert(isAr ? 'تم تسجيل الخروج (Check-Out) وتم تحويل الغرفة لقسم النظافة!' : 'Guest Checked-Out! Room marked for housekeeping.');
            fetchData();
        } catch (err) { console.error(err); }
    };

    const openSwapRoom = (b) => {
        setSwapBooking(b);
        setTargetSwapUnitId('');
        setShowSwapModal(true);
    };

    const handleSwapRoom = async (e) => {
        e.preventDefault();
        try {
            if (!targetSwapUnitId) return;
            const token = localStorage.getItem('token');
            await fetch(`/api/bookings/${swapBooking.id}/swap-room`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ newUnitId: targetSwapUnitId })
            });
            alert(isAr ? 'تم تغيير ونقل الغرفة للنزيل بنجاح!' : 'Room swapped successfully!');
            setShowSwapModal(false);
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(isAr ? 'إلغاء وحذف هذا الحجز؟' : 'Cancel and delete this booking?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/bookings/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            fetchData();
        } catch (err) { console.error(err); }
    };

    // Filter units by property
    const filteredUnits = propertyId ? units.filter(u => u.propertyId === propertyId) : units;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header with Quick Stats */}
            <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                        <i className="ri-hotel-line" style={{ color: 'var(--accent-gold)', marginRight: isAr ? '0' : '8px', marginLeft: isAr ? '8px' : '0' }}></i>
                        {isAr ? 'الاستقبال وإدارة الحجوزات (Front Desk & Bookings)' : 'Front Desk & Room Bookings'}
                    </h2>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        {isAr ? 'نظام الحجوزات الفندقية المتكامل، تسجيل الوصول والمغادرة، وتبديل الغرف (مواصفات QloApps)' : 'Comprehensive hotel booking engine, instant check-in/out, and room allocation rack (QloApps Specs)'}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleSeedSampleData}
                        disabled={seeding}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(59, 130, 246, 0.15)', borderColor: '#3b82f6', color: '#60a5fa' }}
                    >
                        <i className={seeding ? "ri-loader-4-line ri-spin" : "ri-database-2-line"}></i>
                        {seeding ? (isAr ? 'جاري التحميل...' : 'Loading...') : (isAr ? 'بيانات تجريبية' : 'Sample Data')}
                    </button>
                    <button className={`btn ${viewMode === 'frontDesk' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setViewMode('frontDesk')}>
                        <i className="ri-dashboard-line"></i> {isAr ? 'لوحة الغرف (Room Rack)' : 'Room Rack'}
                    </button>
                    <button className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setViewMode('table')}>
                        <i className="ri-table-line"></i> {isAr ? 'سجل الحجوزات' : 'Bookings Table'}
                    </button>
                    <button 
                        className={`btn ${viewMode === 'invoices' ? 'btn-primary' : 'btn-secondary'}`} 
                        onClick={() => setViewMode('invoices')}
                        style={{
                            background: viewMode === 'invoices' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'rgba(37, 99, 235, 0.15)',
                            borderColor: '#3b82f6',
                            color: '#fff',
                            fontWeight: 'bold'
                        }}
                    >
                        <i className="ri-file-list-3-line"></i> {isAr ? 'فواتير النزلاء والإقامة (Invoices)' : 'Guest Invoices & Folios'}
                    </button>
                </div>
            </div>

            {/* Front Desk Room Rack (QloApps Interactive Grid) */}
            {viewMode === 'frontDesk' && (
                <div className="glass-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px' }}>
                            <i className="ri-layout-grid-line" style={{ color: 'var(--accent-cyan)', marginRight: '6px' }}></i>
                            {isAr ? 'لوحة حالة الغرف اللحظية (Front Desk Room Rack)' : 'Real-time Front Desk Room Rack'}
                        </h3>
                        <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                            <span>🟢 {isAr ? 'متاحة (Available)' : 'Available'}</span>
                            <span>🔴 {isAr ? 'مشغولة (Occupied)' : 'Occupied'}</span>
                            <span>🟡 {isAr ? 'محجوزة (Reserved)' : 'Reserved'}</span>
                            <span>🧹 {isAr ? 'تحتاج تنظيف (Dirty)' : 'Needs Cleaning'}</span>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
                        {units.map(u => {
                            const prop = properties.find(p => p.id === u.propertyId);
                            const currentBooking = bookings.find(b => b.unitId === u.id && ['Confirmed', 'CheckedIn'].includes(b.status));
                            const isOccupied = u.status === 'Occupied' || (currentBooking && currentBooking.status === 'CheckedIn');
                            const isReserved = u.status === 'Reserved' || (currentBooking && currentBooking.status === 'Confirmed');

                            return (
                                <div 
                                    key={u.id}
                                    style={{
                                        background: isOccupied ? 'rgba(231, 76, 60, 0.15)' : isReserved ? 'rgba(243, 156, 18, 0.15)' : 'var(--glass-bg)',
                                        border: isOccupied ? '1px solid #e74c3c' : isReserved ? '1px solid #f39c12' : '1px solid var(--glass-border)',
                                        borderRadius: '10px',
                                        padding: '14px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>#{u.unitNumber}</span>
                                        <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)' }}>
                                            {u.roomType || u.type}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                        {prop ? prop.name : ''} - {isAr ? `طابق ${u.floor || 1}` : `Fl. ${u.floor || 1}`}
                                    </div>
                                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                                        {Number(u.dailyRate).toFixed(2)} SAR <span style={{ fontSize: '10px', fontWeight: 'normal', color: 'var(--text-secondary)' }}>/ {isAr ? 'ليلة' : 'night'}</span>
                                    </div>

                                    {currentBooking ? (
                                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '6px 8px', borderRadius: '6px', fontSize: '11px' }}>
                                            <div style={{ fontWeight: 'bold', color: '#fff' }}>👤 {currentBooking.customerName}</div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>
                                                {new Date(currentBooking.checkInDate).toLocaleDateString()} ➔ {new Date(currentBooking.checkOutDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: '11px', color: u.cleaningStatus === 'Clean' ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                                            {u.cleaningStatus === 'Clean' ? '✨ ' + (isAr ? 'الغرفة جاهزة ومجهزة' : 'Clean & Ready') : '🧹 ' + (isAr ? 'تحتاج تنظيف' : 'Needs Cleaning')}
                                        </div>
                                    )}

                                    {/* Action buttons inside rack */}
                                    <div style={{ display: 'flex', gap: '4px', marginTop: 'auto', paddingTop: '6px', flexWrap: 'wrap' }}>
                                        {currentBooking && currentBooking.status === 'Confirmed' && (
                                            <button className="btn btn-primary" style={{ flex: 1, padding: '4px 6px', fontSize: '10px' }} onClick={() => handleCheckIn(currentBooking)}>
                                                {isAr ? 'دخول' : 'Check-In'}
                                            </button>
                                        )}
                                        {currentBooking && currentBooking.status === 'CheckedIn' && (
                                            <button className="btn btn-danger" style={{ flex: 1, padding: '4px 6px', fontSize: '10px' }} onClick={() => handleCheckOut(currentBooking)}>
                                                {isAr ? 'خروج' : 'Check-Out'}
                                            </button>
                                        )}
                                        {currentBooking && (
                                            <>
                                                <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '10px', background: 'rgba(37, 99, 235, 0.25)', borderColor: '#3b82f6', color: '#93c5fd', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '3px' }} title={isAr ? 'عرض وطباعة الفاتورة' : 'Print Invoice / Folio'} onClick={() => openInvoiceModal(currentBooking)}>
                                                    <i className="ri-printer-line"></i> {isAr ? 'الفاتورة' : 'Invoice'}
                                                </button>
                                                {currentBooking.status === 'CheckedIn' && (
                                                    <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '10px', background: 'rgba(16, 185, 129, 0.25)', borderColor: '#10b981', color: '#6ee7b7', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '3px' }} title={isAr ? 'برمجة مفتاح الغرفة' : 'Encode Keycard'} onClick={async () => {
                                                        try {
                                                            const token = localStorage.getItem('token');
                                                            const res = await fetch('/api/hardware/keycard/encode', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                                                body: JSON.stringify({ bookingId: currentBooking.id, roomNumber: u.unitNumber })
                                                            });
                                                            const data = await res.json();
                                                            alert(data.message);
                                                        } catch (err) { alert('Hardware integration error'); }
                                                    }}>
                                                        <i className="ri-key-2-line"></i> {isAr ? 'المفتاح' : 'Keycard'}
                                                    </button>
                                                )}
                                                <button className="btn btn-secondary" style={{ padding: '4px 6px', fontSize: '10px' }} title={isAr ? 'تبديل الغرفة' : 'Swap Room'} onClick={() => openSwapRoom(currentBooking)}>
                                                    <i className="ri-arrow-left-right-line"></i>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Dedicated View: Guest Invoices & Folios Management */}
            {viewMode === 'invoices' && (() => {
                const filteredInvoices = bookings.filter(b => {
                    if (!invoiceSearch) return true;
                    const searchLower = invoiceSearch.toLowerCase();
                    const u = units.find(unit => unit.id === b.unitId);
                    const p = u ? properties.find(prop => prop.id === u.propertyId) : null;
                    return (
                        (b.bookingNumber && b.bookingNumber.toLowerCase().includes(searchLower)) ||
                        (b.customerName && b.customerName.toLowerCase().includes(searchLower)) ||
                        (b.customerPhone && b.customerPhone.toLowerCase().includes(searchLower)) ||
                        (u && u.unitNumber && u.unitNumber.toLowerCase().includes(searchLower)) ||
                        (p && p.name && p.name.toLowerCase().includes(searchLower))
                    );
                });

                const totalBilled = bookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
                const totalVat = bookings.reduce((sum, b) => sum + (Number(b.vat) || (Number(b.totalAmount) * 0.15 / 1.15) || 0), 0);
                const paidCount = bookings.filter(b => b.paymentStatus === 'Paid').length;
                const activeGuestsCount = bookings.filter(b => ['CheckedIn', 'Confirmed'].includes(b.status)).length;

                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* KPI Summary Cards */}
                        <div className="card-grid">
                            <div className="glass-card green">
                                <div className="card-stat">
                                    <div className="stat-info">
                                        <h3>{isAr ? 'إجمالي المبيعات الفندقية' : 'Total Billed Revenue'}</h3>
                                        <div className="stat-value">{totalBilled.toFixed(2)} SAR</div>
                                    </div>
                                    <div className="stat-icon"><i className="ri-money-dollar-circle-line"></i></div>
                                </div>
                            </div>
                            <div className="glass-card cyan">
                                <div className="card-stat">
                                    <div className="stat-info">
                                        <h3>{isAr ? 'ضريبة القيمة المضافة (15%)' : 'Total VAT (15%)'}</h3>
                                        <div className="stat-value">{totalVat.toFixed(2)} SAR</div>
                                    </div>
                                    <div className="stat-icon"><i className="ri-percent-line"></i></div>
                                </div>
                            </div>
                            <div className="glass-card gold">
                                <div className="card-stat">
                                    <div className="stat-info">
                                        <h3>{isAr ? 'فواتير النزلاء المسددة' : 'Paid Guest Folios'}</h3>
                                        <div className="stat-value">{paidCount} / {bookings.length}</div>
                                    </div>
                                    <div className="stat-icon"><i className="ri-checkbox-circle-line"></i></div>
                                </div>
                            </div>
                            <div className="glass-card purple">
                                <div className="card-stat">
                                    <div className="stat-info">
                                        <h3>{isAr ? 'النزلاء المقيمين حالياً' : 'Active In-House Guests'}</h3>
                                        <div className="stat-value">{activeGuestsCount}</div>
                                    </div>
                                    <div className="stat-icon"><i className="ri-user-star-line"></i></div>
                                </div>
                            </div>
                        </div>

                        {/* Invoices List Card */}
                        <div className="glass-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                                        <i className="ri-file-list-3-line" style={{ color: 'var(--accent-cyan)', marginRight: '6px' }}></i>
                                        {isAr ? 'فواتير وكشوف حسابات النزلاء (Guest Tax Invoices & Folios)' : 'Guest Tax Invoices & Folios Directory'}
                                    </h3>
                                    <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                        {isAr ? 'استعراض وطباعة الفواتير الضريبية المبسطة لجميع النزلاء المقيمين والمغادرين (ZATCA Compliant)' : 'View, verify, and print compliant ZATCA Phase 2 hotel invoices and guest stay folios'}
                                    </p>
                                </div>
                                <div style={{ minWidth: '280px' }}>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder={isAr ? '🔍 ابحث برقم الفاتورة، اسم النزيل، الغرفة...' : '🔍 Search by Guest, Invoice #, Room...'} 
                                        value={invoiceSearch}
                                        onChange={e => setInvoiceSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>{isAr ? 'رقم الفاتورة / الحجز' : 'Invoice / Booking #'}</th>
                                            <th>{isAr ? 'النزيل' : 'Guest'}</th>
                                            <th>{isAr ? 'الغرفة والفندق' : 'Room & Hotel'}</th>
                                            <th>{isAr ? 'فترة الإقامة' : 'Stay Dates'}</th>
                                            <th style={{ textAlign: 'right' }}>{isAr ? 'الإجمالي الشامل' : 'Total (SAR)'}</th>
                                            <th style={{ textAlign: 'center' }}>{isAr ? 'حالة السداد' : 'Payment'}</th>
                                            <th style={{ textAlign: 'center' }}>{isAr ? 'حالة الحجز' : 'Stay Status'}</th>
                                            <th style={{ textAlign: 'center' }}>{isAr ? 'طباعة الفاتورة' : 'Print Invoice'}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredInvoices.map(b => {
                                            const u = units.find(unit => unit.id === b.unitId);
                                            const p = u ? properties.find(prop => prop.id === u.propertyId) : null;
                                            const bNights = Math.max(1, Math.ceil((new Date(b.checkOutDate) - new Date(b.checkInDate)) / (1000 * 60 * 60 * 24)));
                                            const isPaid = b.paymentStatus === 'Paid';

                                            return (
                                                <tr key={b.id}>
                                                    <td>
                                                        <strong style={{ color: 'var(--accent-cyan)' }}>{b.bookingNumber || b.id}</strong>
                                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{new Date(b.checkInDate).toLocaleDateString()}</div>
                                                    </td>
                                                    <td>
                                                        <div style={{ fontWeight: 'bold' }}>👤 {b.customerName || b.customerId}</div>
                                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{b.customerPhone || 'N/A'}</div>
                                                    </td>
                                                    <td>
                                                        <div>🏨 <strong>#{u ? u.unitNumber : b.unitId}</strong> ({u ? u.roomType || u.type : 'Deluxe'})</div>
                                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{p ? p.name : ''}</div>
                                                    </td>
                                                    <td>
                                                        <div>{new Date(b.checkInDate).toLocaleDateString()} ➔ {new Date(b.checkOutDate).toLocaleDateString()}</div>
                                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{bNights} {isAr ? 'ليالي' : 'Nights'}</div>
                                                    </td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: 'var(--accent-success)' }}>
                                                            {Number(b.totalAmount).toFixed(2)} SAR
                                                        </div>
                                                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                                                            {isAr ? 'شامل الضريبة 15%' : 'Incl. 15% VAT'}
                                                        </div>
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <span className={`status-badge ${isPaid ? 'valid' : b.paymentStatus === 'PartiallyPaid' ? 'warning' : 'danger'}`}>
                                                            {isPaid ? (isAr ? 'مسددة بالكامل' : 'Paid') : b.paymentStatus === 'PartiallyPaid' ? (isAr ? 'مسددة جزئياً' : 'Partial') : (isAr ? 'غير مسددة' : 'Unpaid')}
                                                        </span>
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <span className={`status-badge ${b.status === 'CheckedIn' ? 'valid' : b.status === 'CheckedOut' ? 'valid' : 'warning'}`}>
                                                            {b.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <button 
                                                            className="btn btn-primary" 
                                                            onClick={() => openInvoiceModal(b)}
                                                            style={{ 
                                                                padding: '6px 14px', 
                                                                fontSize: '12px', 
                                                                display: 'inline-flex', 
                                                                alignItems: 'center', 
                                                                gap: '6px',
                                                                background: '#2563eb',
                                                                borderColor: '#3b82f6',
                                                                fontWeight: 'bold',
                                                                borderRadius: '6px',
                                                                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)'
                                                            }}
                                                        >
                                                            <i className="ri-printer-line" style={{ fontSize: '15px' }}></i>
                                                            {isAr ? 'عرض وطباعة الفاتورة' : 'View & Print Folio'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {filteredInvoices.length === 0 && (
                                            <tr>
                                                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                                                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>🧾</div>
                                                    <div>{isAr ? 'لا توجد فواتير مطابقة للبحث' : 'No guest invoices found.'}</div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* New Reservation Wizard (QloApps Engine) */}
            <div className="glass-card">
                <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>
                    <i className="ri-calendar-event-line" style={{ color: 'var(--accent-purple)', marginRight: '6px' }}></i>
                    {isAr ? 'حجز غرفة جديد (Reservation & Check-In Wizard)' : 'New Reservation & Check-In Wizard'}
                </h3>

                <form onSubmit={handleCreateBooking} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Dates & Property Selection */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'تاريخ الوصول (Check-in)' : 'Check-in Date'}</label>
                            <input type="date" className="form-control" value={checkInDate} onChange={e => setCheckInDate(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'تاريخ المغادرة (Check-out)' : 'Check-out Date'}</label>
                            <input type="date" className="form-control" value={checkOutDate} onChange={e => setCheckOutDate(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'الفندق / المنشأة' : 'Property / Hotel'}</label>
                            <select className="form-control" value={propertyId} onChange={e => setPropertyId(e.target.value)} required>
                                {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'اختيار الغرفة المتاحة' : 'Available Room / Unit'}</label>
                            <select className="form-control" value={unitId} onChange={e => setUnitId(e.target.value)} required>
                                <option value="" disabled>{isAr ? 'اختر الغرفة...' : 'Select Room...'}</option>
                                {filteredUnits.map(u => (
                                    <option key={u.id} value={u.id}>
                                        #{u.unitNumber} - {u.roomType || u.type} ({u.dailyRate} SAR/night)
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Guests & Customer Info */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'النزيل المسجل' : 'Existing Customer'}</label>
                            <select className="form-control" value={customerId} onChange={e => setCustomerId(e.target.value)}>
                                <option value="">{isAr ? '-- نزيل جديد / يدوي --' : '-- New Walk-in Guest --'}</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone || 'No phone'})</option>)}
                            </select>
                        </div>
                        {!customerId && (
                            <>
                                <div className="form-group">
                                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'اسم النزيل' : 'Guest Name'}</label>
                                    <input type="text" className="form-control" placeholder={isAr ? 'الاسم الثلاثي' : 'Full Name'} value={newCustomerName} onChange={e => setNewCustomerName(e.target.value)} required={!customerId} />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'رقم الجوال / الهوية' : 'Phone / ID'}</label>
                                    <input type="tel" className="form-control" placeholder="05xxxxxxxx" value={newCustomerPhone} onChange={e => setNewCustomerPhone(e.target.value)} />
                                </div>
                            </>
                        )}
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'البالغين' : 'Adults'}</label>
                            <input type="number" className="form-control" min="1" value={adults} onChange={e => setAdults(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'الأطفال' : 'Children'}</label>
                            <input type="number" className="form-control" min="0" value={children} onChange={e => setChildren(e.target.value)} />
                        </div>
                    </div>

                    {/* Group Block & Billing Routing (OPERA PMS) */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '15px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'مجموعة الحجز' : 'Group Block'}</label>
                            <select className="form-control" value={groupBlockId} onChange={e => setGroupBlockId(e.target.value)}>
                                <option value="">-- {isAr ? 'بدون مجموعة' : 'None'} --</option>
                                {groupBlocks.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'مسار الغرفة' : 'Room Routing'}</label>
                            <select className="form-control" value={billingRouting.roomCharges} onChange={e => setBillingRouting({ ...billingRouting, roomCharges: e.target.value })}>
                                <option value="Guest">{isAr ? 'دفع النزيل' : 'Guest Pays'}</option>
                                <option value="Company">{isAr ? 'دفع الشركة' : 'Company Pays'}</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'مسار الخدمات' : 'Extras Routing'}</label>
                            <select className="form-control" value={billingRouting.extraCharges} onChange={e => setBillingRouting({ ...billingRouting, extraCharges: e.target.value })}>
                                <option value="Guest">{isAr ? 'دفع النزيل' : 'Guest Pays'}</option>
                                <option value="Company">{isAr ? 'دفع الشركة' : 'Company Pays'}</option>
                            </select>
                        </div>
                    </div>

                    {/* QloApps Extra Add-On Services Selection */}
                    {hotelServices.length > 0 && (
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                <i className="ri-service-line" style={{ marginRight: '6px' }}></i>
                                {isAr ? 'الخدمات الإضافية المتاحة (Extra Hotel Services)' : 'Extra Hotel & Stay Add-ons'}
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                                {hotelServices.map(srv => {
                                    const checked = selectedServices.some(s => s.serviceId === srv.id);
                                    return (
                                        <div 
                                            key={srv.id}
                                            onClick={() => toggleExtraService(srv)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                                                borderRadius: '8px', cursor: 'pointer',
                                                border: checked ? '1px solid var(--accent-cyan)' : '1px solid var(--glass-border)',
                                                background: checked ? 'rgba(0, 200, 255, 0.1)' : 'var(--glass-bg)'
                                            }}
                                        >
                                            <i className={srv.icon || 'ri-service-line'} style={{ fontSize: '18px', color: checked ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}></i>
                                            <div>
                                                <div style={{ fontSize: '12px', fontWeight: 'bold', color: checked ? '#fff' : 'var(--text-secondary)' }}>
                                                    {isAr ? (srv.nameAR || srv.nameEN) : srv.nameEN}
                                                </div>
                                                <div style={{ fontSize: '11px', color: 'var(--accent-gold)' }}>
                                                    +{Number(srv.price).toFixed(2)} SAR <span style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>({srv.priceType})</span>
                                                </div>
                                            </div>
                                            {checked && <i className="ri-check-line" style={{ marginLeft: 'auto', color: 'var(--accent-cyan)' }}></i>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Order Summary Card */}
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '16px', borderRadius: '8px', border: '1px dashed var(--glass-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                            <span>{isAr ? `إقامة الغرفة (${nights} ليالي):` : `Room Stay (${nights} nights):`}</span>
                            <span>{roomRateSubtotal.toFixed(2)} SAR</span>
                        </div>
                        {selectedServices.length > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                <span>{isAr ? 'إجمالي الخدمات الإضافية:' : 'Extra Services Total:'}</span>
                                <span>+{servicesTotal.toFixed(2)} SAR</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                            <span>{isAr ? 'ضريبة القيمة المضافة (15%):' : 'VAT (15%):'}</span>
                            <span>+{vatAmount.toFixed(2)} SAR</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--glass-border)', fontSize: '16px', fontWeight: 'bold', color: 'var(--accent-success)' }}>
                            <span>{isAr ? 'الإجمالي النهائي المطلوب:' : 'Grand Total Due:'}</span>
                            <span>{grandTotal.toFixed(2)} SAR</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" className="btn btn-primary glow-button" style={{ padding: '12px 24px', fontSize: '14px' }}>
                            <i className="ri-check-double-line"></i> {isAr ? 'تأكيد الحجز والدفع وإصدار الفاتورة' : 'Confirm Booking & Issue Tax Invoice'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Bookings Table View */}
            {viewMode === 'table' && (
                <div className="glass-card">
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>
                        <i className="ri-list-check-2" style={{ color: 'var(--accent-cyan)', marginRight: '6px' }}></i>
                        {isAr ? 'جدول جميع الحجوزات السابقة والحالية' : 'All Reservations History'}
                    </h3>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>{isAr ? 'رقم الحجز' : 'Booking #'}</th>
                                    <th>{isAr ? 'النزيل' : 'Guest'}</th>
                                    <th>{isAr ? 'الغرفة والفندق' : 'Room & Property'}</th>
                                    <th>{isAr ? 'فترة الإقامة' : 'Dates (In / Out)'}</th>
                                    <th style={{ textAlign: 'right' }}>{isAr ? 'الإجمالي' : 'Total'}</th>
                                    <th style={{ textAlign: 'center' }}>{isAr ? 'الحالة' : 'Status'}</th>
                                    <th>{isAr ? 'إجراءات' : 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(b => {
                                    const u = units.find(unit => unit.id === b.unitId);
                                    const p = u ? properties.find(prop => prop.id === u.propertyId) : null;
                                    return (
                                        <tr key={b.id}>
                                            <td><strong>{b.bookingNumber || b.id}</strong></td>
                                            <td>
                                                <div style={{ fontWeight: 'bold' }}>{b.customerName || b.customerId}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{b.customerPhone}</div>
                                            </td>
                                            <td>
                                                <div>#{u ? u.unitNumber : b.unitId} ({u ? u.roomType : ''})</div>
                                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{p ? p.name : ''}</div>
                                            </td>
                                            <td>
                                                <div><i className="ri-login-box-line"></i> {new Date(b.checkInDate).toLocaleDateString()}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}><i className="ri-logout-box-line"></i> {new Date(b.checkOutDate).toLocaleDateString()}</div>
                                            </td>
                                            <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                                                {Number(b.totalAmount).toFixed(2)} SAR
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span className={`status-badge ${b.status === 'CheckedIn' ? 'valid' : b.status === 'CheckedOut' ? 'valid' : 'warning'}`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    {b.status === 'Confirmed' && (
                                                        <button className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleCheckIn(b)}>
                                                            {isAr ? 'دخول' : 'Check-In'}
                                                        </button>
                                                    )}
                                                    {b.status === 'CheckedIn' && (
                                                        <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleCheckOut(b)}>
                                                            {isAr ? 'خروج' : 'Check-Out'}
                                                        </button>
                                                    )}
                                                    <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px', background: 'rgba(37, 99, 235, 0.2)', borderColor: '#3b82f6', color: '#60a5fa', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '3px' }} title={isAr ? 'عرض وطباعة الفاتورة' : 'Print Invoice / Folio'} onClick={() => openInvoiceModal(b)}>
                                                        <i className="ri-printer-line"></i> {isAr ? 'الفاتورة' : 'Invoice'}
                                                    </button>
                                                    <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} title={isAr ? 'تبديل الغرفة' : 'Swap Room'} onClick={() => openSwapRoom(b)}>
                                                        <i className="ri-arrow-left-right-line"></i>
                                                    </button>
                                                    <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleDelete(b.id)}>
                                                        <i className="ri-delete-bin-line"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {bookings.length === 0 && (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                                            {isAr ? 'لا توجد حجوزات مسجلة' : 'No bookings found.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Room Swap Modal (QloApps Room Swap feature) */}
            {showSwapModal && swapBooking && (
                <div className="modal-overlay">
                    <div className="modal glass-card" style={{ maxWidth: '480px', width: '100%', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0 }}>{isAr ? 'تبديل ونقل غرفة النزيل (Room Swap)' : 'Swap Guest Room'}</h3>
                            <button className="btn btn-secondary" onClick={() => setShowSwapModal(false)}><i className="ri-close-line"></i></button>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '15px' }}>
                            {isAr ? `نقل النزيل (${swapBooking.customerName}) من الغرفة الحالية إلى غرفة أخرى متاحة:` : `Transfer guest (${swapBooking.customerName}) to another available room:`}
                        </p>
                        <form onSubmit={handleSwapRoom} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'الغرفة الجديدة المستهدفة' : 'Target New Room'}</label>
                                <select className="form-control" value={targetSwapUnitId} onChange={e => setTargetSwapUnitId(e.target.value)} required>
                                    <option value="">{isAr ? 'اختر الغرفة البديلة...' : 'Select Target Room...'}</option>
                                    {units.filter(u => u.id !== swapBooking.unitId && u.status !== 'Maintenance').map(u => (
                                        <option key={u.id} value={u.id}>#{u.unitNumber} - {u.roomType || u.type} ({u.dailyRate} SAR)</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowSwapModal(false)}>{isAr ? 'إلغاء' : 'Cancel'}</button>
                                <button type="submit" className="btn btn-primary">{isAr ? 'تأكيد التبديل' : 'Confirm Swap'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Hotel Folio & Tax Invoice Modal */}
            {showInvoiceModal && invoiceBooking && (() => {
                const u = units.find(unit => unit.id === invoiceBooking.unitId);
                const p = u ? properties.find(prop => prop.id === u.propertyId) : null;
                const bNights = Math.max(1, Math.ceil((new Date(invoiceBooking.checkOutDate) - new Date(invoiceBooking.checkInDate)) / (1000 * 60 * 60 * 24)));
                const roomSub = (invoiceBooking.dailyRate || (u ? u.dailyRate : 0)) * bNights;
                
                return (
                    <div className="modal-overlay" style={{ zIndex: 9999, overflowY: 'auto', padding: '20px' }}>
                        <div className="modal print-modal-content" style={{ maxWidth: '800px', width: '100%', background: '#ffffff', color: '#1a202c', padding: '0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                            {/* Modal Action Bar (Hidden in Print) */}
                            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: '#2d3748', color: '#fff' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 'bold' }}>
                                    <i className="ri-file-list-3-line" style={{ color: '#60a5fa' }}></i>
                                    {isAr ? 'فاتورة النزيل الضريبية الفندقية (Hotel Tax Folio)' : 'Hotel Guest Folio & Tax Invoice'}
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button 
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleShareFolio}
                                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', boxShadow: '0 2px 6px rgba(16, 185, 129, 0.4)' }}
                                    >
                                        <i className="ri-share-line"></i>
                                        {isAr ? 'مشاركة' : 'Share'}
                                    </button>
                                    <button 
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handlePrintFolio}
                                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', boxShadow: '0 2px 6px rgba(37, 99, 235, 0.4)' }}
                                    >
                                        <i className="ri-printer-line"></i>
                                        {isAr ? 'طباعة الفاتورة' : 'Print Invoice'}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary" 
                                        onClick={() => setShowInvoiceModal(false)}
                                        style={{ padding: '8px 14px', background: '#4b5563', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                    >
                                        <i className="ri-close-line"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Printable Folio Content */}
                            <div id="printable-hotel-folio" style={{ padding: '36px', background: '#ffffff', color: '#1a202c', fontFamily: 'system-ui, sans-serif' }}>
                                {/* Invoice Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <img src={settings?.logo || p?.logo || '/logo.png'} alt="Logo" style={{ height: '60px', objectFit: 'contain', borderRadius: '4px' }} />
                                        <div>
                                            <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>
                                                {p ? p.name : (settings?.businessName || 'KamySoft Luxury Hospitality')}
                                            </h1>
                                            <div style={{ color: '#d97706', fontSize: '14px', marginBottom: '6px' }}>
                                                {'⭐'.repeat(p ? p.starRating || 5 : 5)}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
                                                <div>{p ? p.address || p.location : (settings?.address || 'King Fahd Road, Riyadh, Saudi Arabia')}</div>
                                                <div>{p ? p.city : 'Riyadh'} | Tel: {p ? p.phone || '+966 11 456 7890' : (settings?.phone || '+966 11 456 7890')}</div>
                                                <div>Email: {p ? p.email || 'concierge@kamysoft.sa' : 'concierge@kamysoft.sa'}</div>
                                                <div style={{ fontWeight: '600', color: '#334155', marginTop: '2px' }}>VAT TRN: {settings?.vatNumber || '310123456700003'} (الرقم الضريبي)</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'inline-block', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
                                            {isAr ? 'فاتورة ضريبية مبسطة' : 'SIMPLIFIED TAX INVOICE'}
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>
                                            #{invoiceBooking.bookingNumber || invoiceBooking.id}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                                            {isAr ? 'تاريخ الإصدار:' : 'Date:'} {new Date().toLocaleDateString()}
                                        </div>
                                        <div style={{ marginTop: '6px' }}>
                                            <span style={{
                                                fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px',
                                                background: invoiceBooking.paymentStatus === 'Paid' ? '#dcfce7' : '#fef3c7',
                                                color: invoiceBooking.paymentStatus === 'Paid' ? '#15803d' : '#b45309'
                                            }}>
                                                {invoiceBooking.paymentStatus === 'Paid' ? 'PAID / مدفوعة بالكامل' : 'PARTIALLY PAID / مدفوعة جزئياً'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Guest & Reservation Information Box */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px', fontSize: '13px' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', color: '#475569', marginBottom: '8px', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px' }}>
                                            {isAr ? 'بيانات النزيل (Guest Details)' : 'Guest Information'}
                                        </div>
                                        <div style={{ marginBottom: '4px' }}><strong>{isAr ? 'الاسم:' : 'Name:'}</strong> {invoiceBooking.customerName || invoiceBooking.customerId}</div>
                                        <div style={{ marginBottom: '4px' }}><strong>{isAr ? 'الهاتف:' : 'Phone:'}</strong> {invoiceBooking.customerPhone || 'N/A'}</div>
                                        <div><strong>{isAr ? 'النزلاء:' : 'Occupancy:'}</strong> {invoiceBooking.adults || 1} {isAr ? 'بالغين' : 'Adults'}, {invoiceBooking.children || 0} {isAr ? 'أطفال' : 'Children'}</div>
                                        {invoiceBooking.billingRouting && (
                                            <div style={{ marginTop: '8px', padding: '6px', background: '#e0e7ff', borderRadius: '4px', fontSize: '11px', color: '#3730a3' }}>
                                                <strong>{isAr ? 'مسار الفاتورة (Routing):' : 'Billing Routing:'}</strong><br/>
                                                Room: {invoiceBooking.billingRouting.roomCharges} Pays | Extras: {invoiceBooking.billingRouting.extraCharges} Pays
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 'bold', color: '#475569', marginBottom: '8px', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px' }}>
                                            {isAr ? 'تفاصيل الإقامة (Stay Details)' : 'Stay Information'}
                                        </div>
                                        <div style={{ marginBottom: '4px' }}><strong>{isAr ? 'الغرفة:' : 'Unit / Room:'}</strong> #{u ? u.unitNumber : invoiceBooking.unitId} ({u ? u.roomType || u.type : ''}) - {isAr ? `طابق ${u ? u.floor : 1}` : `Floor ${u ? u.floor : 1}`}</div>
                                        {invoiceBooking.groupBlockId && (
                                            <div style={{ marginBottom: '4px', color: '#0369a1' }}><strong>{isAr ? 'المجموعة:' : 'Group Block:'}</strong> {groupBlocks.find(g => g.id === invoiceBooking.groupBlockId)?.name || invoiceBooking.groupBlockId}</div>
                                        )}
                                        <div style={{ marginBottom: '4px' }}><strong>{isAr ? 'الوصول:' : 'Check-In:'}</strong> {new Date(invoiceBooking.checkInDate).toLocaleDateString()} ({p ? p.checkInTime || '14:00' : '14:00'})</div>
                                        <div style={{ marginBottom: '4px' }}><strong>{isAr ? 'المغادرة:' : 'Check-Out:'}</strong> {new Date(invoiceBooking.checkOutDate).toLocaleDateString()} ({p ? p.checkOutTime || '12:00' : '12:00'})</div>
                                        <div><strong>{isAr ? 'إجمالي الليالي:' : 'Total Nights:'}</strong> {bNights} {isAr ? 'ليالي' : 'Nights'}</div>
                                    </div>
                                </div>

                                {/* Itemized Charges Table */}
                                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '13px' }}>
                                    <thead>
                                        <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', color: '#334155', textAlign: 'left' }}>
                                            <th style={{ padding: '10px 12px' }}>{isAr ? 'البند والوصف' : 'Description'}</th>
                                            <th style={{ padding: '10px 12px', textAlign: 'center' }}>{isAr ? 'الكمية / الليالي' : 'Qty / Nights'}</th>
                                            <th style={{ padding: '10px 12px', textAlign: 'right' }}>{isAr ? 'سعر الوحدة' : 'Rate (SAR)'}</th>
                                            <th style={{ padding: '10px 12px', textAlign: 'right' }}>{isAr ? 'المجموع' : 'Amount (SAR)'}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Room Charge */}
                                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '12px' }}>
                                                <div style={{ fontWeight: 'bold', color: '#1e293b' }}>
                                                    {isAr ? `إقامة فندقية - غرفة #${u ? u.unitNumber : ''} (${u ? u.roomType : 'Deluxe'})` : `Hotel Accommodation - Room #${u ? u.unitNumber : ''} (${u ? u.roomType : 'Deluxe'})`}
                                                </div>
                                                <div style={{ fontSize: '11px', color: '#64748b' }}>
                                                    {new Date(invoiceBooking.checkInDate).toLocaleDateString()} ➔ {new Date(invoiceBooking.checkOutDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'center' }}>{bNights}</td>
                                            <td style={{ padding: '12px', textAlign: 'right' }}>{Number(invoiceBooking.dailyRate || (u ? u.dailyRate : 0)).toFixed(2)}</td>
                                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>{roomSub.toFixed(2)}</td>
                                        </tr>

                                        {/* Extra Hotel Services */}
                                        {Array.isArray(invoiceBooking.extraServices) && invoiceBooking.extraServices.map((srv, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                <td style={{ padding: '10px 12px' }}>
                                                    <div style={{ fontWeight: 'bold', color: '#1e293b' }}>✨ {srv.name}</div>
                                                    <div style={{ fontSize: '11px', color: '#64748b' }}>{isAr ? 'خدمة فندقية إضافية' : 'Extra Hotel Service'}</div>
                                                </td>
                                                <td style={{ padding: '10px 12px', textAlign: 'center' }}>{srv.qty || 1}</td>
                                                <td style={{ padding: '10px 12px', textAlign: 'right' }}>{Number(srv.price).toFixed(2)}</td>
                                                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '600' }}>{(Number(srv.price) * (srv.qty || 1)).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Summary & ZATCA QR Code Row */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', borderTop: '2px solid #e2e8f0', paddingTop: '16px' }}>
                                    {/* QR Code Simulation & Legal Notice */}
                                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                                        <div style={{ width: '90px', height: '90px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2px', textAlign: 'center' }}>
                                            {invoiceQrLoading ? (
                                                <div style={{ fontSize: '10px', color: '#64748b' }}>{isAr ? 'جاري التحميل...' : 'Loading QR...'}</div>
                                            ) : folioQr ? (
                                                <img 
                                                    src={folioQr.startsWith('data:image') ? folioQr : `https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(folioQr)}`}
                                                    alt="ZATCA QR Code" 
                                                    style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} 
                                                />
                                            ) : (
                                                <>
                                                    <i className="ri-qr-code-line" style={{ fontSize: '48px', color: '#1e293b' }}></i>
                                                    <span style={{ fontSize: '8px', color: '#64748b', fontWeight: 'bold' }}>ZATCA Phase 2</span>
                                                </>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#64748b', maxWidth: '280px', lineHeight: '1.4' }}>
                                            <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#334155' }}>
                                                {isAr ? 'فاتورة إلكترونية معتمدة' : 'Electronic Tax Invoice'}
                                            </p>
                                            <p style={{ margin: 0 }}>
                                                {isAr ? 'تم إنشاء هذه الفاتورة إلكترونياً وهي متوافقة مع متطلبات هيئة الزكاة والضريبة والجمارك (ZATCA Phase 2).' : 'Generated electronically in compliance with ZATCA Phase 2 e-invoicing standards.'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Financial Breakdown */}
                                    <div style={{ minWidth: '260px', fontSize: '13px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#475569' }}>
                                            <span>{isAr ? 'المجموع الفرعي (غير شامل الضريبة):' : 'Subtotal (Excl. VAT):'}</span>
                                            <span style={{ fontWeight: '600' }}>{Number(invoiceBooking.subtotal || (invoiceBooking.totalAmount / 1.15)).toFixed(2)} SAR</span>
                                        </div>
                                        {invoiceBooking.discount > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#dc2626' }}>
                                                <span>{isAr ? 'الخصم:' : 'Discount:'}</span>
                                                <span>-{Number(invoiceBooking.discount).toFixed(2)} SAR</span>
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#475569' }}>
                                            <span>{isAr ? 'ضريبة القيمة المضافة (15%):' : 'VAT (15%):'}</span>
                                            <span style={{ fontWeight: '600' }}>{Number(invoiceBooking.vat || (invoiceBooking.totalAmount - (invoiceBooking.totalAmount / 1.15))).toFixed(2)} SAR</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '2px solid #cbd5e1', borderBottom: '2px solid #cbd5e1', marginTop: '8px', fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>
                                            <span>{isAr ? 'الإجمالي الكلي:' : 'Grand Total:'}</span>
                                            <span style={{ color: '#16a34a' }}>{Number(invoiceBooking.totalAmount).toFixed(2)} SAR</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '12px', color: '#64748b' }}>
                                            <span>{isAr ? 'المبلغ المدفوع:' : 'Paid Amount:'}</span>
                                            <span>{Number(invoiceBooking.paidAmount || invoiceBooking.totalAmount).toFixed(2)} SAR</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '12px', fontWeight: 'bold', color: (Number(invoiceBooking.totalAmount) - Number(invoiceBooking.paidAmount || invoiceBooking.totalAmount)) > 0 ? '#dc2626' : '#16a34a' }}>
                                            <span>{isAr ? 'المتبقي:' : 'Balance Due:'}</span>
                                            <span>{(Number(invoiceBooking.totalAmount) - Number(invoiceBooking.paidAmount || invoiceBooking.totalAmount)).toFixed(2)} SAR</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Guest Signature & Reception Footer */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '36px', paddingTop: '20px', borderTop: '1px dashed #cbd5e1', fontSize: '12px', color: '#64748b' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ height: '40px' }}></div>
                                        <div style={{ borderTop: '1px solid #94a3b8', paddingTop: '4px', fontWeight: '600' }}>
                                            {isAr ? 'توقيع النزيل (Guest Signature)' : 'Guest Signature'}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ height: '40px' }}></div>
                                        <div style={{ borderTop: '1px solid #94a3b8', paddingTop: '4px', fontWeight: '600' }}>
                                            {isAr ? 'ختم الاستقبال والمنشأة (Reception Official Stamp)' : 'Hotel Receptionist / Cashier Stamp'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

export default Bookings;
