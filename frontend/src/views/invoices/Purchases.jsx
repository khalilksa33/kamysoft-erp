import React, { useState } from 'react';

const Purchases = ({ currentLanguage, translations, formatCurrency }) => {
    const [purchases, setPurchases] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ supplier: '', date: new Date().toISOString().split('T')[0], amount: '', reference: '' });

    const handleSave = (e) => {
        e.preventDefault();
        const newPurchase = {
            id: `PO-${Date.now().toString().slice(-6)}`,
            supplier: form.supplier,
            date: form.date,
            amount: parseFloat(form.amount) || 0,
            reference: form.reference
        };
        setPurchases([...purchases, newPurchase]);
        setShowModal(false);
        setForm({ supplier: '', date: new Date().toISOString().split('T')[0], amount: '', reference: '' });
    };

    const handleDelete = (id) => {
        if (confirm(currentLanguage === 'ar' ? 'هل أنت متأكد من حذف هذه الفاتورة؟' : 'Are you sure you want to delete this purchase invoice?')) {
            setPurchases(purchases.filter(p => p.id !== id));
        }
    };

    return (
        <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>{currentLanguage === 'ar' ? 'فواتير المشتريات' : 'Purchase Invoices'}</h3>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <i className="ri-add-line"></i> {currentLanguage === 'ar' ? 'إضافة فاتورة مشتريات' : 'Add Purchase Invoice'}
                </button>
            </div>
            
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>{currentLanguage === 'ar' ? 'رقم الفاتورة' : 'Invoice #'}</th>
                            <th>{currentLanguage === 'ar' ? 'التاريخ' : 'Date'}</th>
                            <th>{currentLanguage === 'ar' ? 'المورد' : 'Supplier'}</th>
                            <th>{currentLanguage === 'ar' ? 'المرجع' : 'Reference'}</th>
                            <th>{currentLanguage === 'ar' ? 'المبلغ الإجمالي' : 'Total Amount'}</th>
                            <th>{translations[currentLanguage].actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>{currentLanguage === 'ar' ? 'لا توجد بيانات' : 'No data available'}</td></tr>
                        ) : (
                            purchases.map(p => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.date}</td>
                                    <td>{p.supplier}</td>
                                    <td>{p.reference}</td>
                                    <td style={{ fontWeight: 'bold' }}>{formatCurrency(p.amount)}</td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>
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
                        <h3>{currentLanguage === 'ar' ? 'إضافة فاتورة مشتريات' : 'Add Purchase Invoice'}</h3>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'المورد' : 'Supplier'}</label>
                                <input type="text" className="form-control" required value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'التاريخ' : 'Date'}</label>
                                <input type="date" className="form-control" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'الرقم المرجعي' : 'Reference Number'}</label>
                                <input type="text" className="form-control" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'المبلغ الإجمالي' : 'Total Amount'}</label>
                                <input type="number" step="0.01" className="form-control" required value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
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

export default Purchases;
