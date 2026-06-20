import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { parseUploadedCSV, loadDefaultLessons } from '../services/csvService';
import { useLanguage } from '../services/i18n';

export default function Navbar({ onCSVLoaded, isCustomData, searchQuery, setSearchQuery }) {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();

  // Initialize theme from localStorage, default to light
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('dasvi-theme');
    return saved === 'dark';
  });

  // Apply theme class on mount and changes
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('dasvi-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val && window.location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <div className="container position-sticky top-0" style={{ zIndex: 1050 }}>
      <nav className="floating-nav d-flex align-items-center justify-content-between animate-slide-up">
        <Link className="navbar-brand d-flex align-items-center text-decoration-none" to="/" style={{ gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-primary)', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: 'var(--glass-shadow)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mountain"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
          </div>
          <div>
            <span className="fw-extrabold d-block lh-1" style={{ fontSize: '1.3rem', fontFamily: 'var(--font-heading)', color: 'var(--text-heading)' }}>Dasvi</span>
          </div>
        </Link>

        <div className="d-none d-md-flex align-items-center flex-grow-1 px-5" style={{ maxWidth: '400px' }}>
          <div className="position-relative w-100">
            <i className="bi bi-search position-absolute top-50 translate-middle-y ms-3" style={{ color: 'var(--text-secondary)' }}></i>
            <input 
              type="text" 
              className="form-control rounded-pill ps-5 py-2 border-0 w-100" 
              placeholder={t('nav.searchPlaceholder')}
              value={searchQuery || ''}
              onChange={handleSearchChange}
              style={{ backgroundColor: 'var(--search-bg)', color: 'var(--text-heading)', border: '1px solid var(--border-subtle)' }}
            />
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Language Selector */}
          <select 
            className="form-select form-select-sm rounded-pill" 
            style={{ width: 'auto', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', fontWeight: '600' }}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="mr">मराठी (Marathi)</option>
          </select>

          {/* Feedback Form Button */}
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSfF5Z3-MindstixFeedbackForm2026/viewform?usp=sf_link" target="_blank" rel="noopener noreferrer" className="btn btn-sm d-none d-sm-flex align-items-center gap-1 fw-bold rounded-pill" style={{ backgroundColor: 'var(--brand-accent)', color: 'var(--brand-primary)', border: 'none', padding: '0.4rem 1rem' }}>
            <i className="bi bi-chat-left-text"></i> {t('nav.feedback')}
          </a>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <i className={`bi ${isDarkMode ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`}></i>
          </button>
        </div>
      </nav>
      {/* Mobile search bar */}
      <div className="d-md-none mt-2 animate-slide-up stagger-1">
        <div className="position-relative w-100">
            <i className="bi bi-search position-absolute top-50 translate-middle-y ms-3" style={{ color: 'var(--text-secondary)' }}></i>
            <input 
              type="text" 
              className="form-control rounded-pill ps-5 py-2 border-0 w-100 shadow-sm" 
              placeholder={t('nav.searchMobile')}
              value={searchQuery || ''}
              onChange={handleSearchChange}
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-heading)', border: '1px solid var(--border-subtle)' }}
            />
        </div>
      </div>
    </div>
  );
}
