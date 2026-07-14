import React, { useState, useEffect } from 'react';

const GeneralLedger = ({ currentLanguage, formatCurrency, headers }) => {
    const [accounts, setAccounts] = useState([]);
    const [entries, setEntries] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetch('/api/accounts', { headers }).then(res => res.json()),
            fetch('/api/journal', { headers }).then(res => res.json())
        ])
        .then(([accountsData, journalData]) => {
            const accs = Array.isArray(accountsData) ? accountsData : [];
            setAccounts(accs);
            setEntries(Array.isArray(journalData) ? journalData : []);
            if (accs.length > 0) {
                setSelectedAccount(accs[0].code);
            }
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [headers]);

    const getLedgerLines = () => {
        if (!selectedAccount) return [];
        const account = accounts.find(a => a.code === selectedAccount);
        if (!account) return [];

        const accountEntries = entries.filter(e => e.account === selectedAccount);
        // Sort chronologically ascending for ledger calculation
        accountEntries.sort((a, b) => new Date(a.date) - new Date(b.date));

        let balance = 0;
        const normalBalanceDebit = ['Asset', 'Expense'].includes(account.type);

        return accountEntries.map(e => {
            if (normalBalanceDebit) {
                balance += (e.debit || 0) - (e.credit || 0);
            } else {
                balance += (e.credit || 0) - (e.debit || 0);
            }
            return { ...e, balance };
        });
    };

    const ledgerLines = getLedgerLines();
    const currentAcc = accounts.find(a => a.code === selectedAccount);

    return (
        <div className="glass-card">
            <h3 style={{ marginBottom: '20px' }}>
                {currentLanguage === 'ar' ? 'دفتر الاستاذ' : 'General Ledger'}
            </h3>
            
            {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
            ) : (
                <>
                    <div className="form-group" style={{ maxWidth: '400px', marginBottom: '20px' }}>
                        <label>{currentLanguage === 'ar' ? 'اختر الحساب' : 'Select Account'}</label>
                        <select className="form-control" value={selectedAccount} onChange={e => setSelectedAccount(e.target.value)}>
                            {accounts.map(a => (
                                <option key={a.code} value={a.code}>
                                    {a.code} - {currentLanguage === 'ar' ? a.nameAR : a.nameEN} ({a.type})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>{currentLanguage === 'ar' ? 'التاريخ' : 'Date'}</th>
                                    <th>{currentLanguage === 'ar' ? 'رقم القيد' : 'Entry #'}</th>
                                    <th>{currentLanguage === 'ar' ? 'البيان' : 'Description'}</th>
                                    <th>{currentLanguage === 'ar' ? 'مدين' : 'Debit'}</th>
                                    <th>{currentLanguage === 'ar' ? 'دائن' : 'Credit'}</th>
                                    <th>{currentLanguage === 'ar' ? 'الرصيد' : 'Balance'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ledgerLines.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center' }}>
                                            {currentLanguage === 'ar' ? 'لا توجد حركات لهذا الحساب' : 'No entries found for this account'}
                                        </td>
                                    </tr>
                                ) : (
                                    ledgerLines.map(line => (
                                        <tr key={line.entryId}>
                                            <td>{new Date(line.date).toLocaleDateString()}</td>
                                            <td>{line.entryId}</td>
                                            <td>{line.description}</td>
                                            <td style={{ color: line.debit > 0 ? '#3b82f6' : 'inherit' }}>
                                                {line.debit > 0 ? formatCurrency(line.debit) : '-'}
                                            </td>
                                            <td style={{ color: line.credit > 0 ? '#eab308' : 'inherit' }}>
                                                {line.credit > 0 ? formatCurrency(line.credit) : '-'}
                                            </td>
                                            <td style={{ fontWeight: 'bold' }}>{formatCurrency(line.balance)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default GeneralLedger;
