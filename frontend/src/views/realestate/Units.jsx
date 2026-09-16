import React, { useState, useEffect } from 'react';

const Units = ({ currentLanguage }) => {
    const isAr = currentLanguage === 'ar';
    const [units, setUnits] = useState([]);
    const [properties, setProperties] = useState([]);
    const [propertyId, setPropertyId] = useState('');
    const [unitNumber, setUnitNumber] = useState('');
    const [type, setType] = useState('Room');
    const [roomType, setRoomType] = useState('Deluxe');
    const [beds, setBeds] = useState(1);
    const [maxAdults, setMaxAdults] = useState(2);
    const [maxChildren, setMaxChildren] = useState(1);
    const [floor, setFloor] = useState('1');
    const [dailyRate, setDailyRate] = useState('');
    const [cleaningStatus, setCleaningStatus] = useState('Clean');
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
            if (Array.isArray(propData)) {
                setProperties(propData);
                if (propData.length > 0 && !propertyId) setPropertyId(propData[0].id);
            } else setProperties([]);
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
                body: JSON.stringify({
                    propertyId, unitNumber, type, roomType,
                    beds: Number(beds), maxAdults: Number(maxAdults), maxChildren: Number(maxChildren),
                    floor, dailyRate: Number(dailyRate), cleaningStatus
                })
            });
            resetForm();
            fetchData();
        } catch (err) { console.error('Error saving unit', err); }
    };

    const resetForm = () => {
        setUnitNumber('');
        setType('Room');
        setRoomType('Deluxe');
        setBeds(1);
        setMaxAdults(2);
        setMaxChildren(1);
        setFloor('1');
        setDailyRate('');
        setCleaningStatus('Clean');
        setEditId(null);
    };

    const handleEdit = (u) => {
        setEditId(u.id);
        setPropertyId(u.propertyId);
        setUnitNumber(u.unitNumber);
        setType(u.type);
        setRoomType(u.roomType || 'Deluxe');
        setBeds(u.beds || 1);
        setMaxAdults(u.maxAdults || 2);
        setMaxChildren(u.maxChildren || 1);
        setFloor(u.floor || '1');
        setDailyRate(u.dailyRate);
        setCleaningStatus(u.cleaningStatus || 'Clean');
    };

    const handleDelete = async (id) => {
        if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذه الغرفة/الوحدة؟' : 'Delete this room/unit?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/units/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            fetchData();
        } catch (err) { console.error('Error deleting unit', err); }
    };

    const updateCleaning = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/realestate/units/${id}/cleaning-status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ cleaningStatus: status })
            });
            setUnits(units.map(u => u.id === id ? { ...u, cleaningStatus: status } : u));
        } catch (err) { console.error(err); }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                        <i className="ri-door-open-line" style={{ color: 'var(--accent-purple)', marginRight: isAr ? '0' : '8px', marginLeft: isAr ? '8px' : '0' }}></i>
                        {isAr ? 'إدارة الغرف والوحدات الفندقية' : 'Rooms & Units Inventory'}
                    </h2>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        {isAr ? 'تهيئة أنواع الغرف، سعة النزلاء (بالغين وأطفال)، الأسعار اليومية، وحالة النظافة (مواصفات QloApps)' : 'Configure room types, guest occupancy (adults & children), daily rates, and housekeeping status (QloApps Specs)'}
                    </p>
                </div>
            </div>

            <div className="glass-card">
                <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>
                    {editId ? (isAr ? 'تعديل الغرفة/الوحدة' : 'Edit Room / Unit') : (isAr ? 'إضافة غرفة / وحدة فندقية جديدة' : 'Add New Room / Unit')}
                </h3>
                <form onSubmit={handleCreateOrUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'الفندق / العقار' : 'Property / Hotel'}</label>
                            <select className="form-control" value={propertyId} onChange={e => setPropertyId(e.target.value)} required>
                                <option value="" disabled>{isAr ? 'اختر العقار' : 'Select Property'}</option>
                                {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'رقم الغرفة / الوحدة' : 'Room / Unit Number'}</label>
                            <input type="text" className="form-control" placeholder={isAr ? 'مثال: 101 أو Villa-4' : 'e.g. 101, Suite-302'} value={unitNumber} onChange={e => setUnitNumber(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'تصنيف الوحدة' : 'Category'}</label>
                            <select className="form-control" value={type} onChange={e => setType(e.target.value)}>
                                <option value="Room">{isAr ? 'غرفة فندقية (Room)' : 'Hotel Room'}</option>
                                <option value="Suite">{isAr ? 'جناح فندقي (Suite)' : 'Suite'}</option>
                                <option value="Apartment">{isAr ? 'شقة مفروشة (Apartment)' : 'Apartment'}</option>
                                <option value="Villa">{isAr ? 'فيلا خاصة (Villa)' : 'Villa'}</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'نوع الغرفة (QloApps Type)' : 'Room Type'}</label>
                            <select className="form-control" value={roomType} onChange={e => setRoomType(e.target.value)}>
                                <option value="Standard">{isAr ? 'قياسية (Standard)' : 'Standard'}</option>
                                <option value="Deluxe">{isAr ? 'ديلوكس فاخرة (Deluxe)' : 'Deluxe'}</option>
                                <option value="Executive">{isAr ? 'تنفيذية (Executive)' : 'Executive'}</option>
                                <option value="Presidential">{isAr ? 'رئاسية (Presidential Suite)' : 'Presidential Suite'}</option>
                                <option value="Royal Villa">{isAr ? 'فيلا ملكية (Royal Villa)' : 'Royal Villa'}</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'أقصى عدد بالغين' : 'Max Adults'}</label>
                            <input type="number" className="form-control" min="1" value={maxAdults} onChange={e => setMaxAdults(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'أقصى عدد أطفال' : 'Max Children'}</label>
                            <input type="number" className="form-control" min="0" value={maxChildren} onChange={e => setMaxChildren(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'عدد الأسرة' : 'Beds Count'}</label>
                            <input type="number" className="form-control" min="1" value={beds} onChange={e => setBeds(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'الدور / الطابق' : 'Floor'}</label>
                            <input type="text" className="form-control" value={floor} onChange={e => setFloor(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'السعر اليومي (ر.س)' : 'Daily Rate (SAR)'}</label>
                            <input type="number" className="form-control" min="0" step="0.01" placeholder="0.00" value={dailyRate} onChange={e => setDailyRate(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'حالة النظافة (Housekeeping)' : 'Cleaning Status'}</label>
                            <select className="form-control" value={cleaningStatus} onChange={e => setCleaningStatus(e.target.value)}>
                                <option value="Clean">{isAr ? 'نظيفة وجاهزة (Clean)' : 'Clean'}</option>
                                <option value="Dirty">{isAr ? 'تحتاج تنظيف (Dirty)' : 'Dirty'}</option>
                                <option value="Inspecting">{isAr ? 'قيد المعاينة (Inspecting)' : 'Inspecting'}</option>
                                <option value="OutOfService">{isAr ? 'خارج الخدمة (Out of Service)' : 'Out of Service'}</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                        <button type="submit" className="btn btn-primary">
                            <i className="ri-save-line"></i> {isAr ? 'حفظ الغرفة' : 'Save Room / Unit'}
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
                    <i className="ri-hotel-bed-line" style={{ color: 'var(--accent-cyan)', marginRight: '6px' }}></i>
                    {isAr ? 'جدول الغرف والوحدات' : 'Rooms & Units Inventory List'}
                </h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>{isAr ? 'الغرفة' : 'Room #'}</th>
                                <th>{isAr ? 'الفندق / العقار' : 'Property'}</th>
                                <th>{isAr ? 'النوع والطابق' : 'Type & Floor'}</th>
                                <th>{isAr ? 'السعة (بالغين/أطفال)' : 'Capacity'}</th>
                                <th style={{ textAlign: 'right' }}>{isAr ? 'السعر اليومي' : 'Daily Rate'}</th>
                                <th style={{ textAlign: 'center' }}>{isAr ? 'حالة الإشغال' : 'Occupancy'}</th>
                                <th style={{ textAlign: 'center' }}>{isAr ? 'النظافة (Housekeeping)' : 'Cleaning'}</th>
                                <th>{isAr ? 'إجراءات' : 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {units.map(u => {
                                const prop = properties.find(p => p.id === u.propertyId);
                                return (
                                    <tr key={u.id}>
                                        <td>
                                            <div style={{ fontWeight: 'bold' }}>#{u.unitNumber}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{u.roomType || 'Deluxe'}</div>
                                        </td>
                                        <td>{prop ? prop.name : (isAr ? 'غير محدد' : 'N/A')}</td>
                                        <td>
                                            <div>{u.type}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{isAr ? `الطابق ${u.floor || 1}` : `Floor ${u.floor || 1}`}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '12px' }}>
                                                <i className="ri-user-line" title="Adults"></i> {u.maxAdults || 2} | 
                                                <i className="ri-parent-line" style={{ marginLeft: '4px' }} title="Children"></i> {u.maxChildren || 0}
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                                            {Number(u.dailyRate).toFixed(2)} SAR
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className={`status-badge ${u.status === 'Available' ? 'valid' : u.status === 'Occupied' ? 'warning' : 'danger'}`}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <select
                                                className="form-control"
                                                style={{
                                                    fontSize: '11px', padding: '2px 6px', height: '26px', display: 'inline-block', width: 'auto',
                                                    color: u.cleaningStatus === 'Clean' ? 'var(--accent-success)' : u.cleaningStatus === 'Dirty' ? 'var(--accent-danger)' : 'var(--accent-gold)'
                                                }}
                                                value={u.cleaningStatus || 'Clean'}
                                                onChange={(e) => updateCleaning(u.id, e.target.value)}
                                            >
                                                <option value="Clean">🟢 {isAr ? 'نظيفة Clean' : 'Clean'}</option>
                                                <option value="Dirty">🔴 {isAr ? 'متسخة Dirty' : 'Dirty'}</option>
                                                <option value="Inspecting">🟡 {isAr ? 'معاينة Inspect' : 'Inspecting'}</option>
                                                <option value="OutOfService">⚪ {isAr ? 'صيانة OOO' : 'Out of Order'}</option>
                                            </select>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleEdit(u)}>
                                                    <i className="ri-edit-line"></i>
                                                </button>
                                                <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleDelete(u.id)}>
                                                    <i className="ri-delete-bin-line"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {units.length === 0 && (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                                        {isAr ? 'لا توجد غرف أو وحدات مسجلة' : 'No rooms or units found.'}
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

export default Units;
