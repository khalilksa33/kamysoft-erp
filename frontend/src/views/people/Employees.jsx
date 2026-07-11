import React, { useState } from 'react';

const Employees = (props) => {
    const { 
        employees, setEmployees, currentLanguage, translations, headers 
    } = props;

    const [empForm, setEmpForm] = useState({ name: '', dept: '' });
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);

    const handleSaveEmployee = (e) => {
        e.preventDefault();
        const method = empForm.id ? 'PUT' : 'POST';
        const url = empForm.id ? `/api/employees/${empForm.id}` : '/api/employees';
        
        fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(empForm)
        })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then(data => {
            if (empForm.id) {
                setEmployees(employees.map(e => e.id === empForm.id ? data : e));
            } else {
                setEmployees([...employees, data]);
            }
            setShowEmployeeModal(false);
            setEmpForm({ name: '', dept: '' });
        })
        .catch(() => {
            // Optimistic UI for mock mode
            if (empForm.id) {
                setEmployees(employees.map(e => e.id === empForm.id ? { ...empForm } : e));
            } else {
                const mock = { ...empForm, id: `EMP-${Date.now().toString().slice(-4)}` };
                setEmployees([...employees, mock]);
            }
            setShowEmployeeModal(false);
            setEmpForm({ name: '', dept: '' });
        });
    };

    const handleDeleteEmployee = (id) => {
        if (!confirm(currentLanguage === 'ar' ? 'هل أنت متأكد من حذف هذا الموظف؟' : 'Are you sure you want to delete this employee?')) return;
        fetch(`/api/employees/${id}`, { method: 'DELETE', headers: headers })
        .then(() => {
            setEmployees(employees.filter(e => e.id !== id));
        })
        .catch(() => {
            setEmployees(employees.filter(e => e.id !== id));
        });
    };

    return (
        <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 data-i18n="employees">{translations[currentLanguage].employees || 'Employees'}</h3>
                <button className="btn btn-primary" onClick={() => { setEmpForm({ name: '', dept: '' }); setShowEmployeeModal(true); }}>
                    {currentLanguage === 'ar' ? 'إضافة موظف' : 'Add Employee'}
                </button>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>{currentLanguage === 'ar' ? 'الاسم' : 'Name'}</th>
                            <th>{currentLanguage === 'ar' ? 'القسم' : 'Department'}</th>
                            <th>{translations[currentLanguage].actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length === 0 ? (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    {currentLanguage === 'ar' ? 'لا يوجد موظفون مسجلون حالياً' : 'No employees registered currently'}
                                </td>
                            </tr>
                        ) : (
                            employees.map(e => (
                                <tr key={e.id}>
                                    <td>{e.name}</td>
                                    <td>{e.dept}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="btn btn-secondary" onClick={() => { setEmpForm(e); setShowEmployeeModal(true); }}>
                                                <i className="ri-edit-line"></i>
                                            </button>
                                            <button className="btn btn-danger" onClick={() => handleDeleteEmployee(e.id)}>
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

            {showEmployeeModal && (
                <div className="modal-overlay" onClick={() => setShowEmployeeModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>
                            {empForm.id ? (currentLanguage === 'ar' ? 'تعديل بيانات الموظف' : 'Edit Employee Details') : (currentLanguage === 'ar' ? 'إضافة موظف جديد' : 'Add New Employee')}
                        </h3>
                        <form onSubmit={handleSaveEmployee}>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'الاسم' : 'Name'}</label>
                                <input type="text" value={empForm.name} onChange={e => setEmpForm({ ...empForm, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>{currentLanguage === 'ar' ? 'القسم' : 'Department'}</label>
                                <input type="text" value={empForm.dept} onChange={e => setEmpForm({ ...empForm, dept: e.target.value })} required />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="submit" className="btn btn-primary">{translations[currentLanguage].save}</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowEmployeeModal(false)}>{translations[currentLanguage].close}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employees;
