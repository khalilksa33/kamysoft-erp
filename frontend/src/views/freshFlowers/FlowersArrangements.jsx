import React, { useState, useEffect } from 'react';

const FlowersArrangements = ({ translations, currentLanguage, token, setAuthError }) => {
    const [arrangements, setArrangements] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', components: '', price: '' });

    const fetchArrangements = () => {
        fetch('/api/freshFlowers/arrangements', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) setArrangements(data);
        })
        .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchArrangements();
    }, [token]);

    const handleSave = (e) => {
        e.preventDefault();
        fetch('/api/freshFlowers/arrangements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                name: formData.name,
                components: formData.components,
                price: parseFloat(formData.price)
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.arrangement) {
                setArrangements([data.arrangement, ...arrangements]);
                setShowModal(false);
                setFormData({ name: '', components: '', price: '' });
            }
        })
        .catch(err => console.error(err));
    };

    return (
        <div className="module-dashboard">
            <div className="modern-header">
                <h2>{translations?.flowersArrangements || 'Arrangements'}</h2>
                <div className="header-actions">
                    <button className="modern-btn primary" onClick={() => setShowModal(true)}>
                        <i className="ri-add-line"></i> New Arrangement
                    </button>
                </div>
            </div>

            <div className="modern-card">
                <div className="table-responsive">
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Components (Flowers, Wraps)</th>
                                <th>Price (SAR)</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {arrangements.map(arr => (
                                <tr key={arr.id}>
                                    <td><strong>{arr.id}</strong></td>
                                    <td><strong>{arr.name}</strong></td>
                                    <td>{arr.components}</td>
                                    <td>{arr.price.toFixed(2)}</td>
                                    <td><span className="status-badge valid">{arr.status}</span></td>
                                </tr>
                            ))}
                            {arrangements.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center">No arrangements found.</td>
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
                            <h2>Create New Arrangement</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <i className="ri-close-line"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSave}>
                                <div className="form-group">
                                    <label>Arrangement Name</label>
                                    <input 
                                        type="text" 
                                        className="modern-input" 
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        placeholder="e.g. Wedding Special"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Components (Flowers, Wraps, Vases)</label>
                                    <textarea 
                                        className="modern-input" 
                                        required
                                        value={formData.components}
                                        onChange={e => setFormData({...formData, components: e.target.value})}
                                        placeholder="e.g. 10x White Roses, 1x Silk Ribbon"
                                        rows="3"
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Price (SAR)</label>
                                    <input 
                                        type="number" 
                                        className="modern-input" 
                                        required
                                        value={formData.price}
                                        onChange={e => setFormData({...formData, price: e.target.value})}
                                        min="0" step="0.01"
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="modern-btn secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="modern-btn primary">Save Arrangement</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlowersArrangements;
