import re

with open('frontend/src/views/services/Maintenance.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add ReactDOM import
if "import ReactDOM" not in content:
    content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport ReactDOM from 'react-dom';")

# 2. Add printReceipt state and expectedDelivery to form
content = content.replace(
    "const [form, setForm] = useState({ id: '', customer: '', device: '', issue: '', status: 'Pending', cost: 0, date: new Date().toISOString().split('T')[0] });",
    "const [form, setForm] = useState({ id: '', customer: '', device: '', issue: '', expectedDelivery: '', status: 'Pending', cost: 0, date: new Date().toISOString().split('T')[0] });\n    const [printReceipt, setPrintReceipt] = useState(null);"
)

# 3. Update handleSave to reset expectedDelivery
content = content.replace(
    "setForm({ id: '', customer: '', device: '', issue: '', status: 'Pending', cost: 0, date: new Date().toISOString().split('T')[0] });",
    "setForm({ id: '', customer: '', device: '', issue: '', expectedDelivery: '', status: 'Pending', cost: 0, date: new Date().toISOString().split('T')[0] });"
)

# 4. Add expectedDelivery to table header
content = content.replace(
    "<th>{currentLanguage === 'ar' ? 'التكلفة' : 'Cost'}</th>",
    "<th>{currentLanguage === 'ar' ? 'وقت التسليم' : 'Delivery Date'}</th>\n                            <th>{currentLanguage === 'ar' ? 'التكلفة' : 'Cost'}</th>"
)

# 5. Add expectedDelivery to table body
content = content.replace(
    "<td>{formatCurrency(t.cost)}</td>",
    "<td>{t.expectedDelivery ? new Date(t.expectedDelivery).toLocaleString() : '-'}</td>\n                                    <td>{formatCurrency(t.cost)}</td>"
)

# 6. Add Print Button
content = content.replace(
    """<button className="btn btn-secondary" onClick={() => { setForm(t); setShowModal(true); }}>""",
    """<button className="btn btn-success" onClick={() => setPrintReceipt(t)} title={currentLanguage === 'ar' ? 'طباعة' : 'Print'}>
                                                <i className="ri-printer-line"></i>
                                            </button>
                                            <button className="btn btn-secondary" onClick={() => { setForm(t); setShowModal(true); }}>"""
)

# 7. Add expectedDelivery input to the form
content = content.replace(
    """<div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'تاريخ الاستلام' : 'Date'}</label>""",
    """<div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'وقت التسليم المتوقع' : 'Expected Delivery'}</label>
                                <input type="datetime-local" className="form-control" value={form.expectedDelivery || ''} onChange={e => setForm({ ...form, expectedDelivery: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'تاريخ الاستلام' : 'Date'}</label>"""
)

# 8. Add printReceipt portal right before {showModal && (
portal_code = """
            {printReceipt && ReactDOM.createPortal(
                <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.8)' }}>
                    <div className="modal print-receipt-modal" style={{ background: 'white', color: 'black', width: '100%', maxWidth: '350px', padding: '20px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#333' }}>{currentLanguage === 'ar' ? 'إيصال استلام' : 'Booking Receipt'}</h2>
                            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{new Date().toLocaleString()}</p>
                        </div>
                        <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#000' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #ccc', paddingBottom: '5px', marginBottom: '5px' }}>
                                <strong>{currentLanguage === 'ar' ? 'رقم التذكرة' : 'Ticket ID'}:</strong>
                                <span>{printReceipt.id}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #ccc', paddingBottom: '5px', marginBottom: '5px' }}>
                                <strong>{currentLanguage === 'ar' ? 'العميل' : 'Customer'}:</strong>
                                <span>{printReceipt.customer}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #ccc', paddingBottom: '5px', marginBottom: '5px' }}>
                                <strong>{currentLanguage === 'ar' ? 'الجهاز' : 'Device'}:</strong>
                                <span>{printReceipt.device}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #ccc', paddingBottom: '5px', marginBottom: '5px' }}>
                                <strong>{currentLanguage === 'ar' ? 'المشكلة' : 'Issue'}:</strong>
                                <span style={{ textAlign: 'right', maxWidth: '150px' }}>{printReceipt.issue}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #ccc', paddingBottom: '5px', marginBottom: '5px' }}>
                                <strong>{currentLanguage === 'ar' ? 'التكلفة المقدرة' : 'Est. Cost'}:</strong>
                                <span>{formatCurrency(printReceipt.cost)}</span>
                            </div>
                            {printReceipt.expectedDelivery && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #ccc', paddingBottom: '5px', marginBottom: '5px' }}>
                                    <strong>{currentLanguage === 'ar' ? 'وقت التسليم' : 'Delivery'}:</strong>
                                    <span style={{ textAlign: 'right', maxWidth: '150px', color: '#d97706', fontWeight: 'bold' }}>{new Date(printReceipt.expectedDelivery).toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#333' }}>
                            <p>{currentLanguage === 'ar' ? 'شكراً لثقتكم بنا!' : 'Thank you for your trust!'}</p>
                        </div>
                        
                        <div className="no-print" style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
                            <button className="btn btn-primary" onClick={() => window.print()}>{currentLanguage === 'ar' ? 'طباعة' : 'Print'}</button>
                            <button className="btn btn-secondary" onClick={() => setPrintReceipt(null)}>{translations[currentLanguage]?.close || 'Close'}</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
"""

content = content.replace("            {showModal && (", portal_code + "\n            {showModal && (")

with open('frontend/src/views/services/Maintenance.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully applied Maintenance.jsx patch.")
