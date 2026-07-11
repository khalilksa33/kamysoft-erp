import React, { useState } from 'react';

const Inventory = (props) => {
        const { 
        products, setProducts, formatCurrency, currentLanguage, translations, headers
    } = props;

    
    const [showProductModal, setShowProductModal] = useState(false);
    const [prodForm, setProdForm] = useState({ id: '', nameAR: '', nameEN: '', category: 'electronics', stock: 10, price: 100, cost: 60, barcode: '' });


    const handleSaveProduct = (e) => {
        e.preventDefault();
        fetch('/api/products', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(prodForm)
        })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then(data => {
            setProducts([...products, data]);
            setShowProductModal(false);
        })
        .catch(() => {
            // Local fallback
            const mock = { ...prodForm, id: (2000 + products.length).toString() };
            setProducts([...products, mock]);
            setShowProductModal(false);
        });
    };


    const handleDeleteProduct = (id) => {
        if (!confirm(currentLanguage === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) return;
        fetch(`/api/products/${id}`, { method: 'DELETE', headers: headers })
        .then(() => {
            setProducts(products.filter(p => p.id !== id));
        })
        .catch(() => {
            setProducts(products.filter(p => p.id !== id));
        });
    };



    return (
        
                    <div className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 data-i18n="inventory">{translations[currentLanguage].inventory}</h3>
                            <button className="btn btn-primary" onClick={() => setShowProductModal(true)}>{translations[currentLanguage].addProduct}</button>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{translations[currentLanguage].prodId}</th>
                                        <th>{currentLanguage === 'ar' ? 'الباركود' : 'Barcode'}</th>
                                        <th>{translations[currentLanguage].prodName}</th>
                                        <th>{translations[currentLanguage].prodCategory}</th>
                                        <th>{translations[currentLanguage].prodStock}</th>
                                        <th>{translations[currentLanguage].purchaseCost}</th>
                                        <th>{translations[currentLanguage].sellingPrice}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(p => (
                                        <tr key={p.id}>
                                            <td>{p.id}</td>
                                            <td>{p.barcode || '-'}</td>
                                            <td>{currentLanguage === 'ar' ? p.nameAR : p.nameEN}</td>
                                            <td>{translations[currentLanguage][p.category] || p.category}</td>
                                            <td>{p.stock}</td>
                                            <td>{formatCurrency(p.cost || 0)}</td>
                                            <td>{formatCurrency(p.price)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    
            {showProductModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3 style={{ marginBottom: '20px' }}>{translations[currentLanguage].addProduct}</h3>
                        <form onSubmit={handleSaveProduct}>
                            <div className="form-group">
                                <label>{translations[currentLanguage].prodNameAr}</label>
                                <input type="text" className="form-control" value={prodForm.nameAR} onChange={e => setProdForm({ ...prodForm, nameAR: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].prodNameEn}</label>
                                <input type="text" className="form-control" value={prodForm.nameEN} onChange={e => setProdForm({ ...prodForm, nameEN: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].prodCategory}</label>
                                <select className="form-control" value={prodForm.category} onChange={e => setProdForm({ ...prodForm, category: e.target.value })}>
                                    <option value="electronics">{translations[currentLanguage].electronics}</option>
                                    <option value="apparel">{translations[currentLanguage].apparel}</option>
                                    <option value="groceries">{translations[currentLanguage].groceries}</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'الباركود' : 'Barcode'}</label>
                                <input type="text" className="form-control" value={prodForm.barcode || ''} onChange={e => setProdForm({ ...prodForm, barcode: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].prodStock}</label>
                                <input type="number" className="form-control" value={prodForm.stock} onChange={e => setProdForm({ ...prodForm, stock: Number(e.target.value) })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].purchaseCost}</label>
                                <input type="number" className="form-control" value={prodForm.cost} onChange={e => setProdForm({ ...prodForm, cost: Number(e.target.value) })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].sellingPrice}</label>
                                <input type="number" className="form-control" value={prodForm.price} onChange={e => setProdForm({ ...prodForm, price: Number(e.target.value) })} required />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowProductModal(false)}>{translations[currentLanguage].close}</button>
                                <button type="submit" className="btn btn-primary">{translations[currentLanguage].saveProduct}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
                
    );
};

export default Inventory;
