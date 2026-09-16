import React, { useState, useEffect } from 'react';

const RealEstateCRM = ({ currentLanguage }) => {
    const isAr = currentLanguage === 'ar';
    const [leads, setLeads] = useState([]);
    const [properties, setProperties] = useState([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [source, setSource] = useState('Website');
    const [budget, setBudget] = useState('');
    const [interestedPropertyId, setInterestedPropertyId] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [leadRes, propRes] = await Promise.all([
                fetch('/api/leads', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/properties', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            const lData = await leadRes.json();
            const pData = await propRes.json();
            if (Array.isArray(lData)) setLeads(lData); else setLeads([]);
            if (Array.isArray(pData)) setProperties(pData); else setProperties([]);
        } catch (err) { console.error(err); }
    };

    const handleCreateLead = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    name, phone, email, source,
                    budget: Number(budget || 0),
                    interestedPropertyId: interestedPropertyId || undefined
                })
            });
            setName('');
            setPhone('');
            setEmail('');
            setBudget('');
            setShowModal(false);
            fetchData();
        } catch (err) { console.error(err); }
    };

    const updateLeadStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/leads/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status })
            });
            setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
        } catch (err) { console.error(err); }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                        <i className="ri-user-follow-line" style={{ color: 'var(--accent-cyan)', marginRight: isAr ? '0' : '8px', marginLeft: isAr ? '8px' : '0' }}></i>
                        {isAr ? 'إدارة العملاء المحتملين والمهتمين (Real Estate CRM)' : 'Real Estate CRM & Leads'}
                    </h2>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        {isAr ? 'متابعة استفسارات النزلاء، طلبات الشراء والاستئجار، ومراحل التفاوض' : 'Track prospective guests, buyers, inquiries, viewing appointments, and deal pipeline'}
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <i className="ri-user-add-line"></i> {isAr ? 'إضافة عميل محتمل' : 'New Lead'}
                </button>
            </div>

            <div className="glass-card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>{isAr ? 'الاسم' : 'Name'}</th>
                                <th>{isAr ? 'الجوال والبريد' : 'Contact'}</th>
                                <th>{isAr ? 'المصدر' : 'Source'}</th>
                                <th>{isAr ? 'العقار المهتم به' : 'Interested In'}</th>
                                <th style={{ textAlign: 'right' }}>{isAr ? 'الميزانية' : 'Budget'}</th>
                                <th style={{ textAlign: 'center' }}>{isAr ? 'مرحلة العميل' : 'Stage / Status'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map(l => {
                                const prop = properties.find(p => p.id === l.interestedPropertyId);
                                return (
                                    <tr key={l.id}>
                                        <td><strong>{l.name}</strong></td>
                                        <td>
                                            <div>{l.phone}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{l.email}</div>
                                        </td>
                                        <td><span className="badge badge-primary">{l.source}</span></td>
                                        <td>{prop ? prop.name : (isAr ? 'عام' : 'General')}</td>
                                        <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                                            {l.budget ? `${Number(l.budget).toFixed(2)} SAR` : '-'}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <select 
                                                className="form-control"
                                                style={{ fontSize: '11px', padding: '2px 6px', height: '26px', width: 'auto', display: 'inline-block' }}
                                                value={l.status || 'New'}
                                                onChange={(e) => updateLeadStatus(l.id, e.target.value)}
                                            >
                                                <option value="New">{isAr ? 'جديد New' : 'New'}</option>
                                                <option value="Contacted">{isAr ? 'تم التواصل Contacted' : 'Contacted'}</option>
                                                <option value="Viewing Scheduled">{isAr ? 'موعد معاينة Viewing' : 'Viewing Scheduled'}</option>
                                                <option value="Negotiation">{isAr ? 'تفاوض Negotiation' : 'Negotiation'}</option>
                                                <option value="Won">🏆 {isAr ? 'تم الإغلاق بنجاح Won' : 'Won'}</option>
                                                <option value="Lost">❌ {isAr ? 'ملغي Lost' : 'Lost'}</option>
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })}
                            {leads.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                                        {isAr ? 'لا يوجد عملاء محتملين مسجلين' : 'No CRM leads found.'}
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
                    <div className="modal glass-card" style={{ maxWidth: '480px', width: '100%', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0 }}>{isAr ? 'إضافة عميل محتمل جديد' : 'New CRM Lead'}</h3>
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}><i className="ri-close-line"></i></button>
                        </div>
                        <form onSubmit={handleCreateLead} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)' }}>{isAr ? 'اسم العميل' : 'Lead Name'}</label>
                                <input type="text" className="form-control" required value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)' }}>{isAr ? 'رقم الهاتف' : 'Phone'}</label>
                                <input type="tel" className="form-control" required value={phone} onChange={e => setPhone(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)' }}>{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
                                <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)' }}>{isAr ? 'العقار المهتم به' : 'Interested Property'}</label>
                                <select className="form-control" value={interestedPropertyId} onChange={e => setInterestedPropertyId(e.target.value)}>
                                    <option value="">{isAr ? '-- غير محدد --' : '-- General --'}</option>
                                    {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)' }}>{isAr ? 'الميزانية التقريبية' : 'Approx Budget (SAR)'}</label>
                                <input type="number" className="form-control" value={budget} onChange={e => setBudget(e.target.value)} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>{isAr ? 'إلغاء' : 'Cancel'}</button>
                                <button type="submit" className="btn btn-primary">{isAr ? 'حفظ العميل' : 'Save Lead'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RealEstateCRM;
