import React, { useState, useEffect } from 'react';

const LeasingContracts = ({ currentLanguage }) => {
    const isAr = currentLanguage === 'ar';
    const [contracts, setContracts] = useState([]);
    const [units, setUnits] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [unitId, setUnitId] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [rentAmount, setRentAmount] = useState('');
    const [paymentFrequency, setPaymentFrequency] = useState('Monthly');
    const [managementFeeType, setManagementFeeType] = useState('Percentage');
    const [managementFeeValue, setManagementFeeValue] = useState(10);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [cRes, uRes, custRes] = await Promise.all([
                fetch('/api/lease-contracts', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/units', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/customers', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            const cData = await cRes.json();
            const uData = await uRes.json();
            const custData = await custRes.json();
            if (Array.isArray(cData)) setContracts(cData); else setContracts([]);
            if (Array.isArray(uData)) setUnits(uData); else setUnits([]);
            if (Array.isArray(custData)) setCustomers(custData); else setCustomers([]);
        } catch (err) { console.error(err); }
    };

    const handleCreateContract = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/lease-contracts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    unitId, customerId, startDate, endDate,
                    rentAmount: Number(rentAmount), paymentFrequency,
                    managementFeeType, managementFeeValue: Number(managementFeeValue)
                })
            });
            const data = await res.json();
            if (data) {
                alert(isAr ? 'تم إنشاء عقد الإيجار وجدولة الدفعات بنجاح!' : 'Lease contract created with installments scheduled!');
                setShowModal(false);
                fetchData();
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                        <i className="ri-file-paper-2-line" style={{ color: 'var(--accent-purple)', marginRight: isAr ? '0' : '8px', marginLeft: isAr ? '8px' : '0' }}></i>
                        {isAr ? 'عقود الإيجار السنوية والدورية (Lease Contracts)' : 'Lease & Long-Term Contracts'}
                    </h2>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        {isAr ? 'إدارة عقود الإيجار، جدولة الأقساط والدفعات، ونسب إدارة الأملاك' : 'Manage long-term leases, automated installment schedules, and property management fees'}
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <i className="ri-add-line"></i> {isAr ? 'إنشاء عقد إيجار جديد' : 'New Lease Contract'}
                </button>
            </div>

            <div className="glass-card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>{isAr ? 'رقم العقد' : 'Contract ID'}</th>
                                <th>{isAr ? 'الوحدة / الغرفة' : 'Unit'}</th>
                                <th>{isAr ? 'المستأجر' : 'Tenant / Customer'}</th>
                                <th>{isAr ? 'الفترة' : 'Period'}</th>
                                <th style={{ textAlign: 'right' }}>{isAr ? 'مبلغ الإيجار' : 'Rent Amount'}</th>
                                <th>{isAr ? 'دورية الدفع' : 'Frequency'}</th>
                                <th style={{ textAlign: 'center' }}>{isAr ? 'الحالة' : 'Status'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contracts.map(c => {
                                const u = units.find(unit => unit.id === c.unitId);
                                const cust = customers.find(cust => cust.id === c.customerId);
                                return (
                                    <tr key={c._id || c.id}>
                                        <td><strong>#{c.id || (c._id ? c._id.slice(-6) : '')}</strong></td>
                                        <td>#{u ? u.unitNumber : c.unitId} ({u ? u.type : ''})</td>
                                        <td>{cust ? cust.name : c.customerId}</td>
                                        <td>
                                            {new Date(c.startDate).toLocaleDateString()} ➔ {new Date(c.endDate).toLocaleDateString()}
                                        </td>
                                        <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                                            {Number(c.rentAmount).toFixed(2)} SAR
                                        </td>
                                        <td><span className="badge badge-primary">{c.paymentFrequency}</span></td>
                                        <td style={{ textAlign: 'center' }}><span className="status-badge valid">{c.status}</span></td>
                                    </tr>
                                );
                            })}
                            {contracts.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                                        {isAr ? 'لا توجد عقود إيجار مسجلة' : 'No lease contracts found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal glass-card" style={{ maxWidth: '520px', width: '100%', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0 }}>{isAr ? 'إنشاء عقد إيجار جديد' : 'New Lease Contract'}</h3>
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}><i className="ri-close-line"></i></button>
                        </div>
                        <form onSubmit={handleCreateContract} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)' }}>{isAr ? 'الوحدة / الغرفة' : 'Unit / Room'}</label>
                                <select className="form-control" value={unitId} onChange={e => setUnitId(e.target.value)} required>
                                    <option value="">{isAr ? 'اختر الوحدة...' : 'Select Unit...'}</option>
                                    {units.map(u => <option key={u.id} value={u.id}>#{u.unitNumber} ({u.type}) - {u.dailyRate} SAR/day</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)' }}>{isAr ? 'المستأجر / العميل' : 'Customer / Tenant'}</label>
                                <select className="form-control" value={customerId} onChange={e => setCustomerId(e.target.value)} required>
                                    <option value="">{isAr ? 'اختر المستأجر...' : 'Select Customer...'}</option>
                                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone || ''})</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)' }}>{isAr ? 'تاريخ البداية' : 'Start Date'}</label>
                                    <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)' }}>{isAr ? 'تاريخ النهاية' : 'End Date'}</label>
                                    <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)' }}>{isAr ? 'قيمة الإيجار الإجمالية' : 'Total Rent (SAR)'}</label>
                                    <input type="number" className="form-control" value={rentAmount} onChange={e => setRentAmount(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)' }}>{isAr ? 'دورية السداد' : 'Payment Frequency'}</label>
                                    <select className="form-control" value={paymentFrequency} onChange={e => setPaymentFrequency(e.target.value)}>
                                        <option value="Monthly">{isAr ? 'شهري (Monthly)' : 'Monthly'}</option>
                                        <option value="Quarterly">{isAr ? 'ربع سنوي (Quarterly)' : 'Quarterly'}</option>
                                        <option value="Semi-Annually">{isAr ? 'نصف سنوي (Semi-Annually)' : 'Semi-Annually'}</option>
                                        <option value="Yearly">{isAr ? 'سنوي (Yearly)' : 'Yearly'}</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>{isAr ? 'إلغاء' : 'Cancel'}</button>
                                <button type="submit" className="btn btn-primary">{isAr ? 'حفظ وجدولة الأقساط' : 'Save & Schedule'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeasingContracts;
