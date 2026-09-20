import React, { useState, useEffect } from 'react';

const RoomDetails = ({ tenantId, currentLanguage, setLanguage }) => {
    const isAr = currentLanguage === 'ar';
    const [settings, setSettings] = useState(null);
    const [unit, setUnit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);
    
    // Parse roomId from URL
    const roomId = window.location.pathname.split('/').pop();

    useEffect(() => {
        // Fetch Settings
        fetch('/api/settings', { headers: { 'x-tenant-id': tenantId } })
            .then(res => res.json())
            .then(data => { if (data && !data.error) setSettings(data); })
            .catch(err => console.error(err));

        // Fetch Units to find this specific room
        fetch('/api/public/units', { headers: { 'x-tenant-id': tenantId } })
            .then(res => res.json())
            .then(data => {
                if (data && Array.isArray(data)) {
                    const found = data.find(u => u._id === roomId || String(u.id) === String(roomId));
                    setUnit(found);
                }
                setLoading(false);
            })
            .catch(err => { console.error(err); setLoading(false); });
    }, [tenantId, roomId]);

    if (loading) {
        return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
    }

    if (!unit) {
        return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>Room not found.</div>;
    }

    const businessName = settings?.businessName || (isAr ? 'بوابة العميل' : 'Web Portal');
    const fallbackUrl = "https://aleairyfurnishedapartmentsmadina3.reservehotel.net/hotel?muid=734635cd-306e-4b69-ab0a-737de6a205d3";
    const engineUrl = settings?.bookingEngineUrl || fallbackUrl;

    const mainImage = (unit.images && unit.images.length > 0) ? unit.images[0] : null;
    const gallery = unit.images || [];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', fontFamily: "'Inter', 'Tajawal', sans-serif", direction: isAr ? 'rtl' : 'ltr' }}>
            {/* Header */}
            <header style={{ padding: '20px 40px', backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
                <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {settings?.logoUrl && <img src={settings.logoUrl} alt="Logo" style={{ height: '50px', objectFit: 'contain' }} />}
                    <h1 style={{ margin: 0, fontSize: '24px', color: '#1e293b', fontWeight: '800', letterSpacing: '-0.5px' }}>
                        {businessName}
                    </h1>
                </a>
                <button 
                    onClick={() => setLanguage(isAr ? 'en' : 'ar')}
                    style={{ padding: '10px 20px', borderRadius: '50px', border: '1px solid #e2e8f0', background: '#f1f5f9', cursor: 'pointer', fontWeight: 'bold', color: '#0f172a', transition: 'all 0.3s' }}
                >
                    <i className="ri-translate-2"></i> {isAr ? 'English' : 'عربي'}
                </button>
            </header>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <a href="/" style={{ display: 'inline-block', marginBottom: '20px', color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>
                    <i className={isAr ? "ri-arrow-right-line" : "ri-arrow-left-line"}></i> {isAr ? 'العودة للصفحة الرئيسية' : 'Back to Home'}
                </a>

                {/* Gallery Section */}
                {mainImage ? (
                    <div style={{ display: 'grid', gridTemplateColumns: gallery.length > 1 ? '2fr 1fr' : '1fr', gap: '15px', height: '400px', marginBottom: '40px', borderRadius: '24px', overflow: 'hidden' }}>
                        <img src={mainImage} alt={unit.name || unit.type} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {gallery.length > 1 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <img src={gallery[1]} alt="Gallery 2" style={{ width: '100%', height: 'calc(50% - 7.5px)', objectFit: 'cover' }} />
                                {gallery.length > 2 ? (
                                    <img src={gallery[2]} alt="Gallery 3" style={{ width: '100%', height: 'calc(50% - 7.5px)', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: 'calc(50% - 7.5px)', backgroundColor: '#e2e8f0' }}></div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ height: '400px', backgroundColor: '#e2e8f0', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
                        <i className="ri-image-line" style={{ fontSize: '64px', color: '#94a3b8' }}></i>
                    </div>
                )}

                {/* Details & Booking Sidebar */}
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 380px', gap: '40px', alignItems: 'start' }}>
                    {/* Left: Details */}
                    <div>
                        <h2 style={{ fontSize: '36px', color: '#0f172a', fontWeight: '800', marginBottom: '10px' }}>{unit.name || unit.type}</h2>
                        <div style={{ display: 'flex', gap: '20px', color: '#64748b', fontSize: '16px', marginBottom: '30px', fontWeight: '500' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i className="ri-user-line" style={{ color: '#3b82f6' }}></i> {unit.capacityAdults || 2} {isAr ? 'بالغين' : 'Adults'}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i className="ri-user-smile-line" style={{ color: '#3b82f6' }}></i> {unit.capacityChildren || 0} {isAr ? 'أطفال' : 'Children'}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i className="ri-hotel-bed-line" style={{ color: '#3b82f6' }}></i> {unit.beds || 1} {isAr ? 'أسرة' : 'Beds'}</span>
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '30px 0' }} />
                        
                        <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '15px' }}>{isAr ? 'نظرة عامة' : 'Overview'}</h3>
                        <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#475569', whiteSpace: 'pre-wrap' }}>
                            {isAr 
                                ? 'استمتع بإقامة فاخرة ومريحة في هذه الوحدة المجهزة بالكامل لضمان أقصى درجات الراحة لك ولعائلتك. تم تصميم هذه الوحدة لتلبي جميع احتياجاتك العصرية.'
                                : 'Experience a luxurious and comfortable stay in this fully equipped unit designed to ensure maximum comfort for you and your family. This unit has been crafted to meet all your modern needs.'}
                        </p>

                        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '30px 0' }} />

                        <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '20px' }}>{isAr ? 'المميزات' : 'Amenities'}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', color: '#334155', fontSize: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><i className="ri-wifi-line" style={{ fontSize: '24px', color: '#10b981' }}></i> {isAr ? 'إنترنت لاسلكي مجاني' : 'Free High-Speed WiFi'}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><i className="ri-tv-2-line" style={{ fontSize: '24px', color: '#10b981' }}></i> {isAr ? 'شاشة تلفزيون مسطحة' : 'Flat-screen TV'}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><i className="ri-temp-cold-line" style={{ fontSize: '24px', color: '#10b981' }}></i> {isAr ? 'تكييف هواء' : 'Air Conditioning'}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><i className="ri-cup-line" style={{ fontSize: '24px', color: '#10b981' }}></i> {isAr ? 'آلة صنع القهوة' : 'Coffee Maker'}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><i className="ri-safe-2-line" style={{ fontSize: '24px', color: '#10b981' }}></i> {isAr ? 'خزنة آمنة' : 'Safe Box'}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><i className="ri-showers-line" style={{ fontSize: '24px', color: '#10b981' }}></i> {isAr ? 'دش استحمام فاخر' : 'Luxury Shower'}</div>
                        </div>
                    </div>

                    {/* Right: Booking Widget */}
                    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', position: 'sticky', top: '100px' }}>
                        <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                            {unit.dailyRate ? (isAr ? "ريال " + unit.dailyRate : unit.dailyRate + " SAR") : (isAr ? 'السعر عند الطلب' : 'Price on request')} 
                            <span style={{ fontSize: '16px', fontWeight: 'normal', color: '#64748b' }}> {isAr ? '/ الليلة' : '/ night'}</span>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
                            <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden' }}>
                                <div style={{ display: 'flex', borderBottom: '1px solid #cbd5e1' }}>
                                    <div style={{ flex: 1, padding: '12px', borderRight: isAr ? 'none' : '1px solid #cbd5e1', borderLeft: isAr ? '1px solid #cbd5e1' : 'none' }}>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase' }}>{isAr ? 'الوصول' : 'Check-in'}</label>
                                        <input type="date" id="rd-checkin" style={{ border: 'none', outline: 'none', width: '100%', marginTop: '5px', color: '#334155' }} />
                                    </div>
                                    <div style={{ flex: 1, padding: '12px' }}>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase' }}>{isAr ? 'المغادرة' : 'Check-out'}</label>
                                        <input type="date" id="rd-checkout" style={{ border: 'none', outline: 'none', width: '100%', marginTop: '5px', color: '#334155' }} />
                                    </div>
                                </div>
                                <div style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase' }}>{isAr ? 'الضيوف' : 'Guests'}</label>
                                        <div style={{ fontSize: '14px', marginTop: '5px', color: '#334155' }}>
                                            {unit.capacityAdults || 2} {isAr ? 'بالغين' : 'Adults'}, {unit.capacityChildren || 0} {isAr ? 'أطفال' : 'Children'}
                                        </div>
                                    </div>
                                    <i className="ri-arrow-down-s-line" style={{ fontSize: '20px', color: '#94a3b8' }}></i>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => setShowBookingModal(true)}
                            style={{ width: '100%', padding: '16px', backgroundColor: '#e11d48', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s', boxShadow: '0 4px 14px 0 rgba(225, 29, 72, 0.39)' }}
                        >
                            {isAr ? 'احجز هذه الوحدة' : 'Reserve'}
                        </button>
                        <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px', color: '#64748b' }}>
                            {isAr ? 'لن يتم خصم أي مبلغ الآن' : "You won't be charged yet"}
                        </div>
                    </div>
                </div>
            </main>

            {/* Embedded Booking Modal */}
            {showBookingModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                    <div style={{ width: '100%', maxWidth: '1200px', height: '100%', backgroundColor: '#fff', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                        
                        <div style={{ padding: '15px 30px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>{isAr ? 'أكمل حجزك' : 'Complete your booking'}</h3>
                            <button 
                                onClick={() => setShowBookingModal(false)}
                                style={{ background: '#e2e8f0', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '20px', color: '#475569' }}
                            >
                                <i className="ri-close-line"></i>
                            </button>
                        </div>
                        
                        <iframe 
                            src={(() => {
                                let url = engineUrl;
                                const checkin = document.getElementById('rd-checkin') ? document.getElementById('rd-checkin').value : '';
                                const checkout = document.getElementById('rd-checkout') ? document.getElementById('rd-checkout').value : '';
                                if (checkin && checkout) {
                                    const sep = url.includes('?') ? '&' : '?';
                                    url += sep + 'date_from=' + checkin + '&date_to=' + checkout;
                                }
                                return url;
                            })()}
                            title="Booking Engine"
                            style={{ flex: 1, border: 'none', width: '100%' }}
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomDetails;
