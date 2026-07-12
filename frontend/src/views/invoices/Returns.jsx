import React, { useState } from 'react';

const Returns = ({ currentLanguage, translations, formatCurrency, activeTab }) => {
    const [returns, setReturns] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const isSalesReturn = activeTab === 'salesReturn';
    const [form, setForm] = useState({ invoiceId: '', date: new Date().toISOString().split('T')[0], amount: '', reason: '' });

    const handleSave = (e) => {
        e.preventDefault();
        const newReturn = {
            id: `RET-${Date.now().toString().slice(-6)}`,
            type: isSalesReturn ? 'Sales Return' : 'Purchase Return',
            invoiceId: form.invoiceId,
            date: form.date,
            amount: parseFloat(form.amount) || 0,
            reason: form.reason
        };
        setReturns([...returns, newReturn]);
        setShowModal(false);
        setForm({ invoiceId: '', date: new Date().toISOString().split('T')[0], amount: '', reason: '' });
    };

    const handleDelete = (id) => {
        if (confirm(currentLanguage === 'ar' ? 'هل أنت متأكد من حذف هذا المرتجع؟' : 'Are you sure you want to delete this return?')) {
            setReturns(returns.filter(r => r.id !== id));
        }
    };

    const filteredReturns = returns.filter(r => r.type === (isSalesReturn ? 'Sales Return' : 'Purchase Return'));

    return (
        <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>{isSalesReturn ? (currentLanguage === 'ar' ? 'مرتجعات المبيعات' : 'Sales Returns') : (currentLanguage === 'ar' ? 'مرتجعات المشتريات' : 'Purchase Returns')}</h3>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <i className="ri-add-line"></i> {currentLanguage === 'ar' ? 'إضافة مرتجع' : 'Add Return'}
                </button>
            </div>
            
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>{currentLanguage === 'ar' ? 'رقم المرتجع' : 'Return #'}</th>
                            <th>{currentLanguage === 'ar' ? 'التاريخ' : 'Date'}</th>
                            <th>{currentLanguage === 'ar' ? 'رقم الفاتورة الأصلية' : 'Original Invoice #'}</th>
                            <th>{currentLanguage === 'ar' ? 'السبب' : 'Reason'}</th>
                            <th>{currentLanguage === 'ar' ? 'المبلغ المسترجع' : 'Refund Amount'}</th>
                            <th>{translations[currentLanguage].actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReturns.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>{currentLanguage === 'ar' ? 'لا توجد مرتجعات' : 'No returns found'}</td></tr>
                        ) : (
                            filteredReturns.map(r => (
                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                    <td>{r.date}</td>
                                    <td>{r.invoiceId}</td>
                                    <td>{r.reason}</td>
                                    <td style={{ fontWeight: 'bold', color: 'var(--accent-danger)' }}>{formatCurrency(r.amount)}</td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => handleDelete(r.id)}>
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
                        <h3>{currentLanguage === 'ar' ? 'إضافة مرتجع جديد' : 'Add New Return'}</h3>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'رقم الفاتورة الأصلية' : 'Original Invoice #'}</label>
                                <input type="text" className="form-control" required value={form.invoiceId} onChange={e => setForm({ ...form, invoiceId: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'التاريخ' : 'Date'}</label>
                                <input type="date" className="form-control" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'السبب' : 'Reason'}</label>
                                <input type="text" className="form-control" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'المبلغ المسترجع' : 'Refund Amount'}</label>
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

export default Returns;
