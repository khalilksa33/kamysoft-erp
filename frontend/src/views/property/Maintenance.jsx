import React, { useState, useEffect } from 'react';
import '../../index.css';

const STATUSES = ['Pending', 'InProgress', 'Completed'];
const FREQUENCIES = ['None', 'Daily', 'Weekly', 'Monthly', 'Yearly'];

const Maintenance = ({ currentLanguage, headers }) => {
    const isAr = currentLanguage === 'ar';
    const [tasks, setTasks] = useState([]);
    const [units, setUnits] = useState([]);
    const [properties, setProperties] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    
    const [activeTab, setActiveTab] = useState('Corrective'); // 'Corrective' | 'Preventative'
    const [showModal, setShowModal] = useState(false);
    
    const [formData, setFormData] = useState({
        propertyId: '',
        unitId: '',
        maintenanceType: 'Corrective',
        frequency: 'None',
        nextScheduledDate: '',
        description: '',
        cost: 0,
        assigneeType: 'Employee', // 'Employee' | 'Vendor'
        assignedTo: '',
        assignedSupplierId: '',
        vendorCost: 0,
        status: 'Pending'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [taskRes, unitRes, empRes, propRes, supRes] = await Promise.all([
                fetch('/api/maintenance-tasks', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/units', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/employees', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/properties', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/suppliers', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            
            const taskData = await taskRes.json();
            const unitData = await unitRes.json();
            const empData = await empRes.json();
            const propData = await propRes.json();
            const supData = await supRes.json();
            
            setTasks(taskData);
            setUnits(unitData);
            setEmployees(empData);
            setProperties(propData);
            setSuppliers(supData);
            
            setFormData(prev => ({
                ...prev,
                propertyId: propData.length > 0 ? propData[0].id : '',
                assignedTo: empData.length > 0 ? empData[0].id : '',
                assignedSupplierId: supData.length > 0 ? supData[0].id : ''
            }));
        } catch (err) { console.error('Error fetching data', err); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const payload = { ...formData, maintenanceType: activeTab };
            if (payload.assigneeType === 'Employee') {
                payload.assignedSupplierId = '';
                payload.vendorCost = 0;
            } else {
                payload.assignedTo = '';
            }
            if (!payload.unitId) delete payload.unitId;

            await fetch('/api/maintenance-tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            setShowModal(false);
            setFormData({ ...formData, description: '', cost: 0, vendorCost: 0, nextScheduledDate: '' });
            fetchData();
        } catch (err) {
            alert('Error creating task');
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/maintenance-tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus })
            });
            fetchData();
        } catch (err) {
            alert('Error updating status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(isAr ? 'هل أنت متأكد؟' : 'Are you sure?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/maintenance-tasks/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            alert('Error deleting task');
        }
    };

    const getUnitName = (id) => {
        const u = units.find(x => x.id === id || x._id === id);
        return u ? u.unitNumber : (isAr ? 'عام (مرفق)' : 'Facility (General)');
    };

    const getPropertyName = (id) => {
        const p = properties.find(x => x.id === id || x._id === id);
        return p ? p.name : 'N/A';
    };

    const getEmployeeName = (id) => {
        const emp = employees.find(x => x.id === id || x._id === id);
        return emp ? emp.name : 'N/A';
    };

    const getSupplierName = (id) => {
        const sup = suppliers.find(x => x.id === id || x._id === id);
        return sup ? sup.name : 'N/A';
    };

    const filteredTasks = tasks.filter(t => (t.maintenanceType || 'Corrective') === activeTab);

    return (
        <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>{isAr ? 'مهام الصيانة والمرافق' : 'Facility & Maintenance Tasks'}</h2>
                <button onClick={() => setShowModal(true)} className="modern-btn primary">
                    <i className="ri-add-line"></i> {isAr ? 'مهمة صيانة جديدة' : 'New Maintenance Task'}
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <button 
                    className={`modern-btn ${activeTab === 'Corrective' ? 'primary' : ''}`}
                    onClick={() => setActiveTab('Corrective')}
                >
                    {isAr ? 'صيانة تفاعلية' : 'Corrective Maintenance'}
                </button>
                <button 
                    className={`modern-btn ${activeTab === 'Preventative' ? 'primary' : ''}`}
                    onClick={() => setActiveTab('Preventative')}
                >
                    {isAr ? 'صيانة دورية' : 'Preventative Maintenance'}
                </button>
            </div>

            <div className="table-responsive">
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>{isAr ? 'العقار' : 'Property'}</th>
                            <th>{isAr ? 'الوحدة' : 'Unit'}</th>
                            <th>{isAr ? 'الوصف' : 'Description'}</th>
                            {activeTab === 'Preventative' && <th>{isAr ? 'التكرار' : 'Frequency'}</th>}
                            {activeTab === 'Preventative' && <th>{isAr ? 'تاريخ الجدولة' : 'Scheduled Date'}</th>}
                            {activeTab === 'Corrective' && <th>{isAr ? 'تاريخ البلاغ' : 'Reported Date'}</th>}
                            <th>{isAr ? 'المُسند إليه' : 'Assigned To'}</th>
                            <th>{isAr ? 'التكلفة' : 'Cost'}</th>
                            <th>{isAr ? 'الحالة' : 'Status'}</th>
                            <th>{isAr ? 'إجراءات' : 'Actions'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.map(task => (
                            <tr key={task.id || task._id}>
                                <td>{getPropertyName(task.propertyId)}</td>
                                <td>{getUnitName(task.unitId)}</td>
                                <td>{task.description}</td>
                                {activeTab === 'Preventative' && <td>{task.frequency}</td>}
                                {activeTab === 'Preventative' && <td>{task.nextScheduledDate ? new Date(task.nextScheduledDate).toLocaleDateString() : '-'}</td>}
                                {activeTab === 'Corrective' && <td>{new Date(task.reportedDate).toLocaleDateString()}</td>}
                                <td>
                                    {task.assignedSupplierId ? (
                                        <span style={{ color: 'var(--accent-purple)' }}><i className="ri-store-2-line"></i> {getSupplierName(task.assignedSupplierId)}</span>
                                    ) : (
                                        <span style={{ color: 'var(--accent-blue)' }}><i className="ri-user-line"></i> {getEmployeeName(task.assignedTo)}</span>
                                    )}
                                </td>
                                <td>${task.vendorCost > 0 ? task.vendorCost : task.cost}</td>
                                <td>
                                    <select 
                                        className="modern-input" 
                                        style={{ padding: '4px', width: 'auto' }}
                                        value={task.status} 
                                        onChange={(e) => handleUpdateStatus(task.id || task._id, e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="InProgress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </td>
                                <td>
                                    <button className="icon-btn danger" onClick={() => handleDelete(task.id || task._id)}>
                                        <i className="ri-delete-bin-line"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredTasks.length === 0 && (
                            <tr>
                                <td colSpan={activeTab === 'Preventative' ? 9 : 8} style={{ textAlign: 'center', padding: '20px' }}>
                                    {isAr ? 'لا توجد مهام صيانة' : 'No maintenance tasks found'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{isAr ? 'إضافة مهمة صيانة جديدة' : 'Add New Maintenance Task'}</h3>
                        <form onSubmit={handleCreate}>
                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label>{isAr ? 'العقار' : 'Property'}</label>
                                    <select className="modern-input" required value={formData.propertyId} onChange={e => setFormData({...formData, propertyId: e.target.value})}>
                                        <option value="">{isAr ? '-- اختر العقار --' : '-- Select Property --'}</option>
                                        {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>{isAr ? 'الوحدة (اختياري للمرافق)' : 'Unit (Optional for Facility)'}</label>
                                    <select className="modern-input" value={formData.unitId} onChange={e => setFormData({...formData, unitId: e.target.value})}>
                                        <option value="">{isAr ? '-- مرافق العقار --' : '-- Facility Wide --'}</option>
                                        {units.filter(u => u.propertyId === formData.propertyId).map(u => (
                                            <option key={u.id} value={u.id}>{u.unitNumber}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>{isAr ? 'الوصف' : 'Description'}</label>
                                <textarea className="modern-input" required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            </div>

                            {activeTab === 'Preventative' && (
                                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div className="form-group">
                                        <label>{isAr ? 'التكرار' : 'Frequency'}</label>
                                        <select className="modern-input" value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value})}>
                                            {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>{isAr ? 'تاريخ الجدولة القادم' : 'Next Scheduled Date'}</label>
                                        <input type="date" className="modern-input" value={formData.nextScheduledDate} onChange={e => setFormData({...formData, nextScheduledDate: e.target.value})} required={activeTab === 'Preventative'} />
                                    </div>
                                </div>
                            )}

                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label>{isAr ? 'نوع المُسند إليه' : 'Assignee Type'}</label>
                                    <select className="modern-input" value={formData.assigneeType} onChange={e => setFormData({...formData, assigneeType: e.target.value})}>
                                        <option value="Employee">{isAr ? 'موظف داخلي' : 'Internal Employee'}</option>
                                        <option value="Vendor">{isAr ? 'مورد / شركة خارجية' : 'External Vendor'}</option>
                                    </select>
                                </div>
                                
                                {formData.assigneeType === 'Employee' ? (
                                    <div className="form-group">
                                        <label>{isAr ? 'الموظف' : 'Employee'}</label>
                                        <select className="modern-input" required value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})}>
                                            <option value="">{isAr ? '-- اختر --' : '-- Select --'}</option>
                                            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                        </select>
                                    </div>
                                ) : (
                                    <div className="form-group">
                                        <label>{isAr ? 'المورد' : 'Supplier / Vendor'}</label>
                                        <select className="modern-input" required value={formData.assignedSupplierId} onChange={e => setFormData({...formData, assignedSupplierId: e.target.value})}>
                                            <option value="">{isAr ? '-- اختر --' : '-- Select --'}</option>
                                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>{isAr ? 'التكلفة التقديرية' : 'Estimated Cost'}</label>
                                <input 
                                    type="number" 
                                    className="modern-input" 
                                    value={formData.assigneeType === 'Vendor' ? formData.vendorCost : formData.cost} 
                                    onChange={e => {
                                        if (formData.assigneeType === 'Vendor') setFormData({...formData, vendorCost: e.target.value});
                                        else setFormData({...formData, cost: e.target.value});
                                    }} 
                                />
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
};

export default Maintenance;
