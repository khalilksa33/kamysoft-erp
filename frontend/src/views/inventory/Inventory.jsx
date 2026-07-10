import React from 'react';

const Inventory = (props) => {
    const { 
        inventory, formatCurrency, currentLanguage, translations,
        newProduct, setNewProduct, handleAddProduct, handleDeleteProduct
    } = props;

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
                    </div>
                
    );
};

export default Inventory;
