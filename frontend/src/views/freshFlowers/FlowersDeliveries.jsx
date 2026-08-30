import React, { useState, useEffect } from 'react';

const FlowersDeliveries = ({ translations, currentLanguage, token }) => {
    const [deliveries, setDeliveries] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ customer: '', phone: '', address: '', date: '', time: '' });

    const fetchDeliveries = () => {
        fetch('/api/freshFlowers/deliveries', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) setDeliveries(data);
        })
        .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchDeliveries();
    }, [token]);

    const handleSave = (e) => {
        e.preventDefault();
        fetch('/api/freshFlowers/deliveries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.delivery) {
                setDeliveries([data.delivery, ...deliveries]);
                setShowModal(false);
                setFormData({ customer: '', phone: '', address: '', date: '', time: '' });
            }
        })
        .catch(err => console.error(err));
    };

    const updateStatus = (id, newStatus) => {
        fetch(`/api/freshFlowers/deliveries/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ status: newStatus })
        })
        .then(res => res.json())
        .then(data => {
            if (data.delivery) {
                setDeliveries(deliveries.map(d => d.id === id ? { ...d, status: newStatus } : d));
            }
        })
        .catch(err => console.error(err));
    };

    const getStatusClass = (status) => {
        switch(status) {
            case 'Pending': return 'warning';
            case 'Out for Delivery': return 'primary';
            case 'Delivered': return 'valid';
            case 'Cancelled': return 'danger';
            default: return 'default';
        }
    };

    return (
        <div className="module-dashboard">
            <div className="modern-header">
                <h2>{translations?.flowersDeliveries || 'Deliveries'}</h2>
                <div className="header-actions">
                    <button className="modern-btn primary" onClick={() => setShowModal(true)}>
                        <i className="ri-add-line"></i> Schedule Delivery
                    </button>
                </div>
            </div>

            <div className="modern-card">
                <div className="table-responsive">
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>Delivery ID</th>
                                <th>Customer Info</th>
                                <th>Delivery Address</th>
                                <th>Scheduled For</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveries.map(del => (
                                <tr key={del.id}>
                                    <td><strong>{del.id}</strong></td>
                                    <td>
                                        <div>{del.customer}</div>
                                        <div style={{ fontSize: '0.85em', color: '#666' }}>{del.phone}</div>
                                    </td>
                                    <td>{del.address}</td>
                                    <td>
                                        <div>{del.date}</div>
                                        <div style={{ fontSize: '0.85em', color: '#666' }}>{del.time}</div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(del.status)}`}>
                                            {del.status}
                                        </span>
                                    </td>
                                    <td>
                                        <select 
                                            className="modern-select" 
                                            value={del.status} 
                                            onChange={(e) => updateStatus(del.id, e.target.value)}
                                            style={{ padding: '4px 8px', fontSize: '0.85em', width: 'auto' }}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Out for Delivery">Out for Delivery</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {deliveries.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center">No deliveries found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modern-modal" style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h2>Schedule Delivery</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <i className="ri-close-line"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSave}>
                                <div className="form-group">
                                    <label>Customer Name</label>
                                    <input type="text" className="modern-input" required value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" className="modern-input" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>Delivery Address</label>
                                    <textarea className="modern-input" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows="2"></textarea>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div className="form-group">
                                        <label>Date</label>
                                        <input type="date" className="modern-input" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                                    </div>
                                    <div className="form-group">
                                        <label>Time Slot</label>
                                        <select className="modern-select" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}>
                                            <option value="">Select Time...</option>
                                            <option value="08:00 - 10:00">08:00 - 10:00</option>
                                            <option value="10:00 - 12:00">10:00 - 12:00</option>
                                            <option value="14:00 - 16:00">14:00 - 16:00</option>
                                            <option value="16:00 - 18:00">16:00 - 18:00</option>
                                            <option value="18:00 - 20:00">18:00 - 20:00</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="modern-btn secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="modern-btn primary">Schedule</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlowersDeliveries;
