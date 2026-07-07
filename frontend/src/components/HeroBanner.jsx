import React from 'react';
import { useLanguage } from '../services/i18n';
import Prism from './Prism';

export default function HeroBanner() {
  const { t } = useLanguage();

  return (
    <div className="position-relative overflow-hidden mb-5 d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '60vh', paddingTop: '6rem', paddingBottom: '4rem' }}>
      
      {/* Prism WebGL Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.45,
      }}>
        <Prism
          animationType="hover"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          noise={0.5}
          glow={1}
          transparent={true}
          suspendWhenOffscreen={true}
        />
      </div>

      <div className="container position-relative z-1 py-5">
        
        <h1 className="fw-extrabold mb-4" style={{ fontSize: 'var(--font-size-xxl)', letterSpacing: '-0.04em', lineHeight: '1.05' }}>
          <span style={{ 
            color: 'var(--text-heading)',
            display: 'block',
            fontWeight: '600'
          }}>
            {t('hero.titlePrefix') || 'empowering minds.'}
          </span>
          <span style={{ color: 'var(--brand-secondary)', fontWeight: '400' }}>{t('hero.titleHighlight') || 'shaping the future.'}</span>
        </h1>
        
        <p className="mx-auto mb-5" style={{ maxWidth: '650px', color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: '500' }}>
          {t('hero.description')}
        </p>

        {/* Feature Pills */}
        <div className="d-flex justify-content-center flex-wrap gap-3 mb-5">
          <div className="badge rounded-pill px-4 py-2" style={{ backgroundColor: 'var(--brand-accent)', color: 'var(--brand-primary)', border: 'none', fontSize: '0.85rem' }}>
            {t('nav.learningPlatform') || 'Multi-Language Support'}
          </div>
          <div className="badge rounded-pill px-4 py-2" style={{ backgroundColor: 'var(--brand-accent)', color: 'var(--brand-primary)', border: 'none', fontSize: '0.85rem' }}>
            {t('tradeCard.modules') || 'Interactive Modules'}
          </div>
          <div className="badge rounded-pill px-4 py-2" style={{ backgroundColor: 'var(--brand-accent)', color: 'var(--brand-primary)', border: 'none', fontSize: '0.85rem' }}>
            {t('hero.statFree') || 'Real-Time Updates'}
          </div>
        </div>

        <div className="d-flex justify-content-center gap-3">
          <a href="#trades-section" className="btn" style={{ backgroundColor: 'var(--brand-primary)', color: 'var(--bg-primary)', padding: '0.7rem 2rem', borderRadius: '50px', fontWeight: '600' }}>
            {t('hero.exploreCourses') || 'Start Learning'}
          </a>
        </div>
      </div>
    </div>
  );
}
