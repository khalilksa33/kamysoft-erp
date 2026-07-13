const fs = require('fs');
let appStr = fs.readFileSync('frontend/src/App.jsx', 'utf8');

// 1. Add settings={settings} to Sidebar
appStr = appStr.replace('<Sidebar ', '<Sidebar settings={settings} ');

// 2. Change the settings routing condition
appStr = appStr.replace("{['settings', 'basicData', 'generalSettings', 'programActivation', 'techSupport'].includes(activeTab) && <Settings {...props} />}", 
`{['settings', 'basicData', 'generalSettings'].includes(activeTab) && <Settings {...props} />}
                    {activeTab === 'programActivation' && (
                        <div className="glass-card" style={{textAlign: 'center', padding: '50px'}}>
                            <h2>{currentLanguage === 'ar' ? 'تفعيل البرنامج' : 'Program Activation'}</h2>
                            <p style={{color: 'var(--text-secondary)', marginTop: '10px'}}>
                                {currentLanguage === 'ar' ? 'يتم تفعيل البرنامج من خلال منصة ساس.' : 'Program activation is managed via the SaaS platform.'}
                            </p>
                        </div>
                    )}
                    {activeTab === 'techSupport' && (
                        <div className="glass-card" style={{textAlign: 'center', padding: '50px'}}>
                            <h2>{currentLanguage === 'ar' ? 'الدعم الفني' : 'Technical Support'}</h2>
                            <p style={{color: 'var(--text-secondary)', marginTop: '10px'}}>
                                {currentLanguage === 'ar' ? 'للتواصل مع الدعم الفني، يرجى إرسال بريد إلكتروني إلى support@kamysoft.com' : 'To contact technical support, please email support@kamysoft.com'}
                            </p>
                        </div>
                    )}`);

fs.writeFileSync('frontend/src/App.jsx', appStr);
console.log('App.jsx patched successfully.');
