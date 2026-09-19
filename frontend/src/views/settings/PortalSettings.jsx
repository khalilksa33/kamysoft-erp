import React, { useState } from 'react';

const PortalSettings = ({ settings, setSettings, currentLanguage, onSave }) => {
    const isAr = currentLanguage === 'ar';
    const [images, setImages] = useState(settings.portalImages || []);
    const [newImage, setNewImage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('social_')) {
            const platform = name.split('_')[1];
            setSettings({
                ...settings,
                socialLinks: { ...(settings.socialLinks || {}), [platform]: value }
            });
        } else {
            setSettings({ ...settings, [name]: value });
        }
    };

    const handleAddImage = () => {
        if (!newImage) return;
        const updatedImages = [...images, newImage];
        setImages(updatedImages);
        setSettings({ ...settings, portalImages: updatedImages });
        setNewImage('');
    };

    const handleRemoveImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        setSettings({ ...settings, portalImages: updatedImages });
    };

    return (
        <div className="settings-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>
                    <i className="ri-global-line" style={{ marginRight: '8px', color: '#10b981' }}></i>
                    {isAr ? 'إعدادات بوابة العميل (الويب)' : 'Public Web Portal Settings'}
                </h3>
                <button className="btn btn-primary" onClick={onSave}>
                    <i className="ri-save-line"></i> {isAr ? 'حفظ التغييرات' : 'Save Changes'}
                </button>
            </div>
            
            <div className="form-group" style={{ marginBottom: '30px', padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <label style={{ fontWeight: '600', color: '#334155' }}>
                    {isAr ? 'صور العرض (سلايدر)' : 'Property Slider Images (URLs)'}
                </label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <input 
                        type="text" 
                        className="form-control"
                        placeholder={isAr ? 'أدخل رابط الصورة (https://...)' : 'Enter image URL (https://...)'}
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                    />
                    <button className="btn btn-secondary" onClick={handleAddImage} style={{ whiteSpace: 'nowrap' }}>
                        <i className="ri-add-line"></i> {isAr ? 'إضافة' : 'Add Image'}
                    </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px', marginTop: '20px' }}>
                    {images.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', aspectRatio: '16/9' }}>
                            <img src={img} alt="Slider" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button 
                                onClick={() => handleRemoveImage(idx)}
                                style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(239,68,68,0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <i className="ri-close-line"></i>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div className="form-group" style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <label style={{ fontWeight: '600', color: '#334155' }}>{isAr ? 'معلومات التواصل' : 'Contact Information'}</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                        <div>
                            <label className="text-sm">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
                            <input type="email" name="contactEmail" className="form-control" value={settings.contactEmail || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="text-sm">{isAr ? 'رقم الهاتف' : 'Phone Number'}</label>
                            <input type="text" name="contactPhone" className="form-control" value={settings.contactPhone || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="text-sm">{isAr ? 'العنوان' : 'Address (English)'}</label>
                            <input type="text" name="contactAddress" className="form-control" value={settings.contactAddress || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="text-sm">{isAr ? 'العنوان (بالعربية)' : 'Address (Arabic)'}</label>
                            <input type="text" name="contactAddressAr" className="form-control" value={settings.contactAddressAr || ''} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div className="form-group" style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <label style={{ fontWeight: '600', color: '#334155' }}>{isAr ? 'روابط التواصل الاجتماعي' : 'Social Media Links'}</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                        <div>
                            <label className="text-sm">Facebook</label>
                            <input type="text" name="social_facebook" className="form-control" value={settings.socialLinks?.facebook || ''} onChange={handleChange} placeholder="https://facebook.com/..." />
                        </div>
                        <div>
                            <label className="text-sm">Instagram</label>
                            <input type="text" name="social_instagram" className="form-control" value={settings.socialLinks?.instagram || ''} onChange={handleChange} placeholder="https://instagram.com/..." />
                        </div>
                        <div>
                            <label className="text-sm">Twitter / X</label>
                            <input type="text" name="social_twitter" className="form-control" value={settings.socialLinks?.twitter || ''} onChange={handleChange} placeholder="https://twitter.com/..." />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="form-group" style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <label style={{ fontWeight: '600', color: '#334155' }}>{isAr ? 'عن المنشأة' : 'About the Property'}</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                    <div>
                        <label className="text-sm">{isAr ? 'الوصف' : 'Description (English)'}</label>
                        <textarea name="portalDescription" className="form-control" rows="4" value={settings.portalDescription || ''} onChange={handleChange}></textarea>
                    </div>
                    <div>
                        <label className="text-sm">{isAr ? 'الوصف (بالعربية)' : 'Description (Arabic)'}</label>
                        <textarea name="portalDescriptionAr" className="form-control" rows="4" value={settings.portalDescriptionAr || ''} onChange={handleChange}></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PortalSettings;
