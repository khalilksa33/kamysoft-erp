import React from 'react';

const ModuleSwitcher = (props) => {
  const { currentLanguage, translations } = props;
  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <h2>{translations[currentLanguage].moduleSwitch}</h2>
      <p>{currentLanguage === 'ar' ? 'هذه ميزة تجريبية لتبديل الوحدات' : 'This is a placeholder for module switching.'}</p>
    </div>
  );
};

export default ModuleSwitcher;
