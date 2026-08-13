import React, { useState } from 'react';

const Inventory = (props) => {
    const { 
        products, setProducts, formatCurrency, currentLanguage, translations, headers, activeTab 
    } = props;

    // Items
    const [showProductModal, setShowProductModal] = useState(false);
    const [prodForm, setProdForm] = useState({ id: '', nameAR: '', nameEN: '', category: 'electronics', stock: 10, price: 100, cost: 60, barcode: '', isDigital: false, digitalAssetUrl: '', digitalAssetInstructions: '' });

    // Categories
    const [categories, setCategories] = useState([
        { id: '1', nameAR: 'إلكترونيات', nameEN: 'Electronics' },
        { id: '2', nameAR: 'ملابس', nameEN: 'Apparel' },
        { id: '3', nameAR: 'بقالة', nameEN: 'Groceries' }
    ]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [categoryForm, setCategoryForm] = useState({ id: '', nameAR: '', nameEN: '' });

    // Units
    const [units, setUnits] = useState([
        { id: '1', nameAR: 'قطعة', nameEN: 'Piece' },
        { id: '2', nameAR: 'كيلوجرام', nameEN: 'Kg' },
        { id: '3', nameAR: 'كرتون', nameEN: 'Box' }
    ]);
    const [showUnitModal, setShowUnitModal] = useState(false);
    const [unitForm, setUnitForm] = useState({ id: '', nameAR: '', nameEN: '' });

    const handleSaveProduct = (e) => {
        e.preventDefault();
        const method = prodForm.id ? 'PUT' : 'POST';
        const url = prodForm.id ? `/api/products/${prodForm.id}` : '/api/products';
        
        fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(prodForm)
        })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then(data => {
            if (prodForm.id) {
                setProducts(products.map(p => p.id === data.id ? data : p));
            } else {
                setProducts([...products, data]);
            }
            setShowProductModal(false);
            setProdForm({ id: '', nameAR: '', nameEN: '', category: 'electronics', stock: 10, price: 100, cost: 60, barcode: '', isDigital: false, digitalAssetUrl: '', digitalAssetInstructions: '' });
        })
        .catch(() => {
            const mock = { ...prodForm, id: prodForm.id || (2000 + products.length).toString() };
            if (prodForm.id) {
                setProducts(products.map(p => p.id === mock.id ? mock : p));
            } else {
                setProducts([...products, mock]);
            }
            setShowProductModal(false);
            setProdForm({ id: '', nameAR: '', nameEN: '', category: 'electronics', stock: 10, price: 100, cost: 60, barcode: '' });
        });
    };

    const handleDeleteProduct = (id) => {
        if (!window.confirm(currentLanguage === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) return;
        fetch(`/api/products/${id}`, { method: 'DELETE', headers })
            .then(() => setProducts(products.filter(p => p.id !== id)))
            .catch(() => setProducts(products.filter(p => p.id !== id)));
    };

    const handleSaveCategory = (e) => {
        e.preventDefault();
        const mock = { ...categoryForm, id: categoryForm.id || Date.now().toString() };
        if (categoryForm.id) {
            setCategories(categories.map(c => c.id === mock.id ? mock : c));
        } else {
            setCategories([...categories, mock]);
        }
        setShowCategoryModal(false);
        setCategoryForm({ id: '', nameAR: '', nameEN: '' });
    };

    const handleDeleteCategory = (id) => {
        if (!window.confirm(currentLanguage === 'ar' ? 'هل أنت متأكد من حذف هذه الفئة؟' : 'Are you sure you want to delete this category?')) return;
        setCategories(categories.filter(c => c.id !== id));
    };

    const handleSaveUnit = (e) => {
        e.preventDefault();
        const mock = { ...unitForm, id: unitForm.id || Date.now().toString() };
        if (unitForm.id) {
            setUnits(units.map(u => u.id === mock.id ? mock : u));
        } else {
            setUnits([...units, mock]);
        }
        setShowUnitModal(false);
        setUnitForm({ id: '', nameAR: '', nameEN: '' });
    };

    const handleDeleteUnit = (id) => {
        if (!window.confirm(currentLanguage === 'ar' ? 'هل أنت متأكد من حذف هذه الوحدة؟' : 'Are you sure you want to delete this unit?')) return;
        setUnits(units.filter(u => u.id !== id));
    };

    const handleExportCSV = () => {
        if (!products.length) return;
        const headersList = ['id', 'barcode', 'nameAR', 'nameEN', 'category', 'stock', 'cost', 'price'];
        const csvRows = [headersList.join(',')];
        products.forEach(p => {
            const values = headersList.map(header => {
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
            const headersList = rows[0].split(',').map(h => h.replace(/"/g, '').trim());
            const newProducts = [];
            for (let i = 1; i < rows.length; i++) {
                if (!rows[i].trim()) continue;
                const values = rows[i].split(',').map(v => v.replace(/"/g, '').trim());
                const product = {};
                headersList.forEach((header, index) => {
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

    const renderProductsTable = (filteredProducts, title) => (
        <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <h3>{title}</h3>
                {activeTab !== 'itemsReorder' && (
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
                )}
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
                            <th>{currentLanguage === 'ar' ? 'إجراءات' : 'Actions'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(p => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.barcode || '-'}</td>
                                <td>{currentLanguage === 'ar' ? p.nameAR : p.nameEN}</td>
                                <td>{translations[currentLanguage][p.category] || p.category}</td>
                                <td>
                                    <span style={{ color: p.stock <= 10 ? 'var(--accent-danger)' : 'inherit', fontWeight: p.stock <= 10 ? 'bold' : 'normal' }}>
                                        {p.stock}
                                    </span>
                                </td>
                                <td>{formatCurrency(p.cost || 0)}</td>
                                <td>{formatCurrency(p.price)}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn btn-secondary" onClick={() => { setProdForm(p); setShowProductModal(true); }}>
                                            <i className="ri-edit-line"></i>
                                        </button>
                                        <button className="btn btn-danger" onClick={() => handleDeleteProduct(p.id)}>
                                            <i className="ri-delete-bin-line"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderCategories = () => (
        <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>{currentLanguage === 'ar' ? 'فئات المنتجات' : 'Product Categories'}</h3>
                <button className="btn btn-primary" onClick={() => setShowCategoryModal(true)}>
                    <i className="ri-add-line" style={{ marginRight: '5px' }}></i>
                    {currentLanguage === 'ar' ? 'إضافة فئة' : 'Add Category'}
                </button>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>{currentLanguage === 'ar' ? 'المعرف' : 'ID'}</th>
                            <th>{currentLanguage === 'ar' ? 'الاسم (عربي)' : 'Name (AR)'}</th>
                            <th>{currentLanguage === 'ar' ? 'الاسم (إنجليزي)' : 'Name (EN)'}</th>
                            <th>{currentLanguage === 'ar' ? 'إجراءات' : 'Actions'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(c => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.nameAR}</td>
                                <td>{c.nameEN}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn btn-secondary" onClick={() => { setCategoryForm(c); setShowCategoryModal(true); }}>
                                            <i className="ri-edit-line"></i>
                                        </button>
                                        <button className="btn btn-danger" onClick={() => handleDeleteCategory(c.id)}>
                                            <i className="ri-delete-bin-line"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderUnits = () => (
        <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>{currentLanguage === 'ar' ? 'وحدات القياس' : 'Measurement Units'}</h3>
                <button className="btn btn-primary" onClick={() => setShowUnitModal(true)}>
                    <i className="ri-add-line" style={{ marginRight: '5px' }}></i>
                    {currentLanguage === 'ar' ? 'إضافة وحدة' : 'Add Unit'}
                </button>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>{currentLanguage === 'ar' ? 'المعرف' : 'ID'}</th>
                            <th>{currentLanguage === 'ar' ? 'الاسم (عربي)' : 'Name (AR)'}</th>
                            <th>{currentLanguage === 'ar' ? 'الاسم (إنجليزي)' : 'Name (EN)'}</th>
                            <th>{currentLanguage === 'ar' ? 'إجراءات' : 'Actions'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {units.map(u => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.nameAR}</td>
                                <td>{u.nameEN}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn btn-secondary" onClick={() => { setUnitForm(u); setShowUnitModal(true); }}>
                                            <i className="ri-edit-line"></i>
                                        </button>
                                        <button className="btn btn-danger" onClick={() => handleDeleteUnit(u.id)}>
                                            <i className="ri-delete-bin-line"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div>
            {['inventory', 'items'].includes(activeTab) && renderProductsTable(products, translations[currentLanguage].inventory)}
            {activeTab === 'itemsReorder' && renderProductsTable(products.filter(p => p.stock <= 10), currentLanguage === 'ar' ? 'الأصناف تحت حد الطلب' : 'Items Below Reorder (Low Stock)')}
            {activeTab === 'categories' && renderCategories()}
            {activeTab === 'units' && renderUnits()}

            {/* Product Modal */}
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
                                    {categories.map(c => <option key={c.id} value={c.id}>{currentLanguage === 'ar' ? c.nameAR : c.nameEN}</option>)}
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

                            <hr style={{ margin: '20px 0', borderColor: 'var(--glass-border)' }} />
                            
                            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input type="checkbox" id="isDigital" checked={prodForm.isDigital} onChange={e => setProdForm({ ...prodForm, isDigital: e.target.checked })} style={{ width: 'auto' }} />
                                <label htmlFor="isDigital" style={{ margin: 0 }}>{currentLanguage === 'ar' ? 'هذا منتج رقمي' : 'This is a Digital Product'}</label>
                            </div>

                            {prodForm.isDigital && (
                                <>
                                    <div className="form-group">
                                        <label>{currentLanguage === 'ar' ? 'رابط الملف الرقمي' : 'Digital Asset URL'}</label>
                                        <input type="text" className="form-control" value={prodForm.digitalAssetUrl} onChange={e => setProdForm({ ...prodForm, digitalAssetUrl: e.target.value })} placeholder="https://..." />
                                    </div>
                                    <div className="form-group">
                                        <label>{currentLanguage === 'ar' ? 'تعليمات التنزيل' : 'Download Instructions'}</label>
                                        <textarea className="form-control" value={prodForm.digitalAssetInstructions} onChange={e => setProdForm({ ...prodForm, digitalAssetInstructions: e.target.value })} placeholder={currentLanguage === 'ar' ? 'تعليمات للمشتري' : 'Instructions for the buyer'}></textarea>
                                    </div>
                                </>
                            )}

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowProductModal(false)}>{translations[currentLanguage].close}</button>
                                <button type="submit" className="btn btn-primary">{translations[currentLanguage].saveProduct}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {showCategoryModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3 style={{ marginBottom: '20px' }}>{currentLanguage === 'ar' ? 'فئة المنتج' : 'Product Category'}</h3>
                        <form onSubmit={handleSaveCategory}>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'الاسم (عربي)' : 'Name (AR)'}</label>
                                <input type="text" className="form-control" value={categoryForm.nameAR} onChange={e => setCategoryForm({ ...categoryForm, nameAR: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'الاسم (إنجليزي)' : 'Name (EN)'}</label>
                                <input type="text" className="form-control" value={categoryForm.nameEN} onChange={e => setCategoryForm({ ...categoryForm, nameEN: e.target.value })} required />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowCategoryModal(false)}>{translations[currentLanguage].close}</button>
                                <button type="submit" className="btn btn-primary">{currentLanguage === 'ar' ? 'حفظ' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Unit Modal */}
            {showUnitModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3 style={{ marginBottom: '20px' }}>{currentLanguage === 'ar' ? 'وحدة القياس' : 'Measurement Unit'}</h3>
                        <form onSubmit={handleSaveUnit}>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'الاسم (عربي)' : 'Name (AR)'}</label>
                                <input type="text" className="form-control" value={unitForm.nameAR} onChange={e => setUnitForm({ ...unitForm, nameAR: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'الاسم (إنجليزي)' : 'Name (EN)'}</label>
                                <input type="text" className="form-control" value={unitForm.nameEN} onChange={e => setUnitForm({ ...unitForm, nameEN: e.target.value })} required />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowUnitModal(false)}>{translations[currentLanguage].close}</button>
                                <button type="submit" className="btn btn-primary">{currentLanguage === 'ar' ? 'حفظ' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
