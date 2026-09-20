import React, { useState, useEffect } from 'react';

const TenantWebPortal = ({ tenantId, currentLanguage, setLanguage }) => {
    const [settings, setSettings] = useState(null);
    const [units, setUnits] = useState([]);
    const isAr = currentLanguage === 'ar';

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
                    <form action="/book" method="GET" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginTop: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: isAr ? 'right' : 'left', flex: 1, minWidth: '140px' }}>
                            <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold', marginBottom: '8px' }}>{isAr ? 'تاريخ الوصول' : 'Check-in Date'}</label>
                            <input type="date" name="date_from" required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: isAr ? 'right' : 'left', flex: 1, minWidth: '140px' }}>
                            <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold', marginBottom: '8px' }}>{isAr ? 'تاريخ المغادرة' : 'Check-out Date'}</label>
                            <input type="date" name="date_to" required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: isAr ? 'right' : 'left', width: '90px' }}>
                            <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold', marginBottom: '8px' }}>{isAr ? 'بالغين' : 'Adults'}</label>
                            <input type="number" name="adults" min="1" defaultValue="1" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: isAr ? 'right' : 'left', width: '90px' }}>
                            <label style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold', marginBottom: '8px' }}>{isAr ? 'أطفال' : 'Children'}</label>
                            <input type="number" name="children" min="0" defaultValue="0" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', minWidth: '150px' }}>
                            <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', width: '100%', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                                <i className="ri-search-line" style={{ marginRight: isAr ? '0' : '8px', marginLeft: isAr ? '8px' : '0' }}></i>
                                {isAr ? 'بحث عن التوافر' : 'Check Availability'}
                            </button>
                        </div>
                    </form>
                </div>

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
                                        <div style={{ width: '100%', height: '200px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="ri-image-line" style={{ fontSize: '32px', color: '#94a3b8' }}></i>
                                        </div>
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
                                        <a href={/room/} style={{ display: 'block', textAlign: 'center', padding: '10px', background: '#f8fafc', color: '#3b82f6', textDecoration: 'none', borderRadius: '8px', fontWeight: '600', border: '1px solid #e2e8f0' }}>
                                            {isAr ? 'عرض التفاصيل' : 'View Details'}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            
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
