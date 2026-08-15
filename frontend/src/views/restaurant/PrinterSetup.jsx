import React, { useState, useEffect } from 'react';

const PrinterSetup = ({ currentLanguage, translations, headers }) => {
    const [configs, setConfigs] = useState([]);
    const [form, setForm] = useState({ category: '', ip: '', port: 9100 });

    const fetchConfigs = () => {
        fetch('/api/printers', { headers })
            .then(res => res.json())
            .then(data => setConfigs(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchConfigs();
    }, []);

    const handleSave = () => {
        if (!form.category || !form.ip) return;
        fetch('/api/printers', {
            method: 'POST',
            headers,
            body: JSON.stringify(form)
        })
        .then(res => res.json())
        .then(() => {
            fetchConfigs();
            setForm({ category: '', ip: '', port: 9100 });
        })
        .catch(err => console.error(err));
    };

    const handleDelete = (category) => {
        fetch(`/api/printers/${category}`, { method: 'DELETE', headers })
            .then(() => fetchConfigs())
            .catch(err => console.error(err));
    };

    return (
        <div className="view-content active">
            <h2>{currentLanguage === 'ar' ? 'إعدادات طابعات المطبخ' : 'Kitchen Printer Setup'}</h2>
            
            <div className="glass-card" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                        type="text" 
                        placeholder={currentLanguage === 'ar' ? 'الفئة (مثل: المشويات)' : 'Category (e.g., Hot Food)'} 
                        className="form-control" 
                        value={form.category} 
                        onChange={e => setForm({...form, category: e.target.value})} 
                    />
                    <input 
                        type="text" 
                        placeholder="IP Address (e.g., 192.168.1.100)" 
                        className="form-control" 
                        value={form.ip} 
                        onChange={e => setForm({...form, ip: e.target.value})} 
                    />
                    <input 
                        type="number" 
                        placeholder="Port (9100)" 
                        className="form-control" 
                        value={form.port} 
                        onChange={e => setForm({...form, port: parseInt(e.target.value)})} 
                    />
                    <button className="btn btn-primary" onClick={handleSave}>
                        <i className="ri-save-line"></i> {translations[currentLanguage].saveBtn}
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>{currentLanguage === 'ar' ? 'الفئة' : 'Category'}</th>
                            <th>{currentLanguage === 'ar' ? 'عنوان IP' : 'IP Address'}</th>
                            <th>{currentLanguage === 'ar' ? 'المنفذ' : 'Port'}</th>
                            <th>{currentLanguage === 'ar' ? 'إجراء' : 'Action'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {configs.map(config => (
                            <tr key={config.category}>
                                <td>{config.category}</td>
                                <td>{config.ip}</td>
                                <td>{config.port}</td>
                                <td>
                                    <button className="action-btn delete" onClick={() => handleDelete(config.category)}>
                                        <i className="ri-delete-bin-line"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {configs.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    {currentLanguage === 'ar' ? 'لا توجد طابعات مضافة' : 'No printers configured'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PrinterSetup;
