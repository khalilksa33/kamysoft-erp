import React, { useState, useEffect } from 'react';

const BookingPortal = ({ tenantId, currentLanguage, setLanguage }) => {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        // Fetch tenant settings to get bookingEngineUrl
        fetch('/api/settings', { headers: { 'x-tenant-id': tenantId } })
            .then(res => res.json())
            .then(data => {
                if(data && !data.error) setSettings(data);
            })
            .catch(err => console.error(err));
    }, [tenantId]);

    const isAr = currentLanguage === 'ar';
    // Use the fallback requested by the user, but allow overriding via settings
    const fallbackUrl = "https://demo.qloapps.com"; // Default demo URL until configured by tenant
    let engineUrl = settings?.bookingEngineUrl || fallbackUrl;
    if (window.location.search) {
        engineUrl += engineUrl.includes('?') ? window.location.search.replace('?', '&') : window.location.search;
    }

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
            <header style={{ padding: '15px 30px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {settings?.logoUrl && <img src={settings.logoUrl} alt="Logo" style={{ height: '40px', objectFit: 'contain' }} />}
                    <h1 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 'bold' }}>
                        {settings?.businessName || (isAr ? 'بوابة الحجز' : 'Booking Portal')}
                    </h1>
                </div>
                <button 
                    onClick={() => setLanguage(isAr ? 'en' : 'ar')}
                    style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #e2e8f0', background: '#f1f5f9', cursor: 'pointer', fontWeight: 'bold', color: '#0f172a' }}
                >
                    <i className="ri-translate-2"></i> {isAr ? 'English' : 'عربي'}
                </button>
            </header>
            <div style={{ flex: 1, padding: '0', overflow: 'hidden' }}>
                <iframe 
                    src={engineUrl}
                    title="Online Booking Engine"
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

export default BookingPortal;
