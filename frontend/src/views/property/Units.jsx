import React, { useState, useEffect } from 'react';
import '../../index.css';

const Units = ({ currentLanguage }) => {
    const isAr = currentLanguage === 'ar';
    const [units, setUnits] = useState([]);
    const [properties, setProperties] = useState([]);
    const [propertyId, setPropertyId] = useState('');
    const [unitNumber, setUnitNumber] = useState('');
    const [type, setType] = useState('Room');
    const [beds, setBeds] = useState(1);
    const [dailyRate, setDailyRate] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [propRes, unitRes] = await Promise.all([
                fetch('/api/properties', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/units', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            const propData = await propRes.json();
            const unitData = await unitRes.json();
            if (Array.isArray(propData)) { setProperties(propData); if (propData.length > 0) setPropertyId(propData[0].id); } else setProperties([]);
            if (Array.isArray(unitData)) setUnits(unitData); else setUnits([]);
        } catch (err) { console.error('Error fetching data', err); }
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = editId ? `/api/units/${editId}` : '/api/units';
            const method = editId ? 'PUT' : 'POST';

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ propertyId, unitNumber, type, beds: Number(beds), dailyRate: Number(dailyRate) })
            });
            setUnitNumber('');
            setBeds(1);
            setDailyRate('');
            setEditId(null);
            fetchData();
        } catch (err) { console.error('Error saving unit', err); }
    };

    const handleEdit = (u) => {
        setEditId(u.id);
        setPropertyId(u.propertyId);
        setUnitNumber(u.unitNumber);
        setType(u.type);
        setBeds(u.beds);
        setDailyRate(u.dailyRate);
    };

    const handleDelete = async (id) => {
        if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذه الوحدة؟' : 'Delete this unit?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/units/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            fetchData();
        } catch (err) { console.error('Error deleting unit', err); }
    };

    return (
        <div className="view-container">
            <div className="header-row">
                <h2>{isAr ? 'إدارة الوحدات' : 'Manage Units'}</h2>
            </div>
            
            <div className="card">
                <h3>{editId ? (isAr ? 'تعديل الوحدة' : 'Edit Unit') : (isAr ? 'إضافة وحدة جديدة' : 'Add New Unit')}</h3>
                <form onSubmit={handleCreateOrUpdate} className="inline-form">
                    <select className="form-control" value={propertyId} onChange={e => setPropertyId(e.target.value)} required>
                        <option value="" disabled>{isAr ? 'اختر العقار' : 'Select Property'}</option>
                        {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <input type="text" className="form-control" placeholder={isAr ? 'رقم الوحدة (مثال 101)' : 'Unit Number (e.g. 101)'} value={unitNumber} onChange={e => setUnitNumber(e.target.value)} required />
                    <select className="form-control" value={type} onChange={e => setType(e.target.value)}>
                        <option value="Room">{isAr ? 'غرفة' : 'Room'}</option>
                        <option value="Suite">{isAr ? 'جناح' : 'Suite'}</option>
                        <option value="Apartment">{isAr ? 'شقة' : 'Apartment'}</option>
                        <option value="Villa">{isAr ? 'فيلا' : 'Villa'}</option>
                    </select>
                    <input type="number" className="form-control" placeholder={isAr ? 'الأسرة' : 'Beds'} value={beds} onChange={e => setBeds(e.target.value)} required min="1" />
                    <input type="number" className="form-control" placeholder={isAr ? 'السعر اليومي' : 'Daily Rate'} value={dailyRate} onChange={e => setDailyRate(e.target.value)} required min="0" step="0.01" />
                    <button type="submit" className="btn btn-primary">{isAr ? 'حفظ' : 'Save'}</button>
                    {editId && <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setUnitNumber(''); setBeds(1); setDailyRate(''); }}>{isAr ? 'إلغاء' : 'Cancel'}</button>}
                </form>
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>{isAr ? 'العقار' : 'Property'}</th>
                            <th>{isAr ? 'رقم الوحدة' : 'Unit #'}</th>
                            <th>{isAr ? 'النوع' : 'Type'}</th>
                            <th>{isAr ? 'الأسرة' : 'Beds'}</th>
                            <th>{isAr ? 'السعر اليومي' : 'Daily Rate'}</th>
                            <th>{isAr ? 'الحالة' : 'Status'}</th>
                            <th>{isAr ? 'إجراء' : 'Action'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {units.map(u => {
                            const prop = properties.find(p => p.id === u.propertyId);
                            return (
                                <tr key={u.id}>
                                    <td>{prop ? prop.name : (isAr ? 'غير معروف' : 'Unknown')}</td>
                                    <td>{u.unitNumber}</td>
                                    <td>{u.type}</td>
                                    <td>{u.beds}</td>
                                    <td>{u.dailyRate}</td>
                                    <td>
                                        <span className={`status-badge ${u.status.toLowerCase()}`}>{u.status}</span>
                                    </td>
                                    <td style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn btn-primary" onClick={() => handleEdit(u)}>{isAr ? 'تعديل' : 'Edit'}</button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(u.id)}>{isAr ? 'حذف' : 'Delete'}</button>
                                    </td>
                                </tr>
                            )
                        })}
                        {units.length === 0 && <tr><td colSpan="7">{isAr ? 'لا يوجد وحدات' : 'No units found.'}</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Units;
