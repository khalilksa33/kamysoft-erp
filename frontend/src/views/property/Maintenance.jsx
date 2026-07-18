import React, { useState, useEffect } from 'react';
import '../../index.css';

const Maintenance = () => {
    const [tasks, setTasks] = useState([]);
    const [units, setUnits] = useState([]);
    const [employees, setEmployees] = useState([]);
    
    const [unitId, setUnitId] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [description, setDescription] = useState('');
    const [cost, setCost] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [taskRes, unitRes, empRes] = await Promise.all([
                fetch('/api/maintenance-tasks', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/units', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/employees', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            const taskData = await taskRes.json();
            const unitData = await unitRes.json();
            const empData = await empRes.json();
            
            setTasks(taskData);
            setUnits(unitData);
            setEmployees(empData);
            
            if (unitData.length > 0) setUnitId(unitData[0].id);
            if (empData.length > 0) setAssignedTo(empData[0].id);
        } catch (err) { console.error('Error fetching data', err); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await fetch('/api/maintenance-tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ unitId, assignedTo, description, cost: Number(cost) })
            });
            setDescription('');
            setCost(0);
            fetchData();
        } catch (err) { console.error('Error creating task', err); }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const updateData = { status: newStatus };
            if (newStatus === 'Completed') updateData.resolvedDate = new Date().toISOString();
            
            await fetch(`/api/maintenance-tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(updateData)
            });
            fetchData();
        } catch (err) { console.error('Error updating task', err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/maintenance-tasks/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            fetchData();
        } catch (err) { console.error('Error deleting task', err); }
    };

    return (
        <div className="view-container">
            <div className="header-row">
                <h2>Maintenance Tasks</h2>
            </div>
            
            <div className="card">
                <h3>Report Issue</h3>
                <form onSubmit={handleCreate} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <select value={unitId} onChange={e => setUnitId(e.target.value)} required>
                        <option value="" disabled>Select Unit</option>
                        {units.map(u => <option key={u.id} value={u.id}>{u.unitNumber} ({u.type})</option>)}
                    </select>
                    <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
                        <option value="">Unassigned</option>
                        {employees.map(e => <option key={e.id} value={e.id}>{e.name} - {e.position}</option>)}
                    </select>
                    <input type="text" placeholder="Issue Description" value={description} onChange={e => setDescription(e.target.value)} required style={{flex: 1}} />
                    <input type="number" placeholder="Estimated Cost" value={cost} onChange={e => setCost(e.target.value)} min="0" step="0.01" />
                    <button type="submit" className="primary-btn">Submit</button>
                </form>
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Unit</th>
                            <th>Description</th>
                            <th>Assigned To</th>
                            <th>Reported On</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(t => {
                            const unit = units.find(u => u.id === t.unitId);
                            const emp = employees.find(e => e.id === t.assignedTo);
                            return (
                                <tr key={t.id}>
                                    <td>{unit ? unit.unitNumber : t.unitId}</td>
                                    <td>{t.description}</td>
                                    <td>{emp ? emp.name : 'Unassigned'}</td>
                                    <td>{new Date(t.reportedDate).toLocaleDateString()}</td>
                                    <td>
                                        <select 
                                            value={t.status} 
                                            onChange={(e) => handleStatusChange(t.id, e.target.value)}
                                            className={`status-badge ${t.status.toLowerCase()}`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="InProgress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button className="danger-btn" onClick={() => handleDelete(t.id)}>Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                        {tasks.length === 0 && <tr><td colSpan="6">No maintenance tasks.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Maintenance;
