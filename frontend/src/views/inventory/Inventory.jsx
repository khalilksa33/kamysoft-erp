import React, { useState } from 'react';
import * as XLSX from "xlsx";

const Inventory = (props) => {
    const { 
        products, setProducts, formatCurrency, currentLanguage, translations, headers, activeTab 
    } = props;

    // Items
    const [showProductModal, setShowProductModal] = useState(false);
    const [prodForm, setProdForm] = useState({ id: '', nameAR: '', nameEN: '', category: 'electronics', stock: 10, price: 100, cost: 60, barcode: '', isDigital: false, digitalAssetUrl: '', digitalAssetInstructions: '' });

    // Categories
    const [categories, setCategories] = useState(() => {
        const uniqueCats = Array.from(new Set(products.map(p => p.category)));
        return uniqueCats.map((cat, i) => ({ id: String(i+1), nameAR: cat, nameEN: cat }));
    });
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
            setCategories(categories.map(c => c.id == mock.id ? mock : c));
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

    const renderProductsTable = (filteredProducts, title) => (
        <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <h3>{title}</h3>
                {activeTab !== 'itemsReorder' && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="file" id="csv-upload" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" style={{ display: 'none' }} onChange={handleImportProductsData} />
                        <button className="btn btn-secondary" onClick={() => document.getElementById('csv-upload').click()}>
                            <i className="ri-upload-2-line" style={{ marginRight: '5px' }}></i>
                            {currentLanguage === 'ar' ? 'استيراد (CSV/Excel)' : 'Import (CSV/Excel)'}
                        </button>
                        
                    <button className="btn btn-secondary" onClick={() => handleExportProductsData('csv')}>
                        <i className="ri-download-2-line" style={{ marginRight: '5px' }}></i>
                        {currentLanguage === 'ar' ? 'تصدير CSV' : 'Export CSV'}
                    </button>
                    <button className="btn btn-secondary" onClick={() => handleExportProductsData('excel')}>
                        <i className="ri-file-excel-2-line" style={{ marginRight: '5px' }}></i>
                        {currentLanguage === 'ar' ? 'تصدير Excel' : 'Export Excel'}
                    </button>
                        <button className="btn btn-primary" onClick={() => { 
                            setProdForm({ nameEN: '', nameAR: '', price: 0, cost: 0, stock: 0, category: categories.length > 0 ? categories[0].id : '', emoji: '', barcode: '', isDigital: false });
                            setShowProductModal(true); 
                        }}>
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
                
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="file" id="cat-csv-upload" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" style={{ display: 'none' }} onChange={handleImportCategoriesData} />
                    <button className="btn btn-secondary" onClick={() => document.getElementById('cat-csv-upload').click()}>
                        <i className="ri-upload-2-line" style={{ marginRight: '5px' }}></i>
                        {currentLanguage === 'ar' ? 'استيراد (CSV/Excel)' : 'Import (CSV/Excel)'}
                    </button>
                    
                    <button className="btn btn-secondary" onClick={() => handleExportCategoriesData('csv')}>
                        <i className="ri-download-2-line" style={{ marginRight: '5px' }}></i>
                        {currentLanguage === 'ar' ? 'تصدير CSV' : 'Export CSV'}
                    </button>
                    <button className="btn btn-secondary" onClick={() => handleExportCategoriesData('excel')}>
                        <i className="ri-file-excel-2-line" style={{ marginRight: '5px' }}></i>
                        {currentLanguage === 'ar' ? 'تصدير Excel' : 'Export Excel'}
                    </button>
                    <button className="btn btn-primary" onClick={() => { setCategoryForm({ id: '', nameAR: '', nameEN: '' }); setShowCategoryModal(true); }}>
                        <i className="ri-add-line" style={{ marginRight: '5px' }}></i>
                        {currentLanguage === 'ar' ? 'إضافة فئة' : 'Add Category'}
                    </button>
                </div>

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


    const handleExportProductsData = (format) => {
        if (!products || !products.length) return;
        const headersList = ['id', 'barcode', 'nameAR', 'nameEN', 'category', 'stock', 'cost', 'price'];
        
        if (format === 'csv') {
            const csvRows = [headersList.join(',')];
            products.forEach(item => {
                csvRows.push(headersList.map(h => '"' + (item[h] || '').toString().replace(/"/g, '""') + '"').join(','));
            });
            const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'products_export.csv';
            a.click();
        } else if (format === 'excel') {
            const worksheet = XLSX.utils.json_to_sheet(products.map(item => {
                let obj = {};
                headersList.forEach(h => obj[h] = item[h]);
                return obj;
            }));
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
            XLSX.writeFile(workbook, 'products_export.xlsx');
        }
    };

    const handleImportProductsData = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const fileExt = file.name.split('.').pop().toLowerCase();
        
        if (fileExt === 'csv') {
            const reader = new FileReader();
            reader.onload = (event) => {
                const rows = event.target.result.split('\n');
                if (rows.length < 2) return;
                const headersList = rows[0].split(',').map(h => h.replace(/"/g, '').trim());
                const newItems = [];
                for (let i = 1; i < rows.length; i++) {
                    if (!rows[i].trim()) continue;
                    const values = rows[i].split(',').map(v => v.replace(/"/g, '').trim());
                    const item = {};
                    headersList.forEach((header, index) => item[header] = values[index]);
                    if (item.barcode) {
                        item.id = item.id || Date.now().toString() + i;
                        newItems.push(item);
                    }
                }
                if (newItems.length > 0) {
                    setProducts([...products, ...newItems]);
                    alert(currentLanguage === 'ar' ? `تم استيراد ${newItems.length} عنصر بنجاح` : `Successfully imported ${newItems.length} items`);
                }
            };
            reader.readAsText(file);
        } else if (fileExt === 'xlsx' || fileExt === 'xls') {
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                
                const newItems = json.map((row, i) => {
                    let item = { ...row };
                    item.id = item.id || Date.now().toString() + i;
                    return item;
                });
                
                if (newItems.length > 0) {
                    setProducts([...products, ...newItems]);
                    alert(currentLanguage === 'ar' ? `تم استيراد ${newItems.length} عنصر بنجاح` : `Successfully imported ${newItems.length} items`);
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    
    const handleExportCategoriesData = (format) => {
        if (!categories || !categories.length) return;
        const headersList = ['id', 'nameAR', 'nameEN'];
        
        if (format === 'csv') {
            const csvRows = [headersList.join(',')];
            categories.forEach(item => {
                csvRows.push(headersList.map(h => '"' + (item[h] || '').toString().replace(/"/g, '""') + '"').join(','));
            });
            const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'categories_export.csv';
            a.click();
        } else if (format === 'excel') {
            const worksheet = XLSX.utils.json_to_sheet(categories.map(item => {
                let obj = {};
                headersList.forEach(h => obj[h] = item[h]);
                return obj;
            }));
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");
            XLSX.writeFile(workbook, 'categories_export.xlsx');
        }
    };

    const handleImportCategoriesData = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const fileExt = file.name.split('.').pop().toLowerCase();
        
        if (fileExt === 'csv') {
            const reader = new FileReader();
            reader.onload = (event) => {
                const rows = event.target.result.split('\n');
                if (rows.length < 2) return;
                const headersList = rows[0].split(',').map(h => h.replace(/"/g, '').trim());
                const newItems = [];
                for (let i = 1; i < rows.length; i++) {
                    if (!rows[i].trim()) continue;
                    const values = rows[i].split(',').map(v => v.replace(/"/g, '').trim());
                    const item = {};
                    headersList.forEach((header, index) => item[header] = values[index]);
                    if (item.nameAR) {
                        item.id = item.id || Date.now().toString() + i;
                        newItems.push(item);
                    }
                }
                if (newItems.length > 0) {
                    setCategories([...categories, ...newItems]);
                    alert(currentLanguage === 'ar' ? `تم استيراد ${newItems.length} عنصر بنجاح` : `Successfully imported ${newItems.length} items`);
                }
            };
            reader.readAsText(file);
        } else if (fileExt === 'xlsx' || fileExt === 'xls') {
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                
                const newItems = json.map((row, i) => {
                    let item = { ...row };
                    item.id = item.id || Date.now().toString() + i;
                    return item;
                });
                
                if (newItems.length > 0) {
                    setCategories([...categories, ...newItems]);
                    alert(currentLanguage === 'ar' ? `تم استيراد ${newItems.length} عنصر بنجاح` : `Successfully imported ${newItems.length} items`);
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    return (
        <div>
            {['inventory', 'items'].includes(activeTab) && renderProductsTable(products, translations[currentLanguage].inventory)}
            {activeTab === 'itemsReorder' && renderProductsTable(products.filter(p => p.stock <= 10), currentLanguage === 'ar' ? 'الأصناف تحت حد الطلب' : 'Items Below Reorder (Low Stock)')}
            {activeTab === 'categories' && renderCategories()}
            

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
                                    {categories.map(c => <option key={c.id} value={c.nameEN}>{currentLanguage === 'ar' ? c.nameAR : c.nameEN}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                                    <label>{currentLanguage === 'ar' ? 'الباركود' : 'Barcode'}</label>
                                    <input type="text" className="form-control" value={prodForm.barcode || ''} onChange={e => setProdForm({ ...prodForm, barcode: e.target.value })} />
                                </div>
                                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                                    <label>{currentLanguage === 'ar' ? 'أيقونة المنتج (إيموجي)' : 'Product Icon (Emoji)'}</label>
                                    <input type="text" list="emoji-list" className="form-control" placeholder="🍔" value={prodForm.emoji || ''} onChange={e => setProdForm({ ...prodForm, emoji: e.target.value })} />
                                    <datalist id="emoji-list">
                                        <option value="🍔" />
                                        <option value="🍕" />
                                        <option value="🍗" />
                                        <option value="🥩" />
                                        <option value="🥗" />
                                        <option value="🍟" />
                                        <option value="🌭" />
                                        <option value="☕" />
                                        <option value="🥤" />
                                        <option value="🧃" />
                                        <option value="🍰" />
                                        <option value="🍮" />
                                        <option value="🍩" />
                                        <option value="🧊" />
                                        <option value="🌯" />
                                        <option value="🌮" />
                                        <option value="🍲" />
                                        <option value="🍛" />
                                        <option value="🍝" />
                                    </datalist>
                                </div>
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
