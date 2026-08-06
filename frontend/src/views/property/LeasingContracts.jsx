import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function LeasingContracts({ currentLanguage, headers, activeTab }) {
    const isAr = currentLanguage === 'ar';
    const [leases, setLeases] = useState([]);
    const [units, setUnits] = useState([]);
    const [customers, setCustomers] = useState([]);
    
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [viewContract, setViewContract] = useState(null);
    const [formData, setFormData] = useState({
        unitId: '', customerId: '', startDate: '', endDate: '', rentAmount: '', paymentFrequency: 'Monthly', status: 'Active', managementFeeType: 'Percentage', managementFeeValue: 0
    });
    

    const [showInstallments, setShowInstallments] = useState(null); // stores the lease object to show installments
    const [printContract, setPrintContract] = useState(null); // stores lease for contract printing
    const [printReceipt, setPrintReceipt] = useState(null); // stores { lease, installment } for receipt printing


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
            if (Array.isArray(leaseRes.data)) setLeases(leaseRes.data); else setLeases([]);
            if (Array.isArray(unitsRes.data)) setUnits(unitsRes.data); else setUnits([]);
            if (Array.isArray(custRes.data)) setCustomers(custRes.data); else setCustomers([]);
        } catch (err) {
            console.error('Error fetching leasing data:', err);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`/api/lease-contracts/${editingId}`, formData, { headers });
            } else {
                await axios.post('/api/lease-contracts', formData, { headers });
            }
            setShowModal(false);
            setEditingId(null);
            setFormData({ unitId: '', customerId: '', startDate: '', endDate: '', rentAmount: '', paymentFrequency: 'Monthly', status: 'Active', managementFeeType: 'Percentage', managementFeeValue: 0 });
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
        const u = units.find(x => (x._id || x.id) === id);
        return u ? `${u.unitNumber} (${u.type})` : id;
    };
    const getCustomerName = (id) => {
        const c = customers.find(x => (x._id || x.id) === id);
        return c ? c.name : id;
    };

    return (
        <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>{isAr ? 'بيانات بداية عقد الإيجار' : 'Data of Starting Lease Contract'}</h2>
                <button onClick={() => { setEditingId(null); setFormData({ unitId: '', customerId: '', startDate: '', endDate: '', rentAmount: '', paymentFrequency: 'Monthly', status: 'Active', managementFeeType: 'Percentage', managementFeeValue: 0 }); setShowModal(true); }} className="btn btn-primary">
                    <i className="ri-add-line"></i> {isAr ? 'إضافة عقد جديد' : 'New Contract'}
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
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        <button className="btn btn-info btn-icon" onClick={() => setViewContract(lease)} title={isAr ? 'عرض' : 'View'}>
                                            <i className="ri-eye-line"></i>
                                        </button>
                                        <button className="btn btn-warning btn-icon" onClick={() => {
                                            setEditingId(lease._id || lease.id);
                                            setFormData({
                                                unitId: lease.unitId,
                                                customerId: lease.customerId,
                                                startDate: new Date(lease.startDate).toISOString().split('T')[0],
                                                endDate: new Date(lease.endDate).toISOString().split('T')[0],
                                                rentAmount: lease.rentAmount,
                                                paymentFrequency: lease.paymentFrequency,
                                                status: lease.status,
                                                managementFeeType: lease.managementFeeType || 'Percentage',
                                                managementFeeValue: lease.managementFeeValue || 0
                                            });
                                            setShowModal(true);
                                        }} title={isAr ? 'تعديل' : 'Edit'}>
                                            <i className="ri-edit-line"></i>
                                        </button>
                                        <button className="btn btn-primary btn-icon" onClick={() => setPrintContract(lease)} title={isAr ? 'طباعة العقد' : 'Print Contract'}>
                                            <i className="ri-printer-line"></i>
                                        </button>
                                        <button className="btn btn-success btn-icon" onClick={() => setShowInstallments(lease)} title={isAr ? 'الأقساط' : 'Installments'}>
                                            <i className="ri-money-dollar-circle-line"></i>
                                        </button>
                                        <button className="btn btn-secondary btn-icon" onClick={() => handleSetPassword(lease.customerId)} title={isAr ? 'تعيين كلمة مرور البوابة' : 'Set Portal Password'} style={{ color: 'var(--accent-purple)' }}>
                                            <i className="ri-key-2-line"></i>
                                        </button>
                                        <button className="btn btn-danger btn-icon" onClick={() => handleDelete(lease._id || lease.id)} title={isAr ? 'حذف' : 'Delete'}>
                                            <i className="ri-delete-bin-line"></i>
                                        </button>
                                    </div>
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
                                                <button className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => handlePayInstallment(showInstallments._id, idx)}>
                                                    {isAr ? 'دفع' : 'Pay'}
                                                </button>
                                            ) : (
                                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '12px', color: 'var(--accent-green)' }}><i className="ri-check-line"></i> Paid</span>
                                                    <button className="btn btn-secondary" style={{ padding: '2px 6px', fontSize: '12px' }} onClick={() => setPrintReceipt({ lease: showInstallments, installment: inst, index: idx + 1 })}>
                                                        <i className="ri-printer-line"></i>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="modal-actions" style={{ marginTop: '20px' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowInstallments(null)}>
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
                        <h3>{editingId ? (isAr ? 'تعديل بيانات العقد' : 'Edit Contract Data') : (isAr ? 'إضافة بيانات عقد إيجار جديد' : 'Add Data of Starting Lease Contract')}</h3>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>{isAr ? 'الوحدة' : 'Unit'}</label>
                                <select className="form-control" required value={formData.unitId} onChange={e => setFormData({...formData, unitId: e.target.value})}>
                                    <option value="">{isAr ? '-- اختر الوحدة --' : '-- Select Unit --'}</option>
                                    {units.filter(u => u.status === 'Available' || !u.status).map(u => (
                                        <option key={u._id || u.id} value={u._id || u.id}>{u.unitNumber} ({u.type}) - {u.dailyRate}/day</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>{isAr ? 'المستأجر' : 'Tenant (Customer)'}</label>
                                <select className="form-control" required value={formData.customerId} onChange={e => setFormData({...formData, customerId: e.target.value})}>
                                    <option value="">{isAr ? '-- اختر المستأجر --' : '-- Select Tenant --'}</option>
                                    {customers.map(c => (
                                        <option key={c._id || c.id} value={c._id || c.id}>{c.name} - {c.phone}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label>{isAr ? 'تاريخ البداية' : 'Start Date'}</label>
                                    <input type="date" className="form-control" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>{isAr ? 'تاريخ النهاية' : 'End Date'}</label>
                                    <input type="date" className="form-control" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                                </div>
                            </div>
                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label>{isAr ? 'إجمالي الإيجار' : 'Total Rent Amount'}</label>
                                    <input type="number" className="form-control" required min="0" value={formData.rentAmount} onChange={e => setFormData({...formData, rentAmount: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>{isAr ? 'تكرار الدفع' : 'Payment Frequency'}</label>
                                    <select className="form-control" value={formData.paymentFrequency} onChange={e => setFormData({...formData, paymentFrequency: e.target.value})}>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Quarterly">Quarterly</option>
                                        <option value="Semi-Annually">Semi-Annually</option>
                                        <option value="Yearly">Yearly</option>
                                        <option value="One-time">One-time</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label>{isAr ? 'نوع رسوم الإدارة' : 'Management Fee Type'}</label>
                                    <select className="form-control" value={formData.managementFeeType} onChange={e => setFormData({...formData, managementFeeType: e.target.value})}>
                                        <option value="Percentage">Percentage Fee (%)</option>
                                        <option value="Fixed">Fixed Monthly Fee</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>{isAr ? 'قيمة رسوم الإدارة' : 'Management Fee Value'}</label>
                                    <input type="number" className="form-control" min="0" value={formData.managementFeeValue} onChange={e => setFormData({...formData, managementFeeValue: e.target.value})} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>{isAr ? 'الحالة' : 'Status'}</label>
                                <select className="form-control" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                    <option value="Active">Active</option>
                                    <option value="Expired">Expired</option>
                                    <option value="Terminated">Terminated</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setEditingId(null); }}>{isAr ? 'إلغاء' : 'Cancel'}</button>
                                <button type="submit" className="btn btn-primary">{isAr ? 'حفظ' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* PRINT CONTRACT MODAL */}
            {printContract && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="print-area" style={{ padding: '40px', background: '#fff', color: '#000', minHeight: '800px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid #000', paddingBottom: '20px' }}>
                                <h1 style={{ margin: 0, fontSize: '28px' }}>{isAr ? 'بيانات بداية عقد الإيجار' : 'Data of Starting Lease Contract'}</h1>
                                <p style={{ fontSize: '14px', color: '#666' }}>ID: {printContract._id || printContract.id}</p>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
                                <div>
                                    <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px' }}>{isAr ? 'تفاصيل المالك / الإدارة' : 'Landlord / Management Details'}</h3>
                                    <p><strong>{isAr ? 'الإدارة:' : 'Management:'}</strong> 26i ERP Real Estate</p>
                                </div>
                                <div>
                                    <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px' }}>{isAr ? 'بيانات المستأجر' : 'Tenant Details'}</h3>
                                    <p><strong>{isAr ? 'الاسم:' : 'Name:'}</strong> {getCustomerName(printContract.customerId)}</p>
                                </div>
                            </div>

                            <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px' }}>{isAr ? 'تفاصيل العقد' : 'Contract Details'}</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontWeight: 'bold', width: '30%' }}>{isAr ? 'الوحدة:' : 'Unit:'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{getUnitName(printContract.unitId)}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>{isAr ? 'تاريخ البداية:' : 'Start Date:'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{new Date(printContract.startDate).toLocaleDateString()}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>{isAr ? 'تاريخ النهاية:' : 'End Date:'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{new Date(printContract.endDate).toLocaleDateString()}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>{isAr ? 'الإيجار الإجمالي:' : 'Total Rent:'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontSize: '18px', fontWeight: 'bold' }}></td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>{isAr ? 'تكرار الدفع:' : 'Payment Frequency:'}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{printContract.paymentFrequency}</td>
                                    </tr>
                                </tbody>
                            </table>
                            
                            <div style={{ marginTop: '100px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', textAlign: 'center' }}>
                                <div>
                                    <div style={{ borderTop: '1px solid #000', paddingTop: '8px', margin: '0 20px' }}>
                                        <strong>{isAr ? 'توقيع المستأجر' : 'Tenant Signature'}</strong>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ borderTop: '1px solid #000', paddingTop: '8px', margin: '0 20px' }}>
                                        <strong>{isAr ? 'توقيع المالك/المدير' : 'Landlord/Manager Signature'}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="no-print" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--glass-border)', paddingTop: '12px', marginTop: '20px' }}>
                            <button className="btn btn-secondary" onClick={() => setPrintContract(null)}>{isAr ? 'إغلاق' : 'Close'}</button>
                            <button className="btn btn-primary" onClick={() => window.print()}>{isAr ? 'طباعة' : 'Print'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* PRINT RECEIPT MODAL */}
            {printReceipt && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="print-area" style={{ padding: '40px', background: '#fff', color: '#000', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '800px', margin: '0 auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: '20px', marginBottom: '30px' }}>
                                <div>
                                    <h1 style={{ margin: 0, fontSize: '28px', color: '#166534' }}>{isAr ? 'سند قبض' : 'Receipt Voucher'}</h1>
                                    <p style={{ margin: '5px 0 0 0', color: '#666' }}>No. #{printReceipt.index} - {printReceipt.lease._id?.substring(0,6)}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ margin: 0 }}><strong>{isAr ? 'التاريخ:' : 'Date:'}</strong> {new Date().toLocaleDateString()}</p>
                                    <p style={{ margin: '5px 0 0 0' }}><strong>{isAr ? 'تاريخ استحقاق القسط:' : 'Installment Due:'}</strong> {new Date(printReceipt.installment.dueDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                                <p style={{ fontSize: '18px', lineHeight: '1.8' }}>
                                    {isAr ? 'استلمنا من السيد/السادة:' : 'Received from Mr./M/s:'} <strong>{getCustomerName(printReceipt.lease.customerId)}</strong><br/>
                                    {isAr ? 'مبلغ وقدره:' : 'The sum of:'} <strong style={{ fontSize: '22px' }}></strong><br/>
                                    {isAr ? 'وذلك عن إيجار الوحدة:' : 'Being rent for unit:'} <strong>{getUnitName(printReceipt.lease.unitId)}</strong>
                                </p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '80px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                                <div style={{ textAlign: 'center', width: '200px' }}>
                                    <div style={{ borderTop: '1px solid #000', paddingTop: '8px' }}>
                                        <strong>{isAr ? 'المستلم' : 'Receiver'}</strong>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center', width: '200px' }}>
                                    <div style={{ borderTop: '1px solid #000', paddingTop: '8px' }}>
                                        <strong>{isAr ? 'الختم' : 'Stamp'}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="no-print" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--glass-border)', paddingTop: '12px', marginTop: '20px' }}>
                            <button className="btn btn-secondary" onClick={() => setPrintReceipt(null)}>{isAr ? 'إغلاق' : 'Close'}</button>
                            <button className="btn btn-primary" onClick={() => window.print()}>{isAr ? 'طباعة' : 'Print'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW CONTRACT MODAL */}
            {viewContract && (
                <div className="modal-overlay">
                    <div className="modal" style={{ maxWidth: '600px' }}>
                        <h3>{isAr ? 'تفاصيل العقد' : 'Contract Details'}</h3>
                        <div style={{ marginTop: '20px', lineHeight: '1.8' }}>
                            <p><strong>{isAr ? 'الوحدة:' : 'Unit:'}</strong> {getUnitName(viewContract.unitId)}</p>
                            <p><strong>{isAr ? 'المستأجر:' : 'Tenant:'}</strong> {getCustomerName(viewContract.customerId)}</p>
                            <p><strong>{isAr ? 'تاريخ البداية:' : 'Start Date:'}</strong> {new Date(viewContract.startDate).toLocaleDateString()}</p>
                            <p><strong>{isAr ? 'تاريخ النهاية:' : 'End Date:'}</strong> {new Date(viewContract.endDate).toLocaleDateString()}</p>
                            <p><strong>{isAr ? 'الإيجار الإجمالي:' : 'Total Rent:'}</strong> {viewContract.rentAmount}</p>
                            <p><strong>{isAr ? 'تكرار الدفع:' : 'Payment Frequency:'}</strong> {viewContract.paymentFrequency}</p>
                            <p><strong>{isAr ? 'الحالة:' : 'Status:'}</strong> {viewContract.status}</p>
                            <p><strong>{isAr ? 'نوع رسوم الإدارة:' : 'Management Fee Type:'}</strong> {viewContract.managementFeeType}</p>
                            <p><strong>{isAr ? 'قيمة رسوم الإدارة:' : 'Management Fee Value:'}</strong> {viewContract.managementFeeValue}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <button className="btn btn-secondary" onClick={() => setViewContract(null)}>{isAr ? 'إغلاق' : 'Close'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

