import React, { useState } from 'react';

const Salaries = ({ currentLanguage, translations, formatCurrency, activeTab }) => {
    const [salaries, setSalaries] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], employee: '', amount: '', status: 'Paid' });

    const handleSave = (e) => {
        e.preventDefault();
        const newSalary = {
            id: `SAL-${Date.now().toString().slice(-6)}`,
            date: form.date,
            employee: form.employee,
            amount: parseFloat(form.amount) || 0,
            status: form.status
        };
        setSalaries([...salaries, newSalary]);
        setShowModal(false);
        setForm({ date: new Date().toISOString().split('T')[0], employee: '', amount: '', status: 'Paid' });
    };

    const handleDelete = (id) => {
        if (confirm(currentLanguage === 'ar' ? 'هل أنت متأكد من حذف هذا السجل؟' : 'Are you sure you want to delete this record?')) {
            setSalaries(salaries.filter(s => s.id !== id));
        }
    };

    return (
        <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>{currentLanguage === 'ar' ? 'مسيرات الرواتب' : 'Salaries & Payroll'}</h3>
                {activeTab !== 'salariesReport' && (
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <i className="ri-money-dollar-circle-line"></i> {currentLanguage === 'ar' ? 'صرف راتب' : 'Process Salary'}
                    </button>
                )}
            </div>
            
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>{currentLanguage === 'ar' ? 'رقم العملية' : 'Transaction #'}</th>
                            <th>{currentLanguage === 'ar' ? 'التاريخ' : 'Date'}</th>
                            <th>{currentLanguage === 'ar' ? 'الموظف' : 'Employee'}</th>
                            <th>{currentLanguage === 'ar' ? 'المبلغ' : 'Amount'}</th>
                            <th>{currentLanguage === 'ar' ? 'الحالة' : 'Status'}</th>
                            {activeTab !== 'salariesReport' && <th>{translations[currentLanguage].actions}</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {salaries.length === 0 ? (
                            <tr><td colSpan={activeTab !== 'salariesReport' ? "6" : "5"} style={{ textAlign: 'center' }}>{currentLanguage === 'ar' ? 'لا توجد رواتب مسجلة' : 'No salary records found'}</td></tr>
                        ) : (
                            salaries.map(s => (
                                <tr key={s.id}>
                                    <td>{s.id}</td>
                                    <td>{s.date}</td>
                                    <td>{s.employee}</td>
                                    <td style={{ fontWeight: 'bold' }}>{formatCurrency(s.amount)}</td>
                                    <td><span className={`badge ${s.status === 'Paid' ? 'green' : 'gold'}`}>{currentLanguage === 'ar' && s.status === 'Paid' ? 'مدفوع' : currentLanguage === 'ar' ? 'معلق' : s.status}</span></td>
                                    {activeTab !== 'salariesReport' && (
                                        <td>
                                            <button className="btn btn-danger" onClick={() => handleDelete(s.id)}>
                                                <i className="ri-delete-bin-line"></i>
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{currentLanguage === 'ar' ? 'صرف راتب' : 'Process Salary'}</h3>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'التاريخ' : 'Date'}</label>
                                <input type="date" className="form-control" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'الموظف' : 'Employee'}</label>
                                <input type="text" className="form-control" required value={form.employee} onChange={e => setForm({ ...form, employee: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'المبلغ' : 'Amount'}</label>
                                <input type="number" step="0.01" className="form-control" required value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'الحالة' : 'Status'}</label>
                                <select className="form-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                    <option value="Paid">{currentLanguage === 'ar' ? 'مدفوع' : 'Paid'}</option>
                                    <option value="Pending">{currentLanguage === 'ar' ? 'معلق' : 'Pending'}</option>
                                </select>
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

export default Salaries;
