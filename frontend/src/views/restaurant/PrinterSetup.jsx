import React, { useState, useEffect } from 'react';

const PrinterSetup = ({ currentLanguage, translations, headers }) => {
    const [configs, setConfigs] = useState([]);
    const [form, setForm] = useState({ category: '', ip: '', port: 9100, model: 'epson-generic' });
    
    const printerBrands = [
        {
            brand: 'Epson',
            models: [
                { id: 'epson-tm-t88vi', name: 'Epson TM-T88VI' },
                { id: 'epson-tm-t88v', name: 'Epson TM-T88V' },
                { id: 'epson-tm-m30', name: 'Epson TM-m30' },
                { id: 'epson-tm-u220', name: 'Epson TM-U220' },
                { id: 'epson-tm-t20iii', name: 'Epson TM-T20III' },
                { id: 'epson-generic', name: 'Epson Generic (ESC/POS)' }
            ]
        },
        {
            brand: 'TA (Saudi)',
            models: [
                { id: 'ta-80', name: 'TA-80 Thermal' },
                { id: 'ta-pos80', name: 'TA-POS80' },
                { id: 'ta-generic', name: 'TA Generic' }
            ]
        },
        {
            brand: 'ZPOS',
            models: [
                { id: 'zpos-80', name: 'ZPOS 80mm' },
                { id: 'zpos-58', name: 'ZPOS 58mm' },
                { id: 'zpos-generic', name: 'ZPOS Generic' }
            ]
        },
        {
            brand: 'Star Micronics',
            models: [
                { id: 'star-tsp100', name: 'Star TSP100III' },
                { id: 'star-tsp654', name: 'Star TSP654II' },
                { id: 'star-mcprint3', name: 'Star mC-Print3' },
                { id: 'star-generic', name: 'Star Generic' }
            ]
        },
        {
            brand: 'XPrinter',
            models: [
                { id: 'xprinter-xp80c', name: 'XPrinter XP-80C' },
                { id: 'xprinter-xpq800', name: 'XPrinter XP-Q800' },
                { id: 'xprinter-xpn160i', name: 'XPrinter XP-N160I' },
                { id: 'xprinter-generic', name: 'XPrinter Generic' }
            ]
        },
        {
            brand: 'Rongta',
            models: [
                { id: 'rongta-rp326', name: 'Rongta RP326' },
                { id: 'rongta-rp80', name: 'Rongta RP80' },
                { id: 'rongta-generic', name: 'Rongta Generic' }
            ]
        },
        {
            brand: 'Bixolon',
            models: [
                { id: 'bixolon-srp330', name: 'Bixolon SRP-330II' },
                { id: 'bixolon-srp350', name: 'Bixolon SRP-350plusIII' },
                { id: 'bixolon-generic', name: 'Bixolon Generic' }
            ]
        },
        {
            brand: 'Zebra',
            models: [
                { id: 'zebra-zd410', name: 'Zebra ZD410' },
                { id: 'zebra-zd420', name: 'Zebra ZD420' },
                { id: 'zebra-generic', name: 'Zebra Generic' }
            ]
        },
        {
            brand: 'Other',
            models: [
                { id: 'generic-network', name: 'Generic Network Printer (Raw 9100)' }
            ]
        }
    ];

    // Flatten for easy lookup in the table
    const allModels = printerBrands.flatMap(b => b.models);

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
            setForm({ category: '', ip: '', port: 9100, model: 'epson-generic' });
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
                        style={{ width: '100px' }}
                    />
                    <select 
                        className="form-control" 
                        value={form.model} 
                        onChange={e => setForm({...form, model: e.target.value})}
                    >
                        {printerBrands.map(brandGroup => (
                            <optgroup key={brandGroup.brand} label={brandGroup.brand}>
                                {brandGroup.models.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
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
                            <th>{currentLanguage === 'ar' ? 'الطراز' : 'Model'}</th>
                            <th>{currentLanguage === 'ar' ? 'عنوان IP' : 'IP Address'}</th>
                            <th>{currentLanguage === 'ar' ? 'المنفذ' : 'Port'}</th>
                            <th>{currentLanguage === 'ar' ? 'إجراء' : 'Action'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {configs.map(config => (
                            <tr key={config.category}>
                                <td>{config.category}</td>
                                <td>{allModels.find(p => p.id === config.model)?.name || config.model || 'Generic Printer'}</td>
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
                                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
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
