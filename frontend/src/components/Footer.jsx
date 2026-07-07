import React from 'react';
import { useLanguage } from '../services/i18n';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-top" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle) !important' }}>
      {/* Contact & Mission Details */}
      <div className="container py-5 text-center position-relative overflow-hidden" id="contact-section">
        {/* Subtle glow */}
        <div className="position-absolute" style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, var(--brand-secondary) 0%, transparent 60%)', opacity: 0.1, bottom: '-20%', right: '-10%', zIndex: 0 }}></div>
        
        <div className="position-relative z-1 mb-5 pb-5 border-bottom" style={{ borderColor: 'var(--border-subtle) !important' }}>
          <h1 style={{ fontSize: 'clamp(4rem, 15vw, 12rem)', fontWeight: '900', letterSpacing: '-0.05em', color: 'var(--text-primary)', margin: 0, opacity: 0.9 }}>
            dasvi.
          </h1>
          <p className="lead" style={{ color: 'var(--text-secondary)' }}>
            Empowering Minds. Shaping the Future.
          </p>
        </div>

        <div className="row g-4 position-relative z-1">
          <div className="col-12 col-md-6 text-start">
            <h4 className="h5 mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: '700' }}>
              {t('footer.orgName')}
            </h4>
            <p className="small mb-3" style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
              {t('footer.aboutText')}
            </p>
          </div>

          <div className="col-12 col-md-6 text-start text-md-end">
            <h4 className="h5 mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: '700' }}>
              {t('footer.contactOffice')}
            </h4>
            <ul className="list-unstyled small d-flex flex-column gap-2 align-items-start align-items-md-end" style={{ color: 'var(--text-secondary)' }}>
              <li className="d-flex align-items-center gap-2">
                <span>contact@mindstixfoundation.org</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <span>+91 86574 06480</span>
              </li>
            </ul>
            <div className="d-flex gap-3 justify-content-start justify-content-md-end mt-3">
              <a href="https://mindstixfoundation.org/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>
                <i className="bi bi-globe"></i>
              </a>
              <a href="#" style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>
                <i className="bi bi-twitter-x"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Under Footer */}
      <div className="py-3" style={{ borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container text-center">
          <p className="text-muted-custom small m-0">
            {t('footer.copyright', { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
