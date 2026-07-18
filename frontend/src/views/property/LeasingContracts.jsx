import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function LeasingContracts({ currentLanguage, headers, activeTab }) {
    const isAr = currentLanguage === 'ar';
    const [leases, setLeases] = useState([]);
    const [units, setUnits] = useState([]);
    const [customers, setCustomers] = useState([]);
    
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        unitId: '', customerId: '', startDate: '', endDate: '', rentAmount: '', paymentFrequency: 'Monthly', status: 'Active'
    });
    
    const [showInstallments, setShowInstallments] = useState(null); // stores the lease object to show installments

    useEffect(() => {
        if (activeTab === 'property_leasing') {
            fetchData();
        }
    }, [activeTab]);

    const fetchData = async () => {
        try {
            const [leaseRes, unitsRes, custRes] = await Promise.all([
                axios.get('/api/lease-contracts', { headers }),
                axios.get('/api/units', { headers }),
                axios.get('/api/customers', { headers })
            ]);
            setLeases(leaseRes.data);
            setUnits(unitsRes.data);
            setCustomers(custRes.data);
        } catch (err) {
            console.error('Error fetching leasing data:', err);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/lease-contracts', formData, { headers });
            setShowModal(false);
            setFormData({ unitId: '', customerId: '', startDate: '', endDate: '', rentAmount: '', paymentFrequency: 'Monthly', status: 'Active' });
            fetchData();
        } catch (err) {
            alert('Error saving lease contract');
        }
    };

    const handlePayInstallment = async (leaseId, idx) => {
        if (!window.confirm(isAr ? 'هل أنت متأكد من دفع هذا القسط؟' : 'Are you sure you want to mark this installment as paid?')) return;
        try {
            await axios.patch(`/api/lease-contracts/${leaseId}/installments/${idx}/pay`, {}, { headers });
            fetchData();
            
            // update local state for the modal
            setShowInstallments(prev => {
                if (prev && prev._id === leaseId) {
                    const newInst = [...prev.installments];
                    newInst[idx].status = 'Paid';
                    return { ...prev, installments: newInst };
                }
                return prev;
            });
        } catch (err) {
            alert(err.response?.data?.error || 'Error processing payment');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(isAr ? 'هل أنت متأكد؟' : 'Are you sure?')) return;
        try {
            await axios.delete(`/api/lease-contracts/${id}`, { headers });
            fetchData();
        } catch (err) {
            alert('Error deleting lease');
        }
    };

    const handleSetPassword = async (customerId) => {
        const password = window.prompt(isAr ? 'أدخل كلمة مرور البوابة الجديدة للمستأجر:' : 'Enter new portal password for this tenant:');
        if (!password) return;
        try {
            await axios.post(`/api/customers/${customerId}/set-password`, { password }, { headers });
            alert(isAr ? 'تم تعيين كلمة المرور بنجاح' : 'Password set successfully');
        } catch (err) {
            alert('Error setting password');
        }
    };

    const getUnitName = (id) => {
        const u = units.find(x => x._id === id);
        return u ? `${u.unitNumber} (${u.type})` : id;
    };
    const getCustomerName = (id) => {
        const c = customers.find(x => x._id === id);
        return c ? c.name : id;
    };

    return (
        <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>{isAr ? 'عقود الإيجار' : 'Leasing & Contracts'}</h2>
                <button onClick={() => setShowModal(true)} className="modern-btn primary">
                    <i className="ri-add-line"></i> {isAr ? 'عقد جديد' : 'New Lease Contract'}
                </button>
            </div>

            <div className="table-responsive">
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>{isAr ? 'الوحدة' : 'Unit'}</th>
                            <th>{isAr ? 'المستأجر' : 'Tenant'}</th>
                            <th>{isAr ? 'الفترة' : 'Period'}</th>
                            <th>{isAr ? 'الإيجار الإجمالي' : 'Total Rent'}</th>
                            <th>{isAr ? 'الدفع' : 'Payment'}</th>
                            <th>{isAr ? 'الحالة' : 'Status'}</th>
                            <th>{isAr ? 'إجراءات' : 'Actions'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leases.map(lease => (
                            <tr key={lease._id}>
                                <td>{getUnitName(lease.unitId)}</td>
                                <td>{getCustomerName(lease.customerId)}</td>
                                <td>{new Date(lease.startDate).toLocaleDateString()} - {new Date(lease.endDate).toLocaleDateString()}</td>
                                <td>{lease.rentAmount}</td>
                                <td>{lease.paymentFrequency}</td>
                                <td>
                                    <span className={`status-badge ${lease.status === 'Active' ? 'success' : lease.status === 'Expired' ? 'warning' : 'danger'}`}>
                                        {lease.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="icon-btn info" onClick={() => setShowInstallments(lease)} title={isAr ? 'الأقساط' : 'Installments'}>
                                        <i className="ri-money-dollar-circle-line"></i>
                                    </button>
                                    <button className="icon-btn" onClick={() => handleSetPassword(lease.customerId)} title={isAr ? 'تعيين كلمة مرور البوابة' : 'Set Portal Password'} style={{ marginLeft: '8px', color: 'var(--accent-purple)' }}>
                                        <i className="ri-key-2-line"></i>
                                    </button>
                                    <button className="icon-btn danger" onClick={() => handleDelete(lease._id)} style={{ marginLeft: '8px' }}>
                                        <i className="ri-delete-bin-line"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {leases.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                    {isAr ? 'لا توجد عقود' : 'No contracts found'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Installments Modal */}
            {showInstallments && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '600px' }}>
                        <h3>{isAr ? 'جدول الدفعات' : 'Installments Schedule'}</h3>
                        <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                            {getUnitName(showInstallments.unitId)} - {getCustomerName(showInstallments.customerId)}
                        </p>
                        
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>{isAr ? 'تاريخ الاستحقاق' : 'Due Date'}</th>
                                    <th>{isAr ? 'المبلغ' : 'Amount'}</th>
                                    <th>{isAr ? 'الحالة' : 'Status'}</th>
                                    <th>{isAr ? 'إجراء' : 'Action'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {showInstallments.installments.map((inst, idx) => (
                                    <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td>{new Date(inst.dueDate).toLocaleDateString()}</td>
                                        <td>{inst.amount}</td>
                                        <td>
                                            <span className={`status-badge ${inst.status === 'Paid' ? 'success' : 'warning'}`}>
                                                {inst.status}
                                            </span>
                                        </td>
                                        <td>
                                            {inst.status === 'Pending' ? (
                                                <button className="modern-btn primary" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => handlePayInstallment(showInstallments._id, idx)}>
                                                    {isAr ? 'دفع' : 'Pay'}
                                                </button>
                                            ) : (
                                                <span style={{ fontSize: '12px', color: 'var(--accent-green)' }}><i className="ri-check-line"></i> Paid</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="modal-actions" style={{ marginTop: '20px' }}>
                            <button type="button" className="modern-btn" onClick={() => setShowInstallments(null)}>
                                {isAr ? 'إغلاق' : 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{isAr ? 'إضافة عقد جديد' : 'Add New Lease Contract'}</h3>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>{isAr ? 'الوحدة' : 'Unit'}</label>
                                <select className="modern-input" required value={formData.unitId} onChange={e => setFormData({...formData, unitId: e.target.value})}>
                                    <option value="">{isAr ? '-- اختر الوحدة --' : '-- Select Unit --'}</option>
                                    {units.filter(u => u.status === 'Available').map(u => (
                                        <option key={u._id} value={u._id}>{u.unitNumber} ({u.type}) - {u.dailyRate}/day</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>{isAr ? 'المستأجر' : 'Tenant (Customer)'}</label>
                                <select className="modern-input" required value={formData.customerId} onChange={e => setFormData({...formData, customerId: e.target.value})}>
                                    <option value="">{isAr ? '-- اختر المستأجر --' : '-- Select Tenant --'}</option>
                                    {customers.map(c => (
                                        <option key={c._id} value={c._id}>{c.name} - {c.phone}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label>{isAr ? 'تاريخ البداية' : 'Start Date'}</label>
                                    <input type="date" className="modern-input" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>{isAr ? 'تاريخ النهاية' : 'End Date'}</label>
                                    <input type="date" className="modern-input" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                                </div>
                            </div>
                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label>{isAr ? 'إجمالي الإيجار' : 'Total Rent Amount'}</label>
                                    <input type="number" className="modern-input" required min="0" value={formData.rentAmount} onChange={e => setFormData({...formData, rentAmount: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>{isAr ? 'تكرار الدفع' : 'Payment Frequency'}</label>
                                    <select className="modern-input" value={formData.paymentFrequency} onChange={e => setFormData({...formData, paymentFrequency: e.target.value})}>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Quarterly">Quarterly</option>
                                        <option value="Semi-Annually">Semi-Annually</option>
                                        <option value="Yearly">Yearly</option>
                                        <option value="One-time">One-time</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>{isAr ? 'الحالة' : 'Status'}</label>
                                <select className="modern-input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                    <option value="Active">Active</option>
                                    <option value="Expired">Expired</option>
                                    <option value="Terminated">Terminated</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="modern-btn" onClick={() => setShowModal(false)}>{isAr ? 'إلغاء' : 'Cancel'}</button>
                                <button type="submit" className="modern-btn primary">{isAr ? 'حفظ' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
