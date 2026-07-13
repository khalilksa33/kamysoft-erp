import re

with open('frontend/src/views/services/Maintenance.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add ReactDOM import if not there
if "import ReactDOM" not in content:
    content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport ReactDOM from 'react-dom';")

# replace the modal_code with the Portal version
old_modal = """            {printReceipt && ("""
new_modal = """            {printReceipt && ReactDOM.createPortal(
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
            )}"""

# First, remove the old modal block to avoid duplicates!
import re
content = re.sub(r'\{printReceipt && \([\s\S]*?\}\)', new_modal, content, count=1)

with open('frontend/src/views/services/Maintenance.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched Maintenance.jsx")
