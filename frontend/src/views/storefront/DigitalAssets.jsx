import React, { useState, useEffect } from 'react';

const DigitalAssets = ({ headers, currentLanguage, translations }) => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch products that are digital
        fetch('/api/products', { headers })
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    setAssets(data.filter(p => p.isDigital));
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching digital assets:', err);
                setLoading(false);
            });
    }, [headers]);

    return (
        <div className="glass-card fade-in" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '15px' }}>
                <div style={{ padding: '12px', background: 'color-mix(in srgb, #6366f1 15%, transparent)', borderRadius: '12px', color: '#6366f1' }}>
                    <i className="ri-folder-zip-line" style={{ fontSize: '24px' }}></i>
                </div>
                <div>
                    <h3 style={{ margin: 0 }}>{currentLanguage === 'ar' ? 'الأصول الرقمية' : 'Digital Assets'}</h3>
                    <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {currentLanguage === 'ar' ? 'إدارة المنتجات الرقمية والملفات القابلة للتنزيل.' : 'Manage digital products and downloadable files.'}
                    </p>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="spinner"></div>
                </div>
            ) : assets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    <i className="ri-file-close-line" style={{ fontSize: '48px', marginBottom: '10px', display: 'block' }}></i>
                    {currentLanguage === 'ar' ? 'لا توجد منتجات رقمية حالياً.' : 'No digital assets found.'}
                    <div style={{ marginTop: '10px', fontSize: '13px' }}>
                        {currentLanguage === 'ar' ? 'قم بإضافة منتج جديد وتحديده كمنتج رقمي ليظهر هنا.' : 'Add a new product and mark it as digital to see it here.'}
                    </div>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>{currentLanguage === 'ar' ? 'رمز المنتج' : 'Product ID'}</th>
                                <th>{currentLanguage === 'ar' ? 'الاسم' : 'Name'}</th>
                                <th>{currentLanguage === 'ar' ? 'الرابط المرفق' : 'Asset URL'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.map(asset => (
                                <tr key={asset.id}>
                                    <td>{asset.id}</td>
                                    <td>{currentLanguage === 'ar' ? asset.nameAR : asset.nameEN}</td>
                                    <td>
                                        {asset.digitalAssetUrl ? (
                                            <a href={asset.digitalAssetUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
                                                {asset.digitalAssetUrl.substring(0, 40)}{asset.digitalAssetUrl.length > 40 ? '...' : ''}
                                            </a>
                                        ) : (
                                            <span style={{ color: 'var(--text-secondary)' }}>{currentLanguage === 'ar' ? 'لا يوجد رابط' : 'No URL Provided'}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DigitalAssets;
