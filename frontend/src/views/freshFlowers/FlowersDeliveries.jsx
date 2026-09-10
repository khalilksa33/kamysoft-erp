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
            default: return 'valid';
        }
    };

    const getStatusLabel = (status) => {
        if (currentLanguage === 'ar') {
            switch(status) {
                case 'Pending': return 'قيد الانتظار';
                case 'Out for Delivery': return 'في الطريق للتوصيل';
                case 'Delivered': return 'تم التوصيل';
                case 'Cancelled': return 'ملغي';
                default: return status;
            }
        }
        return status;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                        <i className="ri-truck-line" style={{ color: 'var(--accent-cyan)', marginRight: currentLanguage === 'ar' ? '0' : '8px', marginLeft: currentLanguage === 'ar' ? '8px' : '0' }}></i>
                        {translations?.flowersDeliveries || (currentLanguage === 'ar' ? 'جدولة وتوصيل الزهور' : 'Flower Deliveries')}
                    </h2>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        {currentLanguage === 'ar' ? 'متابعة شحنات وتوصيل باقات الورد والهدايا للعملاء' : 'Track and manage flower bouquet delivery schedules and customer addresses'}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <i className="ri-add-line"></i> {currentLanguage === 'ar' ? 'جدولة توصيل جديد' : 'Schedule Delivery'}
                    </button>
                </div>
            </div>

            <div className="glass-card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>{currentLanguage === 'ar' ? 'بيانات المستلم' : 'Customer Info'}</th>
                                <th>{currentLanguage === 'ar' ? 'عنوان التوصيل' : 'Delivery Address'}</th>
                                <th>{currentLanguage === 'ar' ? 'الموعد المجدول' : 'Scheduled For'}</th>
                                <th style={{ textAlign: 'center' }}>{currentLanguage === 'ar' ? 'الحالة' : 'Status'}</th>
                                <th>{currentLanguage === 'ar' ? 'تحديث الحالة' : 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveries.map(del => (
                                <tr key={del.id}>
                                    <td><strong>#{del.id}</strong></td>
                                    <td>
                                        <div style={{ fontWeight: 'bold' }}>{del.customer}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{del.phone}</div>
                                    </td>
                                    <td>{del.address}</td>
                                    <td>
                                        <div><i className="ri-calendar-line" style={{ marginRight: '4px' }}></i>{del.date}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}><i className="ri-time-line" style={{ marginRight: '4px' }}></i>{del.time}</div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className={`status-badge ${getStatusClass(del.status)}`} style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '11px' }}>
                                            {getStatusLabel(del.status)}
                                        </span>
                                    </td>
                                    <td>
                                        <select 
                                            className="form-control" 
                                            value={del.status} 
                                            onChange={(e) => updateStatus(del.id, e.target.value)}
                                            style={{ padding: '4px 8px', fontSize: '12px', width: 'auto', display: 'inline-block' }}
                                        >
                                            <option value="Pending">{currentLanguage === 'ar' ? 'قيد الانتظار' : 'Pending'}</option>
                                            <option value="Out for Delivery">{currentLanguage === 'ar' ? 'في الطريق للتوصيل' : 'Out for Delivery'}</option>
                                            <option value="Delivered">{currentLanguage === 'ar' ? 'تم التوصيل' : 'Delivered'}</option>
                                            <option value="Cancelled">{currentLanguage === 'ar' ? 'ملغي' : 'Cancelled'}</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {deliveries.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                                        {currentLanguage === 'ar' ? 'لا توجد عمليات توصيل مجدولة' : 'No deliveries found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal glass-card" style={{ maxWidth: '520px', width: '100%', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px' }}>
                                {currentLanguage === 'ar' ? 'جدولة توصيل جديد' : 'Schedule Delivery'}
                            </h3>
                            <button className="btn btn-secondary" style={{ padding: '4px 8px', minWidth: 'auto' }} onClick={() => setShowModal(false)}>
                                <i className="ri-close-line"></i>
                            </button>
                        </div>
                        <div>
                            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                        {currentLanguage === 'ar' ? 'اسم المستلم' : 'Recipient / Customer Name'}
                                    </label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        required 
                                        value={formData.customer} 
                                        onChange={e => setFormData({...formData, customer: e.target.value})} 
                                        placeholder={currentLanguage === 'ar' ? 'اسم العميل أو المستلم' : 'Customer name'}
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                        {currentLanguage === 'ar' ? 'رقم الهاتف / الجوال' : 'Phone Number'}
                                    </label>
                                    <input 
                                        type="tel" 
                                        className="form-control" 
                                        required 
                                        value={formData.phone} 
                                        onChange={e => setFormData({...formData, phone: e.target.value})} 
                                        placeholder="05xxxxxxxx"
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                        {currentLanguage === 'ar' ? 'عنوان التوصيل بالتفصيل' : 'Delivery Address'}
                                    </label>
                                    <textarea 
                                        className="form-control" 
                                        required 
                                        value={formData.address} 
                                        onChange={e => setFormData({...formData, address: e.target.value})} 
                                        rows="2"
                                        placeholder={currentLanguage === 'ar' ? 'المدينة، الحي، الشارع، رقم المبنى' : 'City, District, Street, Building No'}
                                    ></textarea>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div className="form-group">
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                            {currentLanguage === 'ar' ? 'التاريخ' : 'Date'}
                                        </label>
                                        <input 
                                            type="date" 
                                            className="form-control" 
                                            required 
                                            value={formData.date} 
                                            onChange={e => setFormData({...formData, date: e.target.value})} 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                            {currentLanguage === 'ar' ? 'الفترة الزمنية' : 'Time Slot'}
                                        </label>
                                        <select 
                                            className="form-control" 
                                            required 
                                            value={formData.time} 
                                            onChange={e => setFormData({...formData, time: e.target.value})}
                                        >
                                            <option value="">{currentLanguage === 'ar' ? 'اختر الفترة...' : 'Select Time...'}</option>
                                            <option value="08:00 - 10:00">08:00 - 10:00 AM</option>
                                            <option value="10:00 - 12:00">10:00 - 12:00 PM</option>
                                            <option value="14:00 - 16:00">02:00 - 04:00 PM</option>
                                            <option value="16:00 - 18:00">04:00 - 06:00 PM</option>
                                            <option value="18:00 - 20:00">06:00 - 08:00 PM</option>
                                            <option value="20:00 - 22:00">08:00 - 10:00 PM</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                        {currentLanguage === 'ar' ? 'إلغاء' : 'Cancel'}
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {currentLanguage === 'ar' ? 'جدولة الطلب' : 'Schedule'}
                                    </button>
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
