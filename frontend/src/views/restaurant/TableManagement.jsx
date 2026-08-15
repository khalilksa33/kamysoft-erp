import React, { useState, useEffect } from 'react';

const TableManagement = ({ currentLanguage, translations, headers, setActiveTab, setTableNum, loadCartFromOrder }) => {
    const [orders, setOrders] = useState([]);
    
    // Simulate 20 tables as defined in POS.jsx
    const allTables = Array.from({ length: 20 }, (_, i) => (i + 1).toString());

    const fetchOrders = () => {
        fetch('/api/restaurant/orders', { headers })
            .then(res => res.json())
            .then(data => setOrders(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleTableClick = (tableNumber) => {
        const order = orders.find(o => o.tableNumber === tableNumber);
        setTableNum(tableNumber);
        if (order) {
            loadCartFromOrder(order);
        } else {
            // New empty tab for this table
            loadCartFromOrder(null); 
        }
        setActiveTab('pos');
    };

    const getTableOrder = (tableNumber) => {
        return orders.find(o => o.tableNumber === tableNumber);
    };

    return (
        <div className="view-content active">
            <h2>{currentLanguage === 'ar' ? 'إدارة الطاولات' : 'Table Management'}</h2>
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '15px',
                marginTop: '20px'
            }}>
                {allTables.map(tableNumber => {
                    const order = getTableOrder(tableNumber);
                    const isOccupied = !!order;
                    
                    return (
                        <div 
                            key={tableNumber} 
                            onClick={() => handleTableClick(tableNumber)}
                            style={{
                                background: isOccupied ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                border: `1px solid ${isOccupied ? 'var(--accent-danger)' : 'var(--accent-success)'}`,
                                padding: '15px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'none'}
                        >
                            <i 
                                className="ri-restaurant-line" 
                                style={{ 
                                    fontSize: '32px', 
                                    color: isOccupied ? 'var(--accent-danger)' : 'var(--accent-success)' 
                                }}
                            ></i>
                            <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                                {currentLanguage === 'ar' ? `طاولة ${tableNumber}` : `Table ${tableNumber}`}
                            </div>
                            
                            {isOccupied ? (
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                    <div style={{ color: 'var(--accent-cyan)' }}>
                                        {order.total.toFixed(2)} SAR
                                    </div>
                                    <div>
                                        {order.items.length} {currentLanguage === 'ar' ? 'عناصر' : 'Items'}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                    {currentLanguage === 'ar' ? 'متاحة' : 'Available'}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TableManagement;
