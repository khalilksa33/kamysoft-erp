const fs = require('fs');

let app = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// 1. Remove max-width from B2B Panel
app = app.replace(
    /<div className="glass-card" style=\{\{ padding: '24px', maxWidth: '1000px', margin: '0 auto' \}\}>/g,
    '<div className="glass-card" style={{ padding: "24px", width: "100%", margin: "0 auto" }}>'
);

// 2. Fix Invoice Share
const invoiceShareRegex = /const el = document\.getElementById\('invoicePrintArea'\);\s*if \(navigator\.share && window\.html2pdf && el\) \{.*?(?=\}\s*\}\s*>\s*<i className="ri-share-line">)/s;

const newInvoiceShare = `const el = document.getElementById('invoicePrintArea');
                                                        const h2p = window.html2pdf || (typeof html2pdf !== 'undefined' ? html2pdf : null);
                                                        if (h2p && el) {
                                                            const opt = { margin: 0, filename: \`Invoice_\${activeInvoice.id}.pdf\`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } };
                                                            h2p().set(opt).from(el).output('blob').then(pdfBlob => {
                                                                const file = new File([pdfBlob], \`Invoice_\${activeInvoice.id}.pdf\`, { type: 'application/pdf' });
                                                                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                                                                    navigator.share({ title: \`Invoice INV-\${activeInvoice.id}\`, files: [file] }).catch(()=>{});
                                                                } else {
                                                                    const url = URL.createObjectURL(pdfBlob);
                                                                    const a = document.createElement('a');
                                                                    a.href = url;
                                                                    a.download = \`Invoice_\${activeInvoice.id}.pdf\`;
                                                                    a.click();
                                                                    URL.revokeObjectURL(url);
                                                                }
                                                            });
                                                        } else {
                                                            navigator.clipboard.writeText(shareText);
                                                            alert('Copied to clipboard as fallback!');
                                                        }`;

if (invoiceShareRegex.test(app)) {
    app = app.replace(invoiceShareRegex, newInvoiceShare);
}

// 3. Fix Quotation Share
const quoteShareRegex = /const el = document\.getElementById\('quotationPrintArea'\);\s*if \(navigator\.share && window\.html2pdf && el\) \{.*?(?=\}\s*\}\s*>\s*<i className="ri-share-line">)/s;

const newQuoteShare = `const el = document.getElementById('quotationPrintArea');
                                                        const h2p = window.html2pdf || (typeof html2pdf !== 'undefined' ? html2pdf : null);
                                                        if (h2p && el) {
                                                            const opt = { margin: 0, filename: \`Quotation_\${activeQuotation.id}.pdf\`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } };
                                                            h2p().set(opt).from(el).output('blob').then(pdfBlob => {
                                                                const file = new File([pdfBlob], \`Quotation_\${activeQuotation.id}.pdf\`, { type: 'application/pdf' });
                                                                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                                                                    navigator.share({ title: \`Quotation QT-\${activeQuotation.id}\`, files: [file] }).catch(()=>{});
                                                                } else {
                                                                    const url = URL.createObjectURL(pdfBlob);
                                                                    const a = document.createElement('a');
                                                                    a.href = url;
                                                                    a.download = \`Quotation_\${activeQuotation.id}.pdf\`;
                                                                    a.click();
                                                                    URL.revokeObjectURL(url);
                                                                }
                                                            });
                                                        } else {
                                                            navigator.clipboard.writeText(shareText);
                                                            alert('Copied to clipboard as fallback!');
                                                        }`;

if (quoteShareRegex.test(app)) {
    app = app.replace(quoteShareRegex, newQuoteShare);
}

// Ensure duplicates in memory are wiped out if they already exist
app = app.replace(/const \[invoices, setInvoices\] = useState\(\[\]\);/g, `const [invoices, setInvoices] = useState([]);
    useEffect(() => {
        setInvoices(prev => prev.filter((v,i,a)=>a.findIndex(t=>t.id===v.id)===i));
    }, [invoices.length]);`);

fs.writeFileSync('frontend/src/App.jsx', app);

// 4. Remove Error Logger
let html = fs.readFileSync('frontend/index.html', 'utf8');
html = html.replace(/<script[^>]*src="\/error_logger\.js"[^>]*><\/script>/g, '');
html = html.replace(/<script[^>]*src="\.\/error_logger\.js"[^>]*><\/script>/g, '');
fs.writeFileSync('frontend/index.html', html);

console.log('Patched share buttons, removed error overlay, fixed B2B panel width, and enforced unique invoices.');
