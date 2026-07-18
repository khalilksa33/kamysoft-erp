import React, { useState } from 'react';

export default function ForgotPassword({ onNavigate }) {
    const [tenantId, setTenantId] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tenantId })
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                setStatus('success');
                setMessage(data.message || 'Password reset link sent to your email address.');
            } else {
                setStatus('error');
                setMessage(data.error || 'Failed to send password reset link.');
            }
        } catch (err) {
            setStatus('error');
            setMessage('Network error. Please try again later.');
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: '#1e293b', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)' }}>
                        <i className="ri-lock-unlock-line" style={{ fontSize: '30px', color: '#fff' }} />
                    </div>
                    <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Forgot Password</h2>
                    <p style={{ color: '#94a3b8', fontSize: '14px' }}>Enter your Store ID to receive a reset link</p>
                </div>

                {status === 'success' ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', border: '1px solid rgba(16,185,129,0.2)' }}>
                            <i className="ri-checkbox-circle-line" style={{ marginRight: '8px', fontSize: '16px' }} />
                            {message}
                        </div>
                        <button type="button" onClick={() => onNavigate('login')} style={{ background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}>
                            Return to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {status === 'error' && (
                            <div style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', display: 'flex', alignItems: 'center', border: '1px solid rgba(239,68,68,0.2)' }}>
                                <i className="ri-error-warning-line" style={{ marginRight: '8px', fontSize: '16px' }} />
                                {message}
                            </div>
                        )}

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Store ID (Tenant ID)</label>
                            <input 
                                type="text" 
                                value={tenantId} 
                                onChange={e => setTenantId(e.target.value)} 
                                required 
                                placeholder="e.g. realestate"
                                style={{ width: '100%', padding: '12px 16px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '15px', transition: 'all 0.2s', outline: 'none' }}
                                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                                onBlur={e => e.target.style.borderColor = '#334155'}
                            />
                        </div>

                        <button type="submit" disabled={status === 'loading'} style={{ width: '100%', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: status === 'loading' ? 'not-allowed' : 'pointer', opacity: status === 'loading' ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>
                            {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '24px' }}>
                            <button type="button" onClick={() => onNavigate('login')} style={{ background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#94a3b8'}>
                                <i className="ri-arrow-left-line" style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                                Back to Login
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
