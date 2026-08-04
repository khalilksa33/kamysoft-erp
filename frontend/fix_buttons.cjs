const fs = require('fs');
let code = fs.readFileSync('src/LandingPage.jsx', 'utf8');

code = code.replace(
    `<button 
                        className="btn btn-primary glow-button" 
                        onClick={onLaunchApp}
                        style={{ padding: '8px 16px', fontSize: '13px' }}
                    >
                        <i className="ri-rocket-2-line"></i>
                        <span>{t.launchDemo}</span>
                    </button>`,
    `<a 
                        href={\`https://demo.\${baseDomain}\`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary glow-button" 
                        style={{ padding: '8px 16px', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <i className="ri-rocket-2-line"></i>
                        <span>{t.launchDemo}</span>
                    </a>`
);

code = code.replace(
    `<button className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '15px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }} onClick={onLaunchApp}>
                            <i className="ri-play-circle-line" style={{ fontSize: '18px' }}></i>
                            <span>{t.launchDemo}</span>
                        </button>`,
    `<a href={\`https://demo.\${baseDomain}\`} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '15px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="ri-play-circle-line" style={{ fontSize: '18px' }}></i>
                            <span>{t.launchDemo}</span>
                        </a>`
);

fs.writeFileSync('src/LandingPage.jsx', code);
console.log("Success");
