import React, { useState, useEffect } from 'react';

const StorefrontSettings = ({ settings, setSettings, handleSaveSettings, currentLanguage, translations }) => {
    const [storefrontConfig, setStorefrontConfig] = useState(settings?.storefront || {
        heroTitleEN: 'Welcome to our store',
        heroTitleAR: 'مرحباً بكم في متجرنا',
        heroSubtitleEN: 'Discover our latest products',
        heroSubtitleAR: 'اكتشف أحدث منتجاتنا',
        bannerUrl: '',
        primaryColor: '#6366f1',
        whatsapp: '',
        instagram: '',
        facebook: ''
    });

    useEffect(() => {
        if (settings?.storefront) {
            setStorefrontConfig(settings.storefront);
        }
    }, [settings]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStorefrontConfig(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setSettings(prev => ({ ...prev, storefront: storefrontConfig }));
        // Give the state a tiny moment to update before triggering save API
        setTimeout(() => handleSaveSettings(), 100);
    };

    return (
        <div className="glass-card fade-in" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '15px' }}>
                <div style={{ padding: '12px', background: 'color-mix(in srgb, #ec4899 15%, transparent)', borderRadius: '12px', color: '#ec4899' }}>
                    <i className="ri-store-2-line" style={{ fontSize: '24px' }}></i>
                </div>
                <div>
                    <h3 style={{ margin: 0 }}>{currentLanguage === 'ar' ? 'إعدادات الواجهة' : 'Storefront Settings'}</h3>
                    <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {currentLanguage === 'ar' ? 'تخصيص مظهر المتجر الإلكتروني الخاص بك.' : 'Customize the appearance of your online store.'}
                    </p>
                </div>
            </div>

            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                    <label>{currentLanguage === 'ar' ? 'العنوان الرئيسي (إنجليزي)' : 'Hero Title (EN)'}</label>
                    <input type="text" className="form-control" name="heroTitleEN" value={storefrontConfig.heroTitleEN} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>{currentLanguage === 'ar' ? 'العنوان الرئيسي (عربي)' : 'Hero Title (AR)'}</label>
                    <input type="text" className="form-control" name="heroTitleAR" value={storefrontConfig.heroTitleAR} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>{currentLanguage === 'ar' ? 'العنوان الفرعي (إنجليزي)' : 'Hero Subtitle (EN)'}</label>
                    <input type="text" className="form-control" name="heroSubtitleEN" value={storefrontConfig.heroSubtitleEN} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>{currentLanguage === 'ar' ? 'العنوان الفرعي (عربي)' : 'Hero Subtitle (AR)'}</label>
                    <input type="text" className="form-control" name="heroSubtitleAR" value={storefrontConfig.heroSubtitleAR} onChange={handleChange} />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>{currentLanguage === 'ar' ? 'رابط صورة البانر' : 'Banner Image URL'}</label>
                    <input type="text" className="form-control" name="bannerUrl" value={storefrontConfig.bannerUrl} onChange={handleChange} placeholder="https://..." />
                </div>

                <div className="form-group">
                    <label>{currentLanguage === 'ar' ? 'اللون الأساسي' : 'Primary Color'}</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="color" name="primaryColor" value={storefrontConfig.primaryColor} onChange={handleChange} style={{ height: '42px', width: '60px', padding: '0', border: 'none', borderRadius: '8px' }} />
                        <input type="text" className="form-control" value={storefrontConfig.primaryColor} readOnly />
                    </div>
                </div>
                
                <div className="form-group">
                    <label>{currentLanguage === 'ar' ? 'رقم الواتساب' : 'WhatsApp Number'}</label>
                    <input type="text" className="form-control" name="whatsapp" value={storefrontConfig.whatsapp} onChange={handleChange} placeholder="+966..." />
                </div>

                <div className="form-group">
                    <label>Instagram URL</label>
                    <input type="text" className="form-control" name="instagram" value={storefrontConfig.instagram} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Facebook URL</label>
                    <input type="text" className="form-control" name="facebook" value={storefrontConfig.facebook} onChange={handleChange} />
                </div>
            </div>

            <div style={{ marginTop: '30px', textAlign: 'right' }}>
                <button className="btn btn-primary" onClick={handleSave}>
                    <i className="ri-save-line"></i> {translations[currentLanguage].saveSettings}
                </button>
            </div>
        </div>
    );
};

export default StorefrontSettings;
