import React, { useState, useEffect } from 'react';

const BalanceSheet = ({ currentLanguage, formatCurrency, headers }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/reports/balance-sheet', { headers })
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

    if (loading || !data) {
        return (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                {currentLanguage === 'ar' ? 'جاري التحميل...' : 'Loading...'}
            </div>
        );
    }

    const { assets, liabilities, equity, totalAssets, totalLiabilities, totalEquity, netIncome } = data;

    const renderAccountRow = (acc) => (
        <div key={acc.code} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                {acc.code} - {currentLanguage === 'ar' ? acc.nameAR : acc.nameEN}
            </span>
            <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                {formatCurrency(acc.balance)}
            </span>
        </div>
    );

    return (
        <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>
                    {currentLanguage === 'ar' ? 'الميزانية العمومية' : 'Balance Sheet'}
                </h2>
                <button className="btn btn-secondary" onClick={() => window.print()}>
                    <i className="ri-printer-line"></i> {currentLanguage === 'ar' ? 'طباعة' : 'Print'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {/* Left Side: Assets */}
                <div>
                    <h3 style={{ borderBottom: '2px solid var(--accent-primary)', paddingBottom: '8px', color: 'var(--accent-primary)' }}>
                        {currentLanguage === 'ar' ? 'الأصول (الموجودات)' : 'Assets'}
                    </h3>
                    <div style={{ marginTop: '16px' }}>
                        {assets.length > 0 ? assets.map(renderAccountRow) : (
                            <div style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>-</div>
                        )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '2px solid rgba(255,255,255,0.1)', marginTop: '16px', fontWeight: 'bold', fontSize: '16px' }}>
                        <span>{currentLanguage === 'ar' ? 'إجمالي الأصول' : 'Total Assets'}</span>
                        <span style={{ color: 'var(--accent-primary)' }}>{formatCurrency(totalAssets)}</span>
                    </div>
                </div>

                {/* Right Side: Liabilities & Equity */}
                <div>
                    <h3 style={{ borderBottom: '2px solid var(--accent-danger)', paddingBottom: '8px', color: 'var(--accent-danger)' }}>
                        {currentLanguage === 'ar' ? 'الخصوم (المطلوبات)' : 'Liabilities'}
                    </h3>
                    <div style={{ marginTop: '16px' }}>
                        {liabilities.length > 0 ? liabilities.map(renderAccountRow) : (
                            <div style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>-</div>
                        )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '2px solid rgba(255,255,255,0.1)', marginTop: '16px', fontWeight: 'bold' }}>
                        <span>{currentLanguage === 'ar' ? 'إجمالي الخصوم' : 'Total Liabilities'}</span>
                        <span>{formatCurrency(totalLiabilities)}</span>
                    </div>

                    <h3 style={{ borderBottom: '2px solid var(--accent-gold)', paddingBottom: '8px', color: 'var(--accent-gold)', marginTop: '24px' }}>
                        {currentLanguage === 'ar' ? 'حقوق الملكية' : 'Equity'}
                    </h3>
                    <div style={{ marginTop: '16px' }}>
                        {equity.length > 0 ? equity.map(renderAccountRow) : (
                            <div style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>-</div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                                {currentLanguage === 'ar' ? 'صافي الدخل (الأرباح المحتجزة)' : 'Net Income (Retained Earnings)'}
                            </span>
                            <span style={{ color: netIncome >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)', fontWeight: '500' }}>
                                {formatCurrency(netIncome)}
                            </span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '2px solid rgba(255,255,255,0.1)', marginTop: '16px', fontWeight: 'bold' }}>
                        <span>{currentLanguage === 'ar' ? 'إجمالي حقوق الملكية' : 'Total Equity'}</span>
                        <span>{formatCurrency(totalEquity)}</span>
                    </div>

                    {/* Total Liabilities & Equity */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '2px solid var(--accent-gold)', marginTop: '24px', fontWeight: 'bold', fontSize: '16px' }}>
                        <span>{currentLanguage === 'ar' ? 'إجمالي الخصوم وحقوق الملكية' : 'Total Liabilities & Equity'}</span>
                        <span style={{ color: (totalAssets === (totalLiabilities + totalEquity)) ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                            {formatCurrency(totalLiabilities + totalEquity)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BalanceSheet;
