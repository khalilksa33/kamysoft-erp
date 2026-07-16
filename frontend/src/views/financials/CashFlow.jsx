import React, { useState, useEffect } from 'react';

const CashFlow = ({ currentLanguage, formatCurrency, headers }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchData = () => {
        setLoading(true);
        let url = '/api/reports/cash-flow';
        if (startDate && endDate) {
            url += `?startDate=${startDate}&endDate=${endDate}`;
        }
        fetch(url, { headers })
            .then(res => res.json())
            .then(resData => {
                setData(resData);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [headers]);

    if (loading && !data) {
        return (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                {currentLanguage === 'ar' ? 'جاري التحميل...' : 'Loading...'}
            </div>
        );
    }

    const { cashInflows, cashOutflows, totalInflows, totalOutflows, netChange } = data || {};

    const renderJournalRow = (entry, index) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }} key={entry.entryId || index}>
            <div style={{ color: 'var(--text-secondary)' }}>
                <span style={{ display: 'inline-block', width: '100px', fontWeight: 'bold' }}>{new Date(entry.date).toLocaleDateString()}</span>
                {entry.description}
            </div>
            <div style={{ fontWeight: '500' }}>
                {formatCurrency(entry.debit > 0 ? entry.debit : entry.credit)}
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, background: 'linear-gradient(45deg, var(--primary-color), var(--accent-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {currentLanguage === 'ar' ? 'التدفقات النقدية' : 'Cash Flow Statement'}
                </h1>
                <button 
                    onClick={() => window.print()} 
                    style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, display: 'flex', gap: '8px', alignItems: 'center', transition: 'all 0.2s' }}
                    className="hover-lift"
                >
                    <span className="material-symbols-outlined">print</span>
                    {currentLanguage === 'ar' ? 'طباعة التقرير' : 'Print Report'}
                </button>
            </div>

            <div className="glass-card" style={{ padding: '20px', display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{currentLanguage === 'ar' ? 'من تاريخ' : 'Start Date'}</label>
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={e => setStartDate(e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{currentLanguage === 'ar' ? 'إلى تاريخ' : 'End Date'}</label>
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={e => setEndDate(e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
                    />
                </div>
                <button 
                    onClick={fetchData} 
                    style={{ background: 'var(--glass-border)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s', height: '42px' }}
                    className="hover-lift"
                >
                    {currentLanguage === 'ar' ? 'تصفية' : 'Filter'}
                </button>
            </div>

            {loading ? (
                 <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                     {currentLanguage === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                 </div>
            ) : (
                <div className="glass-card report-print-area" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    
                    {/* Header for print */}
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <h2 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>{currentLanguage === 'ar' ? 'التدفقات النقدية' : 'Cash Flow Statement'}</h2>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            {startDate && endDate ? `${startDate} - ${endDate}` : (currentLanguage === 'ar' ? 'جميع الفترات' : 'All Periods')}
                        </div>
                    </div>

                    {/* Cash Inflows */}
                    <div>
                        <h3 style={{ fontSize: '1.1rem', color: '#10b981', borderBottom: '2px solid #10b981', paddingBottom: '10px', marginBottom: '15px' }}>
                            {currentLanguage === 'ar' ? 'التدفقات النقدية الداخلة (المقبوضات)' : 'Cash Inflows (Receipts)'}
                        </h3>
                        {cashInflows.length === 0 ? <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem' }}>{currentLanguage === 'ar' ? 'لا توجد بيانات' : 'No data'}</div> : cashInflows.map(renderJournalRow)}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0 5px 0', marginTop: '10px', fontWeight: 'bold', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                            <div>{currentLanguage === 'ar' ? 'إجمالي المقبوضات' : 'Total Inflows'}</div>
                            <div style={{ color: '#10b981' }}>{formatCurrency(totalInflows)}</div>
                        </div>
                    </div>

                    {/* Cash Outflows */}
                    <div>
                        <h3 style={{ fontSize: '1.1rem', color: '#ef4444', borderBottom: '2px solid #ef4444', paddingBottom: '10px', marginBottom: '15px' }}>
                            {currentLanguage === 'ar' ? 'التدفقات النقدية الخارجة (المدفوعات)' : 'Cash Outflows (Payments)'}
                        </h3>
                        {cashOutflows.length === 0 ? <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem' }}>{currentLanguage === 'ar' ? 'لا توجد بيانات' : 'No data'}</div> : cashOutflows.map(renderJournalRow)}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0 5px 0', marginTop: '10px', fontWeight: 'bold', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                            <div>{currentLanguage === 'ar' ? 'إجمالي المدفوعات' : 'Total Outflows'}</div>
                            <div style={{ color: '#ef4444' }}>{formatCurrency(totalOutflows)}</div>
                        </div>
                    </div>

                    {/* Net Cash Flow */}
                    <div style={{ background: 'var(--glass-border)', padding: '25px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{currentLanguage === 'ar' ? 'صافي التغير في النقدية' : 'Net Change in Cash'}</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: netChange >= 0 ? '#10b981' : '#ef4444' }}>
                            {formatCurrency(netChange)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CashFlow;
