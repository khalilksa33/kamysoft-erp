import React from 'react';

const Customers = (props) => {
    const { 
        customers, currentLanguage, translations,
        newCustomer, setNewCustomer, handleAddCustomer, handleDeleteCustomer,
        setShowCustomerModal, setCustForm
    } = props;

    
    const handleExportCustomersCSV = () => {
        if (!customers || !customers.length) return;
        const headersList = ['id', 'name', 'phone', 'email', 'loyaltyPoints'];
        const csvRows = [headersList.join(',')];
        customers.forEach(c => {
            csvRows.push([c.id, c.name, c.phone, c.email, c.loyaltyPoints].map(v => '"' + (v || '').toString().replace(/"/g, '""') + '"').join(','));
        });
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'customers_export.csv';
        a.click();
    };

    const handleImportCustomersCSV = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const rows = event.target.result.split('\n');
            if (rows.length < 2) return;
            const headersList = rows[0].split(',').map(h => h.replace(/"/g, '').trim());
            const newItems = [];
            for (let i = 1; i < rows.length; i++) {
                if (!rows[i].trim()) continue;
                const values = rows[i].split(',').map(v => v.replace(/"/g, '').trim());
                const item = {};
                headersList.forEach((header, index) => item[header] = values[index]);
                if (item.name) {
                    item.id = item.id || Date.now().toString() + i;
                    newItems.push(item);
                }
            }
            if (newItems.length > 0) {
                // To keep it simple, we use the mock add for all of them via an event or just alert to manually save if it's external,
                // but wait, we don't have setCustomers in Customers props. We just have handleAddCustomer or we need to add setCustomers to props.
                // Looking at App.jsx, setCustomers is in props.
                if (props.setCustomers) {
                    props.setCustomers([...customers, ...newItems]);
                }
                alert(currentLanguage === 'ar' ? `تم استيراد ${newItems.length} عميل بنجاح` : `Successfully imported ${newItems.length} customers`);
            }
        };
        reader.readAsText(file);
    };

    return (

        
                    <div className="glass-card">
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                            <h3 data-i18n="customers">{translations[currentLanguage].customers}</h3>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input type="file" id="cust-csv-upload" accept=".csv" style={{ display: 'none' }} onChange={handleImportCustomersCSV} />
                                <button className="btn btn-secondary" onClick={() => document.getElementById('cust-csv-upload').click()}>
                                    <i className="ri-upload-2-line" style={{ marginRight: '5px' }}></i>
                                    {currentLanguage === 'ar' ? 'استيراد CSV' : 'Import CSV'}
                                </button>
                                <button className="btn btn-secondary" onClick={handleExportCustomersCSV}>
                                    <i className="ri-download-2-line" style={{ marginRight: '5px' }}></i>
                                    {currentLanguage === 'ar' ? 'تصدير CSV' : 'Export CSV'}
                                </button>
                                <button className="btn btn-primary" onClick={() => { setCustForm({ name: '', phone: '', email: '' }); setShowCustomerModal(true); }}>
                                    {translations[currentLanguage].addCustomer}
                                </button>
                            </div>
                        </div>

                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{translations[currentLanguage].custName}</th>
                                        <th>{translations[currentLanguage].phone}</th>
                                        <th>{translations[currentLanguage].email}</th>
                                        <th>{translations[currentLanguage].loyaltyPoints}</th>
                                        <th>{translations[currentLanguage].actions}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                                {currentLanguage === 'ar' ? 'لا يوجد عملاء مسجلين حالياً' : 'No customers registered currently'}
                                            </td>
                                        </tr>
                                    ) : (
                                        customers.map(c => (
                                            <tr key={c.id}>
                                                <td>{c.name}</td>
                                                <td>{c.phone}</td>
                                                <td>{c.email}</td>
                                                <td><span className="badge purple">{c.loyaltyPoints || 0} PTS</span></td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button className="btn btn-secondary" onClick={() => { setCustForm(c); setShowCustomerModal(true); }}>
                                                            <i className="ri-edit-line"></i>
                                                        </button>
                                                        <button className="btn btn-danger" onClick={() => handleDeleteCustomer(c.id)}>
                                                            <i className="ri-delete-bin-line"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                
    );
};

export default Customers;
