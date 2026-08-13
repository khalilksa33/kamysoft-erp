import React from 'react';

const ProductList = ({ products, onAddToCart, currentLanguage }) => {
    return (
        <div className="product-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', padding: '20px' }}>
            {products.map(product => (
                <div key={product.id} className="glass-card fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>{product.emoji || '📦'}</div>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
                        {currentLanguage === 'ar' ? product.nameAR : product.nameEN}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
                        {product.isDigital ? 
                            (currentLanguage === 'ar' ? 'منتج رقمي' : 'Digital Product') : 
                            (currentLanguage === 'ar' ? 'منتج ملموس' : 'Physical Product')
                        }
                    </p>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '20px' }}>
                        {product.price} SAR
                    </div>
                    <button 
                        className="btn btn-primary" 
                        onClick={() => onAddToCart(product)}
                        style={{ width: '100%', marginTop: 'auto' }}
                    >
                        <i className="ri-shopping-cart-2-line" style={{ marginRight: '8px' }}></i>
                        {currentLanguage === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ProductList;
