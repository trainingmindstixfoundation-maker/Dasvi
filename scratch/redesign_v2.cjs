const fs = require('fs');

const cssContent = `
/* =========================================================
   NEW MODERN ANIMATED BEIGE/BROWN DESIGN OVERRIDES
   ========================================================= */
:root {
  --brand-primary: #8D6E63 !important;
  --brand-secondary: #BCAAA4 !important;
  --brand-accent: #D7CCC8 !important;
  --bg-primary: #FDFBF7 !important;
  --bg-secondary: #ffffff !important;
  --text-heading: #3E2723 !important;
  --text-primary: #4E342E !important;
  --text-secondary: #795548 !important;
  --border-subtle: rgba(141, 110, 99, 0.15) !important;
}

body {
  background-color: var(--bg-primary) !important;
  color: var(--text-primary) !important;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.floating-nav {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-subtle);
  border-radius: 50px;
  box-shadow: 0 10px 40px rgba(62, 39, 35, 0.06);
  padding: 0.5rem 1.5rem;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
.bento-item {
  background: var(--bg-secondary);
  border-radius: 30px;
  border: 1px solid var(--border-subtle);
  padding: 2.5rem 2rem;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 20px rgba(62, 39, 35, 0.02);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  text-decoration: none;
}
.bento-item:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(62, 39, 35, 0.08);
  border-color: var(--brand-primary);
}

.btn-modern {
  background: var(--brand-primary);
  color: white !important;
  border-radius: 50px;
  padding: 0.8rem 2rem;
  font-weight: 700;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(141, 110, 99, 0.2);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}
.btn-modern:hover {
  background: var(--text-heading);
  transform: translateY(-3px);
  box-shadow: 0 12px 25px rgba(62, 39, 35, 0.3);
}

.btn-modern-outline {
  background: transparent;
  color: var(--text-heading) !important;
  border: 2px solid var(--border-subtle);
  border-radius: 50px;
  padding: 0.8rem 2rem;
  font-weight: 700;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}
.btn-modern-outline:hover {
  border-color: var(--text-heading);
  background: var(--text-heading);
  color: white !important;
  transform: translateY(-3px);
}

.stagger-1 { animation-delay: 0.1s; opacity: 0; }
.stagger-2 { animation-delay: 0.2s; opacity: 0; }
.stagger-3 { animation-delay: 0.3s; opacity: 0; }
.stagger-4 { animation-delay: 0.4s; opacity: 0; }

.modern-hero-shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand-accent) 0%, var(--bg-primary) 100%);
  z-index: 0;
}

`;

fs.appendFileSync('src/index.css', cssContent);

// Navbar complete rewrite
const navbarCode = `import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { parseUploadedCSV, loadDefaultLessons } from '../services/csvService';
import { useLanguage } from '../services/i18n';

export default function Navbar({ onCSVLoaded, isCustomData, searchQuery, setSearchQuery }) {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

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
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(141,110,99,0.3)' }}>
            D
          </div>
          <div>
            <span className="fw-extrabold d-block lh-1" style={{ fontSize: '1.3rem', fontFamily: 'var(--font-heading)', color: 'var(--text-heading)' }}>Dasvi</span>
          </div>
        </Link>

        <div className="d-none d-md-flex align-items-center flex-grow-1 px-5" style={{ maxWidth: '500px' }}>
          <div className="position-relative w-100">
            <i className="bi bi-search position-absolute top-50 translate-middle-y ms-3" style={{ color: 'var(--text-secondary)' }}></i>
            <input 
              type="text" 
              className="form-control rounded-pill ps-5 py-2 border-0 w-100" 
              placeholder={t('nav.searchPlaceholder')}
              value={searchQuery || ''}
              onChange={handleSearchChange}
              style={{ backgroundColor: 'rgba(141, 110, 99, 0.08)', color: 'var(--text-heading)' }}
            />
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <a href="https://mindstixfoundation.org/" target="_blank" rel="noopener noreferrer" className="btn-modern d-none d-sm-flex" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
            <i className="bi bi-globe"></i> Mindstix
          </a>
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
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
            />
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/Navbar.jsx', navbarCode);

// HeroBanner complete rewrite
const heroCode = `import React from 'react';
import { useLanguage } from '../services/i18n';

export default function HeroBanner() {
  const { t } = useLanguage();

  return (
    <div className="position-relative overflow-hidden mb-5 animate-slide-up stagger-1" style={{ padding: '4rem 0' }}>
      
      {/* Animated Shapes */}
      <div className="modern-hero-shape animate-float" style={{ width: '400px', height: '400px', top: '-10%', right: '-5%', opacity: 0.6 }}></div>
      <div className="modern-hero-shape animate-float" style={{ width: '200px', height: '200px', bottom: '0', left: '5%', opacity: 0.4, animationDelay: '2s' }}></div>

      <div className="container position-relative z-1 text-center py-5">
        <span className="badge rounded-pill px-3 py-2 mb-4 fw-bold animate-slide-up stagger-2" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--brand-primary)', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 15px rgba(62,39,35,0.05)' }}>
          <i className="bi bi-stars text-warning me-1"></i> The Next Generation Learning
        </span>
        
        <h1 className="display-3 fw-extrabold mb-4 animate-slide-up stagger-3" style={{ color: 'var(--text-heading)', letterSpacing: '-0.03em', lineHeight: '1.1' }}>
          Empowering Minds <br />
          <span style={{ color: 'var(--brand-primary)' }}>Shaping the Future</span>
        </h1>
        
        <p className="lead mx-auto mb-5 animate-slide-up stagger-4" style={{ maxWidth: '600px', color: 'var(--text-secondary)' }}>
          {t('hero.description')}
        </p>

        <div className="d-flex justify-content-center gap-3 animate-slide-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
          <a href="#trades-section" className="btn-modern">
            Start Learning <i className="bi bi-arrow-right"></i>
          </a>
          <a href="https://mindstixfoundation.org/" target="_blank" rel="noopener noreferrer" className="btn-modern-outline">
            Our Foundation
          </a>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/HeroBanner.jsx', heroCode);

// TradeCard complete rewrite
const tradeCardCode = `import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../services/i18n';

export default function TradeCard({ tradeName, videoCount, moduleCount }) {
  const { t } = useLanguage();
  const normalizedKey = tradeName.toLowerCase();

  const TRADE_ICONS = {
    'class 9': 'bi-journal-richtext',
    'class 10': 'bi-award',
    'class 12': 'bi-mortarboard-fill',
    'skill development': 'bi-laptop',
    'career guidance': 'bi-compass',
  };

  const iconClass = TRADE_ICONS[normalizedKey] || 'bi-book-half';

  return (
    <Link to={\`/trade/\${encodeURIComponent(tradeName)}\`} className="bento-item">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div style={{ width: '60px', height: '60px', borderRadius: '20px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)' }}>
          <i className={\`bi \${iconClass}\`} style={{ fontSize: '1.8rem', color: 'var(--brand-primary)' }}></i>
        </div>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s ease' }} className="arrow-icon-wrapper">
          <i className="bi bi-arrow-up-right" style={{ color: 'var(--text-secondary)' }}></i>
        </div>
      </div>

      <h3 className="h4 fw-bold mb-2" style={{ color: 'var(--text-heading)' }}>
        {t(tradeName).toUpperCase()}
      </h3>
      
      <div className="mt-auto pt-4 d-flex gap-3">
        <div className="px-3 py-2 rounded-3" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }}>
          <div className="fw-bold" style={{ color: 'var(--text-heading)', fontSize: '1.1rem' }}>{moduleCount}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Modules</div>
        </div>
        <div className="px-3 py-2 rounded-3" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }}>
          <div className="fw-bold" style={{ color: 'var(--text-heading)', fontSize: '1.1rem' }}>{videoCount}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Videos</div>
        </div>
      </div>
    </Link>
  );
}
`;
fs.writeFileSync('src/components/TradeCard.jsx', tradeCardCode);

// Home.jsx simplification to use new layout
const homeCode = fs.readFileSync('src/pages/Home.jsx', 'utf8');
const updatedHome = homeCode
  .replace(/<div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">/, '<div className="bento-grid animate-slide-up stagger-3">')
  .replace(/<div id="mission-section"[\s\S]*?{t\('home\.govResources'\)}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '');

fs.writeFileSync('src/pages/Home.jsx', updatedHome);

console.log('V2 Redesign complete.');
