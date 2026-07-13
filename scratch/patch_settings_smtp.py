import sys

file_path = 'frontend/src/views/settings/Settings.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# We'll insert the SMTP settings card right after the ZATCA integration card.
zatca_end_marker = "ZATCA Server settings saved successfully\")\n                            });\n                        }}>\n                            <div className=\"form-row\" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>"

smtp_card = """
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '20px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="ri-mail-send-line"></i> {currentLanguage === 'ar' ? 'إعدادات البريد الإلكتروني (SMTP / SendGrid)' : 'Email / SMTP Settings'}
                        </h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            fetch('/api/settings', {
                                method: 'POST',
                                headers: props.headers,
                                body: JSON.stringify(settings)
                            })
                            .then(res => res.json())
                            .then(data => {
                                setSettings(data);
                                alert(currentLanguage === 'ar' ? 'تم حفظ إعدادات البريد بنجاح' : 'Email settings saved successfully');
                            })
                            .catch(() => {
                                alert(currentLanguage === 'ar' ? 'تم الحفظ محلياً' : 'Settings saved locally');
                            });
                        }}>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'مزود الخدمة' : 'Provider'}</label>
                                <select className="form-control" value={settings?.smtp?.provider || 'smtp'} onChange={e => setSettings({...settings, smtp: {...(settings.smtp || {}), provider: e.target.value}})}>
                                    <option value="smtp">Custom SMTP</option>
                                    <option value="sendgrid">SendGrid</option>
                                </select>
                            </div>
                            
                            {(!settings?.smtp?.provider || settings.smtp.provider === 'smtp') && (
                                <>
                                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '12px', marginBottom: '15px' }}>
                                        <div className="form-group">
                                            <label>SMTP Host</label>
                                            <input type="text" className="form-control" placeholder="smtp.gmail.com" value={settings?.smtp?.host || ''} onChange={e => setSettings({...settings, smtp: {...(settings.smtp || {}), host: e.target.value}})} />
                                        </div>
                                        <div className="form-group">
                                            <label>Port</label>
                                            <input type="number" className="form-control" placeholder="587" value={settings?.smtp?.port || ''} onChange={e => setSettings({...settings, smtp: {...(settings.smtp || {}), port: parseInt(e.target.value)}})} />
                                        </div>
                                    </div>
                                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
                                        <div className="form-group">
                                            <label>{currentLanguage === 'ar' ? 'اسم المستخدم' : 'Username'}</label>
                                            <input type="text" className="form-control" placeholder="user@example.com" value={settings?.smtp?.user || ''} onChange={e => setSettings({...settings, smtp: {...(settings.smtp || {}), user: e.target.value}})} />
                                        </div>
                                        <div className="form-group">
                                            <label>{currentLanguage === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                                            <input type="password" className="form-control" placeholder="••••••••" value={settings?.smtp?.password || ''} onChange={e => setSettings({...settings, smtp: {...(settings.smtp || {}), password: e.target.value}})} />
                                        </div>
                                    </div>
                                </>
                            )}
                            
                            {settings?.smtp?.provider === 'sendgrid' && (
                                <div className="form-group">
                                    <label>SendGrid API Key</label>
                                    <input type="password" className="form-control" placeholder="SG.xxxxxxxxxxxxxx" value={settings?.smtp?.sendgridApiKey || ''} onChange={e => setSettings({...settings, smtp: {...(settings.smtp || {}), sendgridApiKey: e.target.value}})} />
                                </div>
                            )}

                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'بريد المرسل' : 'From Email Address'}</label>
                                <input type="email" className="form-control" placeholder="noreply@yourdomain.com" value={settings?.smtp?.fromEmail || ''} onChange={e => setSettings({...settings, smtp: {...(settings.smtp || {}), fromEmail: e.target.value}})} />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                <button type="submit" className="btn btn-primary" style={{ flexGrow: 1 }}>
                                    <i className="ri-save-line" style={{ marginRight: '8px' }}></i>
                                    {translations[currentLanguage].saveSettings}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => {
                                    const emailToTest = prompt(currentLanguage === 'ar' ? 'أدخل بريداً لاختبار الإرسال:' : 'Enter email to send test to:');
                                    if(emailToTest) {
                                        fetch('/api/send-email', {
                                            method: 'POST',
                                            headers: props.headers,
                                            body: JSON.stringify({
                                                to: emailToTest,
                                                subject: 'Test Email from 26i ERP',
                                                html: '<h3>Test Successful</h3><p>Your SMTP/Email settings are correctly configured.</p>'
                                            })
                                        })
                                        .then(res => res.json())
                                        .then(data => {
                                            if (data.error) alert('Error: ' + data.error);
                                            else alert('Test email sent successfully!');
                                        })
                                        .catch(err => alert('Failed to send: ' + err.message));
                                    }
                                }}>
                                    <i className="ri-mail-check-line" style={{ marginRight: '8px' }}></i>
                                    {currentLanguage === 'ar' ? 'اختبار الإرسال' : 'Send Test'}
                                </button>
                            </div>
                        </form>
                    </div>
"""

# Let's use a simpler marker: before the Cloudflare Tunnel Settings block.
cf_marker = "Cloudflare Tunnel Settings"
idx = content.find(cf_marker)
if idx != -1:
    # Find the start of the glass-card
    card_start = content.rfind('<div className="glass-card">', 0, idx)
    if card_start != -1:
        new_content = content[:card_start] + smtp_card + content[card_start:]
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Patched Settings.jsx with SMTP card.")
    else:
        print("Could not find glass-card start.")
else:
    print("Could not find Cloudflare marker.")

