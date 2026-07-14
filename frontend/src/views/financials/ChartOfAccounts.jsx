import React, { useState, useEffect } from 'react';

const ChartOfAccounts = ({ currentLanguage, formatCurrency, headers }) => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ code: '', nameEN: '', nameAR: '', type: 'Asset' });

    const loadAccounts = () => {
        fetch('/api/accounts', { headers })
            .then(res => res.json())
            .then(data => {
                setAccounts(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        loadAccounts();
    }, [headers]);

    const handleSave = (e) => {
        e.preventDefault();
        const isEdit = accounts.some(a => a.code === form.code);
        const url = isEdit ? `/api/accounts/${form.code}` : '/api/accounts';
        const method = isEdit ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers,
            body: JSON.stringify(form)
        })
        .then(res => res.json())
        .then(() => {
            setShowModal(false);
            setForm({ code: '', nameEN: '', nameAR: '', type: 'Asset' });
            loadAccounts();
        })
        .catch(err => alert('Error saving account: ' + err.message));
    };

    const handleDelete = (code) => {
        if (confirm(currentLanguage === 'ar' ? 'هل أنت متأكد من حذف هذا الحساب؟' : 'Are you sure you want to delete this account?')) {
            fetch(`/api/accounts/${code}`, {
                method: 'DELETE',
                headers
            })
            .then(() => loadAccounts())
            .catch(err => alert('Error deleting account: ' + err.message));
        }
    };

    return (
        <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>{currentLanguage === 'ar' ? 'شجرة الحسابات' : 'Chart of Accounts'}</h3>
                <button className="btn btn-primary" onClick={() => { setForm({ code: '', nameEN: '', nameAR: '', type: 'Asset' }); setShowModal(true); }}>
                    <i className="ri-add-line"></i> {currentLanguage === 'ar' ? 'إضافة حساب' : 'Add Account'}
                </button>
            </div>
            
            {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>{currentLanguage === 'ar' ? 'كود الحساب' : 'Code'}</th>
                                <th>{currentLanguage === 'ar' ? 'اسم الحساب (عربي)' : 'Name (AR)'}</th>
                                <th>{currentLanguage === 'ar' ? 'اسم الحساب (انجليزي)' : 'Name (EN)'}</th>
                                <th>{currentLanguage === 'ar' ? 'النوع' : 'Type'}</th>
                                <th>{currentLanguage === 'ar' ? 'الرصيد' : 'Balance'}</th>
                                <th>{currentLanguage === 'ar' ? 'إجراءات' : 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>
                                        {currentLanguage === 'ar' ? 'لا توجد حسابات' : 'No accounts found'}
                                    </td>
                                </tr>
                            ) : (
                                accounts.map((a, i) => (
                                    <tr key={i}>
                                        <td><strong>{a.code}</strong></td>
                                        <td>{a.nameAR}</td>
                                        <td>{a.nameEN}</td>
                                        <td><span className="badge purple">{a.type}</span></td>
                                        <td style={{ fontWeight: 'bold' }}>{formatCurrency(a.balance)}</td>
                                        <td>
                                            <button className="btn btn-secondary" onClick={() => { setForm(a); setShowModal(true); }} style={{ marginRight: '8px' }}>
                                                <i className="ri-edit-line"></i>
                                            </button>
                                            <button className="btn btn-danger" onClick={() => handleDelete(a.code)}>
                                                <i className="ri-delete-bin-line"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{form.code && accounts.some(a => a.code === form.code) ? (currentLanguage === 'ar' ? 'تعديل الحساب' : 'Edit Account') : (currentLanguage === 'ar' ? 'إضافة حساب جديد' : 'Add New Account')}</h3>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'كود الحساب' : 'Account Code'}</label>
                                <input type="text" className="form-control" required value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} disabled={accounts.some(a => a.code === form.code)} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'اسم الحساب (عربي)' : 'Name (AR)'}</label>
                                <input type="text" className="form-control" required value={form.nameAR} onChange={e => setForm({ ...form, nameAR: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'اسم الحساب (انجليزي)' : 'Name (EN)'}</label>
                                <input type="text" className="form-control" required value={form.nameEN} onChange={e => setForm({ ...form, nameEN: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'النوع' : 'Type'}</label>
                                <select className="form-control" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                    <option value="Asset">Asset / أصل</option>
                                    <option value="Liability">Liability / خصوم</option>
                                    <option value="Equity">Equity / حقوق ملكية</option>
                                    <option value="Revenue">Revenue / إيرادات</option>
                                    <option value="Expense">Expense / مصروفات</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>{currentLanguage === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                                <button type="submit" className="btn btn-primary">{currentLanguage === 'ar' ? 'حفظ' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChartOfAccounts;
