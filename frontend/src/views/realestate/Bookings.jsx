import React, { useState, useEffect } from 'react';

const Bookings = ({ currentLanguage, formatCurrency }) => {
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

    // Room Swap Modal
    const [showSwapModal, setShowSwapModal] = useState(false);
    const [swapBooking, setSwapBooking] = useState(null);
    const [targetSwapUnitId, setTargetSwapUnitId] = useState('');

    // Active View Mode (List vs Front Desk Rack)
    const [viewMode, setViewMode] = useState('frontDesk'); // 'frontDesk' | 'table'

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [bookRes, unitRes, propRes, custRes, srvRes] = await Promise.all([
                fetch('/api/bookings', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/units', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/properties', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/customers', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/realestate/services', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            const bookData = await bookRes.json();
            const unitData = await unitRes.json();
            const propData = await propRes.json();
            const custData = await custRes.json();
            const srvData = await srvRes.json();
            
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
        } catch (err) { console.error('Error fetching data', err); }
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
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className={`btn ${viewMode === 'frontDesk' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setViewMode('frontDesk')}>
                        <i className="ri-dashboard-line"></i> {isAr ? 'لوحة الغرف (Room Rack)' : 'Room Rack'}
                    </button>
                    <button className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setViewMode('table')}>
                        <i className="ri-table-line"></i> {isAr ? 'سجل الحجوزات' : 'Bookings Table'}
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
                                    <div style={{ display: 'flex', gap: '4px', marginTop: 'auto', paddingTop: '6px' }}>
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
                                            <button className="btn btn-secondary" style={{ padding: '4px 6px', fontSize: '10px' }} title={isAr ? 'تبديل الغرفة' : 'Swap Room'} onClick={() => openSwapRoom(currentBooking)}>
                                                <i className="ri-arrow-left-right-line"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

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
        </div>
    );
};

export default Bookings;
