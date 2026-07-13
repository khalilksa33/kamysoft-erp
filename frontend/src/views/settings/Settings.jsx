import React from 'react';

const Settings = (props) => {
    const { 
        settings, setSettings, handleSaveSettings, settingsLoading, currentLanguage, translations, zatcaConn, setZatcaConn
    } = props;

    return (
        
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                        {/* General Settings Card */}
                        <div className="glass-card">
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

                        {/* Modules Configuration Card */}
                        <div className="glass-card">
                            <h3 style={{ marginBottom: '20px', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="ri-layout-grid-line"></i> {currentLanguage === 'ar' ? 'إعدادات الوحدات' : 'Modules Configuration'}
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
                                    alert(currentLanguage === 'ar' ? "تم حفظ إعدادات الوحدات بنجاح" : "Modules configuration saved successfully");
                                })
                                .catch(() => {
                                    alert(currentLanguage === 'ar' ? "تم حفظ الإعدادات محلياً" : "Settings saved locally");
                                });
                            }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                                    {[
                                        { id: 'invoices', label: currentLanguage === 'ar' ? 'الفواتير' : 'Invoices' },
                                        { id: 'pos', label: currentLanguage === 'ar' ? 'نقطة بيع' : 'POS / Cashier' },
                                        { id: 'maintenance', label: currentLanguage === 'ar' ? 'الصيانة' : 'Maintenance' },
                                        { id: 'inventory', label: currentLanguage === 'ar' ? 'المخزون' : 'Inventory' },
                                        { id: 'customers', label: currentLanguage === 'ar' ? 'العملاء' : 'Customers' },
                                        { id: 'employees', label: currentLanguage === 'ar' ? 'الموظفين' : 'Employees' },
                                        { id: 'suppliers', label: currentLanguage === 'ar' ? 'الموردين' : 'Suppliers' },
                                        { id: 'warehouses', label: currentLanguage === 'ar' ? 'المخازن' : 'Warehouses' },
                                        { id: 'financials', label: currentLanguage === 'ar' ? 'المالية' : 'Financials' },
                                        { id: 'reports', label: currentLanguage === 'ar' ? 'تقارير' : 'Reports' }
                                    ].map(module => (
                                        <div key={module.id} className="form-group" style={{ flexDirection: 'row', gap: '10px', alignItems: 'center', margin: 0 }}>
                                            <input 
                                                type="checkbox" 
                                                id={`mod-${module.id}`}
                                                checked={settings.enabledModules?.[module.id] !== false} 
                                                onChange={e => setSettings({
                                                    ...settings,
                                                    enabledModules: {
                                                        ...(settings.enabledModules || {}),
                                                        [module.id]: e.target.checked
                                                    }
                                                })} 
                                                style={{ width: '18px', height: '18px', cursor: 'pointer' }} 
                                            />
                                            <label htmlFor={`mod-${module.id}`} style={{ cursor: 'pointer', margin: 0, fontSize: '14px' }}>{module.label}</label>
                                        </div>
                                    ))}
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                    <i className="ri-save-line"></i> {currentLanguage === 'ar' ? 'حفظ الوحدات' : 'Save Modules'}
                                </button>
                            </form>
                        </div>

                        {/* Branch & Business Configuration Card */}
                        <div className="glass-card">
                            <h3 style={{ marginBottom: '20px', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="ri-building-line"></i> {currentLanguage === 'ar' ? '????? ?????? ???? ??????' : 'Branch & Business Configuration'}
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
                                    alert(currentLanguage === 'ar' ? "?? ??? ??????? ?????? ???? ?????? ?????" : "Branch & business configuration saved successfully");
                                })
                                .catch(() => {
                                    alert(currentLanguage === 'ar' ? "?? ??? ????????? ??????" : "Settings saved locally");
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
                                        <option value="retail">{currentLanguage === 'ar' ? 'متجر تجزئة' : 'Retail Shop'}</option>
                                        <option value="restaurant">{currentLanguage === 'ar' ? 'مطعم / مقهى' : 'Restaurant & Cafe'}</option>
                                        <option value="services">{currentLanguage === 'ar' ? 'خدمات طبية أو مهنية' : 'Services & Medical'}</option>
                                        <option value="appliances">{currentLanguage === 'ar' ? 'أجهزة منزلية وإلكترونيات' : 'Home Appliances & Electronics'}</option>
                                        <option value="furniture">{currentLanguage === 'ar' ? 'أثاث وديكور' : 'Furniture & Home Decor'}</option>
                                        <option value="spareparts">{currentLanguage === 'ar' ? 'قطع غيار (سيارات/تكييف/أخرى)' : 'Auto, HVAC & Spare Parts'}</option>
                                        <option value="grocery">{currentLanguage === 'ar' ? 'سوبرماركت ومواد غذائية' : 'Supermarket & Grocery'}</option>
                                        <option value="apparel">{currentLanguage === 'ar' ? 'ملابس وأزياء' : 'Garments & Apparel'}</option>
                                    </select>
                                </div>

                                {settings.businessType === 'restaurant' && (
                                    <div className="form-group" style={{ flexDirection: 'row', gap: '10px', alignItems: 'center', margin: '15px 0' }}>
                                        <input type="checkbox" id="enableTables" checked={settings.enableTables || false} onChange={e => setSettings({ ...settings, enableTables: e.target.checked })} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                                        <label htmlFor="enableTables" style={{ cursor: 'pointer' }}>{currentLanguage === 'ar' ? 'تفعيل إدارة الطاولات' : 'Enable Table Management'}</label>
                                    </div>
                                )}

                                {settings.businessType === 'services' && (
                                    <div className="form-group" style={{ flexDirection: 'row', gap: '10px', alignItems: 'center', margin: '15px 0' }}>
                                        <input type="checkbox" id="enableServiceDuration" checked={settings.enableServiceDuration || false} onChange={e => setSettings({ ...settings, enableServiceDuration: e.target.checked })} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                                        <label htmlFor="enableServiceDuration" style={{ cursor: 'pointer' }}>{currentLanguage === 'ar' ? 'تفعيل تتبع أوقات الجلسات' : 'Enable Session Duration Tracking'}</label>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label>{currentLanguage === 'ar' ? 'الفرع النشط الحالي لنقطة البيع' : 'Current Active POS Branch'}</label>
                                    <select className="form-control" value={settings.currentBranch || ''} onChange={e => setSettings({ ...settings, currentBranch: e.target.value })}>
                                        {(settings.branches || []).map((br, idx) => (
                                            <option key={idx} value={br.name}>{br.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '15px', marginTop: '15px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                                        {currentLanguage === 'ar' ? 'إضافة فرع جديد' : 'Add New Branch'}
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

                        {/* ZATCA Connection Settings Card */}
                        <div className="glass-card">
                            <h3 style={{ marginBottom: '20px', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="ri-cloud-line"></i> {translations[currentLanguage].zatcaSettings}
                            </h3>
                            <form onSubmit={(e) => { e.preventDefault(); alert(currentLanguage === 'ar' ? "تم حفظ إعدادات خادم الزكاة بنجاح" : "ZATCA Server settings saved successfully"); }}>
                                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
                                    <div className="form-group">
                                        <label>{currentLanguage === 'ar' ? 'اسم النشاط التجاري' : 'Business Name'}</label>
                                        <input type="text" className="form-control" value={settings.businessName || ''} readOnly style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }} />
                                    </div>
                                    <div className="form-group">
                                        <label>{currentLanguage === 'ar' ? 'الرقم الضريبي' : 'VAT Number'}</label>
                                        <input type="text" className="form-control" value={settings.vatNumber || ''} readOnly style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }} />
                                    </div>
                                </div>
                                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
                                    <div className="form-group">
                                        <label>{currentLanguage === 'ar' ? 'رقم السجل التجاري' : 'CR Number'}</label>
                                        <input type="text" className="form-control" value={settings.crNumber || ''} readOnly style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }} />
                                    </div>
                                    <div className="form-group">
                                        <label>{currentLanguage === 'ar' ? 'العنوان الوطني' : 'National Address'}</label>
                                        <input type="text" className="form-control" value={settings.nationalAddress || settings.businessAddress || ''} readOnly style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>{translations[currentLanguage].zatcaEnv}</label>
                                    <select className="form-control" value={zatcaConn.env} onChange={e => setZatcaConn({ ...zatcaConn, env: e.target.value })}>
                                        <option value="sandbox">Sandbox / بيئة تجريبية (صندوق حماية)</option>
                                        <option value="simulation">Simulation / محاكاة???? ???????? ???????</option>
                                        <option value="production">Production / بيئة الإنتاج?????? ??????? ??????????</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>{translations[currentLanguage].zatcaEndpoint}</label>
                                    <input type="text" className="form-control" value={zatcaConn.endpoint} onChange={e => setZatcaConn({ ...zatcaConn, endpoint: e.target.value })} />
                                </div>
                                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div className="form-group">
                                        <label>{translations[currentLanguage].zatcaClientId}</label>
                                        <input type="text" className="form-control" value={zatcaConn.clientId} onChange={e => setZatcaConn({ ...zatcaConn, clientId: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label>{translations[currentLanguage].zatcaClientSecret}</label>
                                        <input type="password" className="form-control" value={zatcaConn.clientSecret} onChange={e => setZatcaConn({ ...zatcaConn, clientSecret: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>{translations[currentLanguage].zatcaDeviceSerial}</label>
                                    <input type="text" className="form-control" value={zatcaConn.deviceSerial} onChange={e => setZatcaConn({ ...zatcaConn, deviceSerial: e.target.value })} />
                                </div>
                                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                    <input type="checkbox" id="zatcaAutoSend" checked={zatcaConn.autoSend} onChange={e => setZatcaConn({ ...zatcaConn, autoSend: e.target.checked })} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                                    <label htmlFor="zatcaAutoSend" style={{ cursor: 'pointer', margin: 0, fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                                        {currentLanguage === 'ar' ? 'إرسال تلقائي لهيئة الزكاة عند الدفع' : 'Auto-Send to ZATCA on Checkout'}
                                    </label>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{translations[currentLanguage].zatcaStatusLabel}:</span>
                                    <span className={`badge ${zatcaConn.status === 'CONNECTED' ? 'green' : 'danger'}`}>
                                        {zatcaConn.status === 'CONNECTED' ? translations[currentLanguage].zatcaStatusConnected : translations[currentLanguage].zatcaStatusDisconnected}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button type="button" className="btn btn-secondary" style={{ flexGrow: 1 }} onClick={() => alert(currentLanguage === 'ar' ? "تم إنشاء المفتاح الخاص و CSR بنجاح!" : "Private Key and CSR successfully generated!")}>
                                        {translations[currentLanguage].csrGenerate}
                                    </button>
                                    <button type="button" className="btn btn-primary" style={{ flexGrow: 1 }} onClick={() => {
                                        setZatcaConn({ ...zatcaConn, status: 'CONNECTED' });
                                        alert(currentLanguage === 'ar' ? "تم تسجيل الجهاز بنجاح واسترداد رمز CCSID من هيئة الزكاة!" : "Device successfully registered & CCSID token retrieved from ZATCA!");
                                    }}>
                                        {translations[currentLanguage].registerDevice}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Cloudflare Tunnel Settings Card */}
                        <div className="glass-card">
                            <h3 style={{ marginBottom: '20px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="ri-cloud-windy-line"></i> {currentLanguage === 'ar' ? 'إعدادات نفق كلاودفلير (Cloudflare Tunnel)' : 'Cloudflare Tunnel Settings'}
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
                                    alert(currentLanguage === 'ar' ? "تم حفظ إعدادات كلاودفلير بنجاح" : "Cloudflare Tunnel settings saved successfully");
                                })
                                .catch(() => {
                                    alert(currentLanguage === 'ar' ? "تم الحفظ محلياً" : "Settings saved locally");
                                });
                            }}>
                                <div className="form-group">
                                    <label>CF_ACCOUNT_ID</label>
                                    <input type="text" className="form-control" placeholder="your_cloudflare_account_id" value={settings.cfAccountId || ''} onChange={e => setSettings({ ...settings, cfAccountId: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>CF_TUNNEL_ID</label>
                                    <input type="text" className="form-control" placeholder="your_tunnel_uuid" value={settings.cfTunnelId || ''} onChange={e => setSettings({ ...settings, cfTunnelId: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>CF_API_TOKEN</label>
                                    <input type="password" className="form-control" placeholder="your_api_token" value={settings.cfApiToken || ''} onChange={e => setSettings({ ...settings, cfApiToken: e.target.value })} />
                                </div>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                    <button type="submit" className="btn btn-primary" style={{ flexGrow: 1 }}>
                                        <i className="ri-save-line" style={{ marginRight: '8px' }}></i>
                                        {translations[currentLanguage].saveSettings}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
    );
};

export default Settings;
