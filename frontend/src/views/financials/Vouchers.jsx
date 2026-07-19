import React, { useState, useEffect } from 'react';

const Vouchers = ({ currentLanguage, translations, formatCurrency, activeTab }) => {
    const [vouchers, setVouchers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const isReceipt = activeTab === 'receiptVoucher';
    const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], payee: '', amount: '', description: '', method: 'Cash' });

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/vouchers', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await res.json();
            if (Array.isArray(data)) setVouchers(data);
        } catch (err) {
            console.error('Error fetching vouchers:', err);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const newVoucher = {
            type: isReceipt ? 'RECEIPT' : 'PAYMENT',
            date: form.date,
            entityType: 'OTHER',
            entityId: form.payee, // Mapping payee to entityId loosely here
            amount: parseFloat(form.amount) || 0,
            method: form.method,
            description: form.description
        };
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/vouchers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(newVoucher)
            });
            if (res.ok) {
                fetchVouchers();
                setShowModal(false);
                setForm({ date: new Date().toISOString().split('T')[0], payee: '', amount: '', description: '', method: 'Cash' });
            } else {
                alert('Error saving voucher');
            }
        } catch (err) {
            alert('Error saving voucher');
        }
    };

    const handleDelete = async (id) => {
        if (confirm(currentLanguage === 'ar' ? 'هل أنت متأكد من حذف هذا السند؟' : 'Are you sure you want to delete this voucher?')) {
            try {
                const token = localStorage.getItem('token');
                await fetch(`/api/vouchers/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                fetchVouchers();
            } catch (err) {
                alert('Error deleting voucher');
            }
        }
    };

    const filteredVouchers = vouchers.filter(v => v.type === (isReceipt ? 'RECEIPT' : 'PAYMENT'));

    return (
        <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>{isReceipt ? (currentLanguage === 'ar' ? 'سندات القبض' : 'Receipt Vouchers') : (currentLanguage === 'ar' ? 'سندات الصرف' : 'Payment Vouchers')}</h3>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <i className="ri-add-line"></i> {currentLanguage === 'ar' ? 'إضافة سند' : 'Add Voucher'}
                </button>
            </div>
            
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>{currentLanguage === 'ar' ? 'رقم السند' : 'Voucher #'}</th>
                            <th>{currentLanguage === 'ar' ? 'التاريخ' : 'Date'}</th>
                            <th>{isReceipt ? (currentLanguage === 'ar' ? 'مستلم من' : 'Received From') : (currentLanguage === 'ar' ? 'يصرف إلى' : 'Pay To')}</th>
                            <th>{currentLanguage === 'ar' ? 'المبلغ' : 'Amount'}</th>
                            <th>{currentLanguage === 'ar' ? 'البيان' : 'Description'}</th>
                            <th>{translations[currentLanguage].actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVouchers.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>{currentLanguage === 'ar' ? 'لا توجد سندات' : 'No vouchers found'}</td></tr>
                        ) : (
                            filteredVouchers.map(v => (
                                <tr key={v.voucherId}>
                                    <td>{v.voucherId}</td>
                                    <td>{new Date(v.date).toISOString().split('T')[0]}</td>
                                    <td>{v.entityId || '-'}</td>
                                    <td style={{ fontWeight: 'bold' }}>{formatCurrency(v.amount)}</td>
                                    <td>{v.description}</td>
                                    <td>
                                        <button className="btn btn-danger btn-icon" onClick={() => handleDelete(v.voucherId)} title={currentLanguage === 'ar' ? 'حذف' : 'Delete'}>
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
                        <h3>{currentLanguage === 'ar' ? 'إضافة سند جديد' : 'Add New Voucher'}</h3>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'التاريخ' : 'Date'}</label>
                                <input type="date" className="form-control" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{isReceipt ? (currentLanguage === 'ar' ? 'مستلم من' : 'Received From') : (currentLanguage === 'ar' ? 'يصرف إلى' : 'Pay To')}</label>
                                <input type="text" className="form-control" required value={form.payee} onChange={e => setForm({ ...form, payee: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'المبلغ' : 'Amount'}</label>
                                <input type="number" step="0.01" className="form-control" required value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'البيان' : 'Description'}</label>
                                <input type="text" className="form-control" required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
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

export default Vouchers;
