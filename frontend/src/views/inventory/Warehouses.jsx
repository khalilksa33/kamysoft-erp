import React, { useState } from 'react';

const Warehouses = (props) => {
    const { currentLanguage, translations, activeTab } = props;
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
        const inventory = props.products || [];
        return (
            <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>{currentLanguage === 'ar' ? 'الجرد المخزني' : 'Stocktaking'}</h3>
                    <button className="btn btn-secondary" onClick={() => window.print()}>
                        <i className="ri-printer-line"></i> {currentLanguage === 'ar' ? 'طباعة' : 'Print'}
                    </button>
                </div>
                {inventory.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>{currentLanguage === 'ar' ? 'لا توجد منتجات مسجلة' : 'No products found'}</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>{currentLanguage === 'ar' ? 'رمز المنتج' : 'Item Code'}</th>
                                <th>{currentLanguage === 'ar' ? 'المنتج' : 'Product'}</th>
                                <th style={{ textAlign: 'center' }}>{currentLanguage === 'ar' ? 'رصيد النظام' : 'System Stock'}</th>
                                <th style={{ textAlign: 'center' }}>{currentLanguage === 'ar' ? 'الرصيد الفعلي' : 'Physical Count'}</th>
                                <th style={{ textAlign: 'center' }}>{currentLanguage === 'ar' ? 'الفروقات' : 'Variance'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map(item => (
                                <tr key={item.id}>
                                    <td>{item.barcode || item.id}</td>
                                    <td>{currentLanguage === 'ar' ? (item.nameAR || item.name) : (item.nameEN || item.name)}</td>
                                    <td style={{ textAlign: 'center' }}>{item.stock}</td>
                                    <td style={{ textAlign: 'center' }}><input type="number" className="form-control" style={{ width: '80px', margin: '0 auto', textAlign: 'center' }} placeholder="0" /></td>
                                    <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>-</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
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
