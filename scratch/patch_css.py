import sys

file_path = 'frontend/src/index.css'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_modal = """
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    z-index: 100;
    overflow-y: auto;
    padding: 40px 20px;
}

.modal {
    background: var(--bg-secondary);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    padding: 32px;
    width: 100%;
    max-width: 800px;
    position: relative;
    height: auto;
    min-height: 500px;
    margin: auto;
}
"""

new_modal = """
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    justify-content: flex-end; /* Align right for sliding drawer */
    align-items: stretch; /* Stretch full height */
    overflow: hidden; /* Prevent body scrolling inside overlay */
}

/* Sliding Drawer Design suitable for all sections */
.modal {
    background: var(--bg-primary); 
    border-left: 1px solid var(--glass-border);
    border-radius: 20px 0 0 20px;
    padding: 40px;
    width: 100%;
    max-width: 900px; /* Big enough for complex forms and A4 invoices */
    height: 100vh;
    margin: 0;
    overflow-y: auto;
    animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    position: relative;
    box-shadow: -10px 0 40px rgba(0,0,0,0.15);
}

/* For Arabic RTL layout, slide from left */
[dir="rtl"] .modal-overlay {
    justify-content: flex-start;
}

[dir="rtl"] .modal {
    border-left: none;
    border-right: 1px solid var(--glass-border);
    border-radius: 0 20px 20px 0;
    animation: slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideInRight {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
}

@keyframes slideInLeft {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
}
"""

if old_modal.strip() in content:
    content = content.replace(old_modal.strip(), new_modal.strip())
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced modal CSS with sliding drawer.")
else:
    # Try finding them individually
    print("Could not find the exact old_modal block. Searching loosely...")
