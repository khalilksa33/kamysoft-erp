import React, { useState } from 'react';

const Suppliers = (props) => {
    const { 
        suppliers, setSuppliers, currentLanguage, translations, headers 
    } = props;

    const [suppForm, setSuppForm] = useState({ company: '', contact: '', phone: '', items: '' });
    const [showSupplierModal, setShowSupplierModal] = useState(false);

    const handleSaveSupplier = (e) => {
        e.preventDefault();
        const method = suppForm.id ? 'PUT' : 'POST';
        const url = suppForm.id ? `/api/suppliers/${suppForm.id}` : '/api/suppliers';
        
        fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(suppForm)
        })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then(data => {
            if (suppForm.id) {
                setSuppliers(suppliers.map(s => s.id === suppForm.id ? data : s));
            } else {
                setSuppliers([...suppliers, data]);
            }
            setShowSupplierModal(false);
            setSuppForm({ company: '', contact: '', phone: '', items: '' });
        })
        .catch(() => {
            if (suppForm.id) {
                setSuppliers(suppliers.map(s => s.id === suppForm.id ? { ...suppForm } : s));
            } else {
                const mock = { ...suppForm, id: `SUPP-${Date.now().toString().slice(-4)}` };
                setSuppliers([...suppliers, mock]);
            }
            setShowSupplierModal(false);
            setSuppForm({ company: '', contact: '', phone: '', items: '' });
        });
    };

    const handleDeleteSupplier = (id) => {
        if (!confirm(currentLanguage === 'ar' ? 'هل أنت متأكد من حذف هذا المورد؟' : 'Are you sure you want to delete this supplier?')) return;
        fetch(`/api/suppliers/${id}`, { method: 'DELETE', headers: headers })
        .then(() => {
            setSuppliers(suppliers.filter(s => s.id !== id));
        })
        .catch(() => {
            setSuppliers(suppliers.filter(s => s.id !== id));
        });
    };

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

            {/* MODAL: ADD / EDIT SUPPLIER */}
            {showSupplierModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3 style={{ marginBottom: '20px' }}>
                            {suppForm.id ? (currentLanguage === 'ar' ? 'تعديل بيانات المورد' : 'Edit Supplier Details') : translations[currentLanguage].addSupplier}
                        </h3>
                        <form onSubmit={handleSaveSupplier}>
                            <div className="form-group">
                                <label>{translations[currentLanguage].suppName}</label>
                                <input type="text" className="form-control" value={suppForm.company || ''} onChange={e => setSuppForm({ ...suppForm, company: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].suppContact}</label>
                                <input type="text" className="form-control" value={suppForm.contact || ''} onChange={e => setSuppForm({ ...suppForm, contact: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].phone}</label>
                                <input type="text" className="form-control" value={suppForm.phone || ''} onChange={e => setSuppForm({ ...suppForm, phone: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].suppliedItems}</label>
                                <input type="text" className="form-control" value={suppForm.items || ''} onChange={e => setSuppForm({ ...suppForm, items: e.target.value })} placeholder="e.g. Garments, Electronics" required />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowSupplierModal(false)}>{translations[currentLanguage].close}</button>
                                <button type="submit" className="btn btn-primary">Save / حفظ</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Suppliers;
