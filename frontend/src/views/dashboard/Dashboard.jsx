import React from 'react';

const Dashboard = (props) => {
    const { 
        invoices, products, formatCurrency, 
        currentLanguage, translations
    } = props;

    return (
        
                    <>
                        <div className="card-grid">
                            <div className="glass-card purple">
                                <div className="card-stat">
                                    <div className="stat-info">
                                        <h3 data-i18n="totalSales">{translations[currentLanguage].totalSales}</h3>
                                        <div className="stat-value">{formatCurrency(invoices.reduce((a, b) => a + b.total, 0))}</div>
                                    </div>
                                    <div className="stat-icon"><i class="ri-money-dollar-circle-line"></i></div>
                                </div>
                            </div>
                            <div className="glass-card cyan">
                                <div className="card-stat">
                                    <div className="stat-info">
                                        <h3 data-i18n="activeProducts">{translations[currentLanguage].activeProducts}</h3>
                                        <div className="stat-value">{products.length}</div>
                                    </div>
                                    <div className="stat-icon"><i class="ri-archive-line"></i></div>
                                </div>
                            </div>
                            <div className="glass-card gold">
                                <div className="card-stat">
                                    <div className="stat-info">
                                        <h3 data-i18n="invoicesGenerated">{translations[currentLanguage].invoicesGenerated}</h3>
                                        <div className="stat-value">{invoices.length}</div>
                                    </div>
                                    <div className="stat-icon"><i class="ri-file-paper-2-line"></i></div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Transactions List */}
                        <div className="glass-card" style={{ marginTop: '24px' }}>
                            <h3 data-i18n="recentTransactions" style={{ marginBottom: '15px' }}>{translations[currentLanguage].recentTransactions}</h3>
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>{translations[currentLanguage].invoiceNum}</th>
                                            <th>{translations[currentLanguage].invoiceDate}</th>
                                            <th>{translations[currentLanguage].invoiceCustomer}</th>
                                            <th>{translations[currentLanguage].invoiceTotal}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoices.slice(-5).reverse().map(inv => (
                                            <tr key={inv.id}>
                                                <td>{inv.id}</td>
                                                <td>{inv.date}</td>
                                                <td>{inv.customer}</td>
                                                <td>{formatCurrency(inv.total)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                
    );
};

export default Dashboard;
