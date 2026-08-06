import React, { useState, useEffect } from 'react';

const Vouchers = ({ currentLanguage, translations, formatCurrency, activeTab }) => {
    const [vouchers, setVouchers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const isReceipt = activeTab === 'receiptVoucher';
    const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], payee: '', amount: '', description: '', method: 'Cash' });
    const [editingId, setEditingId] = useState(null);
    const [viewVoucher, setViewVoucher] = useState(null);
    const [printVoucher, setPrintVoucher] = useState(null);

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
            let res;
            if (editingId) {
                res = await fetch(`/api/vouchers/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(newVoucher)
                });
            } else {
                res = await fetch('/api/vouchers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(newVoucher)
                });
            }
            if (res.ok) {
                fetchVouchers();
                setShowModal(false);
                setEditingId(null);
                setForm({ date: new Date().toISOString().split('T')[0], payee: '', amount: '', description: '', method: 'Cash' });
            } else {
                let errMsg = 'Error saving voucher';
                try {
                    const errData = await res.json();
                    if (errData.error) errMsg = `Error: ${errData.error}`;
                } catch(e) {}
                alert(errMsg);
            }
        } catch (err) {
            alert(`Error saving voucher: ${err.message}`);
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
                <button className="btn btn-primary" onClick={() => { setEditingId(null); setForm({ date: new Date().toISOString().split('T')[0], payee: '', amount: '', description: '', method: 'Cash' }); setShowModal(true); }}>
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
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="btn btn-info btn-icon" onClick={() => setViewVoucher(v)} title={currentLanguage === 'ar' ? 'عرض' : 'View'}>
                                                <i className="ri-eye-line"></i>
                                            </button>
                                            <button className="btn btn-warning btn-icon" onClick={() => {
                                                setEditingId(v.voucherId);
                                                setForm({
                                                    date: new Date(v.date).toISOString().split('T')[0],
                                                    payee: v.entityId || '',
                                                    amount: v.amount,
                                                    description: v.description,
                                                    method: v.method || 'Cash'
                                                });
                                                setShowModal(true);
                                            }} title={currentLanguage === 'ar' ? 'تعديل' : 'Edit'}>
                                                <i className="ri-edit-line"></i>
                                            </button>
                                            <button className="btn btn-secondary btn-icon" onClick={() => setPrintVoucher(v)} title={currentLanguage === 'ar' ? 'طباعة' : 'Print'}>
                                                <i className="ri-printer-line"></i>
                                            </button>
                                            <button className="btn btn-danger btn-icon" onClick={() => handleDelete(v.voucherId)} title={currentLanguage === 'ar' ? 'حذف' : 'Delete'}>
                                                <i className="ri-delete-bin-line"></i>
                                            </button>
                                        </div>
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
                        <h3>{editingId ? (currentLanguage === 'ar' ? 'تعديل السند' : 'Edit Voucher') : (currentLanguage === 'ar' ? 'إضافة سند جديد' : 'Add New Voucher')}</h3>
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
                                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setEditingId(null); }}>{translations[currentLanguage].close}</button>
                                <button type="submit" className="btn btn-primary">{currentLanguage === 'ar' ? 'حفظ' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {viewVoucher && (
                <div className="modal-overlay">
                    <div className="modal" style={{ maxWidth: '500px' }}>
                        <h3>{isReceipt ? (currentLanguage === 'ar' ? 'تفاصيل سند القبض' : 'Receipt Voucher Details') : (currentLanguage === 'ar' ? 'تفاصيل سند الصرف' : 'Payment Voucher Details')}</h3>
                        <div style={{ marginTop: '20px', lineHeight: '1.8' }}>
                            <p><strong>{currentLanguage === 'ar' ? 'رقم السند:' : 'Voucher #:'}</strong> {viewVoucher.voucherId}</p>
                            <p><strong>{currentLanguage === 'ar' ? 'التاريخ:' : 'Date:'}</strong> {new Date(viewVoucher.date).toLocaleDateString()}</p>
                            <p><strong>{isReceipt ? (currentLanguage === 'ar' ? 'مستلم من:' : 'Received From:') : (currentLanguage === 'ar' ? 'يصرف إلى:' : 'Pay To:')}</strong> {viewVoucher.entityId}</p>
                            <p><strong>{currentLanguage === 'ar' ? 'المبلغ:' : 'Amount:'}</strong> {formatCurrency(viewVoucher.amount)}</p>
                            <p><strong>{currentLanguage === 'ar' ? 'طريقة الدفع:' : 'Method:'}</strong> {viewVoucher.method || 'Cash'}</p>
                            <p><strong>{currentLanguage === 'ar' ? 'البيان:' : 'Description:'}</strong> {viewVoucher.description}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <button className="btn btn-secondary" onClick={() => setViewVoucher(null)}>{translations[currentLanguage].close}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Print Modal */}
            {printVoucher && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="print-area" style={{ padding: '40px', background: '#fff', color: '#000', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '800px', margin: '0 auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '20px', marginBottom: '30px' }}>
                                <div>
                                    <h1 style={{ margin: 0, fontSize: '28px', color: isReceipt ? '#166534' : '#991b1b' }}>
                                        {isReceipt ? (currentLanguage === 'ar' ? 'سند قبض' : 'Receipt Voucher') : (currentLanguage === 'ar' ? 'سند صرف' : 'Payment Voucher')}
                                    </h1>
                                    <p style={{ margin: '5px 0 0 0', color: '#666' }}>No. #{printVoucher.voucherId}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ margin: 0 }}><strong>{currentLanguage === 'ar' ? 'التاريخ:' : 'Date:'}</strong> {new Date(printVoucher.date).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '30px', lineHeight: '2' }}>
                                <p style={{ fontSize: '18px' }}>
                                    {isReceipt ? (currentLanguage === 'ar' ? 'استلمنا من السيد/السادة:' : 'Received from Mr./M/s:') : (currentLanguage === 'ar' ? 'يصرف للسيد/السادة:' : 'Pay to Mr./M/s:')} <strong>{printVoucher.entityId}</strong><br/>
                                    {currentLanguage === 'ar' ? 'مبلغ وقدره:' : 'The sum of:'} <strong style={{ fontSize: '22px' }}>{formatCurrency(printVoucher.amount)}</strong><br/>
                                    {currentLanguage === 'ar' ? 'وذلك عن:' : 'Being for:'} <strong>{printVoucher.description}</strong><br/>
                                    {currentLanguage === 'ar' ? 'طريقة الدفع:' : 'Method:'} <strong>{printVoucher.method || 'Cash'}</strong>
                                </p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '80px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                                <div style={{ textAlign: 'center', width: '200px' }}>
                                    <div style={{ borderTop: '1px solid #000', paddingTop: '8px' }}>
                                        <strong>{isReceipt ? (currentLanguage === 'ar' ? 'المستلم' : 'Receiver') : (currentLanguage === 'ar' ? 'المحاسب' : 'Accountant')}</strong>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center', width: '200px' }}>
                                    <div style={{ borderTop: '1px solid #000', paddingTop: '8px' }}>
                                        <strong>{currentLanguage === 'ar' ? 'الختم' : 'Stamp'}</strong>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center', width: '200px' }}>
                                    <div style={{ borderTop: '1px solid #000', paddingTop: '8px' }}>
                                        <strong>{isReceipt ? (currentLanguage === 'ar' ? 'الدافع' : 'Payer') : (currentLanguage === 'ar' ? 'المستلم' : 'Receiver')}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="no-print" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--glass-border)', paddingTop: '12px', marginTop: '20px' }}>
                            <button className="btn btn-secondary" onClick={() => setPrintVoucher(null)}>{translations[currentLanguage].close}</button>
                            <button className="btn btn-primary" onClick={() => window.print()}>{currentLanguage === 'ar' ? 'طباعة' : 'Print'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vouchers;
