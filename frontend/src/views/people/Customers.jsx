import React from 'react';

const Customers = (props) => {
    const { 
        customers, currentLanguage, translations,
        newCustomer, setNewCustomer, handleAddCustomer, handleDeleteCustomer,
        setShowCustomerModal, setCustForm
    } = props;

    return (
        
                    <div className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 data-i18n="customers">{translations[currentLanguage].customers}</h3>
                            <button className="btn btn-primary" onClick={() => { setCustForm({ name: '', phone: '', email: '' }); setShowCustomerModal(true); }}>
                                {translations[currentLanguage].addCustomer}
                            </button>
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
