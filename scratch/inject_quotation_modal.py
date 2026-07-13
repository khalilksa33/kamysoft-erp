import sys
import re

file_path = 'frontend/src/App.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

modal_html = """
            {/* MODAL: CREATE QUOTATION CRUD */}
            {showQuotationCrudModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3 style={{ marginBottom: '20px', color: 'var(--accent-primary)' }}>
                            <i className="ri-file-list-3-line"></i> {currentLanguage === 'ar' ? 'إنشاء عرض سعر جديد' : 'Create New Quotation'}
                        </h3>
                        <form onSubmit={handleSaveQuotation}>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'اسم العميل' : 'Customer Name'}</label>
                                <input type="text" className="form-control" value={quotationForm.customer} onChange={e => setQuotationForm({ ...quotationForm, customer: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'المنتجات (مثال: لابتوب x2, ماوس x1)' : 'Items (e.g. Laptop x2, Mouse x1)'}</label>
                                <input type="text" className="form-control" value={quotationForm.itemsText || ''} onChange={e => setQuotationForm({ ...quotationForm, itemsText: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'الإجمالي (غير شامل الضريبة)' : 'Total (Excl. VAT)'}</label>
                                <input type="number" className="form-control" value={quotationForm.total} onChange={e => setQuotationForm({ ...quotationForm, total: e.target.value })} required />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '30px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowQuotationCrudModal(false)}>{translations[currentLanguage].close}</button>
                                <button type="submit" className="btn btn-primary">{translations[currentLanguage].saveSettings || 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
"""

if "MODAL: CREATE QUOTATION CRUD" not in content:
    # insert before {showAssetModal}
    idx = content.find('{showAssetModal && (')
    if idx != -1:
        new_content = content[:idx] + modal_html + content[idx:]
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Injected Quotation Crud Modal")
    else:
        print("Could not find insertion point")
else:
    print("Modal already exists")

