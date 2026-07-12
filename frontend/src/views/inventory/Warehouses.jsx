import React, { useState } from 'react';

const Warehouses = ({ currentLanguage, translations, activeTab }) => {
    const [warehouses, setWarehouses] = useState([
        { id: 'W-001', name: 'Main Warehouse', location: 'Riyadh', capacity: '1000 sqm', manager: 'Ahmed' }
    ]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', location: '', capacity: '', manager: '' });

    const handleSave = (e) => {
        e.preventDefault();
        const newWH = {
            id: `W-${Date.now().toString().slice(-3)}`,
            name: form.name,
            location: form.location,
            capacity: form.capacity,
            manager: form.manager
        };
        setWarehouses([...warehouses, newWH]);
        setShowModal(false);
        setForm({ name: '', location: '', capacity: '', manager: '' });
    };

    const handleDelete = (id) => {
        if (confirm(currentLanguage === 'ar' ? 'هل أنت متأكد من حذف هذا المستودع؟' : 'Are you sure you want to delete this warehouse?')) {
            setWarehouses(warehouses.filter(w => w.id !== id));
        }
    };

    if (activeTab === 'stocktaking') {
        return (
            <div className="glass-card">
                <h3>{currentLanguage === 'ar' ? 'الجرد المخزني' : 'Stocktaking'}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{currentLanguage === 'ar' ? 'سيتم تفعيل ميزة مطابقة الجرد قريباً.' : 'Inventory reconciliation feature will be enabled soon.'}</p>
            </div>
        );
    }

    return (
        <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>{currentLanguage === 'ar' ? 'إدارة المستودعات' : 'Warehouses Management'}</h3>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <i className="ri-add-line"></i> {currentLanguage === 'ar' ? 'إضافة مستودع' : 'Add Warehouse'}
                </button>
            </div>
            
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>{currentLanguage === 'ar' ? 'الرمز' : 'ID'}</th>
                            <th>{currentLanguage === 'ar' ? 'الاسم' : 'Name'}</th>
                            <th>{currentLanguage === 'ar' ? 'الموقع' : 'Location'}</th>
                            <th>{currentLanguage === 'ar' ? 'السعة' : 'Capacity'}</th>
                            <th>{currentLanguage === 'ar' ? 'المسؤول' : 'Manager'}</th>
                            <th>{translations[currentLanguage].actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {warehouses.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>{currentLanguage === 'ar' ? 'لا توجد مستودعات' : 'No warehouses found'}</td></tr>
                        ) : (
                            warehouses.map(w => (
                                <tr key={w.id}>
                                    <td>{w.id}</td>
                                    <td>{w.name}</td>
                                    <td>{w.location}</td>
                                    <td>{w.capacity}</td>
                                    <td>{w.manager}</td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => handleDelete(w.id)}>
                                            <i className="ri-delete-bin-line"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{currentLanguage === 'ar' ? 'إضافة مستودع جديد' : 'Add New Warehouse'}</h3>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'اسم المستودع' : 'Warehouse Name'}</label>
                                <input type="text" className="form-control" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'الموقع' : 'Location'}</label>
                                <input type="text" className="form-control" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'السعة' : 'Capacity'}</label>
                                <input type="text" className="form-control" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'المسؤول' : 'Manager'}</label>
                                <input type="text" className="form-control" value={form.manager} onChange={e => setForm({ ...form, manager: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>{translations[currentLanguage].close}</button>
                                <button type="submit" className="btn btn-primary">{currentLanguage === 'ar' ? 'حفظ' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Warehouses;
