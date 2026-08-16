import React, { useState } from 'react';

const ProductDetail = ({ product, onAddToCart, onBack, currentLanguage }) => {
    // If the product has variants, create a state to hold the selected option for each variant
    const [selectedVariants, setSelectedVariants] = useState({});
    const [qty, setQty] = useState(1);

    const hasVariants = product.variants && product.variants.length > 0;

    const handleVariantChange = (variantName, option) => {
        setSelectedVariants(prev => ({
            ...prev,
            [variantName]: option
        }));
    };

    const handleAddToCart = () => {
        // Validate all variants are selected
        if (hasVariants) {
            const missingVariant = product.variants.find(v => !selectedVariants[v.name]);
            if (missingVariant) {
                alert(currentLanguage === 'ar' ? `يرجى اختيار ${missingVariant.name}` : `Please select a ${missingVariant.name}`);
                return;
            }
        }
        
        onAddToCart(product, qty, selectedVariants);
    };

    return (
        <div className="product-detail fade-in" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: '20px' }}>
                <i className="ri-arrow-left-line" style={{ marginRight: '8px' }}></i>
                {currentLanguage === 'ar' ? 'الرجوع للمنتجات' : 'Back to Products'}
            </button>
            
            <div className="glass-card" style={{ display: 'flex', gap: '30px', padding: '30px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', minWidth: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--glass-bg)', borderRadius: '12px', fontSize: '100px', minHeight: '300px' }}>
                    {product.emoji || '📦'}
                </div>
                
                <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>{currentLanguage === 'ar' ? product.nameAR : product.nameEN}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '20px' }}>
                        {product.isDigital ? 
                            (currentLanguage === 'ar' ? 'منتج رقمي قابل للتنزيل' : 'Digital Downloadable Product') : 
                            (currentLanguage === 'ar' ? 'منتج ملموس' : 'Physical Product')
                        }
                    </p>
                    
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '30px' }}>
                        {product.price} SAR
                    </div>

                    {hasVariants && (
                        <div className="variants-section" style={{ marginBottom: '30px' }}>
                            {product.variants.map((variant, idx) => (
                                <div key={idx} style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                        {variant.name}
                                    </label>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        {variant.options.map((opt, oIdx) => (
                                            <button 
                                                key={oIdx}
                                                className={`btn ${selectedVariants[variant.name] === opt ? 'btn-primary' : 'btn-secondary'}`}
                                                style={{ padding: '8px 16px', borderRadius: '20px' }}
                                                onClick={() => handleVariantChange(variant.name, opt)}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--glass-border)', borderRadius: '8px', overflow: 'hidden' }}>
                            <button className="btn" style={{ padding: '10px 15px', background: 'transparent', border: 'none' }} onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                            <span style={{ padding: '0 15px', fontWeight: 'bold' }}>{qty}</span>
                            <button className="btn" style={{ padding: '10px 15px', background: 'transparent', border: 'none' }} onClick={() => setQty(qty + 1)}>+</button>
                        </div>
                        <button className="btn btn-primary" onClick={handleAddToCart} style={{ flex: '1', padding: '12px' }}>
                            <i className="ri-shopping-cart-2-line" style={{ marginRight: '8px' }}></i>
                            {currentLanguage === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
