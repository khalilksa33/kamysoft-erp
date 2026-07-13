const fs = require('fs');

let css = fs.readFileSync('frontend/src/index.css', 'utf8');

// Patch 1: .main-content
css = css.replace(/\.main-content\s*\{[\s\S]*?grid-row: 1;\s*\}/, `.main-content {
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    grid-column: 1;
    grid-row: 1;
}`);

// Patch 2: .modal-overlay
css = css.replace(/\.modal-overlay\s*\{[\s\S]*?z-index: 100;\s*\}/, `.modal-overlay {
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
}`);

// Patch 3: .modal
css = css.replace(/\.modal\s*\{[\s\S]*?overflow-y: auto;\s*\}/, `.modal {
    background: var(--bg-secondary);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    padding: 32px;
    width: 100%;
    max-width: 800px;
    position: relative;
    height: auto;
    margin: auto;
}`);

fs.writeFileSync('frontend/src/index.css', css);
console.log("Patched index.css with regex");
