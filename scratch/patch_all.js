const fs = require('fs');

// 1. Patch POS.jsx
let pos = fs.readFileSync('frontend/src/views/pos/POS.jsx', 'utf8');
pos = pos.replace(/<button className="btn btn-secondary" style={{ flexGrow: 1 }} onClick={handleSaveQuotationFromCart}>[\s\S]*?<\/button>/, '');
fs.writeFileSync('frontend/src/views/pos/POS.jsx', pos);

// 2. Patch index.css
let css = fs.readFileSync('frontend/src/index.css', 'utf8');
css = css.replace(/min-height: 60vh;/g, 'height: 85vh;\n    min-height: 600px;');
css = css.replace(/\.table-container \{[\s\S]*?\}/, `.table-container {\n    width: 100%;\n    overflow-x: auto;\n    overflow-y: auto;\n    max-height: 60vh;\n    border-radius: var(--radius-md);\n}`);
fs.writeFileSync('frontend/src/index.css', css);

// 3. Patch App.jsx
let app = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// Remove A4 and Thermal toggle buttons and Cashier Thermal Receipt in the print modal header
app = app.replace(/<div className="no-print" style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var\(--glass-border\)', paddingBottom: '12px', alignItems: 'center' }}>[\s\S]*?<\/div>\s*\{\/\* Print Layout Area \*\/\}/, '{/* Print Layout Area */}');

// Change Share Button logic from navigator.share text to PDF
app = app.replace(/if \(navigator\.share\) \{[\s\S]*?navigator\.clipboard\.writeText\(shareText\);\n\s*\}/g, `
    import('html2pdf.js').then(html2pdf => {
        const element = document.getElementById('invoicePrintArea') || document.getElementById('quotationPrintArea');
        if (element) {
            html2pdf.default().from(element).outputPdf('blob').then(pdfBlob => {
                const file = new File([pdfBlob], 'document.pdf', { type: 'application/pdf' });
                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    navigator.share({ files: [file], title: 'Document', text: shareText });
                } else {
                    const url = URL.createObjectURL(pdfBlob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'document.pdf';
                    a.click();
                }
            });
        } else {
            if (navigator.share) navigator.share({ text: shareText });
            else navigator.clipboard.writeText(shareText);
        }
    });
`);

fs.writeFileSync('frontend/src/App.jsx', app);

console.log('Patched POS.jsx, index.css, and App.jsx');
