const fs = require('fs');

let app = fs.readFileSync('frontend/src/views/invoices/Invoices.jsx', 'utf8');

const targetStr = `                            {/* Invoices List Table */}
                            <div className="glass-card">
                                <div className="table-container">`;

const replacementStr = `                            {/* Invoices List Table */}
                            <div className="glass-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h3>{currentLanguage === 'ar' ? 'إدارة المبيعات' : 'Sales Management'}</h3>
                                    <button className="btn btn-primary" onClick={() => setActiveTab('b2bsale')}>
                                        <i className="ri-add-line"></i> {currentLanguage === 'ar' ? 'إنشاء فاتورة جديدة' : 'Create New Invoice'}
                                    </button>
                                </div>
                                <div className="table-container">`;

if (app.includes(targetStr)) {
    app = app.replace(targetStr, replacementStr);
    fs.writeFileSync('frontend/src/views/invoices/Invoices.jsx', app);
    console.log("Added Create Invoice button to Invoices panel");
} else {
    console.log("Could not find target string in Invoices.jsx");
}
