import React, { useState } from 'react';

const PortalSettings = ({ settings, setSettings, currentLanguage, onSave }) => {
    const isAr = currentLanguage === 'ar';
    const [images, setImages] = useState(settings.portalImages || []);
    const [rooms, setRooms] = useState(settings.portalRooms || []);
    const [newImage, setNewImage] = useState('');
    const [newRoom, setNewRoom] = useState({ name: '', description: '', price: '', imageUrl: '' });

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

    const handleAddRoom = () => {
        if (!newRoom.name) return;
        const updatedRooms = [...rooms, newRoom];
        setRooms(updatedRooms);
        setSettings({ ...settings, portalRooms: updatedRooms });
        setNewRoom({ name: '', description: '', price: '', imageUrl: '' });
    };

    const handleRemoveRoom = (index) => {
        const updatedRooms = rooms.filter((_, i) => i !== index);
        setRooms(updatedRooms);
        setSettings({ ...settings, portalRooms: updatedRooms });
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

            <div className="form-group" style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <label style={{ fontWeight: '600', color: '#334155' }}>
                    {isAr ? 'الغرف والأجنحة' : 'Rooms & Suites'}
                </label>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input type="text" className="form-control" placeholder={isAr ? 'اسم الغرفة/الجناح' : 'Room/Suite Name'} value={newRoom.name} onChange={e => setNewRoom({...newRoom, name: e.target.value})} />
                        <input type="number" className="form-control" placeholder={isAr ? 'السعر' : 'Price'} value={newRoom.price} onChange={e => setNewRoom({...newRoom, price: e.target.value})} />
                    </div>
                    <input type="text" className="form-control" placeholder={isAr ? 'وصف قصير' : 'Short Description'} value={newRoom.description} onChange={e => setNewRoom({...newRoom, description: e.target.value})} />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" className="form-control" placeholder={isAr ? 'رابط صورة الغرفة' : 'Room Image URL'} value={newRoom.imageUrl} onChange={e => setNewRoom({...newRoom, imageUrl: e.target.value})} />
                        <button className="btn btn-secondary" onClick={handleAddRoom} style={{ whiteSpace: 'nowrap' }}>
                            <i className="ri-add-line"></i> {isAr ? 'إضافة غرفة' : 'Add Room'}
                        </button>
                    </div>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {rooms.map((room, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            {room.imageUrl ? (
                                <img src={room.imageUrl} alt={room.name} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                            ) : (
                                <div style={{ width: '80px', height: '60px', background: '#f1f5f9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                    <i className="ri-image-line" style={{ fontSize: '24px' }}></i>
                                </div>
                            )}
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{room.name} <span style={{ color: '#10b981', marginLeft: '10px' }}>{room.price ? $ : ''}</span></h4>
                                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{room.description}</p>
                            </div>
                            <button className="btn btn-danger-soft" onClick={() => handleRemoveRoom(idx)} style={{ padding: '8px' }}>
                                <i className="ri-delete-bin-line"></i>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default PortalSettings;
