import React, { useState, useEffect } from 'react';
import '../../index.css';

const Units = () => {
    const [units, setUnits] = useState([]);
    const [properties, setProperties] = useState([]);
    const [propertyId, setPropertyId] = useState('');
    const [unitNumber, setUnitNumber] = useState('');
    const [type, setType] = useState('Room');
    const [beds, setBeds] = useState(1);
    const [dailyRate, setDailyRate] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [propRes, unitRes] = await Promise.all([
                fetch('/api/properties', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/units', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            const propData = await propRes.json();
            const unitData = await unitRes.json();
            if (Array.isArray(propData)) { setProperties(propData); if (propData.length > 0) setPropertyId(propData[0].id); } else setProperties([]);
            if (Array.isArray(unitData)) setUnits(unitData); else setUnits([]);
        } catch (err) { console.error('Error fetching data', err); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await fetch('/api/units', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ propertyId, unitNumber, type, beds: Number(beds), dailyRate: Number(dailyRate) })
            });
            setUnitNumber('');
            setBeds(1);
            setDailyRate('');
            fetchData();
        } catch (err) { console.error('Error creating unit', err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this unit?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/units/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            fetchData();
        } catch (err) { console.error('Error deleting unit', err); }
    };

    return (
        <div className="view-container">
            <div className="header-row">
                <h2>Manage Units</h2>
            </div>
            
            <div className="card">
                <h3>Add New Unit</h3>
                <form onSubmit={handleCreate} className="inline-form">
                    <select className="form-control" value={propertyId} onChange={e => setPropertyId(e.target.value)} required>
                        <option value="" disabled>Select Property</option>
                        {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <input type="text" className="form-control" placeholder="Unit Number (e.g. 101)" value={unitNumber} onChange={e => setUnitNumber(e.target.value)} required />
                    <select className="form-control" value={type} onChange={e => setType(e.target.value)}>
                        <option value="Room">Room</option>
                        <option value="Suite">Suite</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa</option>
                    </select>
                    <input type="number" className="form-control" placeholder="Beds" value={beds} onChange={e => setBeds(e.target.value)} required min="1" />
                    <input type="number" className="form-control" placeholder="Daily Rate" value={dailyRate} onChange={e => setDailyRate(e.target.value)} required min="0" step="0.01" />
                    <button type="submit" className="primary-btn">Save</button>
                </form>
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Property</th>
                            <th>Unit #</th>
                            <th>Type</th>
                            <th>Beds</th>
                            <th>Daily Rate</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {units.map(u => {
                            const prop = properties.find(p => p.id === u.propertyId);
                            return (
                                <tr key={u.id}>
                                    <td>{prop ? prop.name : 'Unknown'}</td>
                                    <td>{u.unitNumber}</td>
                                    <td>{u.type}</td>
                                    <td>{u.beds}</td>
                                    <td>{u.dailyRate}</td>
                                    <td>
                                        <span className={`status-badge ${u.status.toLowerCase()}`}>{u.status}</span>
                                    </td>
                                    <td>
                                        <button className="danger-btn" onClick={() => handleDelete(u.id)}>Delete</button>
                                    </td>
                                </tr>
                            )
                        })}
                        {units.length === 0 && <tr><td colSpan="7">No units found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Units;
