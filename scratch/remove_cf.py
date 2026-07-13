import sys

file_path = 'frontend/src/views/settings/Settings.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '<div className="glass-card">\n                        <h3 style={{ marginBottom: \'20px\', color: \'var(--accent-primary)\', display: \'flex\', alignItems: \'center\', gap: \'8px\' }}>\n                            <i className="ri-cloud-windy-line"></i> {currentLanguage === \'ar\' ? \'إعدادات نفق كلاودفلير (Cloudflare Tunnel)\' : \'Cloudflare Tunnel Settings\'}'

idx = content.find(start_marker)
if idx != -1:
    end_idx = content.find('</div>\n                    </div>\n    );\n};', idx)
    if end_idx != -1:
        new_content = content[:idx] + '    );\n};\n'
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Removed Cloudflare tunnel settings.")
    else:
        print("End marker not found")
else:
    print("Start marker not found")
