import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../services/i18n';

export default function FloatingContinueButton() {
  const [lastSession, setLastSession] = useState(null);
  const { t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const updateSession = () => setLastSession(localStorage.getItem('iti_last_session'));
    updateSession();
    window.addEventListener('iti_session_update', updateSession);
    return () => window.removeEventListener('iti_session_update', updateSession);
  }, []);

  // Hide the floating button if we are already on a video lesson page
  if (!lastSession || location.pathname.startsWith('/lesson/')) {
    return null;
  }

  return (
    <Link 
      to={`/lesson/${encodeURIComponent(lastSession)}`}
      className="btn rounded-circle shadow-lg d-flex align-items-center justify-content-center"
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '60px',
        height: '60px',
        background: 'var(--floating-btn-bg)',
        color: 'white',
        border: 'none',
        zIndex: 9999,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      title={t('hero.continueLearning') || 'Continue Learning'}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(5, 150, 105, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 .5rem 1rem rgba(0,0,0,.15)';
      }}
    >
      <i className="bi bi-play-fill text-white" style={{ fontSize: '2rem', marginLeft: '4px' }}></i>
    </Link>
  );
}
