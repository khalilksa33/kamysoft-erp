import React, { useState, useEffect } from 'react';

const TenantWebPortal = ({ tenantId, currentLanguage, setLanguage }) => {
    const [settings, setSettings] = useState(null);
    const [units, setUnits] = useState([]);
    const isAr = currentLanguage === 'ar';
    const [selectedUnit, setSelectedUnit] = useState(null);

    useEffect(() => {
        fetch('/api/settings', { headers: { 'x-tenant-id': tenantId } })
            .then(res => res.json())
            .then(data => {
                if(data && !data.error) setSettings(data);
            })
            .catch(err => console.error(err));
            
        fetch('/api/public/units', { headers: { 'x-tenant-id': tenantId } })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setUnits(data);
            })
            .catch(err => console.error(err));
    }, [tenantId]);

    const businessName = settings?.businessName || (tenantId ? tenantId.toUpperCase() : 'Property');
    const fallbackUrl = "https://demo.qloapps.com"; // Default demo URL until configured by tenant
    const engineUrl = settings?.bookingEngineUrl || fallbackUrl;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }} dir={isAr ? 'rtl' : 'ltr'}>
            <header style={{ padding: '20px 40px', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {settings?.logoUrl && <img src={settings.logoUrl} alt="Logo" style={{ height: '50px', objectFit: 'contain' }} />}
                    <h1 style={{ margin: 0, fontSize: '24px', color: '#0f172a', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
                        {businessName}
                    </h1>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button 
                        onClick={() => setLanguage(isAr ? 'en' : 'ar')}
                        style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #e2e8f0', background: '#f1f5f9', cursor: 'pointer', fontWeight: '600', color: '#334155' }}
                    >
                        <i className="ri-translate-2"></i> {isAr ? 'English' : 'عربي'}
                    </button>
                    <a href="/login" style={{ textDecoration: 'none', color: '#3b82f6', fontWeight: '600', fontSize: '15px' }}>
                        {isAr ? 'تسجيل دخول الموظفين' : 'Staff Login'}
                    </a>
                </div>
            </header>

            
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0', background: '#fdfdfd' }}>
                {/* Hero Section */}
                <section style={{ position: 'relative', display: 'flex', minHeight: '85vh', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden', width: '100%' }}>
                    <img 
                        src={settings?.portalImages?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920'} 
                        alt="Hero" 
                        style={{ position: 'absolute', inset: 0, height: '100%', width: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: isAr ? 'linear-gradient(to left, rgba(28,25,23,0.85), rgba(28,25,23,0.45), transparent)' : 'linear-gradient(to right, rgba(28,25,23,0.85), rgba(28,25,23,0.45), transparent)' }}></div>
                    
                    <div style={{ position: 'relative', zIndex: 10, margin: '0 auto', width: '100%', maxWidth: '1200px', padding: '120px 24px 60px', display: 'flex', flexDirection: 'column', textAlign: isAr ? 'right' : 'left' }}>
                        <div style={{ maxWidth: '700px' }}>
                            <p style={{ marginBottom: '24px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.3em', color: '#d4af37', textTransform: 'uppercase' }}>
                                {isAr ? 'بوابة الحجز المباشر' : 'Hotel Booking Portal'}
                            </p>
                            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.15, color: '#fff', fontWeight: '600', marginBottom: '24px' }}>
                                {isAr ? 'جوهر الفخامة العربية' : 'The soul of Arabian luxury'}
                            </h1>
                            <p style={{ maxWidth: '600px', fontSize: '18px', lineHeight: 1.8, fontWeight: 300, color: 'rgba(255,255,255,0.8)' }}>
                                {isAr 
                                    ? 'اكتشف أفضل خيارات الإقامة لدينا. احجز غرفتك بكل سهولة وسرعة من خلال بوابتنا الإلكترونية.'
                                    : 'Discover our premium accommodation options. Book your stay easily and securely through our online portal.'}
                            </p>
                        </div>

                        {/* Search Widget */}
                        <div style={{ marginTop: '48px', maxWidth: '1000px' }}>
                            <form 
                            onSubmit={(e) => { 
                                e.preventDefault(); 
                                const el = document.getElementById('rooms-section');
                                if(el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-end', background: 'rgba(255, 255, 255, 0.95)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.25)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', backdropFilter: 'blur(16px)' }}
                        >
                                <div style={{ display: 'flex', flexDirection: 'column', textAlign: isAr ? 'right' : 'left', flex: '1 1 150px' }}>
                                    <label style={{ fontSize: '12px', color: '#1e293b', fontWeight: '600', marginBottom: '6px' }}>{isAr ? 'تاريخ الوصول' : 'Check-in'}</label>
                                    <input type="date" id="rd-checkin" name="date_from" required style={{ height: '44px', padding: '0 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', background: 'transparent' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', textAlign: isAr ? 'right' : 'left', flex: '1 1 150px' }}>
                                    <label style={{ fontSize: '12px', color: '#1e293b', fontWeight: '600', marginBottom: '6px' }}>{isAr ? 'تاريخ المغادرة' : 'Check-out'}</label>
                                    <input type="date" id="rd-checkout" name="date_to" required style={{ height: '44px', padding: '0 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', background: 'transparent' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '15px', flex: '2 1 200px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: isAr ? 'right' : 'left', flex: '1 1 150px' }}>
                                        <label style={{ fontSize: '12px', color: '#1e293b', fontWeight: '600', marginBottom: '6px' }}>{isAr ? 'بالغين' : 'Adults'}</label>
                                        <input type="number" name="adults" min="1" defaultValue="1" style={{ height: '44px', padding: '0 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', background: 'transparent' }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: isAr ? 'right' : 'left', flex: '1 1 150px' }}>
                                        <label style={{ fontSize: '12px', color: '#1e293b', fontWeight: '600', marginBottom: '6px' }}>{isAr ? 'أطفال' : 'Children'}</label>
                                        <input type="number" name="children" min="0" defaultValue="0" style={{ height: '44px', padding: '0 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', background: 'transparent' }} />
                                    </div>
                                </div>
                                <button type="submit" style={{ height: '44px', padding: '0 24px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', flex: '1 1 150px' }}>
                                    {isAr ? 'بحث عن التوافر' : 'Search availability'}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
                
                {/* Rooms Section Wrap */}
                <div id="rooms-section" style={{ padding: '80px 24px', width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    { (settings?.portalDescription || settings?.portalDescriptionAr) && (
                    <div style={{ maxWidth: '1000px', width: '100%', backgroundColor: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', textAlign: isAr ? 'right' : 'left', marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '24px', color: '#1e293b', marginBottom: '20px', fontWeight: '700' }}>
                            {isAr ? 'عن المنشأة' : 'About the Property'}
                        </h3>
                        <p style={{ fontSize: '16px', color: '#64748b', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                            {isAr ? (settings.portalDescriptionAr || settings.portalDescription) : (settings.portalDescription || settings.portalDescriptionAr)}
                        </p>
                    </div>
                )}
                
                {units && units.length > 0 && (
                    <div style={{ width: '100%', maxWidth: '1000px' }}>
                        <h3 style={{ fontSize: '24px', color: '#1e293b', marginBottom: '20px', textAlign: isAr ? 'right' : 'left', fontWeight: '700' }}>
                            {isAr ? 'الغرف والأجنحة المتاحة' : 'Available Rooms & Suites'}
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {units.map((unit, idx) => (
                                <div key={unit.id || idx} style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }}>
                                    {unit.images && unit.images.length > 0 ? (
                                        <img src={unit.images[0]} alt={unit.name || unit.unitNumber} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                    ) : (
                                        <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800" alt={unit.name || unit.unitNumber} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                    )}
                                    <div style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                            <h4 style={{ margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: 'bold' }}>
                                                {unit.name || unit.type}
                                            </h4>
                                            {unit.dailyRate && <span style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}> / {isAr ? 'يوم' : 'day'}</span>}
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', color: '#64748b', fontSize: '13px' }}>
                                            <span><i className="ri-hotel-bed-line"></i> {unit.beds || 1} {isAr ? 'سرير' : 'Beds'}</span>
                                            <span><i className="ri-user-line"></i> {unit.maxAdults || 2} {isAr ? 'أشخاص' : 'Adults'}</span>
                                        </div>
                                        <button onClick={(e) => { e.preventDefault(); setSelectedUnit(unit); }} style={{ width: '100%', display: 'block', textAlign: 'center', padding: '10px', background: '#f8fafc', color: '#3b82f6', textDecoration: 'none', borderRadius: '8px', fontWeight: '600', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                                            {isAr ? 'عرض التفاصيل والحجز' : 'View Details & Book'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div></main>

            {/* Embedded Details & Booking Modal */}
            {selectedUnit && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ width: '100%', maxWidth: '1000px', maxHeight: '90vh', backgroundColor: '#fff', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                        <div style={{ padding: '20px 30px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                            <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#0f172a' }}>{selectedUnit.name || selectedUnit.type}</h3>
                            <button onClick={() => setSelectedUnit(null)} style={{ background: '#e2e8f0', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '20px', color: '#475569' }}><i className="ri-close-line"></i></button>
                        </div>
                        <div style={{ padding: '30px', overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
                            {/* Left: Details */}
                            <div style={{ flex: '1 1 400px' }}>
                                {selectedUnit.images && selectedUnit.images.length > 0 ? (
                                    <img src={selectedUnit.images[0]} alt="Room" style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '16px', marginBottom: '20px' }} />
                                ) : (
                                    <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800" alt="Room" style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '16px', marginBottom: '20px' }} />
                                )}
                                <div style={{ display: 'flex', gap: '15px', color: '#64748b', fontSize: '15px', marginBottom: '20px', fontWeight: '500' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i className="ri-user-line" style={{ color: '#3b82f6' }}></i> {selectedUnit.maxAdults || 2} {isAr ? 'بالغين' : 'Adults'}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i className="ri-user-smile-line" style={{ color: '#3b82f6' }}></i> {selectedUnit.maxChildren || 0} {isAr ? 'أطفال' : 'Children'}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i className="ri-hotel-bed-line" style={{ color: '#3b82f6' }}></i> {selectedUnit.beds || 1} {isAr ? 'أسرة' : 'Beds'}</span>
                                </div>
                                <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>{isAr ? 'المميزات' : 'Amenities'}</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', color: '#475569', fontSize: '14px', marginBottom: '20px' }}>
                                    <div><i className="ri-wifi-line" style={{ color: '#10b981', marginRight: isAr?0:'8px', marginLeft: isAr?'8px':0 }}></i> {isAr ? 'إنترنت مجاني' : 'Free WiFi'}</div>
                                    <div><i className="ri-tv-2-line" style={{ color: '#10b981', marginRight: isAr?0:'8px', marginLeft: isAr?'8px':0 }}></i> {isAr ? 'شاشة تلفزيون' : 'Flat-screen TV'}</div>
                                    <div><i className="ri-temp-cold-line" style={{ color: '#10b981', marginRight: isAr?0:'8px', marginLeft: isAr?'8px':0 }}></i> {isAr ? 'تكييف هواء' : 'Air Conditioning'}</div>
                                </div>
                            </div>

                            {/* Right: Booking Form */}
                            <div style={{ flex: '1 1 300px', backgroundColor: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                                    {selectedUnit.dailyRate ? (isAr ? "ريال " + selectedUnit.dailyRate : selectedUnit.dailyRate + " SAR") : (isAr ? 'السعر عند الطلب' : 'Price on request')} 
                                    <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#64748b' }}> {isAr ? '/ الليلة' : '/ night'}</span>
                                </div>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const checkin = document.getElementById('modal-checkin').value;
                                    const checkout = document.getElementById('modal-checkout').value;
                                    const name = document.getElementById('modal-name').value;
                                    const phone = document.getElementById('modal-phone').value;
                                    const email = document.getElementById('modal-email').value;

                                    if (!checkin || !checkout || !name || !phone) {
                                        alert(isAr ? 'الرجاء تعبئة الحقول المطلوبة' : 'Please fill required fields');
                                        return;
                                    }

                                    const payload = {
                                        unitId: selectedUnit.id || selectedUnit._id,
                                        customerName: name, customerPhone: phone, customerEmail: email,
                                        checkInDate: new Date(checkin).toISOString(),
                                        checkOutDate: new Date(checkout).toISOString(),
                                        source: 'Web Portal', status: 'Pending',
                                        totalAmount: selectedUnit.dailyRate || 0,
                                        dailyRate: selectedUnit.dailyRate || 0
                                    };

                                    fetch('/api/public/bookings', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json', 'x-tenant-id': tenantId },
                                        body: JSON.stringify(payload)
                                    }).then(res => res.json()).then(data => {
                                        alert(isAr ? 'تم تأكيد حجزك بنجاح وسيتم التواصل معك' : 'Your booking request has been sent and we will contact you!');
                                        setSelectedUnit(null);
                                    }).catch(err => {
                                        alert('Error completing booking.');
                                    });
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>{isAr ? 'الاسم الكامل *' : 'Full Name *'}</label>
                                            <input id="modal-name" required type="text" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>{isAr ? 'رقم الهاتف *' : 'Phone Number *'}</label>
                                            <input id="modal-phone" required type="tel" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
                                            <input id="modal-email" type="email" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>{isAr ? 'الوصول *' : 'Check-in *'}</label>
                                                <input id="modal-checkin" required type="date" defaultValue={document.getElementById('rd-checkin')?.value} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>{isAr ? 'المغادرة *' : 'Check-out *'}</label>
                                                <input id="modal-checkout" required type="date" defaultValue={document.getElementById('rd-checkout')?.value} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                                            </div>
                                        </div>
                                        <button type="submit" style={{ marginTop: '10px', width: '100%', padding: '14px', backgroundColor: '#e11d48', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                                            {isAr ? 'تأكيد الحجز' : 'Reserve Now'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <footer style={{ padding: '40px 20px', backgroundColor: '#0f172a', color: '#cbd5e1', fontSize: '14px', borderTop: '1px solid #1e293b' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginBottom: '30px', textAlign: isAr ? 'right' : 'left' }}>
                    <div>
                        <h4 style={{ color: '#fff', fontSize: '18px', marginBottom: '15px', fontWeight: 'bold' }}>{businessName}</h4>
                        <p style={{ lineHeight: '1.6', marginBottom: '10px' }}>
                            <i className="ri-map-pin-line" style={{ marginRight: isAr ? 0 : '8px', marginLeft: isAr ? '8px' : 0 }}></i>
                            {isAr ? (settings?.contactAddressAr || settings?.contactAddress || settings?.businessAddress || 'العنوان غير متوفر') : (settings?.contactAddress || settings?.businessAddress || 'Address not provided')}
                        </p>
                        {settings?.contactPhone && (
                            <p style={{ lineHeight: '1.6', marginBottom: '10px' }}>
                                <i className="ri-phone-line" style={{ marginRight: isAr ? 0 : '8px', marginLeft: isAr ? '8px' : 0 }}></i>
                                {settings.contactPhone}
                            </p>
                        )}
                        {settings?.contactEmail && (
                            <p style={{ lineHeight: '1.6', marginBottom: '10px' }}>
                                <i className="ri-mail-line" style={{ marginRight: isAr ? 0 : '8px', marginLeft: isAr ? '8px' : 0 }}></i>
                                {settings.contactEmail}
                            </p>
                        )}
                    </div>

                    <div>
                        <h4 style={{ color: '#fff', fontSize: '18px', marginBottom: '15px', fontWeight: 'bold' }}>{isAr ? 'تواصل معنا' : 'Connect With Us'}</h4>
                        <div style={{ display: 'flex', gap: '15px', fontSize: '24px' }}>
                            {settings?.socialLinks?.facebook && <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='#3b5998'} onMouseOut={e => e.target.style.color='#cbd5e1'}><i className="ri-facebook-circle-fill"></i></a>}
                            {settings?.socialLinks?.instagram && <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='#e1306c'} onMouseOut={e => e.target.style.color='#cbd5e1'}><i className="ri-instagram-line"></i></a>}
                            {settings?.socialLinks?.twitter && <a href={settings.socialLinks.twitter} target="_blank" rel="noreferrer" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='#1da1f2'} onMouseOut={e => e.target.style.color='#cbd5e1'}><i className="ri-twitter-x-line"></i></a>}
                            {(!settings?.socialLinks?.facebook && !settings?.socialLinks?.instagram && !settings?.socialLinks?.twitter) && (
                                <span style={{ fontSize: '14px' }}>{isAr ? 'لا توجد روابط متوفرة.' : 'No social links provided.'}</span>
                            )}
                        </div>
                    </div>
                </div>
                
                <div style={{ borderTop: '1px solid #334155', paddingTop: '20px', textAlign: 'center', marginTop: '20px' }}>
                    &copy; {new Date().getFullYear()} {businessName}. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'} | <a href="https://kamysoft.com" target="_blank" style={{ color: '#3b82f6', textDecoration: 'none' }}>Powered by KamySoft ERP</a>
                </div>
            </footer>
        </div>
    );
};
export default TenantWebPortal;
