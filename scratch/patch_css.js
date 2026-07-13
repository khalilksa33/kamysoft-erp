const fs = require('fs');

let css = fs.readFileSync('frontend/src/index.css', 'utf8');

// Patch 1: .main-content
const mainContentOld = `.main-content {
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    overflow-y: auto;
    max-height: 100vh;
    grid-column: 1;
    grid-row: 1;
}`;
const mainContentNew = `.main-content {
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    grid-column: 1;
    grid-row: 1;
}`;
if (css.includes(mainContentOld)) {
    css = css.replace(mainContentOld, mainContentNew);
    console.log("Patched .main-content");
}

// Patch 2: .modal-overlay
const modalOverlayOld = `.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
}`;
const modalOverlayNew = `.modal-overlay {
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
}`;
if (css.includes(modalOverlayOld)) {
    css = css.replace(modalOverlayOld, modalOverlayNew);
    console.log("Patched .modal-overlay");
}

// Patch 3: .modal
const modalOld = `.modal {
    background: var(--bg-secondary);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    padding: 32px;
    width: 90%;
    max-width: 800px;
    position: relative;
    max-height: 95vh;
    height: 85vh;
    min-height: 600px;
    overflow-y: auto;
}`;
const modalNew = `.modal {
    background: var(--bg-secondary);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    padding: 32px;
    width: 100%;
    max-width: 800px;
    position: relative;
    height: auto;
    margin: auto;
}`;
if (css.includes(modalOld)) {
    css = css.replace(modalOld, modalNew);
    console.log("Patched .modal");
}

fs.writeFileSync('frontend/src/index.css', css);
console.log("Done");
