import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Maintenance = (props) => {
    const { formatCurrency, currentLanguage, translations } = props;

    const [tickets, setTickets] = useState([
        { id: 'TKT-001', customer: 'John Doe', device: 'Laptop Dell XPS 15', status: 'Pending', cost: 150, date: '2026-07-10' },
        { id: 'TKT-002', customer: 'Jane Smith', device: 'iPhone 13 Pro', status: 'In Progress', cost: 0, date: '2026-07-11' }
    ]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ id: '', customer: '', device: '', issue: '', expectedDelivery: '', status: 'Pending', cost: 0, date: new Date().toISOString().split('T')[0] });
    const [printReceipt, setPrintReceipt] = useState(null);

    const handleSave = (e) => {
        e.preventDefault();
        const mock = { ...form, id: form.id || `TKT-00${tickets.length + 1}` };
        if (form.id) {
            setTickets(tickets.map(t => t.id === mock.id ? mock : t));
        } else {
            setTickets([...tickets, mock]);
        }
        setShowModal(false);
        setForm({ id: '', customer: '', device: '', issue: '', expectedDelivery: '', status: 'Pending', cost: 0, date: new Date().toISOString().split('T')[0] });
    };

    const handleDelete = (id) => {
        if (confirm(currentLanguage === 'ar' ? 'هل أنت متأكد؟' : 'Are you sure?')) {
            setTickets(tickets.filter(t => t.id !== id));
        }
    };

    return (
        <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>{currentLanguage === 'ar' ? 'الصيانة وإصلاح الأجهزة' : 'Maintenance & Repairs'}</h3>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <i className="ri-add-line" style={{ marginRight: '5px' }}></i>
                    {currentLanguage === 'ar' ? 'حجز جهاز للصيانة' : 'Device Booking'}
                </button>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>{currentLanguage === 'ar' ? 'رقم التذكرة' : 'Ticket ID'}</th>
                            <th>{currentLanguage === 'ar' ? 'العميل' : 'Customer'}</th>
                            <th>{currentLanguage === 'ar' ? 'الجهاز' : 'Device/Item'}</th>
                            <th>{currentLanguage === 'ar' ? 'المشكلة' : 'Issue'}</th>
                            <th>{currentLanguage === 'ar' ? 'التاريخ' : 'Date'}</th>
                            <th>{currentLanguage === 'ar' ? 'الحالة' : 'Status'}</th>
                            <th>{currentLanguage === 'ar' ? 'وقت التسليم' : 'Delivery Date'}</th>
                            <th>{currentLanguage === 'ar' ? 'التكلفة' : 'Cost'}</th>
                            <th>{currentLanguage === 'ar' ? 'إجراءات' : 'Actions'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center' }}>{currentLanguage === 'ar' ? 'لا توجد بيانات' : 'No records found'}</td></tr>
                        ) : (
                            tickets.map(t => (
                                <tr key={t.id}>
                                    <td>{t.id}</td>
                                    <td>{t.customer}</td>
                                    <td>{t.device}</td>
                                    <td>{t.issue || '-'}</td>
                                    <td>{t.date}</td>
                                    <td>
                                        <span style={{ 
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                                            background: t.status === 'Completed' ? 'rgba(34,197,94,0.2)' : t.status === 'In Progress' ? 'rgba(234,179,8,0.2)' : 'rgba(239,68,68,0.2)',
                                            color: t.status === 'Completed' ? '#4ade80' : t.status === 'In Progress' ? '#facc15' : '#f87171'
                                        }}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td>{t.expectedDelivery ? new Date(t.expectedDelivery).toLocaleString() : '-'}</td>
                                    <td>{formatCurrency(t.cost)}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="btn btn-success" onClick={() => setPrintReceipt(t)} title={currentLanguage === 'ar' ? 'طباعة' : 'Print'}>
                                                <i className="ri-printer-line"></i>
                                            </button>
                                            <button className="btn btn-secondary" onClick={() => { setForm(t); setShowModal(true); }}>
                                                <i className="ri-edit-line"></i>
                                            </button>
                                            <button className="btn btn-danger" onClick={() => handleDelete(t.id)}>
                                                <i className="ri-delete-bin-line"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>


            {printReceipt && ReactDOM.createPortal(
                <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.8)' }}>
                    <div className="modal print-receipt-modal" style={{ background: 'white', color: 'black', width: '100%', maxWidth: '350px', padding: '20px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#333' }}>{currentLanguage === 'ar' ? 'إيصال استلام' : 'Booking Receipt'}</h2>
                            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{new Date().toLocaleString()}</p>
                        </div>
                        <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#000' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #ccc', paddingBottom: '5px', marginBottom: '5px' }}>
                                <strong>{currentLanguage === 'ar' ? 'رقم التذكرة' : 'Ticket ID'}:</strong>
                                <span>{printReceipt.id}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #ccc', paddingBottom: '5px', marginBottom: '5px' }}>
                                <strong>{currentLanguage === 'ar' ? 'العميل' : 'Customer'}:</strong>
                                <span>{printReceipt.customer}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #ccc', paddingBottom: '5px', marginBottom: '5px' }}>
                                <strong>{currentLanguage === 'ar' ? 'الجهاز' : 'Device'}:</strong>
                                <span>{printReceipt.device}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #ccc', paddingBottom: '5px', marginBottom: '5px' }}>
                                <strong>{currentLanguage === 'ar' ? 'المشكلة' : 'Issue'}:</strong>
                                <span style={{ textAlign: 'right', maxWidth: '150px' }}>{printReceipt.issue}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #ccc', paddingBottom: '5px', marginBottom: '5px' }}>
                                <strong>{currentLanguage === 'ar' ? 'التكلفة المقدرة' : 'Est. Cost'}:</strong>
                                <span>{formatCurrency(printReceipt.cost)}</span>
                            </div>
                            {printReceipt.expectedDelivery && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #ccc', paddingBottom: '5px', marginBottom: '5px' }}>
                                    <strong>{currentLanguage === 'ar' ? 'وقت التسليم' : 'Delivery'}:</strong>
                                    <span style={{ textAlign: 'right', maxWidth: '150px', color: '#d97706', fontWeight: 'bold' }}>{new Date(printReceipt.expectedDelivery).toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#333' }}>
                            <p>{currentLanguage === 'ar' ? 'شكراً لثقتكم بنا!' : 'Thank you for your trust!'}</p>
                        </div>
                        
                        <div className="no-print" style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
                            <button className="btn btn-primary" onClick={() => window.print()}>{currentLanguage === 'ar' ? 'طباعة' : 'Print'}</button>
                            <button className="btn btn-secondary" onClick={() => setPrintReceipt(null)}>{translations[currentLanguage]?.close || 'Close'}</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3 style={{ marginBottom: '20px' }}>{currentLanguage === 'ar' ? 'تذكرة صيانة' : 'Maintenance Ticket'}</h3>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'اسم العميل' : 'Customer Name'}</label>
                                <input type="text" className="form-control" value={form.customer} onChange={e => setForm({ ...form, customer: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'الجهاز / القطعة' : 'Device / Item'}</label>
                                <input type="text" className="form-control" value={form.device} onChange={e => setForm({ ...form, device: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'وصف المشكلة' : 'Issue Description'}</label>
                                <textarea className="form-control" value={form.issue} onChange={e => setForm({ ...form, issue: e.target.value })} required rows="3"></textarea>
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'وقت التسليم المتوقع' : 'Expected Delivery'}</label>
                                <input type="datetime-local" className="form-control" value={form.expectedDelivery || ''} onChange={e => setForm({ ...form, expectedDelivery: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'تاريخ الاستلام' : 'Date'}</label>
                                <input type="date" className="form-control" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'الحالة' : 'Status'}</label>
                                <select className="form-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                    <option value="Pending">{currentLanguage === 'ar' ? 'قيد الانتظار' : 'Pending'}</option>
                                    <option value="In Progress">{currentLanguage === 'ar' ? 'جاري العمل' : 'In Progress'}</option>
                                    <option value="Completed">{currentLanguage === 'ar' ? 'مكتمل' : 'Completed'}</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'التكلفة المقدرة / الفعلية' : 'Estimated / Final Cost'}</label>
                                <input type="number" className="form-control" value={form.cost} onChange={e => setForm({ ...form, cost: Number(e.target.value) })} required />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>{translations[currentLanguage].close || 'Close'}</button>
                                <button type="submit" className="btn btn-primary">{currentLanguage === 'ar' ? 'حفظ' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Maintenance;
