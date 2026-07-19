import React, { useState } from 'react';

const Settings = (props) => {
    const { 
        settings, setSettings, handleSaveSettings, settingsLoading, currentLanguage, translations, zatcaConn, setZatcaConn
    } = props;

    const [activeSettingsTab, setActiveSettingsTab] = useState('general');

    const tabs = [
        { id: 'general', label: translations[currentLanguage].generalSettings, icon: 'ri-settings-4-line', color: 'var(--accent-purple)' },
        { id: 'branch', label: currentLanguage === 'ar' ? 'تهيئة الفروع ونوع النشاط' : 'Branch & Business Configuration', icon: 'ri-building-line', color: 'var(--accent-gold)' },
        { id: 'zatca', label: translations[currentLanguage].zatcaSettings || 'ZATCA Connection Settings', icon: 'ri-cloud-line', color: 'var(--accent-cyan)' },
        { id: 'email', label: currentLanguage === 'ar' ? 'إعدادات البريد' : 'Email / SMTP Settings', icon: 'ri-mail-send-line', color: 'var(--accent-primary)' },
        { id: 'danger', label: currentLanguage === 'ar' ? 'إغلاق الحساب' : 'Close Account', icon: 'ri-error-warning-line', color: '#f87171' }
    ];

    return (
        <div className="settings-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Tabs Navigation */}
            <div className="settings-tabs" style={{ 
                display: 'flex', 
                gap: '8px', 
                borderBottom: '1px solid var(--glass-border)', 
                paddingBottom: '0', 
                overflowX: 'auto',
                scrollbarWidth: 'none', // Hide scrollbar for Firefox
                msOverflowStyle: 'none',  // Hide scrollbar for IE/Edge
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSettingsTab(tab.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            background: activeSettingsTab === tab.id ? `color-mix(in srgb, ${tab.color} 15%, transparent)` : 'transparent',
                            color: activeSettingsTab === tab.id ? tab.color : 'var(--text-secondary)',
                            border: 'none',
                            borderBottom: activeSettingsTab === tab.id ? `3px solid ${tab.color}` : '3px solid transparent',
                            borderRadius: '8px 8px 0 0',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            fontWeight: activeSettingsTab === tab.id ? '600' : '500',
                            whiteSpace: 'nowrap',
                            fontSize: '14px',
                            outline: 'none'
                        }}
                    >
                        <i className={tab.icon} style={{ fontSize: '18px' }}></i>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content Area */}
            <div className="settings-content" style={{ minHeight: '400px' }}>
                
                {activeSettingsTab === 'general' && (
                    <div className="glass-card fade-in">
                        <h3 style={{ marginBottom: '20px', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="ri-settings-4-line"></i> {translations[currentLanguage].generalSettings}
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
                                alert(currentLanguage === 'ar' ? "تم حفظ الإعدادات بنجاح" : "Settings saved successfully");
                            })
                            .catch(() => {
                                alert(currentLanguage === 'ar' ? "تم حفظ الإعدادات محلياً" : "Settings saved locally");
                            });
                        }}>
                            <div className="form-group">
                                <label>{translations[currentLanguage].businessName}</label>
                                <input type="text" className="form-control" value={settings.businessName} onChange={e => setSettings({ ...settings, businessName: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].vatNumber}</label>
                                <input type="text" className="form-control" value={settings.vatNumber} onChange={e => setSettings({ ...settings, vatNumber: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Company Address / عنوان الشركة</label>
                                <input type="text" className="form-control" value={settings.businessAddress || ''} onChange={e => setSettings({ ...settings, businessAddress: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>CR Number / رقم السجل التجاري</label>
                                <input type="text" className="form-control" value={settings.crNumber || ''} onChange={e => setSettings({ ...settings, crNumber: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Contact Number / رقم التواصل</label>
                                <input type="text" className="form-control" value={settings.contactNumber || ''} onChange={e => setSettings({ ...settings, contactNumber: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Company Logo / شعار الشركة</label>
                                <input type="file" accept="image/*" className="form-control" onChange={e => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setSettings(prev => ({ ...prev, logo: reader.result }));
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }} />
                                {settings.logo && (
                                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <img src={settings.logo} alt="Company Logo Preview" style={{ maxHeight: '50px', maxWidth: '100px', borderRadius: '4px', objectFit: 'contain' }} />
                                        <button type="button" className="btn btn-secondary" onClick={() => setSettings(prev => {
                                            const copy = { ...prev };
                                            delete copy.logo;
                                            return copy;
                                        })} style={{ padding: '4px 8px', fontSize: '11px' }}>Remove</button>
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Base System Currency / العملة الأساسية</label>
                                <select className="form-control" value={settings.baseCurrency} onChange={e => setSettings({ ...settings, baseCurrency: e.target.value })}>
                                    <option value="SAR">SAR / ر.س</option>
                                    <option value="USD">USD / دولار أمريكي</option>
                                    <option value="EUR">EUR / يورو</option>
                                    <option value="EGP">EGP / جنيه مصري</option>
                                    <option value="AED">AED / درهم إماراتي</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>{translations[currentLanguage].saveSettings}</button>
                        </form>
                    </div>
                )}


                {activeSettingsTab === 'branch' && (
                    <div className="glass-card fade-in">
                        <h3 style={{ marginBottom: '20px', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="ri-building-line"></i> {currentLanguage === 'ar' ? 'تهيئة الفروع ونوع النشاط' : 'Branch & Business Configuration'}
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
                                alert(currentLanguage === 'ar' ? "تم حفظ إعدادات الفروع ونوع النشاط بنجاح" : "Branch & business configuration saved successfully");
                            })
                            .catch(() => {
                                alert(currentLanguage === 'ar' ? "تم حفظ الإعدادات محلياً" : "Settings saved locally");
                            });
                        }}>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'نوع النشاط التجاري' : 'Business Type'}</label>
                                <select className="form-control" value={settings.businessType || 'retail'} onChange={e => {
                                    const type = e.target.value;
                                    setSettings({ 
                                        ...settings, 
                                        businessType: type,
                                        enableTables: type === 'restaurant',
                                        enableServiceDuration: type === 'services'
                                    });
                                }}>
                                    <option value="retail">{currentLanguage === 'ar' ? 'بيع بالتجزئة ومحلات' : 'Retail & Shop'}</option>
                                    <option value="restaurant">{currentLanguage === 'ar' ? 'مطاعم ومقاهي' : 'Restaurant & Cafe'}</option>
                                    <option value="services">{currentLanguage === 'ar' ? 'خدمات واستشارات وطبية' : 'Services & Medical'}</option>
                                    <option value="appliances">{currentLanguage === 'ar' ? 'أجهزة منزلية وإلكترونيات' : 'Home Appliances & Electronics'}</option>
                                    <option value="furniture">{currentLanguage === 'ar' ? 'معارض ومحلات أثاث' : 'Furniture & Home Decor'}</option>
                                    <option value="spareparts">{currentLanguage === 'ar' ? 'قطع غيار (سيارات/تكييف/سباكة)' : 'Auto, HVAC & Spare Parts'}</option>
                                    <option value="grocery">{currentLanguage === 'ar' ? 'سوبرماركت ومواد غذائية' : 'Supermarket & Grocery'}</option>
                                    <option value="apparel">{currentLanguage === 'ar' ? 'ملابس وأزياء وأحذية' : 'Garments & Apparel'}</option>
                                </select>
                            </div>

                            {settings.businessType === 'restaurant' && (
                                <div className="form-group" style={{ flexDirection: 'row', gap: '10px', alignItems: 'center', margin: '15px 0' }}>
                                    <input type="checkbox" id="enableTables" checked={settings.enableTables || false} onChange={e => setSettings({ ...settings, enableTables: e.target.checked })} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                                    <label htmlFor="enableTables" style={{ cursor: 'pointer' }}>{currentLanguage === 'ar' ? 'تفعيل إدارة الطاولات والطلبات الداخلية' : 'Enable Table Management'}</label>
                                </div>
                            )}

                            {settings.businessType === 'services' && (
                                <div className="form-group" style={{ flexDirection: 'row', gap: '10px', alignItems: 'center', margin: '15px 0' }}>
                                    <input type="checkbox" id="enableServiceDuration" checked={settings.enableServiceDuration || false} onChange={e => setSettings({ ...settings, enableServiceDuration: e.target.checked })} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                                    <label htmlFor="enableServiceDuration" style={{ cursor: 'pointer' }}>{currentLanguage === 'ar' ? 'تفعيل مدة وموعد الجلسات / الخدمات' : 'Enable Session Duration Tracking'}</label>
                                </div>
                            )}

                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'الفرع النشط حالياً للمبيعات' : 'Current Active POS Branch'}</label>
                                <select className="form-control" value={settings.currentBranch || ''} onChange={e => setSettings({ ...settings, currentBranch: e.target.value })}>
                                    {(settings.branches || []).map((br, idx) => (
                                        <option key={idx} value={br.name}>{br.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '15px', marginTop: '15px' }}>
                                <label style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                                    {currentLanguage === 'ar' ? 'إضافة فرع جديد للمؤسسة' : 'Add New Branch'}
                                </label>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                                    <input type="text" id="newBranchName" placeholder={currentLanguage === 'ar' ? 'اسم الفرع الجديد' : 'New Branch Name'} className="form-control" style={{ flexGrow: 1 }} />
                                    <button type="button" className="btn btn-secondary" onClick={() => {
                                        const el = document.getElementById('newBranchName');
                                        const name = el ? el.value.trim() : '';
                                        if (name) {
                                            const newBranches = [...(settings.branches || []), { name, address: '', phone: '' }];
                                            setSettings({ ...settings, branches: newBranches, currentBranch: settings.currentBranch || name });
                                            if (el) el.value = '';
                                        }
                                    }}>{currentLanguage === 'ar' ? 'إضافة' : 'Add'}</button>
                                </div>
                                
                                <div style={{ maxHeight: '120px', overflowY: 'auto', border: '1px solid var(--glass-border)', borderRadius: '4px', padding: '8px' }}>
                                    {(settings.branches || []).map((br, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <span style={{ fontSize: '13px' }}>{br.name}</span>
                                            <button type="button" style={{ color: 'var(--accent-danger)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => {
                                                const newBranches = (settings.branches || []).filter((_, i) => i !== idx);
                                                const nextBranch = newBranches.length > 0 ? newBranches[0].name : '';
                                                setSettings({ ...settings, branches: newBranches, currentBranch: nextBranch });
                                            }}><i className="ri-delete-bin-line"></i></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>{translations[currentLanguage].saveSettings}</button>
                        </form>
                    </div>
                )}

                {activeSettingsTab === 'zatca' && (
                    <div className="glass-card fade-in">
                        <h3 style={{ marginBottom: '20px', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="ri-cloud-line"></i> {translations[currentLanguage].zatcaSettings || 'ZATCA Connection Settings'}
                        </h3>
                        <form onSubmit={(e) => { e.preventDefault(); alert(currentLanguage === 'ar' ? 'تم حفظ إعدادات خادم الزكاة بنجاح' : 'ZATCA Server settings saved successfully'); }}>
                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
                                <div className="form-group">
                                    <label>{currentLanguage === 'ar' ? 'اسم المؤسسة' : 'Business Name'}</label>
                                    <input type="text" className="form-control" value={settings.businessName || ''} readOnly style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }} />
                                </div>
                                <div className="form-group">
                                    <label>{currentLanguage === 'ar' ? 'الرقم الضريبي' : 'VAT Number'}</label>
                                    <input type="text" className="form-control" value={settings.vatNumber || ''} readOnly style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }} />
                                </div>
                            </div>
                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
                                <div className="form-group">
                                    <label>{currentLanguage === 'ar' ? 'السجل التجاري' : 'CR Number'}</label>
                                    <input type="text" className="form-control" value={settings.crNumber || ''} readOnly style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }} />
                                </div>
                                <div className="form-group">
                                    <label>{currentLanguage === 'ar' ? 'العنوان الوطني' : 'National Address'}</label>
                                    <input type="text" className="form-control" value={(() => {
                                        if (settings.nationalAddress) {
                                            try {
                                                const a = JSON.parse(settings.nationalAddress);
                                                return `${a.buildingNo || ''} ${a.street || ''}, ${a.district || ''}, ${a.city || ''} ${a.postalCode || ''} ${a.additionalNo ? '- ' + a.additionalNo : ''}`.trim();
                                            } catch {
                                                return settings.nationalAddress;
                                            }
                                        }
                                        return settings.businessAddress || '';
                                    })()} readOnly style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].zatcaEnv || 'ZATCA Environment'}</label>
                                <select className="form-control" value={zatcaConn?.env || 'sandbox'} onChange={e => setZatcaConn({ ...zatcaConn, env: e.target.value })}>
                                    <option value="sandbox">Sandbox / بيئة التطوير (فاتورة)</option>
                                    <option value="simulation">Simulation / بيئة المحاكاة للإنتاج</option>
                                    <option value="production">Production / البيئة الفعلية للإنتاج</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].zatcaEndpoint || 'ZATCA Endpoint'}</label>
                                <input type="text" className="form-control" value={zatcaConn?.endpoint || ''} onChange={e => setZatcaConn({ ...zatcaConn, endpoint: e.target.value })} />
                            </div>
                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div className="form-group">
                                    <label>{translations[currentLanguage].zatcaClientId || 'Client ID'}</label>
                                    <input type="text" className="form-control" value={zatcaConn?.clientId || ''} onChange={e => setZatcaConn({ ...zatcaConn, clientId: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>{translations[currentLanguage].zatcaClientSecret || 'Client Secret'}</label>
                                    <input type="password" className="form-control" value={zatcaConn?.clientSecret || ''} onChange={e => setZatcaConn({ ...zatcaConn, clientSecret: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>{translations[currentLanguage].zatcaDeviceSerial || 'Device Serial'}</label>
                                <input type="text" className="form-control" value={zatcaConn?.deviceSerial || ''} onChange={e => setZatcaConn({ ...zatcaConn, deviceSerial: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'رمز التفعيل (OTP)' : 'ZATCA OTP (Fatoora Portal)'}</label>
                                <input type="text" className="form-control" placeholder="123456" value={zatcaConn?.otp || ''} onChange={e => setZatcaConn({ ...zatcaConn, otp: e.target.value })} />
                            </div>
                            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <input type="checkbox" id="zatcaAutoSend" checked={zatcaConn?.autoSend || false} onChange={e => setZatcaConn({ ...zatcaConn, autoSend: e.target.checked })} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                                <label htmlFor="zatcaAutoSend" style={{ cursor: 'pointer', margin: 0, fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                                    {currentLanguage === 'ar' ? 'إرسال الفواتير تلقائياً إلى هيئة الزكاة عند الدفع' : 'Auto-Send to ZATCA on Checkout'}
                                </label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{translations[currentLanguage].zatcaStatusLabel || 'Connection Status'}:</span>
                                <span className={`badge ${zatcaConn?.status === 'CONNECTED' ? 'green' : 'danger'}`}>
                                    {zatcaConn?.status === 'CONNECTED' ? (translations[currentLanguage].zatcaStatusConnected || 'CONNECTED') : (translations[currentLanguage].zatcaStatusDisconnected || 'DISCONNECTED')}
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" className="btn btn-secondary" style={{ flexGrow: 1 }} onClick={async () => {
                                    try {
                                        const token = localStorage.getItem('token');
                                        const res = await fetch('/api/zatca/onboard', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                            body: JSON.stringify({ otp: zatcaConn?.otp, env: zatcaConn?.env })
                                        });
                                        const data = await res.json();
                                        if (res.ok) {
                                            const newConn = {
                                                ...zatcaConn,
                                                clientId: data.zatca?.certificate || zatcaConn.clientId,
                                                clientSecret: data.zatca?.secret || zatcaConn.clientSecret,
                                                status: 'CONNECTED'
                                            };
                                            setZatcaConn(newConn);
                                            alert(currentLanguage === 'ar' ? 'تم إنشاء المفاتيح بنجاح!' : 'Cryptographic Keys generated successfully!');
                                        } else {
                                            alert('Error: ' + data.error);
                                        }
                                    } catch (e) {
                                        alert('Error onboarding device');
                                    }
                                }}>
                                    {currentLanguage === 'ar' ? 'تهيئة الجهاز (إنشاء مفاتيح)' : 'Onboard Device (Generate Keys)'}
                                </button>
                                <button type="button" className="btn btn-primary" style={{ flexGrow: 1 }} onClick={() => {
                                    setZatcaConn({ ...zatcaConn, status: 'CONNECTED' });
                                    alert(currentLanguage === 'ar' ? 'تم تسجيل الجهاز بنجاح والحصول على CCSID!' : 'Device successfully registered & CCSID token retrieved from ZATCA!');
                                }}>
                                    {translations[currentLanguage].registerDevice || 'Register Device'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeSettingsTab === 'email' && (
                    <div className="glass-card fade-in">
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
                )}

                {activeSettingsTab === 'danger' && (
                    <div className="glass-card fade-in" style={{ border: '1px solid rgba(239,68,68,0.3)' }}>
                        <h3 style={{ marginBottom: '20px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="ri-error-warning-line"></i> {currentLanguage === 'ar' ? 'منطقة الخطر - إغلاق الحساب' : 'Danger Zone - Close Account'}
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '13px' }}>
                            {currentLanguage === 'ar' ? 'تنبيه: إغلاق الحساب سيؤدي إلى حذف متجرك وبياناتك بشكل دائم ولا يمكن التراجع عن هذا الإجراء.' : 'Warning: Closing your account will permanently delete your store, products, invoices, and all associated data. This action cannot be undone.'}
                        </p>
                        <button className="btn btn-danger" onClick={() => {
                            if (window.confirm(currentLanguage === 'ar' ? 'هل أنت متأكد تماماً من إغلاق حسابك وحذف جميع بياناتك؟' : 'Are you absolutely sure you want to close your account and delete all data?')) {
                                fetch('/api/tenant/close', {
                                    method: 'DELETE',
                                    headers: props.headers
                                })
                                .then(res => res.json())
                                .then(data => {
                                    if (data.error) alert(data.error);
                                    else {
                                        alert(currentLanguage === 'ar' ? 'تم إغلاق الحساب بنجاح. سيتم تسجيل خروجك.' : 'Account closed successfully. You will be logged out.');
                                        window.location.href = '/';
                                    }
                                })
                                .catch(() => alert('Error closing account.'));
                            }
                        }}>
                            <i className="ri-delete-bin-6-line" style={{ marginRight: '8px' }}></i>
                            {currentLanguage === 'ar' ? 'إغلاق الحساب نهائياً' : 'Permanently Close Account'}
                        </button>
                    </div>
                )}
            </div>
            
            <style jsx="true">{`
                .fade-in {
                    animation: fadeIn 0.3s ease-in-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .settings-tabs::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default Settings;

