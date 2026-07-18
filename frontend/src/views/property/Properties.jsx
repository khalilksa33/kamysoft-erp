import React, { useState, useEffect } from 'react';
import '../../index.css';

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [owners, setOwners] = useState([]);
    const [name, setName] = useState('');
    const [type, setType] = useState('Resort');
    const [location, setLocation] = useState('');
    const [ownerId, setOwnerId] = useState('');

    useEffect(() => {
        fetchProperties();
        fetchOwners();
    }, []);

    const fetchProperties = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/properties', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await res.json();
            if (Array.isArray(data)) setProperties(data);
            else setProperties([]);
        } catch (err) { console.error('Error fetching properties', err); }
    };

    const fetchOwners = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/property-owners', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await res.json();
            if (Array.isArray(data)) setOwners(data);
            else setOwners([]);
        } catch (err) { console.error('Error fetching owners', err); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await fetch('/api/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ name, type, location, ownerId })
            });
            setName('');
            setLocation('');
            setOwnerId('');
            fetchProperties();
        } catch (err) { console.error('Error creating property', err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this property and all its units?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/properties/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            fetchProperties();
        } catch (err) { console.error('Error deleting property', err); }
    };

    const getOwnerName = (id) => {
        const owner = owners.find(o => o.id === id);
        return owner ? owner.name : 'Company Owned';
    };

    return (
        <div className="view-container">
            <div className="header-row">
                <h2>Manage Properties</h2>
            </div>
            
            <div className="card">
                <h3>Add New Property</h3>
                <form onSubmit={handleCreate} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input type="text" placeholder="Property Name" value={name} onChange={e => setName(e.target.value)} required />
                    <select value={type} onChange={e => setType(e.target.value)}>
                        <option value="Resort">Resort</option>
                        <option value="Building">Building</option>
                        <option value="Hotel">Hotel</option>
                        <option value="Compound">Compound</option>
                    </select>
                    <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
                    
                    <select value={ownerId} onChange={e => setOwnerId(e.target.value)}>
                        <option value="">-- Company Owned (No 3rd Party Owner) --</option>
                        {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </select>
                    <button type="submit" className="primary-btn">Save</button>
                </form>
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Location</th>
                            <th>Owner</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map(p => (
                            <tr key={p.id}>
                                <td>{p.name}</td>
                                <td>{p.type}</td>
                                <td>{p.location}</td>
                                <td>{getOwnerName(p.ownerId)}</td>
                                <td>{p.status}</td>
                                <td>
                                    <button className="danger-btn" onClick={() => handleDelete(p.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {properties.length === 0 && <tr><td colSpan="6">No properties found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Properties;
