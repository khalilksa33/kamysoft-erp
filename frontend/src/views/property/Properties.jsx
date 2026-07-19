import React, { useState, useEffect } from 'react';
import '../../index.css';

const Properties = ({ currentLanguage }) => {
    const isAr = currentLanguage === 'ar';
    const [properties, setProperties] = useState([]);
    const [owners, setOwners] = useState([]);
    const [name, setName] = useState('');
    const [type, setType] = useState('Resort');
    const [location, setLocation] = useState('');
    const [ownerId, setOwnerId] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchProperties();
        fetchOwners();
    }, []);

    const fetchProperties = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/properties', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await res.json();
            if (Array.isArray(data)) setProperties(data);
            else setProperties([]);
        } catch (err) { console.error('Error fetching properties', err); }
    };

    const fetchOwners = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/property-owners', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await res.json();
            if (Array.isArray(data)) setOwners(data);
            else setOwners([]);
        } catch (err) { console.error('Error fetching owners', err); }
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = editId ? `/api/properties/${editId}` : '/api/properties';
            const method = editId ? 'PUT' : 'POST';
            
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ name, type, location, ownerId })
            });
            if (!res.ok) {
                const text = await res.text();
                alert(`Error saving property: ${res.status} ${text}`);
                return;
            }
            setName('');
            setLocation('');
            setOwnerId('');
            setEditId(null);
            fetchProperties();
        } catch (err) { 
            console.error('Error saving property', err);
            alert(`Network error saving property: ${err.message}`);
        }
    };

    const handleEdit = (p) => {
        setEditId(p.id);
        setName(p.name);
        setType(p.type);
        setLocation(p.location || '');
        setOwnerId(p.ownerId || '');
    };

    const handleDelete = async (id) => {
        if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا العقار وجميع وحداته؟' : 'Delete this property and all its units?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/properties/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            fetchProperties();
        } catch (err) { console.error('Error deleting property', err); }
    };

    const getOwnerName = (id) => {
        const owner = owners.find(o => o.id === id);
        return owner ? owner.name : (isAr ? 'مملوك للشركة' : 'Company Owned');
    };

    return (
        <div className="view-container">
            <div className="header-row">
                <h2>{isAr ? 'إدارة العقارات' : 'Manage Properties'}</h2>
            </div>
            
            <div className="card">
                <h3>{editId ? (isAr ? 'تعديل العقار' : 'Edit Property') : (isAr ? 'إضافة عقار جديد' : 'Add New Property')}</h3>
                <form onSubmit={handleCreateOrUpdate} className="inline-form">
                    <input type="text" className="form-control" placeholder={isAr ? 'اسم العقار' : 'Property Name'} value={name} onChange={e => setName(e.target.value)} required />
                    <select className="form-control" value={type} onChange={e => setType(e.target.value)}>
                        <option value="Resort">{isAr ? 'منتجع' : 'Resort'}</option>
                        <option value="Building">{isAr ? 'مبنى' : 'Building'}</option>
                        <option value="Hotel">{isAr ? 'فندق' : 'Hotel'}</option>
                        <option value="Compound">{isAr ? 'مجمع' : 'Compound'}</option>
                    </select>
                    <input type="text" className="form-control" placeholder={isAr ? 'الموقع' : 'Location'} value={location} onChange={e => setLocation(e.target.value)} />
                    
                    <select className="form-control" value={ownerId} onChange={e => setOwnerId(e.target.value)}>
                        <option value="">{isAr ? '-- مملوك للشركة --' : '-- Company Owned --'}</option>
                        {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </select>
                    <button type="submit" className="btn btn-primary">{isAr ? 'حفظ' : 'Save'}</button>
                    {editId && <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setName(''); setLocation(''); setOwnerId(''); }}>{isAr ? 'إلغاء' : 'Cancel'}</button>}
                </form>
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>{isAr ? 'الاسم' : 'Name'}</th>
                            <th>{isAr ? 'النوع' : 'Type'}</th>
                            <th>{isAr ? 'الموقع' : 'Location'}</th>
                            <th>{isAr ? 'المالك' : 'Owner'}</th>
                            <th>{isAr ? 'الحالة' : 'Status'}</th>
                            <th>{isAr ? 'إجراء' : 'Action'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map(p => (
                            <tr key={p.id}>
                                <td>{p.name}</td>
                                <td>{p.type}</td>
                                <td>{p.location}</td>
                                <td>{getOwnerName(p.ownerId)}</td>
                                <td>{p.status}</td>
                                <td style={{ display: 'flex', gap: '8px' }}>
                                    <button className="btn btn-primary" onClick={() => handleEdit(p)}>{isAr ? 'تعديل' : 'Edit'}</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>{isAr ? 'حذف' : 'Delete'}</button>
                                </td>
                            </tr>
                        ))}
                        {properties.length === 0 && <tr><td colSpan="6">{isAr ? 'لا يوجد عقارات' : 'No properties found.'}</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Properties;
