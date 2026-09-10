import React, { useState, useEffect } from 'react';

const FlowersArrangements = ({ translations, currentLanguage, token, setAuthError }) => {
    const [arrangements, setArrangements] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', components: '', price: '' });

    const fetchArrangements = () => {
        fetch('/api/freshFlowers/arrangements', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) setArrangements(data);
        })
        .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchArrangements();
    }, [token]);

    const handleSave = (e) => {
        e.preventDefault();
        fetch('/api/freshFlowers/arrangements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                name: formData.name,
                components: formData.components,
                price: parseFloat(formData.price)
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.arrangement) {
                setArrangements([data.arrangement, ...arrangements]);
                setShowModal(false);
                setFormData({ name: '', components: '', price: '' });
            }
        })
        .catch(err => console.error(err));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                        <i className="ri-flower-line" style={{ color: 'var(--accent-purple)', marginRight: currentLanguage === 'ar' ? '0' : '8px', marginLeft: currentLanguage === 'ar' ? '8px' : '0' }}></i>
                        {translations?.flowersArrangements || (currentLanguage === 'ar' ? 'تنسيقات الزهور' : 'Flower Arrangements')}
                    </h2>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        {currentLanguage === 'ar' ? 'إدارة وتصميم باقات وتنسيقات الزهور ومكوناتها' : 'Manage flower bouquets, recipes, and custom arrangements'}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <i className="ri-add-line"></i> {currentLanguage === 'ar' ? 'تنسيق جديد' : 'New Arrangement'}
                    </button>
                </div>
            </div>

            <div className="glass-card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>{currentLanguage === 'ar' ? 'اسم التنسيق' : 'Name'}</th>
                                <th>{currentLanguage === 'ar' ? 'المكونات (زهور، تغليف)' : 'Components (Flowers, Wraps)'}</th>
                                <th style={{ textAlign: 'right' }}>{currentLanguage === 'ar' ? 'السعر (ر.س)' : 'Price (SAR)'}</th>
                                <th style={{ textAlign: 'center' }}>{currentLanguage === 'ar' ? 'الحالة' : 'Status'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {arrangements.map(arr => (
                                <tr key={arr.id}>
                                    <td><strong>#{arr.id}</strong></td>
                                    <td><strong>{arr.name}</strong></td>
                                    <td>{arr.components}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                                        {Number(arr.price).toFixed(2)}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className="status-badge valid" style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '11px' }}>
                                            {arr.status || 'Active'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {arrangements.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                                        {currentLanguage === 'ar' ? 'لا توجد باقات أو تنسيقات مسجلة' : 'No arrangements found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal glass-card" style={{ maxWidth: '500px', width: '100%', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px' }}>
                                {currentLanguage === 'ar' ? 'إضافة تنسيق زهور جديد' : 'Create New Arrangement'}
                            </h3>
                            <button className="btn btn-secondary" style={{ padding: '4px 8px', minWidth: 'auto' }} onClick={() => setShowModal(false)}>
                                <i className="ri-close-line"></i>
                            </button>
                        </div>
                        <div>
                            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                        {currentLanguage === 'ar' ? 'اسم التنسيق' : 'Arrangement Name'}
                                    </label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        placeholder={currentLanguage === 'ar' ? 'مثال: باقة ورد أحمر ملكي' : 'e.g. Royal Red Roses Bouquet'}
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                        {currentLanguage === 'ar' ? 'المكونات (زهور، ورق تغليف، مزهرية)' : 'Components (Flowers, Wraps, Vases)'}
                                    </label>
                                    <textarea 
                                        className="form-control" 
                                        required
                                        value={formData.components}
                                        onChange={e => setFormData({...formData, components: e.target.value})}
                                        placeholder={currentLanguage === 'ar' ? 'مثال: 12 جوري أحمر، تغليف كريب أسود، شريط ساتان' : 'e.g. 12x Red Roses, Black Wrap, Silk Ribbon'}
                                        rows="3"
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                        {currentLanguage === 'ar' ? 'السعر (ر.س)' : 'Price (SAR)'}
                                    </label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        required
                                        value={formData.price}
                                        onChange={e => setFormData({...formData, price: e.target.value})}
                                        min="0" step="0.01"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                        {currentLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {currentLanguage === 'ar' ? 'حفظ التنسيق' : 'Save Arrangement'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlowersArrangements;
