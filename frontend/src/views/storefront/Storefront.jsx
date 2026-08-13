import React, { useState, useEffect } from 'react';
import ProductList from './ProductList';
import CartCheckout from './CartCheckout';

const Storefront = ({ tenantId, currentLanguage, setLanguage }) => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [view, setView] = useState('products'); // 'products' or 'cart'
    const [orderSuccess, setOrderSuccess] = useState(null);

    useEffect(() => {
        // Fetch products for this tenant
        fetch('/api/storefront/products', {
            headers: {
                'x-tenant-id': tenantId
            }
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                setProducts(data);
            }
        })
        .catch(err => console.error('Failed to load products:', err));
    }, [tenantId]);

    const handleAddToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item);
            }
            return [...prev, { product, qty: 1 }];
        });
        alert(currentLanguage === 'ar' ? 'تمت الإضافة للسلة' : 'Added to cart');
    };

    const handleUpdateQty = (productId, qty) => {
        if (qty < 1) return;
        setCart(prev => prev.map(item => item.product.id === productId ? { ...item, qty } : item));
    };

    const handleRemoveFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const handleCheckout = (checkoutForm) => {
        const orderData = {
            ...checkoutForm,
            items: cart.map(item => ({
                id: item.product.id,
                name: item.product.nameEN,
                nameAR: item.product.nameAR,
                nameEN: item.product.nameEN,
                price: item.product.price,
                qty: item.qty,
                isDigital: item.product.isDigital,
                digitalAssetUrl: item.product.digitalAssetUrl,
                digitalAssetInstructions: item.product.digitalAssetInstructions
            })),
            total: cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0),
            paymentMethod: 'Mock Payment Gateway'
        };

        fetch('/api/storefront/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-tenant-id': tenantId
            },
            body: JSON.stringify(orderData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setCart([]);
                setOrderSuccess(data.orderId);
                setView('success');
            } else {
                alert(data.error || 'Checkout failed');
            }
        })
        .catch(err => alert('Error: ' + err.message));
    };

    const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);

    return (
        <div className="storefront-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 0, borderBottom: '1px solid var(--glass-border)' }}>
                <h1 style={{ margin: 0, color: 'var(--accent-primary)', cursor: 'pointer' }} onClick={() => setView('products')}>
                    <i className="ri-store-2-line" style={{ marginRight: '10px' }}></i>
                    Storefront
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button className="btn btn-secondary" onClick={() => setLanguage(currentLanguage === 'ar' ? 'en' : 'ar')}>
                        <i className="ri-translate-2"></i> {currentLanguage === 'ar' ? 'English' : 'عربي'}
                    </button>
                    <button className="btn btn-primary" onClick={() => setView('cart')} style={{ position: 'relative' }}>
                        <i className="ri-shopping-cart-2-line"></i>
                        {cartItemCount > 0 && (
                            <span style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--accent-danger)', color: '#fff', borderRadius: '50%', padding: '2px 8px', fontSize: '12px', fontWeight: 'bold' }}>
                                {cartItemCount}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            <main style={{ flex: 1, padding: '20px' }}>
                {view === 'products' && (
                    <ProductList 
                        products={products} 
                        onAddToCart={handleAddToCart} 
                        currentLanguage={currentLanguage} 
                    />
                )}
                
                {view === 'cart' && (
                    <CartCheckout 
                        cart={cart} 
                        onUpdateQty={handleUpdateQty} 
                        onRemove={handleRemoveFromCart} 
                        onCheckout={handleCheckout} 
                        currentLanguage={currentLanguage} 
                    />
                )}

                {view === 'success' && (
                    <div className="glass-card fade-in" style={{ textAlign: 'center', maxWidth: '600px', margin: '50px auto', padding: '40px' }}>
                        <i className="ri-checkbox-circle-fill" style={{ fontSize: '64px', color: 'var(--accent-success)' }}></i>
                        <h2 style={{ marginTop: '20px' }}>{currentLanguage === 'ar' ? 'تم تأكيد الطلب بنجاح!' : 'Order Placed Successfully!'}</h2>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>
                            {currentLanguage === 'ar' ? `رقم الطلب الخاص بك هو:` : `Your order ID is:`} <strong>{orderSuccess}</strong>
                        </p>
                        <p style={{ marginTop: '20px' }}>
                            {currentLanguage === 'ar' ? 'تم إرسال إيصال وروابط المنتجات الرقمية (إن وجدت) إلى بريدك الإلكتروني.' : 'A receipt and links to any digital products have been sent to your email.'}
                        </p>
                        <button className="btn btn-primary" onClick={() => { setView('products'); setOrderSuccess(null); }} style={{ marginTop: '30px' }}>
                            {currentLanguage === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
                        </button>
                    </div>
                )}
            </main>

            <footer style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', borderTop: '1px solid var(--glass-border)', background: 'var(--glass-bg)' }}>
                Powered by KamySoft ERP Storefront &copy; {new Date().getFullYear()}
            </footer>
        </div>
    );
};

export default Storefront;
