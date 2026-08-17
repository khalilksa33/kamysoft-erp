import React from 'react';

const Customers = (props) => {
    const { 
        customers, currentLanguage, translations,
        newCustomer, setNewCustomer, handleAddCustomer, handleDeleteCustomer,
        setShowCustomerModal, setCustForm
    } = props;

    
    
    
    
    const handleExportCustomersData = (format) => {
        if (!customers || !customers.length) return;
        const headersList = ['id', 'name', 'phone', 'email', 'loyaltyPoints'];
        
        if (format === 'csv') {
            const csvRows = [headersList.join(',')];
            customers.forEach(item => {
                csvRows.push(headersList.map(h => '"' + (item[h] || '').toString().replace(/"/g, '""') + '"').join(','));
            });
            const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'customers_export.csv';
            a.click();
        } else if (format === 'excel') {
            const worksheet = XLSX.utils.json_to_sheet(customers.map(item => {
                let obj = {};
                headersList.forEach(h => obj[h] = item[h]);
                return obj;
            }));
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
            XLSX.writeFile(workbook, 'customers_export.xlsx');
        }
    };

    const handleImportCustomersData = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const fileExt = file.name.split('.').pop().toLowerCase();
        
        if (fileExt === 'csv') {
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
                    if (props.setCustomers) props.setCustomers([...customers, ...newItems]);
                    alert(currentLanguage === 'ar' ? `تم استيراد ${newItems.length} عنصر بنجاح` : `Successfully imported ${newItems.length} items`);
                }
            };
            reader.readAsText(file);
        } else if (fileExt === 'xlsx' || fileExt === 'xls') {
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                
                const newItems = json.map((row, i) => {
                    let item = { ...row };
                    item.id = item.id || Date.now().toString() + i;
                    return item;
                });
                
                if (newItems.length > 0) {
                    if (props.setCustomers) props.setCustomers([...customers, ...newItems]);
                    alert(currentLanguage === 'ar' ? `تم استيراد ${newItems.length} عنصر بنجاح` : `Successfully imported ${newItems.length} items`);
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    return (

        
                    <div className="glass-card">
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                            <h3 data-i18n="customers">{translations[currentLanguage].customers}</h3>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input type="file" id="cust-csv-upload" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" style={{ display: 'none' }} onChange={handleImportCustomersData} />
                                <button className="btn btn-secondary" onClick={() => document.getElementById('cust-csv-upload').click()}>
                                    <i className="ri-upload-2-line" style={{ marginRight: '5px' }}></i>
                                    {currentLanguage === 'ar' ? 'استيراد (CSV/Excel)' : 'Import (CSV/Excel)'}
                                </button>
                                
                    <button className="btn btn-secondary" onClick={() => handleExportCustomersData('csv')}>
                        <i className="ri-download-2-line" style={{ marginRight: '5px' }}></i>
                        {currentLanguage === 'ar' ? 'تصدير CSV' : 'Export CSV'}
                    </button>
                    <button className="btn btn-secondary" onClick={() => handleExportCustomersData('excel')}>
                        <i className="ri-file-excel-2-line" style={{ marginRight: '5px' }}></i>
                        {currentLanguage === 'ar' ? 'تصدير Excel' : 'Export Excel'}
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
