import React, { useState, useEffect } from 'react';

const WarehouseManagement = ({ currentLanguage, translations }) => {
    const [warehouses, setWarehouses] = useState([]);

    useEffect(() => {
        // Fetch from the newly created backend API /api/warehouses
        fetch('/api/warehouses')
            .then(res => res.json())
            .then(data => setWarehouses(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="view-container">
            <header className="view-header">
                <h2>{currentLanguage === 'ar' ? 'إدارة المخازن' : 'Warehouse Management'}</h2>
                <button className="btn btn-primary">
                    <i className="ri-add-line"></i> {currentLanguage === 'ar' ? 'إضافة مخزن' : 'Add Warehouse'}
                </button>
            </header>
            
            <div className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>{currentLanguage === 'ar' ? 'الرقم' : 'ID'}</th>
                            <th>{currentLanguage === 'ar' ? 'اسم المخزن' : 'Warehouse Name'}</th>
                            <th>{currentLanguage === 'ar' ? 'الموقع' : 'Location'}</th>
                            <th>{currentLanguage === 'ar' ? 'المدير' : 'Manager'}</th>
                            <th>{currentLanguage === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {warehouses.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center text-secondary py-4">
                                    {currentLanguage === 'ar' ? 'لا توجد مخازن مضافة بعد' : 'No warehouses added yet'}
                                </td>
                            </tr>
                        ) : (
                            warehouses.map(w => (
                                <tr key={w.id}>
                                    <td>{w.id}</td>
                                    <td>{w.name}</td>
                                    <td>{w.location}</td>
                                    <td>{w.manager}</td>
                                    <td>
                                        <button className="btn btn-sm btn-outline"><i className="ri-edit-line"></i></button>
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

export default WarehouseManagement;
