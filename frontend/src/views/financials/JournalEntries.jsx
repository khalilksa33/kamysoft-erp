import React, { useState } from 'react';

const JournalEntries = ({ currentLanguage, translations, formatCurrency }) => {
    const [entries, setEntries] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], account: '', type: 'Debit', amount: '', description: '' });

    const handleSave = (e) => {
        e.preventDefault();
        const newEntry = {
            id: `JE-${Date.now().toString().slice(-6)}`,
            date: form.date,
            account: form.account,
            type: form.type,
            amount: parseFloat(form.amount) || 0,
            description: form.description
        };
        setEntries([...entries, newEntry]);
        setShowModal(false);
        setForm({ date: new Date().toISOString().split('T')[0], account: '', type: 'Debit', amount: '', description: '' });
    };

    return (
        <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>{currentLanguage === 'ar' ? 'القيود اليومية' : 'Journal Entries'}</h3>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <i className="ri-add-line"></i> {currentLanguage === 'ar' ? 'إضافة قيد' : 'Add Entry'}
                </button>
            </div>
            
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>{currentLanguage === 'ar' ? 'رقم القيد' : 'Entry #'}</th>
                            <th>{currentLanguage === 'ar' ? 'التاريخ' : 'Date'}</th>
                            <th>{currentLanguage === 'ar' ? 'الحساب' : 'Account'}</th>
                            <th>{currentLanguage === 'ar' ? 'النوع' : 'Type'}</th>
                            <th>{currentLanguage === 'ar' ? 'المبلغ' : 'Amount'}</th>
                            <th>{currentLanguage === 'ar' ? 'البيان' : 'Description'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>{currentLanguage === 'ar' ? 'لا توجد قيود' : 'No entries found'}</td></tr>
                        ) : (
                            entries.map(e => (
                                <tr key={e.id}>
                                    <td>{e.id}</td>
                                    <td>{e.date}</td>
                                    <td>{e.account}</td>
                                    <td><span className={`badge ${e.type === 'Debit' ? 'blue' : 'gold'}`}>{currentLanguage === 'ar' && e.type === 'Debit' ? 'مدين' : currentLanguage === 'ar' ? 'دائن' : e.type}</span></td>
                                    <td style={{ fontWeight: 'bold' }}>{formatCurrency(e.amount)}</td>
                                    <td>{e.description}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{currentLanguage === 'ar' ? 'إضافة قيد جديد' : 'Add New Journal Entry'}</h3>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'التاريخ' : 'Date'}</label>
                                <input type="date" className="form-control" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'الحساب' : 'Account'}</label>
                                <input type="text" className="form-control" required value={form.account} onChange={e => setForm({ ...form, account: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'النوع' : 'Type'}</label>
                                <select className="form-control" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                    <option value="Debit">{currentLanguage === 'ar' ? 'مدين (Debit)' : 'Debit'}</option>
                                    <option value="Credit">{currentLanguage === 'ar' ? 'دائن (Credit)' : 'Credit'}</option>
                                </select>
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

export default JournalEntries;
