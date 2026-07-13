import sys
import re

file_path = 'frontend/src/App.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add state variables
state_vars = """
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailAddress, setEmailAddress] = useState('');
    const [isEmailSending, setIsEmailSending] = useState(false);
"""
if "showEmailModal" not in content:
    idx = content.find('const [showInvoiceModal, setShowInvoiceModal] = useState(false);')
    if idx != -1:
        content = content[:idx] + 'const [showInvoiceModal, setShowInvoiceModal] = useState(false);' + state_vars + content[idx + len('const [showInvoiceModal, setShowInvoiceModal] = useState(false);'):]

# 2. Add handleSendEmail function
handle_send_email = """
    const handleSendEmail = async () => {
        if (!emailAddress) {
            alert(currentLanguage === 'ar' ? 'الرجاء إدخال البريد الإلكتروني' : 'Please enter an email address');
            return;
        }
        setIsEmailSending(true);
        try {
            const invoiceHtml = document.getElementById('invoicePrintArea').outerHTML;
            const res = await fetch(`${getBaseDomain()}/api/send-email`, {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: emailAddress,
                    subject: `Invoice ${activeInvoice.id} from ${settings.businessName}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px;">
                            <h2>Hello,</h2>
                            <p>Please find your invoice details below from <strong>${settings.businessName}</strong>.</p>
                            <hr />
                            ${invoiceHtml}
                            <hr />
                            <p>Thank you for your business!</p>
                        </div>
                    `
                })
            });
            const data = await res.json();
            if (data.success) {
                alert(currentLanguage === 'ar' ? 'تم إرسال البريد الإلكتروني بنجاح!' : 'Email sent successfully!');
                setShowEmailModal(false);
                setEmailAddress('');
            } else {
                alert((currentLanguage === 'ar' ? 'فشل إرسال البريد: ' : 'Failed to send email: ') + (data.error || 'Unknown error'));
            }
        } catch (err) {
            alert((currentLanguage === 'ar' ? 'حدث خطأ أثناء الإرسال: ' : 'Error sending email: ') + err.message);
        } finally {
            setIsEmailSending(false);
        }
    };
"""
if "handleSendEmail" not in content:
    idx = content.find('const handleB2BSubmit = () => {')
    if idx != -1:
        content = content[:idx] + handle_send_email + content[idx:]

# 3. Add Email Button to Invoice Modal Actions
email_button_html = """
                        <button className="btn btn-secondary" onClick={() => setShowEmailModal(true)} style={{ background: '#f59e0b', color: '#fff', borderColor: '#f59e0b' }}>
                            <i className="ri-mail-send-line"></i> {currentLanguage === 'ar' ? 'إرسال بالبريد' : 'Email Invoice'}
                        </button>
"""
if "setShowEmailModal(true)" not in content:
    idx = content.find('<button className="btn btn-primary" onClick={() => window.print()}>')
    if idx != -1:
        content = content[:idx] + email_button_html + content[idx:]

# 4. Add Email prompt inside the Invoice modal
email_prompt_html = """
                        {showEmailModal && (
                            <div style={{ marginTop: '20px', padding: '15px', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                                <h4 style={{ marginBottom: '10px' }}>{currentLanguage === 'ar' ? 'إرسال الفاتورة بالبريد الإلكتروني' : 'Email Invoice'}</h4>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input type="email" className="form-control" placeholder={currentLanguage === 'ar' ? 'البريد الإلكتروني للعميل' : 'Customer Email Address'} value={emailAddress} onChange={e => setEmailAddress(e.target.value)} />
                                    <button className="btn btn-primary" onClick={handleSendEmail} disabled={isEmailSending}>
                                        {isEmailSending ? (currentLanguage === 'ar' ? 'جاري الإرسال...' : 'Sending...') : (currentLanguage === 'ar' ? 'إرسال' : 'Send')}
                                    </button>
                                    <button className="btn btn-secondary" onClick={() => setShowEmailModal(false)}>{translations[currentLanguage].close}</button>
                                </div>
                            </div>
                        )}
"""
if "showEmailModal && (" not in content:
    idx = content.find('</div>\n                </div>\n            )}', content.find('{showInvoiceModal && activeInvoice && ('))
    if idx != -1:
        # inject before the closing div of the modal
        # let's find the closing tag of the modal-actions div. The window.print() is in a div.
        # Actually, let's inject it right after the actions div.
        # Search for translations[currentLanguage].close}</button> inside the modal actions.
        close_btn_idx = content.find('{translations[currentLanguage].close}</button>', content.find('{showInvoiceModal && activeInvoice && ('))
        if close_btn_idx != -1:
            div_close_idx = content.find('</div>', close_btn_idx)
            if div_close_idx != -1:
                content = content[:div_close_idx + 6] + email_prompt_html + content[div_close_idx + 6:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated App.jsx with Email functionality")
