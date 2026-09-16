import React, { useState, useEffect } from 'react';

const PropertyOwners = ({ currentLanguage }) => {
    const isAr = currentLanguage === 'ar';
    const [owners, setOwners] = useState([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [bankDetails, setBankDetails] = useState('');
    const [editId, setEditId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchOwners();
    }, []);

    const fetchOwners = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/property-owners', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await res.json();
            if (Array.isArray(data)) setOwners(data); else setOwners([]);
        } catch (err) { console.error(err); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = editId ? `/api/property-owners/${editId}` : '/api/property-owners';
            const method = editId ? 'PUT' : 'POST';

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ name, phone, email, bankDetails })
            });
            setName('');
            setPhone('');
            setEmail('');
            setBankDetails('');
            setEditId(null);
            setShowModal(false);
            fetchOwners();
        } catch (err) { console.error(err); }
    };

    const handleEdit = (o) => {
        setEditId(o.id);
        setName(o.name);
        setPhone(o.phone || '');
        setEmail(o.email || '');
        setBankDetails(o.bankDetails || '');
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm(isAr ? 'حذف هذا المالك؟' : 'Delete this property owner?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/property-owners/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            fetchOwners();
        } catch (err) { console.error(err); }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                        <i className="ri-user-star-line" style={{ color: 'var(--accent-gold)', marginRight: isAr ? '0' : '8px', marginLeft: isAr ? '8px' : '0' }}></i>
                        {isAr ? 'إدارة الملاك والمستثمرين (Property Owners)' : 'Property Owners & Investors'}
                    </h2>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        {isAr ? 'سجل ملاك العقارات، بيانات الحسابات البنكية، وتفاصيل الاتصال' : 'Directory of property owners, bank settlement details, and contact profiles'}
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditId(null); setName(''); setPhone(''); setEmail(''); setBankDetails(''); setShowModal(true); }}>
                    <i className="ri-add-line"></i> {isAr ? 'إضافة مالك جديد' : 'New Owner'}
                </button>
            </div>

            <div className="glass-card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>{isAr ? 'اسم المالك' : 'Owner Name'}</th>
                                <th>{isAr ? 'رقم الهاتف' : 'Phone'}</th>
                                <th>{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                                <th>{isAr ? 'البيانات البنكية (IBAN)' : 'Bank Details / IBAN'}</th>
                                <th>{isAr ? 'إجراءات' : 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {owners.map(o => (
                                <tr key={o.id}>
                                    <td><strong>{o.name}</strong></td>
                                    <td>{o.phone || '-'}</td>
                                    <td>{o.email || '-'}</td>
                                    <td><span style={{ fontSize: '12px', color: 'var(--accent-cyan)' }}>{o.bankDetails || '-'}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleEdit(o)}>
                                                <i className="ri-edit-line"></i>
                                            </button>
                                            <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleDelete(o.id)}>
                                                <i className="ri-delete-bin-line"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {owners.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                                        {isAr ? 'لا يوجد ملاك مسجلين' : 'No property owners found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal glass-card" style={{ maxWidth: '480px', width: '100%', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0 }}>{editId ? (isAr ? 'تعديل بيانات المالك' : 'Edit Owner') : (isAr ? 'إضافة مالك جديد' : 'Add Owner')}</h3>
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}><i className="ri-close-line"></i></button>
                        </div>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)' }}>{isAr ? 'اسم المالك' : 'Owner Name'}</label>
                                <input type="text" className="form-control" required value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)' }}>{isAr ? 'رقم الهاتف' : 'Phone'}</label>
                                <input type="tel" className="form-control" required value={phone} onChange={e => setPhone(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)' }}>{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
                                <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)' }}>{isAr ? 'الحساب البنكي والآيبان (IBAN)' : 'IBAN / Bank Details'}</label>
                                <input type="text" className="form-control" placeholder="SA..." value={bankDetails} onChange={e => setBankDetails(e.target.value)} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>{isAr ? 'إلغاء' : 'Cancel'}</button>
                                <button type="submit" className="btn btn-primary">{isAr ? 'حفظ المالك' : 'Save Owner'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyOwners;
