import React, { useState } from 'react';

const InventoryTransactions = ({ currentLanguage, translations }) => {
    const [transfers, setTransfers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], fromWH: '', toWH: '', item: '', qty: '' });

    const handleSave = (e) => {
        e.preventDefault();
        const newTransfer = {
            id: `TR-${Date.now().toString().slice(-6)}`,
            date: form.date,
            fromWH: form.fromWH,
            toWH: form.toWH,
            item: form.item,
            qty: form.qty
        };
        setTransfers([...transfers, newTransfer]);
        setShowModal(false);
        setForm({ date: new Date().toISOString().split('T')[0], fromWH: '', toWH: '', item: '', qty: '' });
    };

    return (
        <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>{currentLanguage === 'ar' ? 'نقل كميات المخزون' : 'Stock Transfers'}</h3>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <i className="ri-add-line"></i> {currentLanguage === 'ar' ? 'نقل جديد' : 'New Transfer'}
                </button>
            </div>
            
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>{currentLanguage === 'ar' ? 'رقم النقل' : 'Transfer #'}</th>
                            <th>{currentLanguage === 'ar' ? 'التاريخ' : 'Date'}</th>
                            <th>{currentLanguage === 'ar' ? 'من مستودع' : 'From Warehouse'}</th>
                            <th>{currentLanguage === 'ar' ? 'إلى مستودع' : 'To Warehouse'}</th>
                            <th>{currentLanguage === 'ar' ? 'المنتج' : 'Item'}</th>
                            <th>{currentLanguage === 'ar' ? 'الكمية' : 'Qty'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transfers.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>{currentLanguage === 'ar' ? 'لا توجد حركات نقل' : 'No transfers found'}</td></tr>
                        ) : (
                            transfers.map(t => (
                                <tr key={t.id}>
                                    <td>{t.id}</td>
                                    <td>{t.date}</td>
                                    <td>{t.fromWH}</td>
                                    <td>{t.toWH}</td>
                                    <td>{t.item}</td>
                                    <td>{t.qty}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{currentLanguage === 'ar' ? 'نقل كمية جديد' : 'New Stock Transfer'}</h3>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'التاريخ' : 'Date'}</label>
                                <input type="date" className="form-control" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'من مستودع' : 'From Warehouse'}</label>
                                <input type="text" className="form-control" required value={form.fromWH} onChange={e => setForm({ ...form, fromWH: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'إلى مستودع' : 'To Warehouse'}</label>
                                <input type="text" className="form-control" required value={form.toWH} onChange={e => setForm({ ...form, toWH: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'المنتج' : 'Product'}</label>
                                <input type="text" className="form-control" required value={form.item} onChange={e => setForm({ ...form, item: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'الكمية' : 'Quantity'}</label>
                                <input type="number" className="form-control" required min="1" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} />
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

export default InventoryTransactions;
