import React from 'react';

const FreshFlowersDashboard = ({ settings, translations, activeTab, currentLanguage, setActiveTab }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                        <i className="ri-leaf-line" style={{ color: 'var(--accent-success)', marginRight: currentLanguage === 'ar' ? '0' : '8px', marginLeft: currentLanguage === 'ar' ? '8px' : '0' }}></i>
                        {translations?.freshFlowers || 'Fresh Flowers'} - {translations?.flowersDashboard || 'Dashboard'}
                    </h2>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        {currentLanguage === 'ar' ? 'نظرة عامة على تنسيقات الزهور والتوصيل' : 'Overview of fresh flower arrangements and delivery operations'}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-primary" onClick={() => setActiveTab && setActiveTab('flowers_arrangements')}>
                        <i className="ri-add-line"></i> {translations?.flowersArrangements || 'New Arrangement'}
                    </button>
                    <button className="btn btn-secondary" onClick={() => setActiveTab && setActiveTab('flowers_deliveries')}>
                        <i className="ri-truck-line"></i> {translations?.flowersDeliveries || 'Deliveries'}
                    </button>
                </div>
            </div>

            <div className="card-grid">
                <div className="glass-card purple">
                    <div className="card-stat">
                        <div className="stat-info">
                            <h3>{translations?.flowersArrangements || 'Active Arrangements'}</h3>
                            <div className="stat-value">0</div>
                        </div>
                        <div className="stat-icon"><i className="ri-leaf-line"></i></div>
                    </div>
                </div>

                <div className="glass-card cyan">
                    <div className="card-stat">
                        <div className="stat-info">
                            <h3>{translations?.flowersDeliveries || 'Scheduled Deliveries'}</h3>
                            <div className="stat-value">0</div>
                        </div>
                        <div className="stat-icon"><i className="ri-truck-line"></i></div>
                    </div>
                </div>

                <div className="glass-card gold">
                    <div className="card-stat">
                        <div className="stat-info">
                            <h3>{currentLanguage === 'ar' ? 'الطلبات اليومية' : 'Daily Orders'}</h3>
                            <div className="stat-value">0</div>
                        </div>
                        <div className="stat-icon"><i className="ri-shopping-basket-line"></i></div>
                    </div>
                </div>

                <div className="glass-card green">
                    <div className="card-stat">
                        <div className="stat-info">
                            <h3>{currentLanguage === 'ar' ? 'إجمالي المبيعات' : 'Flower Sales'}</h3>
                            <div className="stat-value">0.00 {settings?.currency || 'SAR'}</div>
                        </div>
                        <div className="stat-icon"><i className="ri-money-dollar-circle-line"></i></div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px' }}>
                            <i className="ri-time-line" style={{ color: 'var(--accent-cyan)', marginRight: '6px' }}></i>
                            {currentLanguage === 'ar' ? 'التوصيل القادم' : 'Upcoming Deliveries'}
                        </h3>
                    </div>
                    <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-secondary)' }}>
                        <i className="ri-truck-line" style={{ fontSize: '32px', opacity: 0.5, marginBottom: '8px', display: 'block' }}></i>
                        <p style={{ margin: 0 }}>{currentLanguage === 'ar' ? 'لا توجد عمليات توصيل مجدولة' : 'No upcoming deliveries scheduled.'}</p>
                    </div>
                </div>
                
                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px' }}>
                            <i className="ri-sparkling-line" style={{ color: 'var(--accent-gold)', marginRight: '6px' }}></i>
                            {currentLanguage === 'ar' ? 'أحدث التنسيقات' : 'Recent Arrangements'}
                        </h3>
                    </div>
                    <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-secondary)' }}>
                        <i className="ri-flower-line" style={{ fontSize: '32px', opacity: 0.5, marginBottom: '8px', display: 'block' }}></i>
                        <p style={{ margin: 0 }}>{currentLanguage === 'ar' ? 'لم يتم إنشاء أي باقات بعد' : 'No arrangements created yet.'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreshFlowersDashboard;