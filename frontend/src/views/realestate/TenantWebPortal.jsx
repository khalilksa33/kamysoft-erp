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

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
                <div style={{ maxWidth: '600px', backgroundColor: '#fff', padding: '50px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.02)' }}>
                    <h2 style={{ fontSize: '32px', color: '#0f172a', marginBottom: '16px', fontWeight: '800' }}>
                        {isAr ? 'مرحباً بك في' : 'Welcome to'} <span style={{ color: '#3b82f6' }}>{businessName}</span>
                    </h2>
                    <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '40px', lineHeight: '1.6' }}>
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
            </main>
            
            <footer style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fff', color: '#94a3b8', fontSize: '14px', borderTop: '1px solid #e2e8f0' }}>
                &copy; {new Date().getFullYear()} {businessName}. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'} | Powered by KamySoft ERP
            </footer>
        </div>
    );
};
export default TenantWebPortal;
