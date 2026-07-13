import re

with open('frontend/src/App.old.jsx', 'r', encoding='utf-8') as f:
    old_content = f.read()

# Extract from {/* General Settings Card */} to just before {/* ZATCA Connection Settings Card */}
start_marker = "{/* General Settings Card */}"
end_marker = "{/* ZATCA Connection Settings Card */}"

start_idx = old_content.find(start_marker)
end_idx = old_content.find(end_marker, start_idx)

if start_idx != -1 and end_idx != -1:
    missing_cards = old_content[start_idx:end_idx]
    
    with open('frontend/src/views/settings/Settings.jsx', 'r', encoding='utf-8') as f:
        settings_content = f.read()
    
    # We find where to insert it in Settings.jsx. 
    # Settings.jsx currently has `{/* General Settings Card */}` but it's followed by nothing, or maybe it is followed by the Email/SMTP card.
    # Let's replace the existing `{/* General Settings Card */}` in Settings.jsx with our missing_cards
    
    # Wait, the current Settings.jsx has:
    # {* General Settings Card *}
    # <div className="glass-card">
    # <h3 style={{ marginBottom: '20px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
    
    # Let's just insert missing_cards right after `gap: '24px' }}>\n`
    
    insert_marker = "gap: '24px' }}>"
    insert_idx = settings_content.find(insert_marker)
    if insert_idx != -1:
        insert_idx += len(insert_marker)
        
        # Remove any existing dangling {/* General Settings Card */}
        new_content = settings_content[:insert_idx] + "\n" + missing_cards + settings_content[insert_idx:]
        new_content = new_content.replace("{/* General Settings Card */}\n                        \n\n                    <div className=\"glass-card\">", "<div className=\"glass-card\">")
        
        # Let's be safer and use regex to replace `{/* General Settings Card */}` that is followed by empty lines
        new_content = re.sub(r'\{\/\* General Settings Card \*\/}[\s]*?<div className="glass-card">[\s]*?<h3.*?ri-mail-send-line', 
                             lambda m: m.group(0).replace("{/* General Settings Card */}", ""), new_content)
                             
        with open('frontend/src/views/settings/Settings.jsx', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Restored missing cards.")
    else:
        print("Could not find insert marker.")
else:
    print("Could not find missing cards in App.old.jsx.")
