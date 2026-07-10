import React from 'react';

const Suppliers = (props) => {
    const { 
        suppliers, currentLanguage, translations,
        newSupplier, setNewSupplier, handleAddSupplier, handleDeleteSupplier
    } = props;

    return (
        
                    <div className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 data-i18n="suppliers">{translations[currentLanguage].suppliers}</h3>
                            <button className="btn btn-primary" onClick={() => { setSuppForm({ company: '', contact: '', phone: '', items: '' }); setShowSupplierModal(true); }}>
                                {translations[currentLanguage].addSupplier}
                            </button>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{translations[currentLanguage].suppName}</th>
                                        <th>{translations[currentLanguage].suppContact}</th>
                                        <th>{translations[currentLanguage].phone}</th>
                                        <th>{translations[currentLanguage].suppliedItems}</th>
                                        <th>{translations[currentLanguage].actions}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {suppliers.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                                {currentLanguage === 'ar' ? 'لا يوجد موردون مسجلون حالياً' : 'No suppliers registered currently'}
                                            </td>
                                        </tr>
                                    ) : (
                                        suppliers.map(s => (
                                            <tr key={s.id}>
                                                <td>{s.company}</td>
                                                <td>{s.contact}</td>
                                                <td>{s.phone}</td>
                                                <td>{s.items}</td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button className="btn btn-secondary" onClick={() => { setSuppForm(s); setShowSupplierModal(true); }}>
                                                            <i className="ri-edit-line"></i>
                                                        </button>
                                                        <button className="btn btn-danger" onClick={() => handleDeleteSupplier(s.id)}>
                                                            <i className="ri-delete-bin-line"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                
    );
};

export default Suppliers;
