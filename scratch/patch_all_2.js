const fs = require('fs');

// 1. Patch index.css
let css = fs.readFileSync('frontend/src/index.css', 'utf8');
css = css.replace('.modal {\n    background: var(--bg-secondary);\n    border: 1px solid var(--glass-border);\n    border-radius: var(--radius-lg);\n    padding: 32px;\n    width: 90%;\n    max-width: 800px;', 
                  '.modal {\n    background: var(--bg-secondary);\n    border: 1px solid var(--glass-border);\n    border-radius: var(--radius-lg);\n    padding: 32px;\n    width: 95%;\n    max-width: 1000px;\n    min-height: 700px;\n    height: 90vh;');
fs.writeFileSync('frontend/src/index.css', css);

// 2. Patch App.jsx
let app = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// Deduplicate invoices
app = app.replace(/\.then\(data => setInvoices\(data\)\)/g, '.then(data => setInvoices(data.filter((v,i,a)=>a.findIndex(t=>t.id===v.id)===i)))');
// Deduplicate quotations
app = app.replace(/\.then\(data => setQuotations\(data\)\)/g, '.then(data => setQuotations(data.filter((v,i,a)=>a.findIndex(t=>t.id===v.id)===i)))');

// Create Invoice button size in B2B
app = app.replace(/<button\s+className="btn btn-primary glow-button"\s+onClick=\{handleB2BSubmit\}\s+disabled=\{b2bForm\.items\.length === 0 \|\| !b2bForm\.items\[0\]\.productId\}\s+style=\{\{\s*display:\s*'flex',\s*alignItems:\s*'center',\s*gap:\s*'6px'\s*\}\}/g,
                  '<button className="btn btn-primary glow-button" onClick={handleB2BSubmit} disabled={b2bForm.items.length === 0 || !b2bForm.items[0].productId} style={{ display: "flex", alignItems: "center", gap: "6px", height: "60px", fontSize: "1.2rem", padding: "0 30px" }}');

// Share logic for Invoice
app = app.replace(/if \(navigator\.share\) \{\s*navigator\.share\(\{\s*title: `Invoice INV-\$\{activeInvoice\.id\}`,\s*text: shareText,\s*url: window\.location\.href\s*\}\)\.catch\(\(\) => \{\}\);\s*\} else \{/g,
                  `const el = document.getElementById('invoicePrintArea');
                  if (navigator.share && window.html2pdf && el) {
                      const opt = { margin: 0, filename: \`Invoice_\${activeInvoice.id}.pdf\`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } };
                      window.html2pdf().set(opt).from(el).output('blob').then(pdfBlob => {
                          const file = new File([pdfBlob], \`Invoice_\${activeInvoice.id}.pdf\`, { type: 'application/pdf' });
                          navigator.share({ title: \`Invoice INV-\${activeInvoice.id}\`, files: [file] }).catch(()=>{});
                      });
                  } else {`);

// Share logic for Quotation
app = app.replace(/if \(navigator\.share\) \{\s*navigator\.share\(\{\s*title: `Quotation QT-\$\{activeQuotation\.id\}`,\s*text: shareText,\s*url: window\.location\.href\s*\}\)\.catch\(\(\) => \{\}\);\s*\} else \{/g,
                  `const el = document.getElementById('quotationPrintArea');
                  if (navigator.share && window.html2pdf && el) {
                      const opt = { margin: 0, filename: \`Quotation_\${activeQuotation.id}.pdf\`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } };
                      window.html2pdf().set(opt).from(el).output('blob').then(pdfBlob => {
                          const file = new File([pdfBlob], \`Quotation_\${activeQuotation.id}.pdf\`, { type: 'application/pdf' });
                          navigator.share({ title: \`Quotation QT-\${activeQuotation.id}\`, files: [file] }).catch(()=>{});
                      });
                  } else {`);

// Remove A4 and Thermal buttons from Quotation modal
app = app.replace(/<button className="btn btn-secondary" onClick=\{\(\) => setInvoiceFormat\('thermal'\)\} style=\{\{ flexGrow: 1 \}\}>.*?<\/button>\s*<button className="btn btn-secondary" onClick=\{\(\) => setInvoiceFormat\('a4'\)\} style=\{\{ flexGrow: 1 \}\}>.*?<\/button>/s, '');

// Add html2pdf import if missing
if (!app.includes("import html2pdf")) {
    app = app.replace("import React,", "import html2pdf from 'html2pdf.js';\nimport React,");
}

// Add Quotation CRUD modal
const quotationModal = `
            {showQuotationCrudModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{currentLanguage === 'ar' ? 'عرض السعر' : 'Quotation'}</h3>
                        <form onSubmit={(e) => { e.preventDefault(); handleSaveQuotation(quotationForm); setShowQuotationCrudModal(false); }}>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'العميل' : 'Customer'}</label>
                                <input type="text" className="form-control" required value={quotationForm.customer || ''} onChange={e => setQuotationForm({...quotationForm, customer: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'العناصر' : 'Items'}</label>
                                <input type="text" className="form-control" required value={quotationForm.itemsText || ''} onChange={e => setQuotationForm({...quotationForm, itemsText: e.target.value})} placeholder="e.g. Item1 x2, Item2 x1" />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'الإجمالي' : 'Total Amount'}</label>
                                <input type="number" step="0.01" className="form-control" required value={quotationForm.total || ''} onChange={e => setQuotationForm({...quotationForm, total: e.target.value})} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowQuotationCrudModal(false)}>{translations[currentLanguage].close || 'Close'}</button>
                                <button type="submit" className="btn btn-primary">{currentLanguage === 'ar' ? 'حفظ' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
`;

if (!app.includes('setShowQuotationCrudModal(false)')) {
    app = app.replace('{showQuotationModal && activeQuotation && (', quotationModal + '\n            {showQuotationModal && activeQuotation && (');
}

fs.writeFileSync('frontend/src/App.jsx', app);
console.log('Patched App.jsx and index.css successfully');
