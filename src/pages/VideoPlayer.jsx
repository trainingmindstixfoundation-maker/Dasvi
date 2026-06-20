import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PremiumBreadcrumb from '../components/PremiumBreadcrumb';
import { getLessonById, getCoursePlaylist, searchLessons } from '../services/csvService';
import { useLanguage } from '../services/i18n';
import ShareButton from '../components/ShareButton';

export default function VideoPlayer({ lessons }) {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();

  const lesson = getLessonById(lessons, lessonId);

  useEffect(() => {
    if (lessonId) {
      localStorage.setItem('iti_last_session', lessonId);
      window.dispatchEvent(new Event('iti_session_update'));
    }
  }, [lessonId]);

  const navigateToLesson = useCallback((id) => {
    navigate(`/lesson/${encodeURIComponent(id)}`);
  }, [navigate]);

  if (!lesson) {
    return (
      <div className="container py-5 text-center">
        <h2>{t('vp.lessonNotFound')}</h2>
        <Link to="/" className="btn-modern">{t('vp.backToHome')}</Link>
      </div>
    );
  }

  const { lesson_title, description, youtube_video_id, youtube_download_link, trade, semester, module } = lesson;
  const coursePlaylist = getCoursePlaylist(lessons, trade, semester);
  
  const currentModuleLessons = coursePlaylist.filter(
    item => item.module.toLowerCase() === module.toLowerCase()
  );

  const isSearchActive = searchQuery.trim() !== '';
  const searchResults = isSearchActive ? searchLessons(coursePlaylist, searchQuery) : [];

  return (
    <div className="container py-4">
      <div className="animate-slide-up">
        <PremiumBreadcrumb
          backTo={`/trade/${encodeURIComponent(trade)}/semester/${encodeURIComponent(semester)}/module/${encodeURIComponent(module)}`}
          crumbs={[
            { label: t('breadcrumb.home'), to: '/' },
            { label: t(trade).toUpperCase(), to: `/trade/${encodeURIComponent(trade)}` },
            { label: t(semester), to: `/trade/${encodeURIComponent(trade)}/semester/${encodeURIComponent(semester)}` },
            { label: t(module) },
          ]}
        />
      </div>

      <div className="row g-4 mt-2">
        {/* Main Content */}
        <div className="col-12 col-lg-8 animate-slide-up stagger-1">
          {/* Video Player */}
          <div className="bento-item p-3 mb-4" style={{ borderRadius: '24px' }}>
            <div className="position-relative w-100 overflow-hidden" style={{ paddingTop: '56.25%', borderRadius: '16px', background: 'var(--text-heading)' }}>
              {youtube_video_id ? (
                <iframe
                  className="position-absolute top-0 start-0 w-100 h-100 border-0"
                  src={`https://www.youtube.com/embed/${youtube_video_id}?autoplay=0&rel=0`}
                  allowFullScreen
                  title={lesson_title}
                ></iframe>
              ) : (
                <div className="position-absolute w-100 h-100 d-flex flex-column align-items-center justify-content-center text-white">
                  <i className="bi bi-camera-video-off fs-1 mb-2"></i>
                  <span>No Video Available</span>
                </div>
              )}
            </div>
          </div>

          {/* Details & Resources */}
          <div className="bento-item p-4 mb-4" style={{ borderRadius: '24px' }}>
            <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
              <h1 className="h3 fw-bold" style={{ color: 'var(--text-heading)' }}>{lesson_title}</h1>
              <ShareButton />
            </div>

            <div className="d-flex flex-wrap gap-2 mb-4">
              <span className="badge rounded-pill" style={{ background: 'var(--brand-accent)', color: 'var(--text-heading)', padding: '6px 12px' }}>{trade.toUpperCase()}</span>
              <span className="badge rounded-pill" style={{ background: 'var(--brand-secondary)', color: '#fff', padding: '6px 12px' }}>{module}</span>
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {description || 'Explore this comprehensive lesson to enhance your knowledge and skills in this module.'}
            </p>

            <hr style={{ borderColor: 'var(--border-subtle)', margin: '1.5rem 0' }} />

            <h4 className="h6 fw-bold mb-3" style={{ color: 'var(--brand-primary)' }}>Required Resources</h4>
            <div className="d-flex flex-wrap gap-3">
              {lesson?.pdf_drive_id ? (
                <a
                  href={`https://drive.google.com/file/d/${lesson.pdf_drive_id}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-modern-outline"
                >
                  <i className="bi bi-file-earmark-pdf-fill"></i> Worksheet PDF
                </a>
              ) : (
                <span className="btn-modern-outline" style={{ opacity: 0.5, pointerEvents: 'none' }}>
                  <i className="bi bi-file-earmark-pdf-fill"></i> No Worksheet
                </span>
              )}
              {youtube_download_link && (
                <a
                  href={youtube_download_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-modern"
                >
                  <i className="bi bi-download"></i> Download Video
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Modules Sidebar */}
        <div className="col-12 col-lg-4 animate-slide-up stagger-2">
          <div className="bento-item p-4" style={{ borderRadius: '24px', height: '100%' }}>
            <h3 className="h5 fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-heading)' }}>
              <i className="bi bi-collection-play-fill text-primary" style={{ color: 'var(--brand-primary) !important' }}></i> Module Lessons
            </h3>
            
            <input
              type="text"
              className="form-control rounded-pill w-100 mb-4"
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ fontSize: '0.85rem', padding: '0.6rem 1.2rem', backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }}
            />

            <div className="d-flex flex-column gap-2 overflow-auto pe-2" style={{ maxHeight: '600px' }}>
              {(isSearchActive ? searchResults : currentModuleLessons).map(rel => {
                const isCurrent = rel.id === lessonId;
                return (
                  <div
                    key={rel.id}
                    onClick={() => navigateToLesson(rel.id)}
                    className="d-flex align-items-center gap-3 p-2 rounded-4"
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: isCurrent ? 'var(--badge-bg)' : 'transparent',
                      border: `1px solid ${isCurrent ? 'var(--brand-primary)' : 'transparent'}`,
                      borderRadius: '12px'
                    }}
                    onMouseEnter={e => {
                      if (!isCurrent) e.currentTarget.style.background = 'var(--badge-bg)';
                    }}
                    onMouseLeave={e => {
                      if (!isCurrent) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div className="position-relative flex-shrink-0" style={{ width: '80px', height: '50px', borderRadius: '12px', overflow: 'hidden' }}>
                      <img src={rel.thumbnail} alt={rel.lesson_title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {isCurrent && (
                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
                          <i className="bi bi-play-fill text-white fs-4"></i>
                        </div>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="fw-bold mb-1 text-truncate" style={{ fontSize: '0.85rem', color: isCurrent ? 'var(--brand-primary)' : 'var(--text-heading)' }}>
                        {rel.lesson_title}
                      </h4>
                      <p className="m-0 text-truncate" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{rel.module}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
