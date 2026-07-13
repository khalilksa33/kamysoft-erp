const fs = require('fs');

let app = fs.readFileSync('frontend/src/App.jsx', 'utf8');

const regex = /\{\/\*\s*TAB:\s*INVOICES\s*&\s*REPRINT\s*\(SALES\s*MANAGEMENT\)\s*\*\/\}\s*\{activeTab === 'invoices' && <Invoices \{\.\.\.props\} \/>\}/g;

if (regex.test(app)) {
    app = app.replace(regex, '');
    fs.writeFileSync('frontend/src/App.jsx', app);
    console.log("Duplicate Invoices component removed from App.jsx");
} else {
    console.log("Regex did not match duplicate Invoices component.");
}
