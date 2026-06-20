import React from 'react';
import { useLanguage } from '../services/i18n';

export default function LanguageSelectionPopup() {
  const { setLanguage, t, hasChosenLanguage } = useLanguage();

  if (hasChosenLanguage) return null;

  const handleSelect = (lang) => {
    setLanguage(lang);
  };

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
      style={{ 
        zIndex: 2000, 
        backgroundColor: 'rgba(10, 20, 40, 0.75)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div 
        className="card shadow-lg animate-fade-in" 
        style={{ 
          maxWidth: '400px', 
          width: '90%', 
          borderRadius: '24px',
          border: 'none',
          overflow: 'hidden'
        }}
      >
        <div 
          className="p-4 text-center"
          style={{ background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-accent) 100%)' }}
        >
          <i className="bi bi-translate text-white mb-2" style={{ fontSize: '2.5rem' }}></i>
          <h3 className="text-white fw-bold m-0" style={{ fontFamily: 'var(--font-heading)' }}>
            {t('langPopup.title') || 'Choose Your Language'}
          </h3>
        </div>
        
        <div className="p-4" style={{ background: 'var(--bg-secondary)' }}>
          <p className="text-center text-muted mb-4" style={{ fontSize: '0.9rem' }}>
            {t('langPopup.subtitle') || 'Select your preferred language for the platform'}
          </p>

          <div className="d-flex flex-column gap-3">
            <button 
              onClick={() => handleSelect('en')}
              className="btn btn-outline-primary py-3 rounded-pill fw-bold fs-6 d-flex justify-content-between align-items-center px-4"
              style={{ transition: 'all 0.2s' }}
            >
              <span>EN</span>
              <span>English</span>
              <i className="bi bi-chevron-right"></i>
            </button>
            <button 
              onClick={() => handleSelect('hi')}
              className="btn btn-outline-primary py-3 rounded-pill fw-bold fs-6 d-flex justify-content-between align-items-center px-4"
              style={{ transition: 'all 0.2s' }}
            >
              <span>हि</span>
              <span>हिंदी (Hindi)</span>
              <i className="bi bi-chevron-right"></i>
            </button>
            <button 
              onClick={() => handleSelect('mr')}
              className="btn btn-outline-primary py-3 rounded-pill fw-bold fs-6 d-flex justify-content-between align-items-center px-4"
              style={{ transition: 'all 0.2s' }}
            >
              <span>म</span>
              <span>मराठी (Marathi)</span>
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
