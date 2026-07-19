import React, { useState, useEffect } from 'react';
import '../../index.css';

const PropertyOwners = ({ currentLanguage }) => {
    const isAr = currentLanguage === 'ar';
    const [owners, setOwners] = useState([]);
    const [form, setForm] = useState({ name: '', phone: '', email: '', bankDetails: '' });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchOwners();
    }, []);

    const fetchOwners = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/property-owners', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await res.json();
            setOwners(data);
        } catch (err) { console.error('Error fetching owners', err); }
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = editId ? `/api/property-owners/${editId}` : '/api/property-owners';
            const method = editId ? 'PUT' : 'POST';
            
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(form)
            });
            setForm({ name: '', phone: '', email: '', bankDetails: '' });
            setEditId(null);
            fetchOwners();
        } catch (err) { console.error('Error saving owner', err); }
    };

    const handleEdit = (o) => {
        setEditId(o.id);
        setForm({ name: o.name, phone: o.phone || '', email: o.email || '', bankDetails: o.bankDetails || '' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا المالك؟' : 'Are you sure you want to delete this owner?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/property-owners/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            fetchOwners();
        } catch (err) { console.error('Error deleting owner', err); }
    };

    return (
        <div className="view-container">
            <div className="header-row">
                <h2>{isAr ? 'ملاك العقارات' : 'Property Owners'}</h2>
            </div>
            
            <div className="card">
                <h3>{editId ? (isAr ? 'تعديل المالك' : 'Edit Owner') : (isAr ? 'إضافة مالك جديد' : 'Add New Owner')}</h3>
                <form onSubmit={handleCreateOrUpdate} className="inline-form">
                    <input type="text" className="form-control" placeholder={isAr ? 'اسم المالك' : 'Owner Name'} value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                    <input type="text" className="form-control" placeholder={isAr ? 'رقم الجوال' : 'Phone'} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                    <input type="email" className="form-control" placeholder={isAr ? 'البريد الإلكتروني' : 'Email'} value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    <input type="text" className="form-control" placeholder={isAr ? 'تفاصيل البنك (الايبان)' : 'Bank Details (IBAN)'} value={form.bankDetails} onChange={e => setForm({...form, bankDetails: e.target.value})} style={{ flex: '1 1 300px' }} />
                    <button type="submit" className="btn btn-primary">{isAr ? 'حفظ' : 'Save'}</button>
                    {editId && <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setForm({ name: '', phone: '', email: '', bankDetails: '' }); }}>{isAr ? 'إلغاء' : 'Cancel'}</button>}
                </form>
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>{isAr ? 'الاسم' : 'Name'}</th>
                            <th>{isAr ? 'الجوال' : 'Phone'}</th>
                            <th>{isAr ? 'البريد' : 'Email'}</th>
                            <th>{isAr ? 'البنك' : 'Bank Details'}</th>
                            <th>{isAr ? 'إجراء' : 'Action'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {owners.map(o => (
                            <tr key={o.id}>
                                <td>{o.name}</td>
                                <td>{o.phone}</td>
                                <td>{o.email}</td>
                                <td>{o.bankDetails}</td>
                                <td style={{ display: 'flex', gap: '8px' }}>
                                    <button className="btn btn-primary" onClick={() => handleEdit(o)}>{isAr ? 'تعديل' : 'Edit'}</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(o.id)}>{isAr ? 'حذف' : 'Delete'}</button>
                                </td>
                            </tr>
                        ))}
                        {owners.length === 0 && <tr><td colSpan="5">{isAr ? 'لا يوجد ملاك' : 'No owners found.'}</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PropertyOwners;
