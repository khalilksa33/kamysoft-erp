import React, { useState, useEffect, useCallback } from 'react';

const ADMIN_KEY_STORAGE = 'saas_admin_key';

const SECTOR_LABELS = {
    retail: 'Retail', grocery: 'Grocery', restaurant: 'Restaurant',
    apparel: 'Apparel', appliances: 'Electronics', furniture: 'Furniture',
    spareparts: 'Spare Parts', salon: 'Salon'
};

function fmt(n) { return (n ?? 0).toLocaleString(); }
function timeAgo(date) {
    if (!date) return '—';
    const diff = (Date.now() - new Date(date).getTime()) / 1000;
    if (diff < 60) return `${Math.round(diff)}s ago`;
    if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
    return `${Math.round(diff / 86400)}d ago`;
}

export default function SaasAdmin({ baseDomain = '26i.uk' }) {
    const [adminKey, setAdminKey] = useState(() => localStorage.getItem(ADMIN_KEY_STORAGE) || '');
    const [keyInput, setKeyInput] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [authError, setAuthError] = useState('');

    const [tab, setTab] = useState('stores'); // 'stores' | 'inquiries'
    const [stats, setStats] = useState(null);
    const [stores, setStores] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionMsg, setActionMsg] = useState('');
    const [search, setSearch] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null); // tenantId pending delete
    const [expandedStore, setExpandedStore] = useState(null);

    // Payments
    const [payments, setPayments] = useState([]);

    // Modules Modal
    const [showModulesModal, setShowModulesModal] = useState(false);
    const [selectedTenantForModules, setSelectedTenantForModules] = useState('');
    const [selectedModules, setSelectedModules] = useState({});

    const apiHeaders = useCallback(() => ({
        'Content-Type': 'application/json',
        'x-saas-admin-key': adminKey
    }), [adminKey]);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [statsRes, storesRes] = await Promise.all([
                fetch('/api/saas/stats', { headers: apiHeaders() }),
                fetch('/api/saas/stores', { headers: apiHeaders() })
            ]);
            if (statsRes.status === 403 || storesRes.status === 403) {
                setAuthenticated(false);
                setAuthError('Invalid admin key.');
                localStorage.removeItem(ADMIN_KEY_STORAGE);
                setAdminKey('');
                return;
            }
            setStats(await statsRes.json());
            setStores(await storesRes.json());
            setAuthenticated(true);
        } catch {
            setAuthError('Connection error. Make sure the server is running.');
        } finally {
            setLoading(false);
        }
    }, [apiHeaders]);

    const loadInquiries = useCallback(async () => {
        try {
            const res = await fetch('/api/saas/inquiries', { headers: apiHeaders() });
            setInquiries(await res.json());
        } catch { /* ignore */ }
    }, [apiHeaders]);

    const loadPayments = useCallback(async () => {
        try {
            const res = await fetch('/api/saas/payments', { headers: apiHeaders() });
            setPayments(await res.json());
        } catch { /* ignore */ }
    }, [apiHeaders]);

    useEffect(() => {
        if (adminKey) loadData();
    }, [adminKey, loadData]);

    useEffect(() => {
        if (authenticated && tab === 'inquiries') loadInquiries();
        if (authenticated && tab === 'payments') loadPayments();
    }, [authenticated, tab, loadInquiries, loadPayments]);

    const handleLogin = (e) => {
        e.preventDefault();
        setAuthError('');
        localStorage.setItem(ADMIN_KEY_STORAGE, keyInput);
        setAdminKey(keyInput);
    };

    const handleSuspend = async (tenantId, currentSuspended) => {
        await fetch(`/api/saas/stores/${tenantId}/status`, {
            method: 'PATCH',
            headers: apiHeaders(),
            body: JSON.stringify({ suspended: !currentSuspended })
        });
        setActionMsg(`Store "${tenantId}" ${!currentSuspended ? 'suspended' : 'activated'}.`);
        setTimeout(() => setActionMsg(''), 3000);
        loadData();
    };

    const handleDelete = async (tenantId) => {
        setConfirmDelete(null);
        const res = await fetch(`/api/saas/stores/${tenantId}`, {
            method: 'DELETE', headers: apiHeaders()
        });
        const data = await res.json();
        setActionMsg(data.message || data.error || 'Done.');
        setTimeout(() => setActionMsg(''), 4000);
        loadData();
    };

    const openModulesModal = async (tenantId) => {
        try {
            const res = await fetch(`/api/saas/stores/${tenantId}/modules`, { headers: apiHeaders() });
            const data = await res.json();
            setSelectedModules(data || {});
            setSelectedTenantForModules(tenantId);
            setShowModulesModal(true);
        } catch {
            setActionMsg('Error loading modules');
        }
    };

    const handleSaveModules = async () => {
        try {
            await fetch(`/api/saas/stores/${selectedTenantForModules}/modules`, {
                method: 'PATCH',
                headers: apiHeaders(),
                body: JSON.stringify({ modules: selectedModules })
            });
            setShowModulesModal(false);
            setActionMsg(`Modules updated for ${selectedTenantForModules}`);
            setTimeout(() => setActionMsg(''), 3000);
        } catch {
            setActionMsg('Error saving modules');
        }
    };

    const filteredStores = stores.filter(s =>
        !search || s.tenantId?.includes(search.toLowerCase()) || s.businessName?.toLowerCase().includes(search.toLowerCase())
    );

    /* ---- LOGIN SCREEN ---- */
    if (!authenticated) {
        return (
            <div style={{ minHeight: '100vh', background: '#0a0a14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '48px 40px', width: '400px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛡️</div>
                    <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>SME Solutions Admin</h1>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', marginBottom: '32px' }}>Enter your provider admin key to access the control panel.</p>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <input
                            type="password"
                            value={keyInput}
                            onChange={e => setKeyInput(e.target.value)}
                            placeholder="Admin Key"
                            required
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none', textAlign: 'center', letterSpacing: '3px' }}
                        />
                        {authError && <p style={{ color: '#f87171', fontSize: '12px' }}>{authError}</p>}
                        <button type="submit" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', border: 'none', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                            Unlock Admin Panel
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    /* ---- MAIN PANEL ---- */
    return (
        <div style={{ minHeight: '100vh', background: '#0a0a14', color: '#e5e7eb', fontFamily: "'Inter', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet" />

            {/* Header */}
            <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '22px' }}>🛡️</span>
                    <span style={{ fontWeight: '700', fontSize: '16px', color: '#fff' }}>SME Solutions</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>/ SaaS Provider Panel</span>
                </div>
                <button onClick={() => { localStorage.removeItem(ADMIN_KEY_STORAGE); setAdminKey(''); setAuthenticated(false); setKeyInput(''); }}
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '6px 14px', color: '#f87171', fontSize: '12px', cursor: 'pointer' }}>
                    <i className="ri-logout-box-line" /> Logout
                </button>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>

                {/* Stats Cards */}
                {stats && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                        {[
                            { label: 'Total Stores', value: fmt(stats.storeCount), icon: 'ri-store-2-line', color: '#7c3aed' },
                            { label: 'Total Invoices', value: fmt(stats.invoiceCount), icon: 'ri-file-list-3-line', color: '#0ea5e9' },
                            { label: 'Total Users', value: fmt(stats.userCount), icon: 'ri-user-3-line', color: '#10b981' },
                            { label: 'Inquiries', value: fmt(stats.inquiryCount), icon: 'ri-mail-line', color: '#f59e0b' }
                        ].map(card => (
                            <div key={card.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${card.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: card.color }}>
                                    <i className={card.icon} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff' }}>{card.value}</div>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>{card.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Action Toast */}
                {actionMsg && (
                    <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '10px 16px', marginBottom: '16px', color: '#34d399', fontSize: '13px' }}>
                        <i className="ri-checkbox-circle-line" style={{ marginRight: '8px' }} />{actionMsg}
                    </div>
                )}

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
                    {[['stores', 'ri-store-2-line', 'Stores'], ['inquiries', 'ri-mail-open-line', 'Inquiries'], ['payments', 'ri-bank-card-line', 'Payments']].map(([t, icon, label]) => (
                        <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? '#7c3aed' : 'transparent', border: 'none', borderRadius: '7px', padding: '8px 20px', color: tab === t ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <i className={icon} />{label}
                        </button>
                    ))}
                </div>

                {/* ======= STORES TAB ======= */}
                {tab === 'stores' && (
                    <>
                        {/* Toolbar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <i className="ri-search-line" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: '14px' }} />
                                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by subdomain or business name…"
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '9px 12px 9px 36px', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <button onClick={loadData} style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '8px', padding: '9px 16px', color: '#a78bfa', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <i className="ri-refresh-line" />Refresh
                            </button>
                        </div>

                        {/* Table */}
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.3)' }}>Loading…</div>
                        ) : (
                            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                            {['Subdomain / URL', 'Business Name', 'Sector', 'Users', 'Products', 'Invoices', 'Status', 'Actions'].map(h => (
                                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStores.length === 0 ? (
                                            <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.25)' }}>No stores found.</td></tr>
                                        ) : filteredStores.map((store, i) => (
                                            <React.Fragment key={store.tenantId}>
                                            <tr style={{ borderBottom: i < filteredStores.length - 1 && expandedStore !== store.tenantId ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.15s' }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <div style={{ fontWeight: '600', color: '#a78bfa' }}>{store.tenantId}</div>
                                                    <a href={`https://${store.tenantId}.${baseDomain}`} target="_blank" rel="noreferrer"
                                                        style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', textDecoration: 'none' }}>
                                                        {store.tenantId}.{baseDomain} <i className="ri-external-link-line" />
                                                    </a>
                                                </td>
                                                <td style={{ padding: '12px 16px', color: '#e5e7eb' }}>{store.businessName || '—'}</td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <span style={{ background: 'rgba(14,165,233,0.12)', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px', fontSize: '11px' }}>
                                                        {SECTOR_LABELS[store.businessType] || store.businessType || '—'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px 16px', color: '#d1d5db' }}>{fmt(store.userCount)}</td>
                                                <td style={{ padding: '12px 16px', color: '#d1d5db' }}>{fmt(store.productCount)}</td>
                                                <td style={{ padding: '12px 16px', color: '#d1d5db' }}>{fmt(store.invoiceCount)}</td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <span style={{ background: store.suspended ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: store.suspended ? '#f87171' : '#34d399', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500' }}>
                                                        {store.suspended ? 'Suspended' : 'Active'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                                        <a href={`https://${store.tenantId}.${baseDomain}`} target="_blank" rel="noreferrer"
                                                            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '6px', padding: '5px 8px', color: '#a78bfa', fontSize: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <i className="ri-external-link-line" />Visit
                                                        </a>
                                                        <button onClick={() => handleSuspend(store.tenantId, store.suspended)}
                                                            style={{ background: store.suspended ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', border: `1px solid ${store.suspended ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`, borderRadius: '6px', padding: '5px 8px', color: store.suspended ? '#34d399' : '#fbbf24', fontSize: '12px', cursor: 'pointer' }}>
                                                            <i className={store.suspended ? 'ri-play-circle-line' : 'ri-pause-circle-line'} />
                                                            {store.suspended ? 'Activate' : 'Suspend'}
                                                        </button>
                                                        <button onClick={() => setExpandedStore(expandedStore === store.tenantId ? null : store.tenantId)}
                                                            style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '6px', padding: '5px 8px', color: '#38bdf8', fontSize: '12px', cursor: 'pointer' }}>
                                                            <i className="ri-information-line" />
                                                        </button>
                                                        <button onClick={() => openModulesModal(store.tenantId)}
                                                            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '6px', padding: '5px 8px', color: '#a78bfa', fontSize: '12px', cursor: 'pointer' }}>
                                                            <i className="ri-apps-2-line" /> Modules
                                                        </button>
                                                        {store.tenantId !== 'default' && (
                                                            <button onClick={() => setConfirmDelete(store.tenantId)}
                                                                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '5px 8px', color: '#f87171', fontSize: '12px', cursor: 'pointer' }}>
                                                                <i className="ri-delete-bin-6-line" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedStore === store.tenantId && (
                                                <tr key={`${store.tenantId}-details`} style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                                    <td colSpan={8} style={{ padding: '16px 24px' }}>
                                                        <div style={{ display: 'flex', gap: '40px', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                                                            <div>
                                                                <div style={{ marginBottom: '6px' }}><span style={{ color: 'rgba(255,255,255,0.4)', width: '100px', display: 'inline-block' }}>License Key:</span> <span style={{ color: '#10b981', fontFamily: 'monospace', fontWeight: 'bold' }}>{store.licenseKey || 'N/A'}</span></div>
                                                                <div style={{ marginBottom: '6px' }}><span style={{ color: 'rgba(255,255,255,0.4)', width: '100px', display: 'inline-block' }}>Expires At:</span> {store.licenseExpiresAt ? new Date(store.licenseExpiresAt).toLocaleDateString() : 'N/A'}</div>
                                                                <div><span style={{ color: 'rgba(255,255,255,0.4)', width: '100px', display: 'inline-block' }}>Lic. Status:</span> {store.licenseStatus || 'active'}</div>
                                                            </div>
                                                            <div>
                                                                <div style={{ marginBottom: '6px' }}><span style={{ color: 'rgba(255,255,255,0.4)', width: '80px', display: 'inline-block' }}>Email:</span> {store.email || 'N/A'}</div>
                                                                <div style={{ marginBottom: '6px' }}><span style={{ color: 'rgba(255,255,255,0.4)', width: '80px', display: 'inline-block' }}>Mobile:</span> {store.mobile || store.contactNumber || 'N/A'}</div>
                                                                <div><span style={{ color: 'rgba(255,255,255,0.4)', width: '80px', display: 'inline-block' }}>Address:</span> {store.nationalAddress || store.businessAddress || 'N/A'}</div>
                                                            </div>
                                                            <div>
                                                                <div style={{ marginBottom: '6px' }}><span style={{ color: 'rgba(255,255,255,0.4)', width: '80px', display: 'inline-block' }}>VAT:</span> {store.vatNumber || 'N/A'}</div>
                                                                <div><span style={{ color: 'rgba(255,255,255,0.4)', width: '80px', display: 'inline-block' }}>CR:</span> {store.crNumber || 'N/A'}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

                {/* ======= INQUIRIES TAB ======= */}
                {tab === 'inquiries' && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                    {['Name', 'Email', 'Phone', 'Business', 'Sector', 'Branches', 'Message', 'Date'].map(h => (
                                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {inquiries.length === 0 ? (
                                    <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.25)' }}>No inquiries yet.</td></tr>
                                ) : inquiries.map((inq, i) => (
                                    <tr key={inq._id} style={{ borderBottom: i < inquiries.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '12px 16px', fontWeight: '600', color: '#e5e7eb' }}>{inq.name}</td>
                                        <td style={{ padding: '12px 16px', color: '#a78bfa' }}><a href={`mailto:${inq.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{inq.email}</a></td>
                                        <td style={{ padding: '12px 16px', color: '#d1d5db' }}>{inq.phone || '—'}</td>
                                        <td style={{ padding: '12px 16px', color: '#d1d5db' }}>{inq.businessName || '—'}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ background: 'rgba(14,165,233,0.12)', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px', fontSize: '11px' }}>
                                                {SECTOR_LABELS[inq.businessType] || inq.businessType || '—'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', color: '#d1d5db', textAlign: 'center' }}>{inq.branches || 1}</td>
                                        <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.5)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inq.message || '—'}</td>
                                        <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.35)', fontSize: '11px', whiteSpace: 'nowrap' }}>{timeAgo(inq.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ======= PAYMENTS TAB ======= */}
                {tab === 'payments' && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                    {['Date', 'Store / Tenant', 'Amount', 'Status', 'Method', 'Reference'].map(h => (
                                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(payments) && payments.length === 0 ? (
                                    <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.25)' }}>No payments found.</td></tr>
                                ) : Array.isArray(payments) ? payments.map((pay, i) => (
                                    <tr key={pay._id} style={{ borderBottom: i < payments.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.5)' }}>{new Date(pay.date).toLocaleDateString()}</td>
                                        <td style={{ padding: '12px 16px', fontWeight: '600', color: '#a78bfa' }}>{pay.tenantId}</td>
                                        <td style={{ padding: '12px 16px', color: '#10b981', fontWeight: '600' }}>SAR {fmt(pay.amount)}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ background: pay.status === 'Paid' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: pay.status === 'Paid' ? '#34d399' : '#fbbf24', padding: '3px 8px', borderRadius: '4px', fontSize: '11px' }}>
                                                {pay.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', color: '#d1d5db' }}>{pay.method}</td>
                                        <td style={{ padding: '12px 16px', color: '#d1d5db' }}>{pay.reference || '—'}</td>
                                    </tr>
                                )) : null}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {confirmDelete && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#12121e', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '14px', padding: '32px 36px', maxWidth: '420px', textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</div>
                        <h3 style={{ color: '#fff', fontWeight: '700', marginBottom: '10px' }}>Delete Store?</h3>
                        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                            This will permanently delete <strong style={{ color: '#f87171' }}>{confirmDelete}.{baseDomain}</strong> and <strong>all its data</strong> — products, invoices, users — and cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px', color: '#fff', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
                            <button onClick={() => handleDelete(confirmDelete)} style={{ flex: 1, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '8px', padding: '10px', color: '#f87171', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                                <i className="ri-delete-bin-6-line" /> Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modules Modal */}
            {showModulesModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#12121e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '32px 36px', width: '400px' }}>
                        <h3 style={{ color: '#fff', fontWeight: '700', marginBottom: '16px' }}>Modules for {selectedTenantForModules}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                            {['pos', 'inventory', 'financials', 'hrm', 'ecommerce', 'b2b'].map(mod => (
                                <label key={mod} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={selectedModules[mod] || false}
                                        onChange={e => setSelectedModules({ ...selectedModules, [mod]: e.target.checked })}
                                        style={{ width: '18px', height: '18px', accentColor: '#7c3aed' }} />
                                    <span style={{ color: '#fff', textTransform: 'capitalize' }}>{mod}</span>
                                </label>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setShowModulesModal(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px', color: '#fff', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
                            <button onClick={handleSaveModules} style={{ flex: 1, background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', border: 'none', borderRadius: '8px', padding: '10px', color: '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                                Save Modules
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
