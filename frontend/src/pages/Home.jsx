import React from 'react';
import HeroBanner from '../components/HeroBanner';
import TradeCard from '../components/TradeCard';
import { getTrades, getLessons, searchLessons } from '../services/csvService';
import { useLanguage, getTranslation } from '../services/i18n';

export default function Home({ lessons, searchQuery = '', setSearchQuery }) {
  const { t, language } = useLanguage();
  // Extract unique trades
  const trades = getTrades(lessons);

  // Helper metrics per trade
  const getTradeMetrics = (tradeName) => {
    const tradeLessons = lessons.filter(item => item.trade.toLowerCase() === tradeName.toLowerCase());
    const actualVideos = tradeLessons.filter(item => !item.placeholder);
    const uniqueModules = [...new Set(tradeLessons.map(item => item.module).filter(Boolean))].length;
    const classDesc = tradeLessons.find(item => item.classDescription)?.classDescription || '';
    const classTrans = tradeLessons.find(item => item.classTranslations)?.classTranslations || null;
    const classThumb = tradeLessons.find(item => item.classThumbnail)?.classThumbnail || '';
    return {
      videoCount: actualVideos.length,
      moduleCount: uniqueModules,
      classDescription: classDesc,
      classTranslations: classTrans,
      classThumbnail: classThumb
    };
  };

  // Filter trades dynamically if user searches for a trade name specifically
  const filteredTrades = trades.filter(trade => 
    trade.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  // If there's a search query, show searched lessons directly as an OTT results tray!
  // This is highly functional and provides immediate feedback.
  const searchedLessons = searchQuery.trim() 
    ? searchLessons(lessons, searchQuery)
    : [];

  return (
    <div className="container py-4 flex-grow-1">
      {/* Hero Banner */}
      <HeroBanner videoCount={lessons.length} tradeCount={trades.length} />

      {/* Heading */}
      <div className="my-4">
        <h2 className="text-center text-heading mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--brand-primary)', fontWeight: '700' }}>
          {t('home.whatTrade')}
        </h2>
      </div>

      {/* Searched Lessons Tray (OTT Style search results) */}
      {searchQuery.trim() !== '' && (
        <div className="mb-5 text-start">
          <h3 className="mb-4 d-flex align-items-center gap-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--brand-primary)', fontSize: '1.4rem' }}>
            <i className="bi bi-search text-success"></i>
            {t('home.searchResults')} ({searchedLessons.length} {t('home.itemsFound')})
          </h3>
          {searchedLessons.length > 0 ? (
            <div className="row row-cols-1 row-cols-md-2 g-4">
              {searchedLessons.map(lesson => (
                <div className="col" key={lesson.id}>
                  <div className="card glow-card p-3 d-flex flex-row gap-3 align-items-center h-100" style={{ backgroundColor: 'var(--bg-secondary)', border: 'none', boxShadow: '0 8px 25px rgba(92, 64, 51, 0.04)', borderRadius: '20px' }}>
                     <div className="position-relative flex-shrink-0 d-flex align-items-center justify-content-center" style={{ width: '120px', aspectRatio: '16/9', borderRadius: '16px', background: 'radial-gradient(circle, var(--brand-accent) 0%, var(--bg-primary) 100%)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="bi bi-play-fill" style={{ fontSize: '1.1rem', marginLeft: '2px', color: 'var(--bg-primary)' }}></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <span className="badge fw-bold mb-1 px-2 py-1 rounded-pill" style={{ backgroundColor: 'var(--brand-accent)', color: 'var(--brand-primary)', fontSize: '0.65rem' }}>
                        {getTranslation(lesson.classTranslations, language, lesson.trade)}
                      </span>
                      <h4 className="text-heading h6 mb-1 text-truncate" style={{ fontFamily: 'var(--font-heading)', fontWeight: '600' }}>
                        {getTranslation(lesson.videoTranslations, language, lesson.lesson_title)}
                      </h4>
                      <p className="text-muted-custom small mb-0 text-truncate" style={{ fontSize: '0.75rem' }}>
                        {getTranslation(lesson.subjectTranslations, language, lesson.module)}
                      </p>
                      <a href={`/lesson/${encodeURIComponent(lesson.id)}`} className="small fw-bold text-decoration-none mt-1.5 d-inline-block" style={{ color: 'var(--brand-primary)' }}>
                        {t('home.watchNow')} &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted py-4">
              <i className="bi bi-exclamation-triangle text-warning fs-3 mb-2 d-block"></i>
              <span>{t('home.noLessonsMatch')}</span>
            </div>
          )}
          <hr className="my-5" style={{ borderColor: 'var(--border-subtle)' }} />
        </div>
      )}

      {/* Core Trades Section */}
      <div id="trades-section" className="mb-5 text-start">
        <div className="d-flex align-items-center gap-2 mb-4">
          <i className="bi bi-grid-fill fs-3" style={{ color: 'var(--brand-primary)' }}></i>
          <h2 className="text-heading m-0" style={{ fontFamily: 'var(--font-heading)', fontWeight: '700' }}>
            {t('home.coreTradesTitle')}
          </h2>
        </div>
        
        {filteredTrades.length > 0 ? (
          <div className="row g-4">
            {filteredTrades.map(tradeName => {
              const metrics = getTradeMetrics(tradeName);
              return (
                <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3 d-flex justify-content-center" key={tradeName}>
                  <div className="profile-card-wrap">
                    <TradeCard 
                      tradeName={tradeName}
                      videoCount={metrics.videoCount}
                      moduleCount={metrics.moduleCount}
                      classDescription={metrics.classDescription}
                      classTranslations={metrics.classTranslations}
                      classThumbnail={metrics.classThumbnail}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-muted py-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)', borderRadius: '32px' }}>
            <i className="bi bi-cloud-upload text-primary fs-2 mb-2 d-block"></i>
            <span>{t('home.noTradesParsed')}</span>
          </div>
        )}
      </div>

      {/* NGO Mission & Initiatives section */}
      <div className="mb-5 text-start pt-4">
        <div className="p-5" style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '32px', border: '1px solid var(--border-subtle)' }}>
          <h2 className="text-heading fw-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Why Dasvi?
          </h2>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="d-flex gap-3">
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--brand-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="bi bi-heart-fill fs-5" style={{ color: 'var(--brand-primary)' }}></i>
                </div>
                <div>
                  <h4 className="fw-bold mb-2" style={{ color: 'var(--text-heading)' }}>Our Vision & Impact</h4>
                  <p className="text-muted-custom" style={{ lineHeight: '1.6' }}>
                    {t('home.visionP1')}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex gap-3">
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--brand-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="bi bi-rocket-takeoff-fill fs-5" style={{ color: 'var(--brand-primary)' }}></i>
                </div>
                <div>
                  <h4 className="fw-bold mb-2" style={{ color: 'var(--text-heading)' }}>Holistic Empowerment</h4>
                  <p className="text-muted-custom" style={{ lineHeight: '1.6' }}>
                    {t('home.visionP2')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
