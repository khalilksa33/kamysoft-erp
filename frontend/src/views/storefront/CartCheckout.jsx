import React, { useState } from 'react';

const CartCheckout = ({ cart, onUpdateQty, onRemove, onCheckout, currentLanguage }) => {
    const [checkoutForm, setCheckoutForm] = useState({
        customer: '',
        email: '',
        phone: '',
        address: ''
    });

    const total = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        onCheckout(checkoutForm);
    };

    if (cart.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <i className="ri-shopping-cart-2-line" style={{ fontSize: '48px', color: 'var(--text-secondary)' }}></i>
                <h2>{currentLanguage === 'ar' ? 'السلة فارغة' : 'Your Cart is Empty'}</h2>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-card fade-in" style={{ marginBottom: '20px' }}>
                <h3>{currentLanguage === 'ar' ? 'مراجعة السلة' : 'Review Cart'}</h3>
                <table style={{ width: '100%', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ textAlign: currentLanguage === 'ar' ? 'right' : 'left', padding: '10px' }}>{currentLanguage === 'ar' ? 'المنتج' : 'Product'}</th>
                            <th style={{ padding: '10px' }}>{currentLanguage === 'ar' ? 'السعر' : 'Price'}</th>
                            <th style={{ padding: '10px' }}>{currentLanguage === 'ar' ? 'الكمية' : 'Qty'}</th>
                            <th style={{ padding: '10px' }}>{currentLanguage === 'ar' ? 'الإجمالي' : 'Total'}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map(item => (
                            <tr key={item.product.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '10px' }}>
                                    {item.product.emoji} {currentLanguage === 'ar' ? item.product.nameAR : item.product.nameEN}
                                    {item.product.isDigital && <span style={{ marginLeft: '10px', fontSize: '12px', background: 'var(--accent-primary)', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>Digital</span>}
                                </td>
                                <td style={{ padding: '10px', textAlign: 'center' }}>{item.product.price} SAR</td>
                                <td style={{ padding: '10px', textAlign: 'center' }}>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        value={item.qty} 
                                        onChange={(e) => onUpdateQty(item.product.id, parseInt(e.target.value) || 1)}
                                        style={{ width: '60px', margin: '0 auto' }}
                                        min="1"
                                    />
                                </td>
                                <td style={{ padding: '10px', textAlign: 'center' }}>{item.product.price * item.qty} SAR</td>
                                <td style={{ padding: '10px', textAlign: 'center' }}>
                                    <button className="btn btn-danger" onClick={() => onRemove(item.product.id)}>
                                        <i className="ri-delete-bin-line"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ textAlign: 'right', marginTop: '20px', fontSize: '24px', fontWeight: 'bold' }}>
                    {currentLanguage === 'ar' ? 'الإجمالي:' : 'Grand Total:'} {total} SAR
                </div>
            </div>

            <div className="glass-card fade-in">
                <h3>{currentLanguage === 'ar' ? 'تفاصيل الطلب' : 'Checkout Details'}</h3>
                <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                    <div className="form-group">
                        <label>{currentLanguage === 'ar' ? 'الاسم' : 'Full Name'}</label>
                        <input type="text" className="form-control" required value={checkoutForm.customer} onChange={e => setCheckoutForm({...checkoutForm, customer: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label>{currentLanguage === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                        <input type="email" className="form-control" required value={checkoutForm.email} onChange={e => setCheckoutForm({...checkoutForm, email: e.target.value})} placeholder={currentLanguage === 'ar' ? 'لإرسال الملفات الرقمية والإيصال' : 'For digital goods and receipt'} />
                    </div>
                    <div className="form-group">
                        <label>{currentLanguage === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
                        <input type="tel" className="form-control" required value={checkoutForm.phone} onChange={e => setCheckoutForm({...checkoutForm, phone: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label>{currentLanguage === 'ar' ? 'العنوان' : 'Shipping Address'}</label>
                        <textarea className="form-control" value={checkoutForm.address} onChange={e => setCheckoutForm({...checkoutForm, address: e.target.value})} placeholder={currentLanguage === 'ar' ? 'غير مطلوب للمنتجات الرقمية فقط' : 'Not required if only buying digital goods'}></textarea>
                    </div>
                    
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px', fontSize: '18px', marginTop: '20px' }}>
                        {currentLanguage === 'ar' ? 'تأكيد الطلب والدفع' : 'Confirm Order & Pay'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CartCheckout;
