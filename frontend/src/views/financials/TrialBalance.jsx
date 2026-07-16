import React, { useState, useEffect } from 'react';

const TrialBalance = ({ currentLanguage, formatCurrency, headers }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/reports/trial-balance', { headers })
            .then(res => res.json())
            .then(resData => {
                setData(resData);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [headers]);

    const validData = Array.isArray(data) ? data : [];
    const totalDebit = validData.reduce((sum, item) => sum + (item.debit || 0), 0);
    const totalCredit = validData.reduce((sum, item) => sum + (item.credit || 0), 0);

    return (
        <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>
                    {currentLanguage === 'ar' ? 'ميزان المراجعة' : 'Trial Balance'}
                </h2>
                <button className="btn btn-secondary" onClick={() => window.print()}>
                    <i className="ri-printer-line"></i> {currentLanguage === 'ar' ? 'طباعة' : 'Print'}
                </button>
            </div>

            {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    {currentLanguage === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <th style={{ padding: '12px', textAlign: currentLanguage === 'ar' ? 'right' : 'left' }}>{currentLanguage === 'ar' ? 'رمز الحساب' : 'Code'}</th>
                                <th style={{ padding: '12px', textAlign: currentLanguage === 'ar' ? 'right' : 'left' }}>{currentLanguage === 'ar' ? 'اسم الحساب' : 'Account Name'}</th>
                                <th style={{ padding: '12px', textAlign: currentLanguage === 'ar' ? 'right' : 'left' }}>{currentLanguage === 'ar' ? 'النوع' : 'Type'}</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>{currentLanguage === 'ar' ? 'مدين' : 'Debit'}</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>{currentLanguage === 'ar' ? 'دائن' : 'Credit'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {validData.filter(a => a.debit > 0 || a.credit > 0).map((acc, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '12px' }}>{acc.code}</td>
                                    <td style={{ padding: '12px' }}>{currentLanguage === 'ar' ? acc.nameAR : acc.nameEN}</td>
                                    <td style={{ padding: '12px' }}>{acc.type}</td>
                                    <td style={{ padding: '12px', textAlign: 'right', color: acc.debit > 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                        {formatCurrency(acc.debit)}
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right', color: acc.credit > 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                        {formatCurrency(acc.credit)}
                                    </td>
                                </tr>
                            ))}
                            {data.filter(a => a.debit > 0 || a.credit > 0).length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        {currentLanguage === 'ar' ? 'لا توجد حركات مالية بعد' : 'No financial transactions yet'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr style={{ background: 'rgba(255,255,255,0.08)', fontWeight: 'bold' }}>
                                <td colSpan="3" style={{ padding: '12px', textAlign: currentLanguage === 'ar' ? 'left' : 'right' }}>
                                    {currentLanguage === 'ar' ? 'الإجمالي' : 'Total'}
                                </td>
                                <td style={{ padding: '12px', textAlign: 'right', color: totalDebit === totalCredit ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                                    {formatCurrency(totalDebit)}
                                </td>
                                <td style={{ padding: '12px', textAlign: 'right', color: totalDebit === totalCredit ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                                    {formatCurrency(totalCredit)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TrialBalance;
