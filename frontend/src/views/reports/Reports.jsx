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

    if (activeTab === 'purchasesMovement') {
        const reportExpenses = props.expenses || [];
        return (
            <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>{translations[currentLanguage].purchasesMovement || 'Purchases Movement'}</h3>
                    <button className="btn btn-secondary" onClick={() => window.print()}>
                        <i className="ri-printer-line"></i> {currentLanguage === 'ar' ? 'طباعة' : 'Print'}
                    </button>
                </div>
                {reportExpenses.length === 0 ? (
                    <p>{currentLanguage === 'ar' ? 'لا توجد مشتريات' : 'No purchases found'}</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>{currentLanguage === 'ar' ? 'التاريخ' : 'Date'}</th>
                                <th>{currentLanguage === 'ar' ? 'الفئة' : 'Category'}</th>
                                <th>{currentLanguage === 'ar' ? 'الوصف' : 'Description'}</th>
                                <th style={{ textAlign: 'right' }}>{currentLanguage === 'ar' ? 'المبلغ' : 'Amount'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportExpenses.map(exp => (
                                <tr key={exp._id || exp.id || Math.random()}>
                                    <td>{exp.date ? new Date(exp.date).toLocaleDateString() : ''}</td>
                                    <td>{exp.category}</td>
                                    <td>{exp.description}</td>
                                    <td style={{ textAlign: 'right' }}>{formatCurrency(exp.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        );
    }

    if (activeTab === 'itemsMovement') {
        const items = (props.products || []).map(p => {
            let qtySold = 0;
            (props.invoices || []).forEach(inv => {
                if (inv.items) {
                    inv.items.forEach(i => {
                        if (i.name === p.name || i.productId === p.id) {
                            qtySold += Number(i.qty || 0);
                        }
                    });
                }
            });
            return { ...p, qtySold };
        });

        return (
            <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>{translations[currentLanguage].itemsMovement || 'Items Movement'}</h3>
                    <button className="btn btn-secondary" onClick={() => window.print()}>
                        <i className="ri-printer-line"></i> {currentLanguage === 'ar' ? 'طباعة' : 'Print'}
                    </button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>{currentLanguage === 'ar' ? 'المنتج' : 'Product'}</th>
                            <th style={{ textAlign: 'center' }}>{currentLanguage === 'ar' ? 'المخزون الحالي' : 'Current Stock'}</th>
                            <th style={{ textAlign: 'center' }}>{currentLanguage === 'ar' ? 'الكمية المباعة' : 'Qty Sold'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td style={{ textAlign: 'center' }}>{item.stock}</td>
                                <td style={{ textAlign: 'center' }}>{item.qtySold}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (activeTab === 'taxReport') {
        const totalOutputVat = (props.invoices || []).reduce((sum, inv) => sum + (inv.vat || 0), 0);
        return (
            <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>{translations[currentLanguage].taxReport || 'Tax Report'}</h3>
                    <button className="btn btn-secondary" onClick={() => window.print()}>
                        <i className="ri-printer-line"></i> {currentLanguage === 'ar' ? 'طباعة' : 'Print'}
                    </button>
                </div>
                <div className="card-grid">
                    <div className="glass-card purple">
                        <div className="card-stat">
                            <div className="stat-info">
                                <h3>{currentLanguage === 'ar' ? 'إجمالي ضريبة المخرجات (المبيعات)' : 'Total Output VAT (Sales)'}</h3>
                                <div className="stat-value">{formatCurrency(totalOutputVat)}</div>
                            </div>
                            <div className="stat-icon"><i className="ri-percent-line"></i></div>
                        </div>
                    </div>
                    <div className="glass-card cyan">
                        <div className="card-stat">
                            <div className="stat-info">
                                <h3>{currentLanguage === 'ar' ? 'صافي الضريبة المستحقة' : 'Net Tax Due'}</h3>
                                <div className="stat-value">{formatCurrency(totalOutputVat)}</div>
                            </div>
                            <div className="stat-icon"><i className="ri-bank-card-line"></i></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (activeTab === 'accountsDebts') {
        const debts = (props.invoices || [])
            .filter(inv => inv.zatcaStatus !== 'REPORTED')
            .reduce((acc, inv) => {
                acc[inv.customer] = (acc[inv.customer] || 0) + (inv.total || 0);
                return acc;
            }, {});
            
        return (
            <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>{translations[currentLanguage].accountsDebts || 'Accounts & Debts'}</h3>
                    <button className="btn btn-secondary" onClick={() => window.print()}>
                        <i className="ri-printer-line"></i> {currentLanguage === 'ar' ? 'طباعة' : 'Print'}
                    </button>
                </div>
                {Object.keys(debts).length === 0 ? (
                    <p>{currentLanguage === 'ar' ? 'لا توجد ديون مسجلة' : 'No debts found'}</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>{currentLanguage === 'ar' ? 'العميل' : 'Customer'}</th>
                                <th style={{ textAlign: 'right' }}>{currentLanguage === 'ar' ? 'المبلغ المستحق' : 'Amount Due'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(debts).map(([customer, amount]) => (
                                <tr key={customer}>
                                    <td>{customer || 'Cash Customer'}</td>
                                    <td style={{ textAlign: 'right', color: 'var(--accent-danger)' }}>{formatCurrency(amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        );
    }

    if (activeTab === 'profitAnalysis') {
        const totalRevenue = (props.invoices || []).reduce((sum, inv) => sum + ((inv.total || 0) - (inv.vat || 0)), 0);
        const totalExpenses = (props.expenses || []).reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
        const netProfit = totalRevenue - totalExpenses;
        const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(2) : 0;

        return (
            <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>{translations[currentLanguage].profitAnalysis || 'Profit Analysis'}</h3>
                    <button className="btn btn-secondary" onClick={() => window.print()}>
                        <i className="ri-printer-line"></i> {currentLanguage === 'ar' ? 'طباعة' : 'Print'}
                    </button>
                </div>
                <div className="card-grid">
                    <div className="glass-card cyan">
                        <div className="card-stat">
                            <div className="stat-info">
                                <h3>{currentLanguage === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}</h3>
                                <div className="stat-value">{formatCurrency(totalRevenue)}</div>
                            </div>
                            <div className="stat-icon"><i className="ri-money-dollar-circle-line"></i></div>
                        </div>
                    </div>
                    <div className="glass-card purple">
                        <div className="card-stat">
                            <div className="stat-info">
                                <h3>{currentLanguage === 'ar' ? 'إجمالي المصروفات' : 'Total Expenses'}</h3>
                                <div className="stat-value">{formatCurrency(totalExpenses)}</div>
                            </div>
                            <div className="stat-icon"><i className="ri-wallet-3-line"></i></div>
                        </div>
                    </div>
                    <div className="glass-card gold">
                        <div className="card-stat">
                            <div className="stat-info">
                                <h3>{currentLanguage === 'ar' ? 'صافي الربح' : 'Net Profit'}</h3>
                                <div className="stat-value" style={{ color: netProfit >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>{formatCurrency(netProfit)}</div>
                            </div>
                            <div className="stat-icon"><i className="ri-scales-3-line"></i></div>
                        </div>
                    </div>
                    <div className="glass-card green">
                        <div className="card-stat">
                            <div className="stat-info">
                                <h3>{currentLanguage === 'ar' ? 'هامش الربح' : 'Profit Margin'}</h3>
                                <div className="stat-value">{profitMargin}%</div>
                            </div>
                            <div className="stat-icon"><i className="ri-line-chart-line"></i></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (activeTab === 'maintenanceReport') {
        const mockTickets = [
            { id: 'TKT-001', customer: 'John Doe', device: 'Laptop Dell XPS 15', status: 'Pending', cost: 150, date: '2026-07-10' },
            { id: 'TKT-002', customer: 'Jane Smith', device: 'iPhone 13 Pro', status: 'In Progress', cost: 0, date: '2026-07-11' }
        ];
        return (
            <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>{translations[currentLanguage].maintenanceReport || 'Maintenance Report'}</h3>
                    <button className="btn btn-secondary" onClick={() => window.print()}>
                        <i className="ri-printer-line"></i> {currentLanguage === 'ar' ? 'طباعة' : 'Print'}
                    </button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>{currentLanguage === 'ar' ? 'رقم التذكرة' : 'Ticket ID'}</th>
                            <th>{currentLanguage === 'ar' ? 'العميل' : 'Customer'}</th>
                            <th>{currentLanguage === 'ar' ? 'الجهاز' : 'Device'}</th>
                            <th>{currentLanguage === 'ar' ? 'التاريخ' : 'Date'}</th>
                            <th style={{ textAlign: 'right' }}>{currentLanguage === 'ar' ? 'التكلفة' : 'Cost'}</th>
                            <th>{currentLanguage === 'ar' ? 'الحالة' : 'Status'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockTickets.map(t => (
                            <tr key={t.id}>
                                <td>{t.id}</td>
                                <td>{t.customer}</td>
                                <td>{t.device}</td>
                                <td>{t.date}</td>
                                <td style={{ textAlign: 'right' }}>{formatCurrency(t.cost)}</td>
                                <td>{t.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    // Placeholder for other reports
    const placeholderTitles = {
        financialMovement: translations[currentLanguage].financialMovement || 'Financial Movement',
        customerStatement: translations[currentLanguage].customerStatement || 'Customer Statement',
        supplierStatement: translations[currentLanguage].supplierStatement || 'Supplier Statement',
        salesAnalysis: translations[currentLanguage].salesAnalysis || 'Sales Analysis',
        summaryReport: translations[currentLanguage].summaryReport || 'Summary Report'
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
