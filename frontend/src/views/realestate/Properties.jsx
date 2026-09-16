import React, { useState, useEffect } from 'react';

const Properties = ({ currentLanguage }) => {
    const isAr = currentLanguage === 'ar';
    const [properties, setProperties] = useState([]);
    const [owners, setOwners] = useState([]);
    const [name, setName] = useState('');
    const [type, setType] = useState('Hotel');
    const [location, setLocation] = useState('');
    const [city, setCity] = useState('');
    const [starRating, setStarRating] = useState(4);
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [ownerId, setOwnerId] = useState('');
    const [selectedAmenities, setSelectedAmenities] = useState(['WiFi', 'AC', 'Parking']);
    const [editId, setEditId] = useState(null);

    // Gallery & Sell modals
    const [showGallery, setShowGallery] = useState(false);
    const [currentGalleryImages, setCurrentGalleryImages] = useState([]);
    const [currentGalleryProperty, setCurrentGalleryProperty] = useState('');
    const [galleryIndex, setGalleryIndex] = useState(0);

    const [showSellModal, setShowSellModal] = useState(false);
    const [sellProperty, setSellProperty] = useState(null);
    const [sellForm, setSellForm] = useState({ customerName: '', price: '' });

    const availableAmenities = [
        { id: 'WiFi', label: isAr ? 'واي فاي سريع' : 'High-speed WiFi', icon: 'ri-wifi-line' },
        { id: 'Pool', label: isAr ? 'مسبح' : 'Swimming Pool', icon: 'ri-drop-line' },
        { id: 'Parking', label: isAr ? 'موقف سيارات مجاني' : 'Free Parking', icon: 'ri-parking-box-line' },
        { id: 'AC', label: isAr ? 'تكييف مركزي' : 'Air Conditioning', icon: 'ri-temp-cold-line' },
        { id: 'Breakfast', label: isAr ? 'إفطار مجاني' : 'Free Breakfast', icon: 'ri-cup-line' },
        { id: 'Gym', label: isAr ? 'نادي صحي / جيم' : 'Fitness Center / Gym', icon: 'ri-heart-pulse-line' },
        { id: 'Spa', label: isAr ? 'سبا ومساج' : 'Spa & Wellness', icon: 'ri-sparkling-line' },
        { id: 'Restaurant', label: isAr ? 'مطعم وكافيه' : 'Restaurant & Cafe', icon: 'ri-restaurant-line' }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [propRes, ownerRes] = await Promise.all([
                fetch('/api/properties', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/property-owners', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            const propData = await propRes.json();
            const ownerData = await ownerRes.json();
            if (Array.isArray(propData)) setProperties(propData); else setProperties([]);
            if (Array.isArray(ownerData)) setOwners(ownerData); else setOwners([]);
        } catch (err) { console.error('Error fetching data', err); }
    };

    const toggleAmenity = (id) => {
        if (selectedAmenities.includes(id)) {
            setSelectedAmenities(selectedAmenities.filter(a => a !== id));
        } else {
            setSelectedAmenities([...selectedAmenities, id]);
        }
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = editId ? `/api/properties/${editId}` : '/api/properties';
            const method = editId ? 'PUT' : 'POST';

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    name, type, location, city, starRating: Number(starRating),
                    phone, email, ownerId, amenities: selectedAmenities
                })
            });
            resetForm();
            fetchData();
        } catch (err) { console.error('Error saving property', err); }
    };

    const resetForm = () => {
        setName('');
        setType('Hotel');
        setLocation('');
        setCity('');
        setStarRating(4);
        setPhone('');
        setEmail('');
        setOwnerId('');
        setSelectedAmenities(['WiFi', 'AC', 'Parking']);
        setEditId(null);
    };

    const handleEdit = (p) => {
        setEditId(p.id);
        setName(p.name);
        setType(p.type || 'Hotel');
        setLocation(p.location || '');
        setCity(p.city || '');
        setStarRating(p.starRating || 4);
        setPhone(p.phone || '');
        setEmail(p.email || '');
        setOwnerId(p.ownerId || '');
        setSelectedAmenities(p.amenities || ['WiFi', 'AC']);
    };

    const handleDelete = async (id) => {
        if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا العقار؟ سيتم حذف جميع الوحدات المرتبطة به.' : 'Delete this property and all linked units?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/properties/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            fetchData();
        } catch (err) { console.error('Error deleting property', err); }
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
            const data = await res.json();
            if (data.success) {
                alert(isAr ? 'تم رفع الصور بنجاح!' : 'Images uploaded successfully!');
                fetchData();
            }
        } catch (err) { console.error('Error uploading images', err); }
    };

    const handleViewGallery = (p) => {
        setCurrentGalleryProperty(p.name);
        setCurrentGalleryImages(p.images || []);
        setGalleryIndex(0);
        setShowGallery(true);
    };

    const handleSell = (p) => {
        setSellProperty(p);
        setShowSellModal(true);
    };

    const submitSell = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/properties/${sellProperty.id}/sell`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(sellForm)
            });
            const data = await res.json();
            if (data.success) {
                alert(isAr ? 'تم بيع العقار وإصدار الفاتورة الضريبية بنجاح!' : 'Property sold and ZATCA invoice generated!');
                setShowSellModal(false);
                setSellForm({ customerName: '', price: '' });
                fetchData();
            }
        } catch (err) { console.error('Error selling property', err); }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                        <i className="ri-building-4-line" style={{ color: 'var(--accent-cyan)', marginRight: isAr ? '0' : '8px', marginLeft: isAr ? '8px' : '0' }}></i>
                        {isAr ? 'إدارة العقارات والمنشآت الفندقية' : 'Properties & Hotels Management'}
                    </h2>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        {isAr ? 'تهيئة الفنادق، المنتجعات، الأبراج، والمجمعات السكنية مع المرافق والصور (مواصفات QloApps)' : 'Configure hotels, resorts, buildings, amenities, and multi-image galleries (QloApps Specs)'}
                    </p>
                </div>
            </div>

            <div className="glass-card">
                <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>
                    {editId ? (isAr ? 'تعديل بيانات العقار' : 'Edit Property') : (isAr ? 'إضافة عقار / فندق جديد' : 'Add New Property / Hotel')}
                </h3>
                <form onSubmit={handleCreateOrUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'اسم العقار / الفندق' : 'Property / Hotel Name'}</label>
                            <input type="text" className="form-control" placeholder={isAr ? 'مثال: فندق قصر الميريديان' : 'e.g. Meridian Palace Hotel'} value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'النوع' : 'Property Type'}</label>
                            <select className="form-control" value={type} onChange={e => setType(e.target.value)}>
                                <option value="Hotel">{isAr ? 'فندق (Hotel)' : 'Hotel'}</option>
                                <option value="Resort">{isAr ? 'منتجع (Resort)' : 'Resort'}</option>
                                <option value="Building">{isAr ? 'عمارة / برج سكني (Building)' : 'Building'}</option>
                                <option value="Compound">{isAr ? 'مجمع سكني (Compound)' : 'Compound'}</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'تصنيف النجوم' : 'Star Rating'}</label>
                            <select className="form-control" value={starRating} onChange={e => setStarRating(e.target.value)}>
                                <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                                <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                                <option value="3">⭐⭐⭐ (3 Stars)</option>
                                <option value="2">⭐⭐ (2 Stars)</option>
                                <option value="1">⭐ (1 Star)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'المدينة' : 'City'}</label>
                            <input type="text" className="form-control" placeholder={isAr ? 'الرياض، جدة، الخبر...' : 'Riyadh, Jeddah, etc.'} value={city} onChange={e => setCity(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'العنوان / الموقع' : 'Address / Location'}</label>
                            <input type="text" className="form-control" placeholder={isAr ? 'طريق الملك فهد، حي العليا' : 'King Fahd Rd, Olaya'} value={location} onChange={e => setLocation(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{isAr ? 'المالك' : 'Property Owner'}</label>
                            <select className="form-control" value={ownerId} onChange={e => setOwnerId(e.target.value)}>
                                <option value="">{isAr ? 'بدون مالك (تابع للمنشأة)' : 'Direct / Company Owned'}</option>
                                {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Amenities Selection (QloApps feature) */}
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            <i className="ri-hotel-fill" style={{ marginRight: '6px' }}></i>
                            {isAr ? 'المرافق والخدمات المتاحة (Amenities)' : 'Property Amenities & Features'}
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                            {availableAmenities.map(am => {
                                const checked = selectedAmenities.includes(am.id);
                                return (
                                    <div 
                                        key={am.id}
                                        onClick={() => toggleAmenity(am.id)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '8px',
                                            padding: '8px 12px', borderRadius: '6px', cursor: 'pointer',
                                            border: checked ? '1px solid var(--accent-cyan)' : '1px solid var(--glass-border)',
                                            background: checked ? 'rgba(0, 200, 255, 0.1)' : 'var(--glass-bg)',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <i className={am.icon} style={{ color: checked ? 'var(--accent-cyan)' : 'var(--text-secondary)', fontSize: '16px' }}></i>
                                        <span style={{ fontSize: '12px', color: checked ? '#fff' : 'var(--text-secondary)' }}>{am.label}</span>
                                        {checked && <i className="ri-check-line" style={{ marginLeft: 'auto', color: 'var(--accent-cyan)' }}></i>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                        <button type="submit" className="btn btn-primary">
                            <i className="ri-save-line"></i> {isAr ? 'حفظ العقار' : 'Save Property'}
                        </button>
                        {editId && (
                            <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                {isAr ? 'إلغاء' : 'Cancel'}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="glass-card">
                <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>
                    <i className="ri-list-check-2" style={{ color: 'var(--accent-purple)', marginRight: '6px' }}></i>
                    {isAr ? 'قائمة العقارات والمنشآت' : 'Properties Directory'}
                </h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>{isAr ? 'الاسم' : 'Name'}</th>
                                <th>{isAr ? 'النوع' : 'Type'}</th>
                                <th>{isAr ? 'المدينة والموقع' : 'Location'}</th>
                                <th>{isAr ? 'التقييم والمرافق' : 'Rating & Amenities'}</th>
                                <th>{isAr ? 'المالك' : 'Owner'}</th>
                                <th>{isAr ? 'الحالة' : 'Status'}</th>
                                <th>{isAr ? 'إجراءات' : 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {properties.map(p => (
                                <tr key={p.id}>
                                    <td>
                                        <div style={{ fontWeight: 'bold' }}>{p.name}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ID: {p.id}</div>
                                    </td>
                                    <td><span className="badge badge-primary">{p.type}</span></td>
                                    <td>{p.city ? `${p.city} - ` : ''}{p.location}</td>
                                    <td>
                                        <div>{'⭐'.repeat(p.starRating || 4)}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                            {(p.amenities || []).slice(0, 3).join(', ')}{(p.amenities || []).length > 3 ? ` +${(p.amenities.length - 3)}` : ''}
                                        </div>
                                    </td>
                                    <td>{owners.find(o => o.id === p.ownerId)?.name || (isAr ? 'مباشر' : 'Direct')}</td>
                                    <td>
                                        <span className={`status-badge ${p.status === 'Active' ? 'valid' : p.status === 'Sold' ? 'valid' : 'warning'}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleViewGallery(p)}>
                                                <i className="ri-image-line"></i> {p.images?.length || 0}
                                            </button>
                                            
                                            <input 
                                                type="file" 
                                                multiple 
                                                accept="image/*" 
                                                style={{ display: 'none' }} 
                                                id={`upload-${p.id}`}
                                                onChange={(e) => handleImageUpload(e, p.id)} 
                                            />
                                            <label htmlFor={`upload-${p.id}`} className="btn btn-secondary" style={{ cursor: 'pointer', margin: 0, padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <i className="ri-upload-2-line"></i>
                                            </label>

                                            {p.status !== 'Sold' && (
                                                <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--accent-gold)' }} onClick={() => handleSell(p)}>
                                                    <i className="ri-shopping-cart-line"></i> {isAr ? 'بيع' : 'Sell'}
                                                </button>
                                            )}
                                            <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleEdit(p)}>
                                                <i className="ri-edit-line"></i>
                                            </button>
                                            <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleDelete(p.id)}>
                                                <i className="ri-delete-bin-line"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {properties.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                                        {isAr ? 'لا توجد عقارات مسجلة بعد' : 'No properties found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Sell Modal */}
            {showSellModal && (
                <div className="modal-overlay">
                    <div className="modal glass-card" style={{ maxWidth: '480px', width: '100%', padding: '24px' }}>
                        <h3 style={{ margin: '0 0 15px 0' }}>{isAr ? 'بيع العقار وإصدار فاتورة ZATCA' : 'Sell Property & Generate Invoice'}</h3>
                        <form onSubmit={submitSell} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)' }}>{isAr ? 'اسم المشتري' : 'Buyer Name'}</label>
                                <input type="text" className="form-control" required value={sellForm.customerName} onChange={e => setSellForm({...sellForm, customerName: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)' }}>{isAr ? 'مبلغ البيع (بدون ضريبة)' : 'Sale Price (SAR)'}</label>
                                <input type="number" className="form-control" required value={sellForm.price} onChange={e => setSellForm({...sellForm, price: e.target.value})} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowSellModal(false)}>{isAr ? 'إلغاء' : 'Cancel'}</button>
                                <button type="submit" className="btn btn-primary">{isAr ? 'تأكيد البيع' : 'Confirm Sale'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Gallery Modal */}
            {showGallery && (
                <div className="modal-overlay" onClick={() => setShowGallery(false)}>
                    <div className="modal glass-card" style={{ maxWidth: '800px', width: '90%', padding: '20px', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0 }}>{currentGalleryProperty} - {isAr ? 'معرض الصور' : 'Photo Gallery'}</h3>
                            <button className="btn btn-secondary" onClick={() => setShowGallery(false)}>
                                <i className="ri-close-line"></i>
                            </button>
                        </div>
                        <div style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', overflow: 'hidden' }}>
                            {currentGalleryImages.length > 0 ? (
                                <img src={currentGalleryImages[galleryIndex] || currentGalleryImages[0]} alt="Property" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            ) : (
                                <p style={{ color: 'var(--text-secondary)' }}>{isAr ? 'لا توجد صور لهذا العقار' : 'No images uploaded'}</p>
                            )}
                        </div>
                        {currentGalleryImages.length > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '15px' }}>
                                <button className="btn btn-secondary" onClick={() => setGalleryIndex(prev => prev > 0 ? prev - 1 : currentGalleryImages.length - 1)}>
                                    <i className="ri-arrow-left-s-line"></i>
                                </button>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{galleryIndex + 1} / {currentGalleryImages.length}</span>
                                <button className="btn btn-secondary" onClick={() => setGalleryIndex(prev => prev < currentGalleryImages.length - 1 ? prev + 1 : 0)}>
                                    <i className="ri-arrow-right-s-line"></i>
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
