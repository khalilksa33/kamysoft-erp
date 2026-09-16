import React, { useState, useEffect } from 'react';

const Housekeeping = ({ currentLanguage }) => {
    const isAr = currentLanguage === 'ar';
    const [units, setUnits] = useState([]);
    const [properties, setProperties] = useState([]);
    const [filterProperty, setFilterProperty] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [unitRes, propRes] = await Promise.all([
                fetch('/api/units', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/properties', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            const uData = await unitRes.json();
            const pData = await propRes.json();
            if (Array.isArray(uData)) setUnits(uData); else setUnits([]);
            if (Array.isArray(pData)) setProperties(pData); else setProperties([]);
        } catch (err) { console.error(err); }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/realestate/units/${id}/cleaning-status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ cleaningStatus: newStatus })
            });
            setUnits(units.map(u => u.id === id ? { ...u, cleaningStatus: newStatus } : u));
        } catch (err) { console.error(err); }
    };

    const filtered = units.filter(u => {
        if (filterProperty && u.propertyId !== filterProperty) return false;
        if (filterStatus !== 'All' && u.cleaningStatus !== filterStatus) return false;
        return true;
    });

    const cleanCount = units.filter(u => (u.cleaningStatus || 'Clean') === 'Clean').length;
    const dirtyCount = units.filter(u => u.cleaningStatus === 'Dirty').length;
    const inspectingCount = units.filter(u => u.cleaningStatus === 'Inspecting').length;
    const oooCount = units.filter(u => u.cleaningStatus === 'OutOfService').length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                        <i className="ri-brush-line" style={{ color: 'var(--accent-success)', marginRight: isAr ? '0' : '8px', marginLeft: isAr ? '8px' : '0' }}></i>
                        {isAr ? 'إدارة النظافة والتدبير الفندقي (Housekeeping)' : 'Housekeeping & Room Readiness'}
                    </h2>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        {isAr ? 'متابعة حالة تنظيف الغرف، المعاينة، وجاهزية استقبال النزلاء بنقرة واحدة (مواصفات QloApps)' : 'Track room cleaning workflows, inspections, and readiness for check-in with 1-click updates (QloApps Specs)'}
                    </p>
                </div>
            </div>

            {/* Quick KPI Cards */}
            <div className="card-grid">
                <div className="glass-card green">
                    <div className="card-stat">
                        <div className="stat-info">
                            <h3>{isAr ? 'غرف نظيفة وجاهزة' : 'Clean & Ready'}</h3>
                            <div className="stat-value">{cleanCount}</div>
                        </div>
                        <div className="stat-icon"><i className="ri-checkbox-circle-line"></i></div>
                    </div>
                </div>

                <div className="glass-card purple">
                    <div className="card-stat">
                        <div className="stat-info">
                            <h3>{isAr ? 'غرف تحتاج تنظيف' : 'Dirty / Needs Cleaning'}</h3>
                            <div className="stat-value" style={{ color: '#e74c3c' }}>{dirtyCount}</div>
                        </div>
                        <div className="stat-icon"><i className="ri-alarm-warning-line"></i></div>
                    </div>
                </div>

                <div className="glass-card gold">
                    <div className="card-stat">
                        <div className="stat-info">
                            <h3>{isAr ? 'قيد الفحص والمعاينة' : 'Under Inspection'}</h3>
                            <div className="stat-value">{inspectingCount}</div>
                        </div>
                        <div className="stat-icon"><i className="ri-search-eye-line"></i></div>
                    </div>
                </div>

                <div className="glass-card cyan">
                    <div className="card-stat">
                        <div className="stat-info">
                            <h3>{isAr ? 'خارج الخدمة / صيانة' : 'Out of Service'}</h3>
                            <div className="stat-value">{oooCount}</div>
                        </div>
                        <div className="stat-icon"><i className="ri-tools-line"></i></div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="glass-card" style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{isAr ? 'المنشأة:' : 'Property:'}</label>
                    <select className="form-control" style={{ width: 'auto' }} value={filterProperty} onChange={e => setFilterProperty(e.target.value)}>
                        <option value="">{isAr ? 'جميع العقارات' : 'All Properties'}</option>
                        {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{isAr ? 'حالة النظافة:' : 'Status:'}</label>
                    <select className="form-control" style={{ width: 'auto' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                        <option value="All">{isAr ? 'الكل (All)' : 'All'}</option>
                        <option value="Clean">🟢 {isAr ? 'نظيفة Clean' : 'Clean'}</option>
                        <option value="Dirty">🔴 {isAr ? 'تحتاج تنظيف Dirty' : 'Dirty'}</option>
                        <option value="Inspecting">🟡 {isAr ? 'قيد المعاينة Inspecting' : 'Inspecting'}</option>
                        <option value="OutOfService">⚪ {isAr ? 'خارج الخدمة Out of Service' : 'Out of Service'}</option>
                    </select>
                </div>
            </div>

            {/* Room Housekeeping Grid */}
            <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                    {filtered.map(u => {
                        const prop = properties.find(p => p.id === u.propertyId);
                        const status = u.cleaningStatus || 'Clean';

                        return (
                            <div
                                key={u.id}
                                style={{
                                    background: 'var(--glass-bg)',
                                    border: status === 'Clean' ? '1px solid var(--accent-success)' : status === 'Dirty' ? '1px solid #e74c3c' : '1px solid var(--glass-border)',
                                    borderRadius: '10px',
                                    padding: '16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>#{u.unitNumber}</span>
                                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)' }}>
                                        {u.roomType || u.type}
                                    </span>
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                    {prop ? prop.name : ''} - {isAr ? `الطابق ${u.floor || 1}` : `Floor ${u.floor || 1}`}
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                    {isAr ? 'حالة الإشغال:' : 'Occupancy:'} <strong>{u.status}</strong>
                                </div>

                                <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--glass-border)' }}>
                                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                        {isAr ? 'تغيير الحالة:' : 'Set Cleaning Status:'}
                                    </label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                                        <button 
                                            className={`btn ${status === 'Clean' ? 'btn-primary' : 'btn-secondary'}`} 
                                            style={{ padding: '4px', fontSize: '11px', borderColor: 'var(--accent-success)' }}
                                            onClick={() => updateStatus(u.id, 'Clean')}
                                        >
                                            🟢 Clean
                                        </button>
                                        <button 
                                            className={`btn ${status === 'Dirty' ? 'btn-danger' : 'btn-secondary'}`} 
                                            style={{ padding: '4px', fontSize: '11px' }}
                                            onClick={() => updateStatus(u.id, 'Dirty')}
                                        >
                                            🔴 Dirty
                                        </button>
                                        <button 
                                            className={`btn ${status === 'Inspecting' ? 'btn-primary' : 'btn-secondary'}`} 
                                            style={{ padding: '4px', fontSize: '11px', borderColor: 'var(--accent-gold)' }}
                                            onClick={() => updateStatus(u.id, 'Inspecting')}
                                        >
                                            🟡 Inspect
                                        </button>
                                        <button 
                                            className={`btn ${status === 'OutOfService' ? 'btn-secondary' : 'btn-secondary'}`} 
                                            style={{ padding: '4px', fontSize: '11px' }}
                                            onClick={() => updateStatus(u.id, 'OutOfService')}
                                        >
                                            ⚪ OOO
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Housekeeping;
