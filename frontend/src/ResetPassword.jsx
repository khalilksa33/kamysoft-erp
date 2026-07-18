import React, { useState, useEffect } from 'react';

export default function ResetPassword({ onNavigate }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    // Extract token and tenantId from URL parameters
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    const tenantId = searchParams.get('tenantId');

    useEffect(() => {
        if (!token || !tenantId) {
            setStatus('error');
            setMessage('Invalid reset link. Missing required parameters.');
        }
    }, [token, tenantId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Passwords do not match.');
            return;
        }
        
        if (password.length < 6) {
            setStatus('error');
            setMessage('Password must be at least 6 characters long.');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tenantId, token, newPassword: password })
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                setStatus('success');
                setMessage('Password has been reset successfully. You can now log in.');
            } else {
                setStatus('error');
                setMessage(data.error || 'Failed to reset password.');
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
                    <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.5)' }}>
                        <i className="ri-key-line" style={{ fontSize: '30px', color: '#fff' }} />
                    </div>
                    <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Reset Password</h2>
                    <p style={{ color: '#94a3b8', fontSize: '14px' }}>Create a new password for Store: {tenantId}</p>
                </div>

                {status === 'success' ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', border: '1px solid rgba(16,185,129,0.2)' }}>
                            <i className="ri-checkbox-circle-line" style={{ marginRight: '8px', fontSize: '16px' }} />
                            {message}
                        </div>
                        <button type="button" onClick={() => onNavigate('login')} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', width: '100%' }}>
                            Go to Login
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

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>New Password</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                required 
                                disabled={!token || !tenantId}
                                style={{ width: '100%', padding: '12px 16px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '15px', transition: 'all 0.2s', outline: 'none' }}
                                onFocus={e => e.target.style.borderColor = '#10b981'}
                                onBlur={e => e.target.style.borderColor = '#334155'}
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Confirm New Password</label>
                            <input 
                                type="password" 
                                value={confirmPassword} 
                                onChange={e => setConfirmPassword(e.target.value)} 
                                required 
                                disabled={!token || !tenantId}
                                style={{ width: '100%', padding: '12px 16px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '15px', transition: 'all 0.2s', outline: 'none' }}
                                onFocus={e => e.target.style.borderColor = '#10b981'}
                                onBlur={e => e.target.style.borderColor = '#334155'}
                            />
                        </div>

                        <button type="submit" disabled={status === 'loading' || !token || !tenantId} style={{ width: '100%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: (status === 'loading' || !token || !tenantId) ? 'not-allowed' : 'pointer', opacity: (status === 'loading' || !token || !tenantId) ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
                            {status === 'loading' ? 'Resetting...' : 'Reset Password'}
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '24px' }}>
                            <button type="button" onClick={() => onNavigate('login')} style={{ background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#94a3b8'}>
                                Cancel & Back to Login
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
