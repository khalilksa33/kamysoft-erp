import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TenantPortal() {
    const [token, setToken] = useState(localStorage.getItem('tenant_token'));
    const [customer, setCustomer] = useState(JSON.parse(localStorage.getItem('tenant_customer') || 'null'));
    const [activeTab, setActiveTab] = useState('leases'); // leases, invoices, maintenance
    
    // Login State
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // Dashboard Data
    const [leases, setLeases] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [newTicket, setNewTicket] = useState({ unitId: '', description: '' });

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        try {
            const res = await axios.post('/api/tenant-portal/login', { phone, password });
            setToken(res.data.token);
            setCustomer(res.data.customer);
            localStorage.setItem('tenant_token', res.data.token);
            localStorage.setItem('tenant_customer', JSON.stringify(res.data.customer));
        } catch (err) {
            setLoginError(err.response?.data?.error || 'Login failed');
        }
    };

    const handleLogout = () => {
        setToken(null);
        setCustomer(null);
        localStorage.removeItem('tenant_token');
        localStorage.removeItem('tenant_customer');
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token, activeTab]);

    const fetchData = async () => {
        try {
            if (activeTab === 'leases') {
                const res = await axios.get('/api/tenant-portal/leases', { headers });
                setLeases(res.data);
            } else if (activeTab === 'invoices') {
                const res = await axios.get('/api/tenant-portal/invoices', { headers });
                setInvoices(res.data);
            } else if (activeTab === 'maintenance') {
                const [tasksRes, leasesRes] = await Promise.all([
                    axios.get('/api/tenant-portal/maintenance', { headers }),
                    axios.get('/api/tenant-portal/leases', { headers })
                ]);
                setTasks(tasksRes.data);
                // Also need active leases to let them pick a unit for new tickets
                setLeases(leasesRes.data.filter(l => l.status === 'Active'));
            }
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                handleLogout();
            }
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        if (!newTicket.unitId) return alert('Select a unit');
        try {
            await axios.post('/api/tenant-portal/maintenance', newTicket, { headers });
            setNewTicket({ unitId: '', description: '' });
            fetchData();
            alert('Ticket submitted successfully');
        } catch (err) {
            alert('Error submitting ticket');
        }
    };

    if (!token) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
                <div className="glass-card" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <i className="ri-building-4-line" style={{ fontSize: '48px', color: 'var(--accent-purple)' }}></i>
                        <h2 style={{ marginTop: '10px' }}>Tenant Portal</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Sign in to manage your property</p>
                    </div>
                    {loginError && <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff6b6b', padding: '10px', borderRadius: '4px', marginBottom: '20px', textAlign: 'center' }}>{loginError}</div>}
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <div className="input-with-icon">
                                <i className="ri-phone-line"></i>
                                <input type="text" className="form-control" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter registered phone" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-with-icon">
                                <i className="ri-lock-line"></i>
                                <input type="password" className="form-control" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
            <nav style={{ background: 'var(--bg-panel)', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="ri-building-4-line" style={{ fontSize: '24px', color: 'var(--accent-purple)' }}></i>
                    <h2 style={{ margin: 0, fontSize: '18px' }}>Tenant Portal</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Welcome, <strong>{customer?.name}</strong></span>
                    <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '6px 12px' }}>
                        <i className="ri-logout-box-r-line"></i> Logout
                    </button>
                </div>
            </nav>

            <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                    <button className={`btn ${activeTab === 'leases' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('leases')}>
                        My Leases
                    </button>
                    <button className={`btn ${activeTab === 'invoices' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('invoices')}>
                        My Invoices
                    </button>
                    <button className={`btn ${activeTab === 'maintenance' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('maintenance')}>
                        Maintenance Requests
                    </button>
                </div>

                <div className="glass-card" style={{ padding: '30px' }}>
                    {activeTab === 'leases' && (
                        <div>
                            <h3 style={{ marginBottom: '20px' }}>My Active Leases</h3>
                            <div className="table-responsive">
                                <table className="modern-table">
                                    <thead>
                                        <tr>
                                            <th>Unit ID</th>
                                            <th>Start Date</th>
                                            <th>End Date</th>
                                            <th>Total Rent</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leases.map(l => (
                                            <tr key={l._id}>
                                                <td>{l.unitId}</td>
                                                <td>{new Date(l.startDate).toLocaleDateString()}</td>
                                                <td>{new Date(l.endDate).toLocaleDateString()}</td>
                                                <td>${l.rentAmount}</td>
                                                <td><span className="status-badge success">{l.status}</span></td>
                                            </tr>
                                        ))}
                                        {leases.length === 0 && <tr><td colSpan="5" style={{textAlign:'center'}}>No active leases.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'invoices' && (
                        <div>
                            <h3 style={{ marginBottom: '20px' }}>My Invoices</h3>
                            <div className="table-responsive">
                                <table className="modern-table">
                                    <thead>
                                        <tr>
                                            <th>Invoice ID</th>
                                            <th>Due Date</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoices.map(i => (
                                            <tr key={i._id}>
                                                <td>{i._id.slice(-6).toUpperCase()}</td>
                                                <td>{new Date(i.dueDate).toLocaleDateString()}</td>
                                                <td>${i.total}</td>
                                                <td>
                                                    <span className={`status-badge ${i.status === 'Paid' ? 'success' : 'warning'}`}>
                                                        {i.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {invoices.length === 0 && <tr><td colSpan="4" style={{textAlign:'center'}}>No invoices found.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'maintenance' && (
                        <div>
                            <h3 style={{ marginBottom: '20px' }}>Maintenance Requests</h3>
                            
                            <form onSubmit={handleCreateTicket} style={{ display: 'flex', gap: '15px', marginBottom: '30px', alignItems: 'flex-end' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Select Unit</label>
                                    <select className="form-control" required value={newTicket.unitId} onChange={e => setNewTicket({...newTicket, unitId: e.target.value})}>
                                        <option value="">-- Choose Unit --</option>
                                        {leases.map(l => (
                                            <option key={l.unitId} value={l.unitId}>Unit {l.unitId}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group" style={{ flex: 2 }}>
                                    <label>Issue Description</label>
                                    <input type="text" className="form-control" required value={newTicket.description} onChange={e => setNewTicket({...newTicket, description: e.target.value})} placeholder="E.g., AC is leaking" />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }}>Submit</button>
                            </form>

                            <div className="table-responsive">
                                <table className="modern-table">
                                    <thead>
                                        <tr>
                                            <th>Unit ID</th>
                                            <th>Description</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.map(t => (
                                            <tr key={t._id}>
                                                <td>{t.unitId}</td>
                                                <td>{t.description}</td>
                                                <td>
                                                    <span className={`status-badge ${t.status === 'Completed' ? 'success' : t.status === 'In Progress' ? 'info' : 'warning'}`}>
                                                        {t.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {tasks.length === 0 && <tr><td colSpan="3" style={{textAlign:'center'}}>No past requests.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
