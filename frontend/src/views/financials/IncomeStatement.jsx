import React, { useState, useEffect } from 'react';

const IncomeStatement = ({ currentLanguage, formatCurrency, headers }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchData = () => {
        setLoading(true);
        let url = '/api/reports/income-statement';
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

    const { revenues, cogs, operatingExpenses, totalRevenue, totalCogs, grossProfit, totalOperatingExpenses, netIncome } = data || {};

    const renderAccountRow = (acc) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }} key={acc.code}>
            <div style={{ color: 'var(--text-secondary)' }}>
                <span style={{ display: 'inline-block', width: '50px', fontWeight: 'bold' }}>{acc.code}</span>
                {currentLanguage === 'ar' ? acc.nameAR : acc.nameEN}
            </div>
            <div style={{ fontWeight: '500' }}>{formatCurrency(acc.balance)}</div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, background: 'linear-gradient(45deg, var(--primary-color), var(--accent-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {currentLanguage === 'ar' ? 'قائمة الدخل' : 'Income Statement'}
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
                        <h2 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>{currentLanguage === 'ar' ? 'قائمة الدخل' : 'Income Statement'}</h2>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            {startDate && endDate ? `${startDate} - ${endDate}` : (currentLanguage === 'ar' ? 'جميع الفترات' : 'All Periods')}
                        </div>
                    </div>

                    {/* Revenues */}
                    <div>
                        <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', borderBottom: '2px solid var(--primary-color)', paddingBottom: '10px', marginBottom: '15px' }}>
                            {currentLanguage === 'ar' ? 'الإيرادات' : 'Revenues'}
                        </h3>
                        {revenues.length === 0 ? <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem' }}>{currentLanguage === 'ar' ? 'لا توجد بيانات' : 'No data'}</div> : revenues.map(renderAccountRow)}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0 5px 0', marginTop: '10px', fontWeight: 'bold', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                            <div>{currentLanguage === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenues'}</div>
                            <div>{formatCurrency(totalRevenue)}</div>
                        </div>
                    </div>

                    {/* Cost of Goods Sold */}
                    <div>
                        <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-color)', borderBottom: '2px solid var(--accent-color)', paddingBottom: '10px', marginBottom: '15px' }}>
                            {currentLanguage === 'ar' ? 'تكلفة البضاعة المباعة' : 'Cost of Goods Sold'}
                        </h3>
                        {cogs.length === 0 ? <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem' }}>{currentLanguage === 'ar' ? 'لا توجد بيانات' : 'No data'}</div> : cogs.map(renderAccountRow)}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0 5px 0', marginTop: '10px', fontWeight: 'bold', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                            <div>{currentLanguage === 'ar' ? 'إجمالي تكلفة البضاعة المباعة' : 'Total COGS'}</div>
                            <div>{formatCurrency(totalCogs)}</div>
                        </div>
                    </div>

                    {/* Gross Profit */}
                    <div style={{ background: 'rgba(var(--primary-rgb), 0.05)', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{currentLanguage === 'ar' ? 'إجمالي الربح (الخسارة)' : 'Gross Profit (Loss)'}</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: grossProfit >= 0 ? '#10b981' : '#ef4444' }}>
                            {formatCurrency(grossProfit)}
                        </div>
                    </div>

                    {/* Operating Expenses */}
                    <div>
                        <h3 style={{ fontSize: '1.1rem', color: '#f59e0b', borderBottom: '2px solid #f59e0b', paddingBottom: '10px', marginBottom: '15px' }}>
                            {currentLanguage === 'ar' ? 'المصروفات التشغيلية' : 'Operating Expenses'}
                        </h3>
                        {operatingExpenses.length === 0 ? <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem' }}>{currentLanguage === 'ar' ? 'لا توجد بيانات' : 'No data'}</div> : operatingExpenses.map(renderAccountRow)}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0 5px 0', marginTop: '10px', fontWeight: 'bold', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                            <div>{currentLanguage === 'ar' ? 'إجمالي المصروفات' : 'Total Operating Expenses'}</div>
                            <div>{formatCurrency(totalOperatingExpenses)}</div>
                        </div>
                    </div>

                    {/* Net Income */}
                    <div style={{ background: 'var(--glass-border)', padding: '25px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{currentLanguage === 'ar' ? 'صافي الدخل' : 'Net Income'}</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: netIncome >= 0 ? '#10b981' : '#ef4444' }}>
                            {formatCurrency(netIncome)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IncomeStatement;
