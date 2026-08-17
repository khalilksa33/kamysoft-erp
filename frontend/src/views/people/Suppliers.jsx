import React, { useState } from 'react';
import * as XLSX from "xlsx";

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

    
    
    
    
    const handleExportSuppliersData = (format) => {
        if (!suppliers || !suppliers.length) return;
        const headersList = ['id', 'company', 'contact', 'phone', 'items'];
        
        if (format === 'csv') {
            const csvRows = [headersList.join(',')];
            suppliers.forEach(item => {
                csvRows.push(headersList.map(h => '"' + (item[h] || '').toString().replace(/"/g, '""') + '"').join(','));
            });
            const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'suppliers_export.csv';
            a.click();
        } else if (format === 'excel') {
            const worksheet = XLSX.utils.json_to_sheet(suppliers.map(item => {
                let obj = {};
                headersList.forEach(h => obj[h] = item[h]);
                return obj;
            }));
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Suppliers");
            XLSX.writeFile(workbook, 'suppliers_export.xlsx');
        }
    };

    const handleImportSuppliersData = (e) => {
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
                    if (item.company) {
                        item.id = item.id || Date.now().toString() + i;
                        newItems.push(item);
                    }
                }
                if (newItems.length > 0) {
                    setSuppliers([...suppliers, ...newItems]);
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
                    setSuppliers([...suppliers, ...newItems]);
                    alert(currentLanguage === 'ar' ? `تم استيراد ${newItems.length} عنصر بنجاح` : `Successfully imported ${newItems.length} items`);
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    return (

        <div className="glass-card">
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <h3 data-i18n="suppliers">{translations[currentLanguage].suppliers}</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="file" id="supp-csv-upload" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" style={{ display: 'none' }} onChange={handleImportSuppliersData} />
                    <button className="btn btn-secondary" onClick={() => document.getElementById('supp-csv-upload').click()}>
                        <i className="ri-upload-2-line" style={{ marginRight: '5px' }}></i>
                        {currentLanguage === 'ar' ? 'استيراد (CSV/Excel)' : 'Import (CSV/Excel)'}
                    </button>
                    
                    <button className="btn btn-secondary" onClick={() => handleExportSuppliersData('csv')}>
                        <i className="ri-download-2-line" style={{ marginRight: '5px' }}></i>
                        {currentLanguage === 'ar' ? 'تصدير CSV' : 'Export CSV'}
                    </button>
                    <button className="btn btn-secondary" onClick={() => handleExportSuppliersData('excel')}>
                        <i className="ri-file-excel-2-line" style={{ marginRight: '5px' }}></i>
                        {currentLanguage === 'ar' ? 'تصدير Excel' : 'Export Excel'}
                    </button>
                    <button className="btn btn-primary" onClick={() => { setSuppForm({ company: '', contact: '', phone: '', items: '' }); setShowSupplierModal(true); }}>
                        {translations[currentLanguage].addSupplier}
                    </button>
                </div>
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
