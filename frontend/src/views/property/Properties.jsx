import React, { useState, useEffect } from 'react';
import '../../index.css';

const Properties = ({ currentLanguage }) => {
    const isAr = currentLanguage === 'ar';
    const [properties, setProperties] = useState([]);
    const [owners, setOwners] = useState([]);
    const [name, setName] = useState('');
    const [type, setType] = useState('Resort');
    const [location, setLocation] = useState('');
    const [ownerId, setOwnerId] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchProperties();
        fetchOwners();
    }, []);

    const fetchProperties = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/properties', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await res.json();
            if (Array.isArray(data)) setProperties(data);
            else setProperties([]);
        } catch (err) { console.error('Error fetching properties', err); }
    };

    const fetchOwners = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/property-owners', { headers: { 'Authorization': `Bearer ${token}` } });
            const data = await res.json();
            if (Array.isArray(data)) setOwners(data);
            else setOwners([]);
        } catch (err) { console.error('Error fetching owners', err); }
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = editId ? `/api/properties/${editId}` : '/api/properties';
            const method = editId ? 'PUT' : 'POST';
            
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ name, type, location, ownerId })
            });
            if (!res.ok) {
                const text = await res.text();
                alert(`Error saving property: ${res.status} ${text}`);
                return;
            }
            setName('');
            setLocation('');
            setOwnerId('');
            setEditId(null);
            fetchProperties();
        } catch (err) { 
            console.error('Error saving property', err);
            alert(`Network error saving property: ${err.message}`);
        }
    };

    const handleEdit = (p) => {
        setEditId(p.id);
        setName(p.name);
        setType(p.type);
        setLocation(p.location || '');
        setOwnerId(p.ownerId || '');
    };

    const handleDelete = async (id) => {
        if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا العقار وجميع وحداته؟' : 'Delete this property and all its units?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/properties/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            fetchProperties();
        } catch (err) { console.error('Error deleting property', err); }
    };

    const [showSellModal, setShowSellModal] = useState(false);
    const [sellPropertyId, setSellPropertyId] = useState(null);
    const [sellForm, setSellForm] = useState({ customerName: '', price: '' });

    const handleSell = (p) => {
        setSellPropertyId(p.id);
        setSellForm({ customerName: '', price: '' });
        setShowSellModal(true);
    };

    const submitSell = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/properties/${sellPropertyId}/sell`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(sellForm)
            });
            if (res.ok) {
                setShowSellModal(false);
                fetchProperties();
                alert(isAr ? 'تم بيع العقار وإصدار فاتورة بنجاح' : 'Property sold and invoice generated successfully');
            } else {
                alert('Error selling property');
            }
        } catch (err) {
            alert('Network error while selling');
        }
    };

    const [showGallery, setShowGallery] = useState(false);
    const [currentGalleryImages, setCurrentGalleryImages] = useState([]);
    const [currentGalleryProperty, setCurrentGalleryProperty] = useState('');
    const [galleryIndex, setGalleryIndex] = useState(0);

    const handleViewGallery = (p) => {
        let imgs = p.images && p.images.length > 0 ? p.images : [
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
        ];
        setCurrentGalleryImages(imgs);
        setCurrentGalleryProperty(p.name);
        setGalleryIndex(0);
        setShowGallery(true);
    };

    const handleImageUpload = async (e, propertyId) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('photos', files[i]);
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/properties/${propertyId}/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                alert(isAr ? 'تم رفع الصور بنجاح!' : 'Images uploaded successfully!');
                fetchProperties();
            } else {
                alert(isAr ? 'خطأ في رفع الصور' : 'Error uploading images');
            }
        } catch (err) {
            console.error('Error uploading images', err);
            alert('Network error while uploading');
        }
    };

    const getOwnerName = (id) => {
        const owner = owners.find(o => o.id === id);
        return owner ? owner.name : (isAr ? 'مملوك للشركة' : 'Company Owned');
    };

    return (
        <div className="view-container">
            <div className="header-row">
                <h2>{isAr ? 'إدارة العقارات' : 'Manage Properties'}</h2>
            </div>
            
            <div className="card">
                <h3>{editId ? (isAr ? 'تعديل العقار' : 'Edit Property') : (isAr ? 'إضافة عقار جديد' : 'Add New Property')}</h3>
                <form onSubmit={handleCreateOrUpdate} className="inline-form">
                    <input type="text" className="form-control" placeholder={isAr ? 'اسم العقار' : 'Property Name'} value={name} onChange={e => setName(e.target.value)} required />
                    <select className="form-control" value={type} onChange={e => setType(e.target.value)}>
                        <option value="Resort">{isAr ? 'منتجع' : 'Resort'}</option>
                        <option value="Building">{isAr ? 'مبنى' : 'Building'}</option>
                        <option value="Hotel">{isAr ? 'فندق' : 'Hotel'}</option>
                        <option value="Compound">{isAr ? 'مجمع' : 'Compound'}</option>
                    </select>
                    <input type="text" className="form-control" placeholder={isAr ? 'الموقع' : 'Location'} value={location} onChange={e => setLocation(e.target.value)} />
                    
                    <select className="form-control" value={ownerId} onChange={e => setOwnerId(e.target.value)}>
                        <option value="">{isAr ? '-- مملوك للشركة --' : '-- Company Owned --'}</option>
                        {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </select>
                    <button type="submit" className="btn btn-primary">{isAr ? 'حفظ' : 'Save'}</button>
                    {editId && <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setName(''); setLocation(''); setOwnerId(''); }}>{isAr ? 'إلغاء' : 'Cancel'}</button>}
                </form>
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>{isAr ? 'الاسم' : 'Name'}</th>
                            <th>{isAr ? 'النوع' : 'Type'}</th>
                            <th>{isAr ? 'الموقع' : 'Location'}</th>
                            <th>{isAr ? 'المالك' : 'Owner'}</th>
                            <th>{isAr ? 'الحالة' : 'Status'}</th>
                            <th>{isAr ? 'إجراء' : 'Action'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map(p => (
                            <tr key={p.id}>
                                <td>{p.name}</td>
                                <td>{p.type}</td>
                                <td>{p.location}</td>
                                <td>{getOwnerName(p.ownerId)}</td>
                                <td>
                                    {p.status === 'Sold' ? (
                                        <span className="badge badge-success">{isAr ? 'مباع' : 'Sold'}</span>
                                    ) : (
                                        <span className="badge badge-primary">{p.status}</span>
                                    )}
                                </td>
                                <td style={{ display: 'flex', gap: '8px' }}>
                                    <button className="btn btn-secondary" onClick={() => handleViewGallery(p)}>
                                        <i className="ri-image-line"></i> {isAr ? 'الصور' : 'Gallery'}
                                    </button>
                                    
                                    <input 
                                        type="file" 
                                        multiple 
                                        accept="image/*" 
                                        style={{ display: 'none' }} 
                                        id={`upload-${p.id}`}
                                        onChange={(e) => handleImageUpload(e, p.id)} 
                                    />
                                    <label htmlFor={`upload-${p.id}`} className="btn btn-primary" style={{ cursor: 'pointer', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <i className="ri-upload-2-line"></i> {isAr ? 'رفع' : 'Upload'}
                                    </label>

                                    {p.status !== 'Sold' && (
                                        <button className="btn btn-success" onClick={() => handleSell(p)}>{isAr ? 'بيع العقار' : 'Sell Property'}</button>
                                    )}
                                    <button className="btn btn-primary" onClick={() => handleEdit(p)}>{isAr ? 'تعديل' : 'Edit'}</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>{isAr ? 'حذف' : 'Delete'}</button>
                                </td>
                            </tr>
                        ))}
                        {properties.length === 0 && <tr><td colSpan="6">{isAr ? 'لا يوجد عقارات' : 'No properties found.'}</td></tr>}
                    </tbody>
                </table>
            </div>

            {showSellModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{isAr ? 'بيع العقار وإصدار فاتورة' : 'Sell Property & Generate Invoice'}</h3>
                        <form onSubmit={submitSell}>
                            <div className="form-group">
                                <label>{isAr ? 'اسم المشتري / العميل' : 'Buyer Name'}</label>
                                <input type="text" className="form-control" required value={sellForm.customerName} onChange={e => setSellForm({...sellForm, customerName: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>{isAr ? 'مبلغ البيع (بدون ضريبة)' : 'Sale Price (ex. VAT)'}</label>
                                <input type="number" className="form-control" required value={sellForm.price} onChange={e => setSellForm({...sellForm, price: e.target.value})} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowSellModal(false)}>{isAr ? 'إلغاء' : 'Cancel'}</button>
                                <button type="submit" className="btn btn-success">{isAr ? 'بيع وإصدار' : 'Sell & Generate'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showGallery && (
                <div className="modal-overlay" onClick={() => setShowGallery(false)}>
                    <div className="modal-content" style={{ maxWidth: '95vw', width: '95vw', height: '90vh', padding: '10px', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <h3 style={{ margin: 0 }}>{currentGalleryProperty} - {isAr ? 'معرض الصور' : 'Photo Gallery'}</h3>
                            <button className="btn btn-secondary" onClick={() => setShowGallery(false)}>
                                <i className="ri-close-line"></i>
                            </button>
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                            {currentGalleryImages.length > 0 ? (
                                <img src={currentGalleryImages[galleryIndex] || currentGalleryImages[0]} alt="Property" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', cursor: 'zoom-in', transition: 'transform 0.3s' }} 
                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.5)'} 
                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                            ) : (
                                <p>{isAr ? 'لا توجد صور' : 'No images available'}</p>
                            )}
                        </div>
                        {currentGalleryImages.length > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
                                <button className="btn btn-primary" onClick={() => setGalleryIndex(prev => prev > 0 ? prev - 1 : currentGalleryImages.length - 1)}>
                                    <i className="ri-arrow-left-s-line"></i> {isAr ? 'السابق' : 'Prev'}
                                </button>
                                <span>{galleryIndex + 1} / {currentGalleryImages.length}</span>
                                <button className="btn btn-primary" onClick={() => setGalleryIndex(prev => prev < currentGalleryImages.length - 1 ? prev + 1 : 0)}>
                                    {isAr ? 'التالي' : 'Next'} <i className="ri-arrow-right-s-line"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Properties;
