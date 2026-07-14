import React, { useState, useEffect } from 'react';

const JournalEntries = ({ currentLanguage, translations, formatCurrency, headers, activeTab }) => {
    const [entries, setEntries] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], account: '', type: 'Debit', amount: '', description: '' });

    const loadData = () => {
        setLoading(true);
        Promise.all([
            fetch('/api/journal', { headers }).then(res => res.json()),
            fetch('/api/accounts', { headers }).then(res => res.json())
        ])
        .then(([journalData, accountsData]) => {
            setEntries(Array.isArray(journalData) ? journalData : []);
            setAccounts(Array.isArray(accountsData) ? accountsData : []);
            if (accountsData.length > 0 && !form.account) {
                setForm(f => ({ ...f, account: accountsData[0].code }));
            }
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    };

    useEffect(() => {
        if (activeTab === 'dailyJournal' || activeTab === 'financials') {
            loadData();
        }
    }, [headers, activeTab]);

    const handleSave = (e) => {
        e.preventDefault();
        
        const payload = {
            date: form.date,
            account: form.account,
            description: form.description,
            debit: form.type === 'Debit' ? parseFloat(form.amount) : 0,
            credit: form.type === 'Credit' ? parseFloat(form.amount) : 0
        };

        fetch('/api/journal', {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(() => {
            setShowModal(false);
            setForm({ date: new Date().toISOString().split('T')[0], account: accounts[0]?.code || '', type: 'Debit', amount: '', description: '' });
            loadData();
        })
        .catch(err => alert('Error saving entry: ' + err.message));
    };

    if (activeTab && activeTab !== 'dailyJournal' && activeTab !== 'financials') {
        const placeholderTitles = {
            generalLedger: currentLanguage === 'ar' ? 'دفتر الاستاذ' : 'General Ledger'
        };
        if (placeholderTitles[activeTab]) {
            return (
                <div className="glass-card" style={{ textAlign: 'center', padding: '50px' }}>
                    <h3>{placeholderTitles[activeTab]}</h3>
                    <p>{currentLanguage === 'ar' ? 'قيد التطوير' : 'Under development'}</p>
                </div>
            );
        }
    }

    return (
        <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>{currentLanguage === 'ar' ? 'القيود اليومية' : 'Journal Entries'}</h3>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <i className="ri-add-line"></i> {currentLanguage === 'ar' ? 'إضافة قيد' : 'Add Entry'}
                </button>
            </div>
            
            {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>{currentLanguage === 'ar' ? 'رقم القيد' : 'Entry #'}</th>
                                <th>{currentLanguage === 'ar' ? 'التاريخ' : 'Date'}</th>
                                <th>{currentLanguage === 'ar' ? 'الحساب' : 'Account'}</th>
                                <th>{currentLanguage === 'ar' ? 'مدين' : 'Debit'}</th>
                                <th>{currentLanguage === 'ar' ? 'دائن' : 'Credit'}</th>
                                <th>{currentLanguage === 'ar' ? 'البيان' : 'Description'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center' }}>{currentLanguage === 'ar' ? 'لا توجد قيود' : 'No entries found'}</td></tr>
                            ) : (
                                entries.map(e => {
                                    const acc = accounts.find(a => a.code === e.account);
                                    const accName = acc ? (currentLanguage === 'ar' ? acc.nameAR : acc.nameEN) : e.account;
                                    return (
                                        <tr key={e.entryId}>
                                            <td>{e.entryId}</td>
                                            <td>{new Date(e.date).toLocaleDateString()}</td>
                                            <td>{e.account} - {accName}</td>
                                            <td style={{ fontWeight: e.debit > 0 ? 'bold' : 'normal', color: e.debit > 0 ? '#3b82f6' : 'inherit' }}>
                                                {e.debit > 0 ? formatCurrency(e.debit) : '-'}
                                            </td>
                                            <td style={{ fontWeight: e.credit > 0 ? 'bold' : 'normal', color: e.credit > 0 ? '#eab308' : 'inherit' }}>
                                                {e.credit > 0 ? formatCurrency(e.credit) : '-'}
                                            </td>
                                            <td>{e.description}</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}

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
                                <select className="form-control" required value={form.account} onChange={e => setForm({ ...form, account: e.target.value })}>
                                    {accounts.map(a => (
                                        <option key={a.code} value={a.code}>
                                            {a.code} - {currentLanguage === 'ar' ? a.nameAR : a.nameEN} ({a.type})
                                        </option>
                                    ))}
                                </select>
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
