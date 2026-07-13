import React from 'react';

const Reports = (props) => {
    const {
        invoices,
        reportSubTab,
        setReportSubTab,
        formatCurrency,
        currentLanguage,
        translations,
        activeTab
    } = props;

    // Helper to render the standard sales report table (used for salesMovement)
    const renderSalesReport = (reportInvoices) => (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Sub Tabs Selection */}
            <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
                <button className={`btn ${reportSubTab === 'daily' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setReportSubTab('daily')}>
                    <i className="ri-calendar-event-line"></i> {translations[currentLanguage].dailyReports}
                </button>
                <button className={`btn ${reportSubTab === 'monthly' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setReportSubTab('monthly')}>
                    <i className="ri-calendar-todo-line"></i> {translations[currentLanguage].monthlyReports}
                </button>
                <button className={`btn ${reportSubTab === 'annual' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setReportSubTab('annual')}>
                    <i className="ri-calendar-line"></i> {translations[currentLanguage].annualReports}
                </button>
                <button className="btn btn-secondary" style={{ marginRight: currentLanguage === 'en' ? 'auto' : '0', marginLeft: currentLanguage === 'ar' ? 'auto' : '0' }} onClick={() => window.print()}>
                    <i className="ri-printer-line"></i> {translations[currentLanguage].printReport}
                </button>
            </div>

            {/* Report Stats Grid */}
            <div className="card-grid">
                <div className="glass-card purple">
                    <div className="card-stat">
                        <div className="stat-info">
                            <h3>{translations[currentLanguage].totalSalesTax}</h3>
                            <div className="stat-value">{formatCurrency(reportInvoices.reduce((sum, inv) => sum + inv.total, 0))}</div>
                        </div>
                        <div className="stat-icon"><i className="ri-money-dollar-circle-line"></i></div>
                    </div>
                </div>
                <div className="glass-card cyan">
                    <div className="card-stat">
                        <div className="stat-info">
                            <h3>{translations[currentLanguage].totalVatCollected}</h3>
                            <div className="stat-value">{formatCurrency(reportInvoices.reduce((sum, inv) => sum + (inv.vat || 0), 0))}</div>
                        </div>
                        <div className="stat-icon"><i className="ri-percent-line"></i></div>
                    </div>
                </div>
                <div className="glass-card gold">
                    <div className="card-stat">
                        <div className="stat-info">
                            <h3>{translations[currentLanguage].netSalesValue}</h3>
                            <div className="stat-value">{formatCurrency(reportInvoices.reduce((sum, inv) => sum + inv.total - (inv.vat || 0), 0))}</div>
                        </div>
                        <div className="stat-icon"><i className="ri-coins-line"></i></div>
                    </div>
                </div>
                <div className="glass-card green">
                    <div className="card-stat">
                        <div className="stat-info">
                            <h3>{translations[currentLanguage].invoiceCount}</h3>
                            <div className="stat-value">{reportInvoices.length}</div>
                        </div>
                        <div className="stat-icon"><i className="ri-file-list-3-line"></i></div>
                    </div>
                </div>
            </div>

            {/* Detailed List */}
            <div className="table-container" style={{ marginTop: '12px' }}>
                <table>
                    <thead>
                        <tr>
                            <th>{translations[currentLanguage].invoiceNum}</th>
                            <th>{translations[currentLanguage].invoiceDate}</th>
                            <th>{translations[currentLanguage].invoiceCustomer}</th>
                            <th style={{ textAlign: 'right' }}>{translations[currentLanguage].netSalesValue}</th>
                            <th style={{ textAlign: 'right' }}>{translations[currentLanguage].vat}</th>
                            <th style={{ textAlign: 'right' }}>{translations[currentLanguage].invoiceTotal}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportInvoices.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    {currentLanguage === 'ar' ? 'لا توجد مبيعات مسجلة لهذه الفترة' : 'No sales recorded for this period'}
                                </td>
                            </tr>
                        ) : (
                            reportInvoices.map(inv => (
                                <tr key={inv.id}>
                                    <td>{inv.id}</td>
                                    <td>{inv.date}</td>
                                    <td>{inv.customer}</td>
                                    <td style={{ textAlign: 'right' }}>{formatCurrency(inv.total - (inv.vat || 0))}</td>
                                    <td style={{ textAlign: 'right' }}>{formatCurrency(inv.vat || 0)}</td>
                                    <td style={{ textAlign: 'right' }}>{formatCurrency(inv.total)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // Determine which report to show based on activeTab
    if (activeTab === 'salesMovement') {
        // Filter invoices according to the selected sub‑tab (daily / monthly / annual)
        const now = new Date();
        const todayStr = now.toLocaleDateString();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const reportInvoices = invoices.filter(inv => {
            if (!inv.date) return false;
            const invDate = new Date(inv.date);
            if (isNaN(invDate.getTime())) {
                // Fallback for malformed dates – simple string checks
                if (reportSubTab === 'daily') return inv.date.includes(todayStr);
                if (reportSubTab === 'monthly') return inv.date.includes(`/${currentMonth + 1}/`) || inv.date.includes(`-${currentMonth + 1}-`);
                if (reportSubTab === 'annual') return inv.date.includes(String(currentYear));
                return false;
            }
            if (reportSubTab === 'daily') return invDate.toDateString() === now.toDateString();
            if (reportSubTab === 'monthly') return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
            if (reportSubTab === 'annual') return invDate.getFullYear() === currentYear;
            return true;
        });
        return renderSalesReport(reportInvoices);
    }

    if (activeTab === 'unpaidInvoices') {
        const unpaid = invoices.filter(inv => inv.zatcaStatus !== 'REPORTED');
        return (
            <div className="glass-card" style={{ padding: '24px' }}>
                <h3>{translations[currentLanguage].unpaidInvoices || 'Unpaid Invoices'}</h3>
                {unpaid.length === 0 ? (
                    <p>{currentLanguage === 'ar' ? 'لا توجد فواتير غير مدفوعة' : 'No unpaid invoices found'}</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>{translations[currentLanguage].invoiceNum}</th>
                                <th>{translations[currentLanguage].invoiceDate}</th>
                                <th>{translations[currentLanguage].invoiceCustomer}</th>
                                <th style={{ textAlign: 'right' }}>{translations[currentLanguage].invoiceTotal}</th>
                                <th>{translations[currentLanguage].status || 'Status'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unpaid.map(inv => (
                                <tr key={inv.id}>
                                    <td>{inv.id}</td>
                                    <td>{inv.date}</td>
                                    <td>{inv.customer}</td>
                                    <td style={{ textAlign: 'right' }}>{formatCurrency(inv.total)}</td>
                                    <td>{inv.zatcaStatus}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        );
    }

    // Placeholder for other reports
    const placeholderTitles = {
        purchasesMovement: translations[currentLanguage].purchasesMovement || 'Purchases Movement',
        maintenanceReport: translations[currentLanguage].maintenanceReport || 'Maintenance Report',
        itemsMovement: translations[currentLanguage].itemsMovement || 'Items Movement',
        financialMovement: translations[currentLanguage].financialMovement || 'Financial Movement',
        customerStatement: translations[currentLanguage].customerStatement || 'Customer Statement',
        supplierStatement: translations[currentLanguage].supplierStatement || 'Supplier Statement',
        salesAnalysis: translations[currentLanguage].salesAnalysis || 'Sales Analysis',
        accountsDebts: translations[currentLanguage].accountsDebts || 'Accounts & Debts',
        profitAnalysis: translations[currentLanguage].profitAnalysis || 'Profit Analysis',
        summaryReport: translations[currentLanguage].summaryReport || 'Summary Report',
        taxReport: translations[currentLanguage].taxReport || 'Tax Report'
    };
    if (placeholderTitles[activeTab]) {
        return (
            <div className="glass-card" style={{ textAlign: 'center', padding: '50px' }}>
                <h3>{placeholderTitles[activeTab]}</h3>
                <p>{currentLanguage === 'ar' ? 'قيد التطوير' : 'Under development'}</p>
            </div>
        );
    }

    // Fallback – nothing matched
    return null;
};

export default Reports;
