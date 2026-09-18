import React, { useState, useEffect } from 'react';

const GroupBlocks = ({ currentLanguage, formatCurrency }) => {
    const isAr = currentLanguage === 'ar';
    const [groups, setGroups] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        name: '', startDate: '', endDate: '', roomsBlocked: 10, rate: 0, status: 'Tentative', companyId: ''
    });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/groups', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await res.json();
            setGroups(data);
        } catch (err) { console.error('Error fetching groups', err); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await fetch('/api/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(form)
            });
            setShowModal(false);
            fetchData();
        } catch (err) { console.error('Error saving group block', err); }
    };

    return (
        <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h3 style={{ margin: 0 }}>
                        <i className="ri-team-line" style={{ color: 'var(--accent-purple)', marginRight: '6px' }}></i>
                        {isAr ? 'حجوزات المجموعات (Group Blocks)' : 'Group Blocks'}
                    </h3>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        {isAr ? 'إدارة المجموعات، الفعاليات، وحفلات الزفاف' : 'Manage corporate events, weddings, and group room blocks'}
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <i className="ri-add-line"></i> {isAr ? 'مجموعة جديدة' : 'New Group Block'}
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>{isAr ? 'الاسم' : 'Name'}</th>
                            <th>{isAr ? 'الفترة' : 'Dates'}</th>
                            <th>{isAr ? 'الغرف المحجوزة' : 'Rooms Blocked'}</th>
                            <th>{isAr ? 'سعر الغرفة' : 'Agreed Rate'}</th>
                            <th>{isAr ? 'الحالة' : 'Status'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groups.map(g => (
                            <tr key={g.id}>
                                <td>{g.name}</td>
                                <td>{new Date(g.startDate).toLocaleDateString()} - {new Date(g.endDate).toLocaleDateString()}</td>
                                <td>{g.roomsBlocked}</td>
                                <td>{formatCurrency(g.rate)}</td>
                                <td><span className={`status-badge ${g.status === 'Definite' ? 'valid' : 'warning'}`}>{g.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{isAr ? 'إضافة مجموعة جديدة' : 'Add New Group Block'}</h3>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>{isAr ? 'اسم المجموعة' : 'Group Name'}</label>
                                <input type="text" className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>{isAr ? 'تاريخ البداية' : 'Start Date'}</label>
                                    <input type="date" className="form-control" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} required />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>{isAr ? 'تاريخ النهاية' : 'End Date'}</label>
                                    <input type="date" className="form-control" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} required />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>{isAr ? 'عدد الغرف' : 'Rooms Blocked'}</label>
                                    <input type="number" className="form-control" value={form.roomsBlocked} onChange={e => setForm({ ...form, roomsBlocked: e.target.value })} required />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>{isAr ? 'السعر المتفق عليه' : 'Agreed Rate'}</label>
                                    <input type="number" className="form-control" value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>{isAr ? 'الحالة' : 'Status'}</label>
                                <select className="form-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                    <option value="Tentative">Tentative</option>
                                    <option value="Definite">Definite</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>{isAr ? 'إلغاء' : 'Cancel'}</button>
                                <button type="submit" className="btn btn-primary">{isAr ? 'حفظ' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupBlocks;
