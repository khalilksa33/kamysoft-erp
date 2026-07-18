import React, { useState, useEffect } from 'react';
import axios from 'axios';

const STATUSES = ['New', 'Contacted', 'Viewing Scheduled', 'Negotiation', 'Won', 'Lost'];

export default function RealEstateCRM({ currentLanguage, headers, activeTab }) {
    const isAr = currentLanguage === 'ar';
    const [leads, setLeads] = useState([]);
    const [properties, setProperties] = useState([]);
    
    const [showModal, setShowModal] = useState(false);
    const [showNotesModal, setShowNotesModal] = useState(null);
    const [newNote, setNewNote] = useState('');
    
    const [formData, setFormData] = useState({
        name: '', phone: '', email: '', source: 'Website', status: 'New', interestedPropertyId: '', budget: ''
    });

    useEffect(() => {
        if (activeTab === 'property_crm') {
            fetchData();
        }
    }, [activeTab]);

    const fetchData = async () => {
        try {
            const [leadsRes, propsRes] = await Promise.all([
                axios.get('/api/leads', { headers }),
                axios.get('/api/properties', { headers })
            ]);
            if (Array.isArray(leadsRes.data)) setLeads(leadsRes.data); else setLeads([]);
            if (Array.isArray(propsRes.data)) setProperties(propsRes.data); else setProperties([]);
        } catch (err) {
            console.error('Error fetching CRM data:', err);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/leads', formData, { headers });
            setShowModal(false);
            setFormData({ name: '', phone: '', email: '', source: 'Website', status: 'New', interestedPropertyId: '', budget: '' });
            fetchData();
        } catch (err) {
            alert('Error saving lead');
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await axios.put(`/api/leads/${id}`, { status: newStatus }, { headers });
            fetchData();
        } catch (err) {
            alert('Error updating status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(isAr ? 'هل أنت متأكد؟' : 'Are you sure?')) return;
        try {
            await axios.delete(`/api/leads/${id}`, { headers });
            fetchData();
        } catch (err) {
            alert('Error deleting lead');
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;
        try {
            await axios.post(`/api/leads/${showNotesModal._id}/notes`, { content: newNote }, { headers });
            setNewNote('');
            fetchData();
            const res = await axios.get('/api/leads', { headers });
            const updatedLead = res.data.find(l => l._id === showNotesModal._id);
            setShowNotesModal(updatedLead);
        } catch (err) {
            alert('Error adding note');
        }
    };

    const handleConvert = async (id) => {
        if (!window.confirm(isAr ? 'تحويل هذا العميل المحتمل إلى مستأجر/عميل؟' : 'Convert this lead into a Tenant/Customer?')) return;
        try {
            await axios.post(`/api/leads/${id}/convert`, {}, { headers });
            alert(isAr ? 'تم التحويل بنجاح' : 'Converted successfully');
            fetchData();
        } catch (err) {
            alert('Error converting lead');
        }
    };

    const getPropertyName = (id) => {
        const p = properties.find(x => x._id === id || x.id === id);
        return p ? p.name : 'N/A';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'var(--accent-blue)';
            case 'Contacted': return 'var(--accent-purple)';
            case 'Viewing Scheduled': return 'var(--accent-yellow)';
            case 'Negotiation': return 'var(--accent-orange)';
            case 'Won': return 'var(--accent-green)';
            case 'Lost': return 'var(--accent-red)';
            default: return 'var(--text-secondary)';
        }
    };

    // Drag and Drop Handlers
    const onDragStart = (e, leadId) => {
        e.dataTransfer.setData("leadId", leadId);
    };

    const onDragOver = (e) => {
        e.preventDefault(); // necessary to allow dropping
    };

    const onDrop = (e, newStatus) => {
        const leadId = e.dataTransfer.getData("leadId");
        if (!leadId) return;
        const lead = leads.find(l => l._id === leadId);
        if (lead && lead.status !== newStatus) {
            // Optimistically update the state for smoother UI
            setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status: newStatus } : l));
            handleUpdateStatus(leadId, newStatus);
        }
    };

    return (
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '80vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>{isAr ? 'إدارة العملاء المحتملين (CRM)' : 'CRM / Lead Management'}</h2>
                <button onClick={() => setShowModal(true)} className="modern-btn primary">
                    <i className="ri-add-line"></i> {isAr ? 'عميل محتمل جديد' : 'New Lead'}
                </button>
            </div>

            {/* Kanban Board */}
            <div className="kanban-board" style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px', flex: 1 }}>
                {STATUSES.map(status => (
                    <div 
                        key={status}
                        className="kanban-column"
                        onDragOver={onDragOver}
                        onDrop={(e) => onDrop(e, status)}
                        style={{
                            minWidth: '280px',
                            backgroundColor: 'var(--bg-secondary)',
                            borderRadius: '8px',
                            padding: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            borderTop: `4px solid ${getStatusColor(status)}`
                        }}
                    >
                        <h3 style={{ fontSize: '16px', margin: 0, paddingBottom: '8px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{status}</span>
                            <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'var(--bg-color)', borderRadius: '12px' }}>
                                {leads.filter(l => l.status === status).length}
                            </span>
                        </h3>
                        
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {leads.filter(l => l.status === status).map(lead => (
                                <div 
                                    key={lead._id}
                                    draggable
                                    onDragStart={(e) => onDragStart(e, lead._id)}
                                    style={{
                                        backgroundColor: 'var(--bg-color)',
                                        padding: '12px',
                                        borderRadius: '6px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                        cursor: 'grab',
                                        borderLeft: `3px solid ${getStatusColor(status)}`
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <strong style={{ fontSize: '14px' }}>{lead.name}</strong>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <button className="icon-btn info" style={{ padding: '4px', fontSize: '12px' }} onClick={() => setShowNotesModal(lead)} title={isAr ? 'ملاحظات المتابعة' : 'Follow-up Notes'}>
                                                <i className="ri-sticky-note-line"></i>
                                            </button>
                                            <button className="icon-btn danger" style={{ padding: '4px', fontSize: '12px' }} onClick={() => handleDelete(lead._id)}>
                                                <i className="ri-delete-bin-line"></i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <div><i className="ri-phone-line"></i> {lead.phone}</div>
                                        <div><i className="ri-building-line"></i> {getPropertyName(lead.interestedPropertyId)}</div>
                                        {lead.budget && <div><i className="ri-money-dollar-circle-line"></i> ${lead.budget}</div>}
                                    </div>
                                    
                                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '10px', padding: '2px 6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px' }}>{lead.source}</span>
                                        {status !== 'Won' && (
                                            <button 
                                                className="modern-btn" 
                                                style={{ padding: '2px 6px', fontSize: '10px', backgroundColor: 'var(--accent-green)', color: '#fff', border: 'none' }}
                                                onClick={() => handleConvert(lead._id)}
                                            >
                                                {isAr ? 'تحويل' : 'Convert'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Notes Modal */}
            {showNotesModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '600px' }}>
                        <h3>{isAr ? 'ملاحظات المتابعة:' : 'Follow-up Notes:'} {showNotesModal.name}</h3>
                        
                        <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '16px', padding: '10px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                            {showNotesModal.notes && showNotesModal.notes.length > 0 ? (
                                showNotesModal.notes.map((n, idx) => (
                                    <div key={idx} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                            {new Date(n.date).toLocaleString()} - <strong>{n.user}</strong>
                                        </div>
                                        <div style={{ marginTop: '4px' }}>{n.content}</div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: 'var(--text-secondary)' }}>{isAr ? 'لا توجد ملاحظات' : 'No notes yet'}</p>
                            )}
                        </div>

                        <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '10px' }}>
                            <input 
                                type="text" 
                                className="modern-input" 
                                style={{ flex: 1 }} 
                                placeholder={isAr ? 'إضافة ملاحظة جديدة...' : 'Add new note...'} 
                                value={newNote} 
                                onChange={e => setNewNote(e.target.value)} 
                                required 
                            />
                            <button type="submit" className="modern-btn primary">{isAr ? 'إضافة' : 'Add'}</button>
                        </form>

                        <div className="modal-actions" style={{ marginTop: '20px' }}>
                            <button type="button" className="modern-btn" onClick={() => setShowNotesModal(null)}>
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
                        <h3>{isAr ? 'إضافة عميل محتمل' : 'Add New Lead'}</h3>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>{isAr ? 'الاسم' : 'Name'}</label>
                                <input type="text" className="modern-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label>{isAr ? 'الهاتف' : 'Phone'}</label>
                                    <input type="text" className="modern-input" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
                                    <input type="email" className="modern-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                                </div>
                            </div>
                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label>{isAr ? 'المصدر' : 'Source'}</label>
                                    <select className="modern-input" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})}>
                                        <option value="Website">Website</option>
                                        <option value="Referral">Referral</option>
                                        <option value="Walk-in">Walk-in</option>
                                        <option value="Social Media">Social Media</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>{isAr ? 'العقار المهتم به' : 'Interested Property'}</label>
                                    <select className="modern-input" value={formData.interestedPropertyId} onChange={e => setFormData({...formData, interestedPropertyId: e.target.value})}>
                                        <option value="">{isAr ? '-- غير محدد --' : '-- Not Specified --'}</option>
                                        {properties.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>{isAr ? 'الميزانية (اختياري)' : 'Budget (Optional)'}</label>
                                <input type="number" className="modern-input" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
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
