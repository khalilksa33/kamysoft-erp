import React from 'react';

const Reports = (props) => {
    const { 
        invoices, reportSubTab, setReportSubTab, 
        formatCurrency, currentLanguage, translations
    } = props;

    
                    const now = new Date();
                    const todayStr = now.toLocaleDateString();
                    const currentMonth = now.getMonth();
                    const currentYear = now.getFullYear();
                    
                    const reportInvoices = invoices.filter(inv => {
                        if (!inv.date) return false;
                        const invDate = new Date(inv.date);
                        
                        if (isNaN(invDate.getTime())) {
                            const datePart = inv.date.split(',')[0] || inv.date;
                            if (reportSubTab === 'daily') {
                                return datePart.includes(todayStr) || inv.date.includes(todayStr);
                            }
                            if (reportSubTab === 'monthly') {
                                return inv.date.includes(`/${currentMonth + 1}/`) || inv.date.includes(`/${String(currentMonth + 1).padStart(2, '0')}/`) || inv.date.includes(`-${currentMonth + 1}-`);
                            }
                            if (reportSubTab === 'annual') {
                                return inv.date.includes(String(currentYear));
                            }
                            return false;
                        }
                        
                        if (reportSubTab === 'daily') {
                            return invDate.toDateString() === now.toDateString();
                        } else if (reportSubTab === 'monthly') {
                            return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
                        } else if (reportSubTab === 'annual') {
                            return invDate.getFullYear() === currentYear;
                        }
                        return true;
                    });

                    const totalSales = reportInvoices.reduce((sum, inv) => sum + inv.total, 0);
                    const totalVat = reportInvoices.reduce((sum, inv) => sum + (inv.vat || 0), 0);
                    const netSales = totalSales - totalVat;
                    const invoiceCount = reportInvoices.length;

                    return (
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
                                            <div className="stat-value">{formatCurrency(totalSales)}</div>
                                        </div>
                                        <div className="stat-icon"><i className="ri-money-dollar-circle-line"></i></div>
                                    </div>
                                </div>
                                <div className="glass-card cyan">
                                    <div className="card-stat">
                                        <div className="stat-info">
                                            <h3>{translations[currentLanguage].totalVatCollected}</h3>
                                            <div className="stat-value">{formatCurrency(totalVat)}</div>
                                        </div>
                                        <div className="stat-icon"><i className="ri-percent-line"></i></div>
                                    </div>
                                </div>
                                <div className="glass-card gold">
                                    <div className="card-stat">
                                        <div className="stat-info">
                                            <h3>{translations[currentLanguage].netSalesValue}</h3>
                                            <div className="stat-value">{formatCurrency(netSales)}</div>
                                        </div>
                                        <div className="stat-icon"><i className="ri-coins-line"></i></div>
                                    </div>
                                </div>
                                <div className="glass-card green">
                                    <div className="card-stat">
                                        <div className="stat-info">
                                            <h3>{translations[currentLanguage].invoiceCount}</h3>
                                            <div className="stat-value">{invoiceCount}</div>
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
};

export default Reports;
