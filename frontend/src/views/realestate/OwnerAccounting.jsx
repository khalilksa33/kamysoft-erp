import React, { useState, useEffect } from 'react';

const OwnerAccounting = ({ currentLanguage, formatCurrency }) => {
    const isAr = currentLanguage === 'ar';
    const [owners, setOwners] = useState([]);
    const [selectedOwnerId, setSelectedOwnerId] = useState('');
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        return d.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [statement, setStatement] = useState(null);

    useEffect(() => {
        fetchOwners();
    }, []);

    const fetchOwners = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/property-owners', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await res.json();
            if (Array.isArray(data)) {
                setOwners(data);
                if (data.length > 0) setSelectedOwnerId(data[0].id);
            }
        } catch (err) { console.error(err); }
    };

    const fetchStatement = async () => {
        if (!selectedOwnerId) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/owner-statement/${selectedOwnerId}?startDate=${startDate}&endDate=${endDate}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setStatement(data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        if (selectedOwnerId) fetchStatement();
    }, [selectedOwnerId, startDate, endDate]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                        <i className="ri-wallet-3-line" style={{ color: 'var(--accent-cyan)', marginRight: isAr ? '0' : '8px', marginLeft: isAr ? '8px' : '0' }}></i>
                        {isAr ? 'كشوف حسابات الملاك والمستثمرين (Owner Accounting)' : 'Owner Accounting & Payout Statements'}
                    </h2>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        {isAr ? 'احتساب إيرادات التأجير، خصم رسوم الإدارة والصيانة، وصافي المبالغ المستحقة للتحويل' : 'Calculate gross collected revenues, management fees, maintenance costs, and net payouts'}
                    </p>
                </div>
                <button className="btn btn-secondary" onClick={() => window.print()}>
                    <i className="ri-printer-line"></i> {isAr ? 'طباعة كشف الحساب' : 'Print Statement'}
                </button>
            </div>

            {/* Filter Bar */}
            <div className="glass-card" style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{isAr ? 'المالك:' : 'Owner:'}</label>
                    <select className="form-control" style={{ width: 'auto' }} value={selectedOwnerId} onChange={e => setSelectedOwnerId(e.target.value)}>
                        {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{isAr ? 'من:' : 'From:'}</label>
                    <input type="date" className="form-control" style={{ width: 'auto' }} value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{isAr ? 'إلى:' : 'To:'}</label>
                    <input type="date" className="form-control" style={{ width: 'auto' }} value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
            </div>

            {statement && (
                <>
                    {/* Summary Cards */}
                    <div className="card-grid">
                        <div className="glass-card green">
                            <div className="card-stat">
                                <div className="stat-info">
                                    <h3>{isAr ? 'إجمالي المحصل من الإيجارات' : 'Total Collected Revenue'}</h3>
                                    <div className="stat-value">{formatCurrency(statement.summary?.totalCollected || 0)}</div>
                                </div>
                                <div className="stat-icon"><i className="ri-money-dollar-circle-line"></i></div>
                            </div>
                        </div>

                        <div className="glass-card purple">
                            <div className="card-stat">
                                <div className="stat-info">
                                    <h3>{isAr ? 'رسوم إدارة الأملاك' : 'Management Fees'}</h3>
                                    <div className="stat-value">-{formatCurrency(statement.summary?.managementFees || 0)}</div>
                                </div>
                                <div className="stat-icon"><i className="ri-percent-line"></i></div>
                            </div>
                        </div>

                        <div className="glass-card gold">
                            <div className="card-stat">
                                <div className="stat-info">
                                    <h3>{isAr ? 'تكاليف الصيانة المخصومة' : 'Maintenance Expenses'}</h3>
                                    <div className="stat-value">-{formatCurrency(statement.summary?.maintenanceCosts || 0)}</div>
                                </div>
                                <div className="stat-icon"><i className="ri-tools-line"></i></div>
                            </div>
                        </div>

                        <div className="glass-card cyan">
                            <div className="card-stat">
                                <div className="stat-info">
                                    <h3>{isAr ? 'صافي المبلغ المستحق للمالك' : 'Net Due to Owner'}</h3>
                                    <div className="stat-value" style={{ color: 'var(--accent-cyan)' }}>{formatCurrency(statement.summary?.netDue || 0)}</div>
                                </div>
                                <div className="stat-icon"><i className="ri-bank-card-line"></i></div>
                            </div>
                        </div>
                    </div>

                    {/* Breakdown Tables */}
                    <div className="glass-card">
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>
                            <i className="ri-arrow-down-circle-line" style={{ color: 'var(--accent-success)', marginRight: '6px' }}></i>
                            {isAr ? 'تفاصيل الدفعات والإيرادات المحصلة' : 'Collected Revenue Breakdown'}
                        </h3>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{isAr ? 'التاريخ' : 'Date'}</th>
                                        <th>{isAr ? 'رقم الوحدة' : 'Unit ID'}</th>
                                        <th style={{ textAlign: 'right' }}>{isAr ? 'المبلغ المحصل' : 'Collected Amount'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(statement.income || []).map((inc, i) => (
                                        <tr key={i}>
                                            <td>{new Date(inc.date).toLocaleDateString()}</td>
                                            <td>#{inc.unitId}</td>
                                            <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--accent-success)' }}>
                                                {formatCurrency(inc.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                    {(statement.income || []).length === 0 && (
                                        <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>{isAr ? 'لا توجد دفعات محصلة لهذه الفترة' : 'No collected revenue for this period'}</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default OwnerAccounting;
