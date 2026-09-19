import React, { useState, useEffect } from 'react';

const TenantWebPortal = ({ tenantId, currentLanguage, setLanguage }) => {
    const [settings, setSettings] = useState(null);
    const isAr = currentLanguage === 'ar';

    useEffect(() => {
        fetch('/api/settings', { headers: { 'x-tenant-id': tenantId } })
            .then(res => res.json())
            .then(data => {
                if(data && !data.error) setSettings(data);
            })
            .catch(err => console.error(err));
    }, [tenantId]);

    const businessName = settings?.businessName || (tenantId ? tenantId.toUpperCase() : 'Property');

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

            
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', background: '#f8fafc' }}>
                {settings?.portalImages && settings.portalImages.length > 0 && (
                    <div style={{ width: '100%', maxWidth: '1000px', marginBottom: '40px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', height: '400px', position: 'relative' }}>
                        <div style={{ display: 'flex', width: '100%', height: '100%', overflowX: 'auto', scrollSnapType: 'x mandatory' }}>
                            {settings.portalImages.map((img, idx) => (
                                <img key={idx} src={img} alt="Property" style={{ width: '100%', height: '100%', objectFit: 'cover', flexShrink: 0, scrollSnapAlign: 'start' }} />
                            ))}
                        </div>
                        {settings.portalImages.length > 1 && (
                            <div style={{ position: 'absolute', bottom: '15px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                {settings.portalImages.map((_, idx) => (
                                    <div key={idx} style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.7)' }}></div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div style={{ maxWidth: '800px', width: '100%', backgroundColor: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '32px', color: '#0f172a', marginBottom: '16px', fontWeight: '800' }}>
                        {isAr ? 'مرحباً بك في' : 'Welcome to'} <span style={{ color: '#3b82f6' }}>{businessName}</span>
                    </h2>
                    <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '30px', lineHeight: '1.6' }}>
                        {isAr 
                            ? 'اكتشف أفضل خيارات الإقامة لدينا. احجز غرفتك بكل سهولة وسرعة من خلال بوابتنا الإلكترونية.'
                            : 'Discover our premium accommodation options. Book your stay easily and securely through our online portal.'}
                    </p>
                    <a 
                        href="/book"
                        style={{ 
                            display: 'inline-block',
                            padding: '16px 40px', 
                            backgroundColor: '#3b82f6', 
                            color: '#fff', 
                            textDecoration: 'none',
                            borderRadius: '50px',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)'
                        }}
                    >
                        <i className="ri-calendar-check-line" style={{ marginRight: isAr ? '0' : '8px', marginLeft: isAr ? '8px' : '0' }}></i>
                        {isAr ? 'احجز الآن (Book Now)' : 'Book Now'}
                    </a>
                </div>

                {settings?.portalRooms && settings.portalRooms.length > 0 && (
                    <div style={{ width: '100%', maxWidth: '1000px' }}>
                        <h3 style={{ fontSize: '24px', color: '#1e293b', marginBottom: '20px', textAlign: isAr ? 'right' : 'left', fontWeight: '700' }}>
                            {isAr ? 'الغرف والأجنحة المتاحة' : 'Available Rooms & Suites'}
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {settings.portalRooms.map((room, idx) => (
                                <div key={idx} style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }}>
                                    {room.imageUrl ? (
                                        <img src={room.imageUrl} alt={room.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '200px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="ri-image-line" style={{ fontSize: '32px', color: '#94a3b8' }}></i>
                                        </div>
                                    )}
                                    <div style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                            <h4 style={{ margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: 'bold' }}>{room.name}</h4>
                                            {room.price && <span style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}></span>}
                                        </div>
                                        <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>{room.description}</p>
                                        <a href="/book" style={{ display: 'block', textAlign: 'center', padding: '10px', background: '#f8fafc', color: '#3b82f6', textDecoration: 'none', borderRadius: '8px', fontWeight: '600', border: '1px solid #e2e8f0' }}>
                                            {isAr ? 'عرض التفاصيل والحجز' : 'View Details & Book'}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            
            <footer style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fff', color: '#94a3b8', fontSize: '14px', borderTop: '1px solid #e2e8f0' }}>
                &copy; {new Date().getFullYear()} {businessName}. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'} | Powered by KamySoft ERP
            </footer>
        </div>
    );
};
export default TenantWebPortal;
