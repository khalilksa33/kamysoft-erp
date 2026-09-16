import React, { useState, useEffect } from 'react';

const PriceRules = ({ currentLanguage }) => {
    const isAr = currentLanguage === 'ar';
    const [rules, setRules] = useState([]);
    const [properties, setProperties] = useState([]);
    const [name, setName] = useState('');
    const [propertyId, setPropertyId] = useState('');
    const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(() => {
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        return d.toISOString().split('T')[0];
    });
    const [ruleType, setRuleType] = useState('Multiplier');
    const [value, setValue] = useState(1.2);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [rulesRes, propRes] = await Promise.all([
                fetch('/api/realestate/price-rules', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/properties', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            const rData = await rulesRes.json();
            const pData = await propRes.json();
            if (Array.isArray(rData)) setRules(rData); else setRules([]);
            if (Array.isArray(pData)) setProperties(pData); else setProperties([]);
        } catch (err) { console.error(err); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await fetch('/api/realestate/price-rules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    name, propertyId: propertyId || undefined,
                    startDate: new Date(startDate).toISOString(),
                    endDate: new Date(endDate).toISOString(),
                    ruleType, value: Number(value)
                })
            });
            setName('');
            setValue(1.2);
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(isAr ? 'حذف هذه القاعدة السعرية؟' : 'Delete this price rule?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/realestate/price-rules/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            fetchData();
        } catch (err) { console.error(err); }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                        <i className="ri-price-tag-3-line" style={{ color: 'var(--accent-gold)', marginRight: isAr ? '0' : '8px', marginLeft: isAr ? '8px' : '0' }}></i>
                        {isAr ? 'قواعد الأسعار والمواسم الديناميكية (Dynamic Pricing)' : 'Dynamic Rates & Seasonal Price Rules'}
                    </h2>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        {isAr ? 'تسعير متقدم حسب المواسم، الإجازات، عطلات نهاية الأسبوع والعروض الترويجية (مواصفات QloApps)' : 'Advanced rate plans, seasonal pricing, weekend multipliers, and promo rules (QloApps Specs)'}
                    </p>
                </div>
            </div>

            <div className="glass-card">
                <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>
                    {isAr ? 'إضافة خطة تسعير / قاعدة موسمية جديدة' : 'Add New Pricing Rule / Season Plan'}
                </h3>
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'اسم القاعدة / الموسم' : 'Rule / Season Name'}</label>
                            <input type="text" className="form-control" placeholder={isAr ? 'موسم الرياض / إجازة الصيف' : 'e.g. Summer Peak Season'} value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'تطبيق على منشأة محددة' : 'Target Property'}</label>
                            <select className="form-control" value={propertyId} onChange={e => setPropertyId(e.target.value)}>
                                <option value="">{isAr ? 'جميع العقارات والمنشآت (All)' : 'All Properties'}</option>
                                {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'تاريخ البداية' : 'Start Date'}</label>
                            <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'تاريخ النهاية' : 'End Date'}</label>
                            <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'نوع التعديل' : 'Modification Type'}</label>
                            <select className="form-control" value={ruleType} onChange={e => setRuleType(e.target.value)}>
                                <option value="Multiplier">{isAr ? 'مضاعف سعر (مثال 1.2 = +20%)' : 'Multiplier (e.g. 1.2 = +20%)'}</option>
                                <option value="PercentageDiscount">{isAr ? 'خصم نسبة مئوية (Percentage Discount)' : 'Percentage Discount (%)'}</option>
                                <option value="FixedDiscount">{isAr ? 'خصم مبلغ ثابت (Fixed SAR Discount)' : 'Fixed SAR Discount'}</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'القيمة' : 'Value'}</label>
                            <input type="number" step="0.01" className="form-control" value={value} onChange={e => setValue(e.target.value)} required />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" className="btn btn-primary">
                            <i className="ri-save-line"></i> {isAr ? 'حفظ خطة التسعير' : 'Save Price Rule'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="glass-card">
                <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>
                    <i className="ri-scales-3-line" style={{ color: 'var(--accent-purple)', marginRight: '6px' }}></i>
                    {isAr ? 'قائمة الخطط والأسعار الموسمية النشطة' : 'Active Dynamic Rate Rules'}
                </h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>{isAr ? 'اسم القاعدة' : 'Rule Name'}</th>
                                <th>{isAr ? 'المنشأة' : 'Property'}</th>
                                <th>{isAr ? 'الفترة الزمنية' : 'Date Window'}</th>
                                <th>{isAr ? 'النوع والتأثير' : 'Type & Effect'}</th>
                                <th style={{ textAlign: 'center' }}>{isAr ? 'الحالة' : 'Status'}</th>
                                <th>{isAr ? 'إجراءات' : 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rules.map(r => {
                                const prop = properties.find(p => p.id === r.propertyId);
                                return (
                                    <tr key={r.id}>
                                        <td><strong>{r.name}</strong></td>
                                        <td>{prop ? prop.name : (isAr ? 'جميع المنشآت' : 'All Properties')}</td>
                                        <td>
                                            {new Date(r.startDate).toLocaleDateString()} ➔ {new Date(r.endDate).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <span className="badge badge-primary">
                                                {r.ruleType}: {r.value}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}><span className="status-badge valid">{r.status || 'Active'}</span></td>
                                        <td>
                                            <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleDelete(r.id)}>
                                                <i className="ri-delete-bin-line"></i>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {rules.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                                        {isAr ? 'لا توجد قواعد تسعير موسمية نشطة' : 'No dynamic pricing rules configured.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PriceRules;
