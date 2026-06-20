import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SemesterCard from '../components/SemesterCard';
import PremiumBreadcrumb from '../components/PremiumBreadcrumb';
import { getSemesters, resolveTradeName } from '../services/csvService';
import { useLanguage } from '../services/i18n';
import ShareButton from '../components/ShareButton';

export default function Trade({ lessons, searchQuery = '', setSearchQuery }) {
  const { tradeName } = useParams();
  const { t } = useLanguage();
  const resolvedTrade = resolveTradeName(lessons, tradeName);

  // Retrieve unique semesters for this trade name
  const semesters = getSemesters(lessons, resolvedTrade);

  // Helper metric builders
  const getSemesterMetrics = (sem) => {
    const semLessons = lessons.filter(item => 
      item.trade.toLowerCase() === tradeName.toLowerCase() &&
      item.semester.toLowerCase() === sem.toLowerCase()
    );
    const uniqueModules = [...new Set(semLessons.map(item => item.module).filter(Boolean))].length;
    return {
      videoCount: semLessons.length,
      moduleCount: uniqueModules
    };
  };

  // Filter semesters based on query
  const filteredSemesters = semesters.filter(sem => 
    sem.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="container py-5 flex-grow-1 text-start">
      <PremiumBreadcrumb
        backTo="/"
        crumbs={[
          { label: t('breadcrumb.home'), to: '/' },
          { label: t(resolvedTrade).toUpperCase() },
        ]}
      />

      {/* Trade Banner */}
      <div className="p-5 mb-5 text-center position-relative overflow-hidden" 
           style={{ 
             background: 'var(--hero-gradient)',
             border: '1px solid var(--border-subtle)',
             borderRadius: '40px',
             boxShadow: 'var(--neon-blue-glow)'
           }}>
        
        {/* Decorative elements */}
        <div className="position-absolute" style={{
          top: '-10%', left: '-10%', width: '200px', height: '200px', borderRadius: '50%',
          background: 'radial-gradient(circle, var(--hero-sphere1) 0%, transparent 70%)', filter: 'blur(20px)'
        }}></div>
        
        <div className="position-relative z-1">
          <div className="d-flex justify-content-center align-items-center gap-3 mb-2.5">
            <span className="badge fw-bold px-3.5 py-1.5 rounded-pill shadow-sm" 
                  style={{ 
                    backgroundColor: 'var(--brand-accent)', 
                    color: 'var(--text-heading)', 
                    border: 'none',
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em'
                  }}>
              {t('trade.overview')}
            </span>
            <ShareButton />
          </div>
          <h1 className="display-5 fw-extrabold uppercase m-0" style={{ fontFamily: 'var(--font-heading)', color: 'var(--brand-primary)' }}>
            {t(tradeName).toUpperCase()}
          </h1>
          <p className="lead mx-auto mt-3 mb-0" style={{ maxWidth: '650px', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            {t('trade.chooseSemester')}
          </p>
        </div>
      </div>

      {/* Semesters list */}
      <div className="my-4">
        <h2 className="text-heading text-center mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--brand-primary)', fontWeight: '700' }}>
          {t('trade.selectYear')}
        </h2>
        
        {filteredSemesters.length > 0 ? (
          <div className="row justify-content-center">
            {filteredSemesters.map(sem => {
              const metrics = getSemesterMetrics(sem);
              return (
                <SemesterCard 
                  key={sem}
                  tradeName={resolvedTrade}
                  semesterName={sem}
                  videoCount={metrics.videoCount}
                  moduleCount={metrics.moduleCount}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center text-muted py-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)', borderRadius: '32px' }}>
            <i className="bi bi-journal-x fs-2 mb-2 d-block" style={{ color: 'var(--brand-primary)' }}></i>
            <span>{t('trade.noSemesters')} "{searchQuery}". {t('trade.tryDifferent')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
