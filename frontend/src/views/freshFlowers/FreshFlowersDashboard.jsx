import React from 'react';

const FreshFlowersDashboard = ({ settings, translations, activeTab }) => {
    return (
        <div className="module-dashboard">
            <div className="modern-header">
                <h2>{translations?.freshFlowers || 'Fresh Flowers'} - {translations?.flowersDashboard || 'Dashboard'}</h2>
                <div className="header-actions">
                    <button className="modern-btn primary">
                        <i className="ri-add-line"></i> {translations?.flowersArrangements || 'New Arrangement'}
                    </button>
                </div>
            </div>

            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <div className="stat-card modern-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div className="stat-icon" style={{background: 'var(--primary-color, #007bff)', color: 'white', padding: '15px', borderRadius: '10px', fontSize: '24px'}}>
                        <i className="ri-leaf-line"></i>
                    </div>
                    <div className="stat-details">
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>{translations?.flowersArrangements || 'Arrangements'}</h3>
                        <p className="stat-value" style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>0</p>
                    </div>
                </div>

                <div className="stat-card modern-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div className="stat-icon" style={{background: '#2ecc71', color: 'white', padding: '15px', borderRadius: '10px', fontSize: '24px'}}>
                        <i className="ri-truck-line"></i>
                    </div>
                    <div className="stat-details">
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>{translations?.flowersDeliveries || 'Deliveries'}</h3>
                        <p className="stat-value" style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>0</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="modern-card">
                    <div className="card-header" style={{ padding: '15px 20px', borderBottom: '1px solid #eee' }}>
                        <h3 style={{ margin: 0, fontSize: '16px' }}>Upcoming Deliveries</h3>
                    </div>
                    <div className="card-body" style={{ padding: '20px' }}>
                        <p className="empty-state" style={{ color: '#999', textAlign: 'center' }}>No upcoming deliveries scheduled.</p>
                    </div>
                </div>
                
                <div className="modern-card">
                    <div className="card-header" style={{ padding: '15px 20px', borderBottom: '1px solid #eee' }}>
                        <h3 style={{ margin: 0, fontSize: '16px' }}>Recent Arrangements</h3>
                    </div>
                    <div className="card-body" style={{ padding: '20px' }}>
                        <p className="empty-state" style={{ color: '#999', textAlign: 'center' }}>No arrangements created yet.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreshFlowersDashboard;