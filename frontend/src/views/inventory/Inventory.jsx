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



    const handleExportCSV = () => {
        if (!products.length) return;
        const headers = ['id', 'barcode', 'nameAR', 'nameEN', 'category', 'stock', 'cost', 'price'];
        const csvRows = [headers.join(',')];
        products.forEach(p => {
            const values = headers.map(header => {
                const escaped = ('' + (p[header] || '')).replace(/"/g, '""');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        });
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'inventory_export.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleImportCSV = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const rows = text.split('\n');
            if (rows.length < 2) return;
            const headers = rows[0].split(',').map(h => h.replace(/"/g, '').trim());
            const newProducts = [];
            for (let i = 1; i < rows.length; i++) {
                if (!rows[i].trim()) continue;
                // Basic CSV parse (does not handle commas inside quotes perfectly, but sufficient for simple data)
                const values = rows[i].split(',').map(v => v.replace(/"/g, '').trim());
                const product = {};
                headers.forEach((header, index) => {
                    product[header] = values[index];
                });
                product.id = product.id || Date.now().toString() + i;
                product.stock = Number(product.stock) || 0;
                product.cost = Number(product.cost) || 0;
                product.price = Number(product.price) || 0;
                newProducts.push(product);
            }
            if (newProducts.length > 0) {
                setProducts([...products, ...newProducts]);
                alert(currentLanguage === 'ar' ? `تم استيراد ${newProducts.length} منتج بنجاح` : `Successfully imported ${newProducts.length} products`);
            }
        };
        reader.readAsText(file);
    };

    return (
        
                    <div className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                            <h3 data-i18n="inventory">{translations[currentLanguage].inventory}</h3>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input type="file" id="csv-upload" accept=".csv" style={{ display: 'none' }} onChange={handleImportCSV} />
                                <button className="btn btn-secondary" onClick={() => document.getElementById('csv-upload').click()}>
                                    <i className="ri-upload-2-line" style={{ marginRight: '5px' }}></i>
                                    {currentLanguage === 'ar' ? 'استيراد CSV' : 'Import CSV'}
                                </button>
                                <button className="btn btn-secondary" onClick={handleExportCSV}>
                                    <i className="ri-download-2-line" style={{ marginRight: '5px' }}></i>
                                    {currentLanguage === 'ar' ? 'تصدير CSV' : 'Export CSV'}
                                </button>
                                <button className="btn btn-primary" onClick={() => setShowProductModal(true)}>
                                    <i className="ri-add-line" style={{ marginRight: '5px' }}></i>
                                    {translations[currentLanguage].addProduct}
                                </button>
                            </div>
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
