import React, { useState } from 'react';

const Maintenance = (props) => {
    const { formatCurrency, currentLanguage, translations } = props;

    const [tickets, setTickets] = useState([
        { id: 'TKT-001', customer: 'John Doe', device: 'Laptop Dell XPS 15', status: 'Pending', cost: 150, date: '2026-07-10' },
        { id: 'TKT-002', customer: 'Jane Smith', device: 'iPhone 13 Pro', status: 'In Progress', cost: 0, date: '2026-07-11' }
    ]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ id: '', customer: '', device: '', status: 'Pending', cost: 0, date: new Date().toISOString().split('T')[0] });

    const handleSave = (e) => {
        e.preventDefault();
        const mock = { ...form, id: form.id || `TKT-00${tickets.length + 1}` };
        if (form.id) {
            setTickets(tickets.map(t => t.id === mock.id ? mock : t));
        } else {
            setTickets([...tickets, mock]);
        }
        setShowModal(false);
        setForm({ id: '', customer: '', device: '', status: 'Pending', cost: 0, date: new Date().toISOString().split('T')[0] });
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
                    {currentLanguage === 'ar' ? 'تذكرة صيانة جديدة' : 'New Ticket'}
                </button>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>{currentLanguage === 'ar' ? 'رقم التذكرة' : 'Ticket ID'}</th>
                            <th>{currentLanguage === 'ar' ? 'العميل' : 'Customer'}</th>
                            <th>{currentLanguage === 'ar' ? 'الجهاز' : 'Device/Item'}</th>
                            <th>{currentLanguage === 'ar' ? 'التاريخ' : 'Date'}</th>
                            <th>{currentLanguage === 'ar' ? 'الحالة' : 'Status'}</th>
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
                                    <td>{formatCurrency(t.cost)}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
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
