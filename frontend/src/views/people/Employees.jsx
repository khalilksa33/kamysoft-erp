import React from 'react';

const Employees = (props) => {
    const { currentLanguage, translations } = props;
    return (
        <div className="view-container">
            <h2>{translations[currentLanguage].employees || 'Employees'}</h2>
            <div className="panel card">
                <p>Employees management coming soon...</p>
            </div>
        </div>
    );
};

export default Employees;
