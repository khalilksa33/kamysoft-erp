import React, { useState, useEffect } from 'react';
import '../../index.css';

const OwnerAccounting = ({ currentLanguage }) => {
    const isAr = currentLanguage === 'ar';
    const [owners, setOwners] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statement, setStatement] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOwners();
        // Set default dates (current month)
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        setStartDate(firstDay.toISOString().split('T')[0]);
        setEndDate(lastDay.toISOString().split('T')[0]);
    }, []);

    const fetchOwners = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/property-owners', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await res.json();
            setOwners(data);
        } catch (err) { console.error('Error fetching owners', err); }
    };

    const generateStatement = async () => {
        if (!selectedOwner) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/owner-statement/${selectedOwner}?startDate=${startDate}&endDate=${endDate}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setStatement(data);
        } catch (err) {
            console.error('Error generating statement', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="view-container">
            <div className="header-row no-print">
                <h2>{isAr ? 'حسابات الملاك' : 'Owner Accounting'}</h2>
            </div>
            
            <div className="card no-print" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 200px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>{isAr ? 'اختر المالك' : 'Select Owner'}</label>
                        <select className="form-control" value={selectedOwner} onChange={e => setSelectedOwner(e.target.value)}>
                            <option value="">-- {isAr ? 'اختر المالك' : 'Choose Owner'} --</option>
                            {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>{isAr ? 'من تاريخ' : 'Start Date'}</label>
                        <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>{isAr ? 'إلى تاريخ' : 'End Date'}</label>
                        <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>
                    <button className="btn btn-primary" onClick={generateStatement} disabled={!selectedOwner || loading}>
                        {loading ? (isAr ? 'جاري التوليد...' : 'Generating...') : (isAr ? 'توليد الكشف' : 'Generate Statement')}
                    </button>
                    {statement && (
                        <button className="btn btn-secondary" onClick={handlePrint}>
                            <i className="ri-printer-line" style={{ marginRight: '5px' }}></i> {isAr ? 'طباعة' : 'Print'}
                        </button>
                    )}
                </div>
            </div>

            {statement && (
                <div className="card print-area" style={{ background: '#fff', color: '#000' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
                        <h2>{isAr ? 'كشف حساب مالك عقار' : 'Property Owner Statement'}</h2>
                        <h3>{owners.find(o => o.id === selectedOwner)?.name}</h3>
                        <p>{isAr ? 'الفترة:' : 'Period:'} {startDate} {isAr ? 'إلى' : 'to'} {endDate}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                        <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#64748b' }}>{isAr ? 'إجمالي الإيرادات (المحصلة)' : 'Total Rent Collected'}</h4>
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>${statement.summary.totalCollected.toFixed(2)}</span>
                        </div>
                        <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#64748b' }}>{isAr ? 'رسوم الإدارة' : 'Management Fees'}</h4>
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>${statement.summary.managementFees.toFixed(2)}</span>
                        </div>
                        <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#64748b' }}>{isAr ? 'مصروفات الصيانة' : 'Maintenance Costs'}</h4>
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>${statement.summary.maintenanceCosts.toFixed(2)}</span>
                        </div>
                        <div style={{ padding: '20px', background: '#f0fdf4', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#166534' }}>{isAr ? 'صافي المستحق للمالك' : 'Net Due to Owner'}</h4>
                            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#166534' }}>${statement.summary.netDue.toFixed(2)}</span>
                        </div>
                    </div>

                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>{isAr ? 'تفاصيل الإيرادات' : 'Income Details'}</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                        <thead>
                            <tr style={{ background: '#f1f5f9' }}>
                                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #e2e8f0' }}>{isAr ? 'التاريخ' : 'Date'}</th>
                                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #e2e8f0' }}>{isAr ? 'رقم الوحدة' : 'Unit ID'}</th>
                                <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #e2e8f0' }}>{isAr ? 'المبلغ' : 'Amount'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statement.income.map((inc, idx) => (
                                <tr key={idx}>
                                    <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{new Date(inc.date).toLocaleDateString()}</td>
                                    <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{inc.unitId}</td>
                                    <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #e2e8f0' }}>${inc.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                            {statement.income.length === 0 && (
                                <tr><td colSpan="3" style={{ padding: '10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>No income recorded.</td></tr>
                            )}
                        </tbody>
                    </table>

                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>{isAr ? 'تفاصيل المصروفات (الصيانة)' : 'Expense Details (Maintenance)'}</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f1f5f9' }}>
                                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #e2e8f0' }}>{isAr ? 'التاريخ' : 'Date'}</th>
                                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #e2e8f0' }}>{isAr ? 'رقم الوحدة' : 'Unit ID'}</th>
                                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #e2e8f0' }}>{isAr ? 'الوصف' : 'Description'}</th>
                                <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #e2e8f0' }}>{isAr ? 'التكلفة' : 'Cost'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statement.expenses.map((exp, idx) => (
                                <tr key={idx}>
                                    <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{new Date(exp.date).toLocaleDateString()}</td>
                                    <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{exp.unitId}</td>
                                    <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{exp.description}</td>
                                    <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #e2e8f0' }}>${exp.cost.toFixed(2)}</td>
                                </tr>
                            ))}
                            {statement.expenses.length === 0 && (
                                <tr><td colSpan="4" style={{ padding: '10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>No expenses recorded.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OwnerAccounting;
