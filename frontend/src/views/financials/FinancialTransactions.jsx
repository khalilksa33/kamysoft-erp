import React, { useState, useEffect } from 'react';

const FinancialTransactions = ({ currentLanguage, formatCurrency, headers }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/transactions', { headers })
            .then(res => res.json())
            .then(data => {
                setTransactions(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [headers]);

    return (
        <div className="glass-card">
            <h3 style={{ marginBottom: '20px' }}>
                {currentLanguage === 'ar' ? 'الحركات المالية (المبيعات والمصروفات)' : 'Financial Transactions (Sales & Expenses)'}
            </h3>
            
            {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>{currentLanguage === 'ar' ? 'التاريخ' : 'Date'}</th>
                                <th>{currentLanguage === 'ar' ? 'النوع' : 'Type'}</th>
                                <th>{currentLanguage === 'ar' ? 'المرجع' : 'Ref'}</th>
                                <th>{currentLanguage === 'ar' ? 'البيان' : 'Description'}</th>
                                <th>{currentLanguage === 'ar' ? 'وارد' : 'Income'}</th>
                                <th>{currentLanguage === 'ar' ? 'منصرف' : 'Expense'}</th>
                                <th>{currentLanguage === 'ar' ? 'الرصيد' : 'Balance'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center' }}>
                                        {currentLanguage === 'ar' ? 'لا توجد حركات مالية' : 'No transactions found'}
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((t, i) => (
                                    <tr key={`${t.id}-${i}`}>
                                        <td>{new Date(t.date).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge ${t.type === 'Sale' ? 'green' : 'red'}`}>
                                                {currentLanguage === 'ar' && t.type === 'Sale' ? 'مبيعات' : currentLanguage === 'ar' && t.type === 'Expense' ? 'مصروف' : t.type}
                                            </span>
                                        </td>
                                        <td>{t.ref}</td>
                                        <td>{t.description}</td>
                                        <td style={{ color: '#10b981', fontWeight: t.income > 0 ? 'bold' : 'normal' }}>
                                            {t.income > 0 ? formatCurrency(t.income) : '-'}
                                        </td>
                                        <td style={{ color: '#ef4444', fontWeight: t.expense > 0 ? 'bold' : 'normal' }}>
                                            {t.expense > 0 ? formatCurrency(t.expense) : '-'}
                                        </td>
                                        <td style={{ fontWeight: 'bold' }}>{formatCurrency(t.balance)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FinancialTransactions;
