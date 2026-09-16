import React, { useState, useEffect } from 'react';

const ExtraServices = ({ currentLanguage }) => {
    const isAr = currentLanguage === 'ar';
    const [services, setServices] = useState([]);
    const [nameEN, setNameEN] = useState('');
    const [nameAR, setNameAR] = useState('');
    const [price, setPrice] = useState('');
    const [priceType, setPriceType] = useState('PerStay');
    const [icon, setIcon] = useState('ri-service-line');
    const [description, setDescription] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/realestate/services', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await res.json();
            if (Array.isArray(data)) setServices(data); else setServices([]);
        } catch (err) { console.error(err); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = editId ? `/api/realestate/services/${editId}` : '/api/realestate/services';
            const method = editId ? 'PUT' : 'POST';

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ nameEN, nameAR, price: Number(price), priceType, icon, description })
            });
            resetForm();
            fetchServices();
        } catch (err) { console.error(err); }
    };

    const resetForm = () => {
        setNameEN('');
        setNameAR('');
        setPrice('');
        setPriceType('PerStay');
        setIcon('ri-service-line');
        setDescription('');
        setEditId(null);
    };

    const handleEdit = (s) => {
        setEditId(s.id);
        setNameEN(s.nameEN);
        setNameAR(s.nameAR || '');
        setPrice(s.price);
        setPriceType(s.priceType || 'PerStay');
        setIcon(s.icon || 'ri-service-line');
        setDescription(s.description || '');
    };

    const handleDelete = async (id) => {
        if (!window.confirm(isAr ? 'حذف هذه الخدمة؟' : 'Delete this extra service?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/realestate/services/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            fetchServices();
        } catch (err) { console.error(err); }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                        <i className="ri-hand-heart-line" style={{ color: 'var(--accent-cyan)', marginRight: isAr ? '0' : '8px', marginLeft: isAr ? '8px' : '0' }}></i>
                        {isAr ? 'إدارة الخدمات الإضافية الفندقية (Extra Services)' : 'Hotel & Property Extra Services'}
                    </h2>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        {isAr ? 'تعريف الخدمات المضافة (استقبال المطار، الإفطار، السبا، سرير إضافي) وحسابها التلقائي (مواصفات QloApps)' : 'Configure add-ons (Airport shuttle, Breakfast, Spa, Extra bed) for automatic booking billing (QloApps Specs)'}
                    </p>
                </div>
            </div>

            <div className="glass-card">
                <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>
                    {editId ? (isAr ? 'تعديل الخدمة' : 'Edit Extra Service') : (isAr ? 'إضافة خدمة فندقية جديدة' : 'Add New Extra Service')}
                </h3>
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'الاسم بالإنجليزية' : 'Service Name (EN)'}</label>
                            <input type="text" className="form-control" placeholder="e.g. Airport Shuttle VIP" value={nameEN} onChange={e => setNameEN(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'الاسم بالعربية' : 'Service Name (AR)'}</label>
                            <input type="text" className="form-control" placeholder="مثال: توصيل المطار VIP" value={nameAR} onChange={e => setNameAR(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'السعر (ر.س)' : 'Price (SAR)'}</label>
                            <input type="number" className="form-control" min="0" step="0.01" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'طريقة الاحتساب' : 'Billing Type'}</label>
                            <select className="form-control" value={priceType} onChange={e => setPriceType(e.target.value)}>
                                <option value="PerStay">{isAr ? 'لكل حجز/إقامة (Per Stay)' : 'Per Stay'}</option>
                                <option value="PerNight">{isAr ? 'لكل ليلة (Per Night)' : 'Per Night'}</option>
                                <option value="PerPerson">{isAr ? 'لكل فرد (Per Person)' : 'Per Person'}</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'الأيقونة' : 'Icon Class'}</label>
                            <select className="form-control" value={icon} onChange={e => setIcon(e.target.value)}>
                                <option value="ri-car-line">🚗 Car / Shuttle</option>
                                <option value="ri-cup-line">🍳 Breakfast / Food</option>
                                <option value="ri-hotel-bed-line">🛏️ Extra Bed</option>
                                <option value="ri-sparkling-line">✨ Spa / Massage</option>
                                <option value="ri-brush-line">🧹 Housekeeping</option>
                                <option value="ri-service-line">🛎️ General Service</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" className="btn btn-primary">
                            <i className="ri-save-line"></i> {isAr ? 'حفظ الخدمة' : 'Save Service'}
                        </button>
                        {editId && (
                            <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                {isAr ? 'إلغاء' : 'Cancel'}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="glass-card">
                <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>
                    <i className="ri-list-check" style={{ color: 'var(--accent-gold)', marginRight: '6px' }}></i>
                    {isAr ? 'دليل الخدمات الإضافية الفندقية' : 'Active Extra Services Catalog'}
                </h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>{isAr ? 'الخدمة' : 'Service'}</th>
                                <th>{isAr ? 'الاسم بالعربية' : 'Arabic Name'}</th>
                                <th style={{ textAlign: 'right' }}>{isAr ? 'السعر' : 'Price'}</th>
                                <th>{isAr ? 'طريقة الاحتساب' : 'Billing Type'}</th>
                                <th style={{ textAlign: 'center' }}>{isAr ? 'الحالة' : 'Status'}</th>
                                <th>{isAr ? 'إجراءات' : 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map(s => (
                                <tr key={s.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <i className={s.icon || 'ri-service-line'} style={{ color: 'var(--accent-cyan)', fontSize: '18px' }}></i>
                                            <strong>{s.nameEN}</strong>
                                        </div>
                                    </td>
                                    <td>{s.nameAR || '-'}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                                        {Number(s.price).toFixed(2)} SAR
                                    </td>
                                    <td><span className="badge badge-primary">{s.priceType}</span></td>
                                    <td style={{ textAlign: 'center' }}><span className="status-badge valid">{s.status || 'Active'}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleEdit(s)}>
                                                <i className="ri-edit-line"></i>
                                            </button>
                                            <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleDelete(s.id)}>
                                                <i className="ri-delete-bin-line"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {services.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                                        {isAr ? 'لم يتم إضافة أي خدمات إضافية بعد' : 'No extra services configured.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExtraServices;
