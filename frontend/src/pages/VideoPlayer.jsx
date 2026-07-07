import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PremiumBreadcrumb from '../components/PremiumBreadcrumb';
import { getLessonById, getCoursePlaylist, searchLessons } from '../services/csvService';
import { useLanguage } from '../services/i18n';
import ShareButton from '../components/ShareButton';
import VisitorModal from '../components/VisitorModal';
import { hasVisitorToken, trackActivity, verifyVisitorToken } from '../services/visitorService';
import FallbackImage from '../components/ui/FallbackImage';

export default function VideoPlayer({ lessons }) {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { t, language } = useLanguage();

  const [videoTest, setVideoTest] = useState(null);
  
  // Visitor onboarding state
  const iframeRef = useRef(null);
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  
  // MCQ state
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [activeQuizQuestions, setActiveQuizQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [openModules, setOpenModules] = useState({});

  // Optional Star Rating State
  const [starRating, setStarRating] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);

  useEffect(() => {
    setStarRating(0);
    setHoverStar(0);
    setRatingSubmitted(false);
  }, [lessonId]);

  const handleStarRating = async (ratingValue) => {
    if (ratingSubmitted || ratingLoading) return;
    
    // Secure verification: check visitor token first
    if (!hasVisitorToken()) {
      setShowVisitorModal(true);
      if (iframeRef.current && iframeRef.current.contentWindow) {
        try { iframeRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*'); } catch (err) {}
      }
      return;
    }

    setStarRating(ratingValue);
    setRatingLoading(true);

    const token = localStorage.getItem('visitor_token');
    try {
      // 1. Record in visitor activity timeline
      await fetch('http://localhost:5000/api/visitors/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor_token: token,
          activity_type: 'VIDEO_RATING',
          resource_id: `${lesson?.lesson_title || 'Video'} (${ratingValue} Stars)`,
          duration: ratingValue
        })
      });

      // 2. Record in admin feedback system
      await fetch('http://localhost:5000/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: lesson?.lesson_title || 'Video Lesson',
          name: `Verified Student (${token.slice(0, 8)})`,
          email: 'student_visitor@dasvi.in',
          rating: `${ratingValue} / 5 Stars`,
          message: `Optional video feedback rating: ${ratingValue} stars given for lesson: ${lesson?.lesson_title || lessonId}`,
          formUrl: `/lesson/${lessonId}`
        })
      });

      setRatingSubmitted(true);
    } catch (err) {
      console.error('Error recording rating:', err);
      setRatingSubmitted(true);
    } finally {
      setRatingLoading(false);
    }
  };

  const lesson = getLessonById(lessons, lessonId);

  useEffect(() => {
    if (lessonId) {
      localStorage.setItem('iti_last_session', lessonId);
      window.dispatchEvent(new Event('iti_session_update'));

      // Fetch tests/quizzes for this video lesson OR its subject (module)
      fetch('http://localhost:5000/api/tests')
        .then(res => res.json())
        .then(data => {
          const testForVideo = data.find(t => 
            (t.videoId && String(t.videoId) === String(lessonId)) ||
            (t.subjectId && lesson?.rawSubject?.id && String(t.subjectId) === String(lesson.rawSubject.id))
          );
          setVideoTest(testForVideo || null);
        })
        .catch(err => console.error("Error fetching video test:", err));
    }
  }, [lessonId, lesson?.rawSubject?.id]);

  // Visitor identification & 10s video watch timer check
  useEffect(() => {
    if (!lessonId) return;

    if (hasVisitorToken()) {
      verifyVisitorToken();
      trackActivity('VIDEO_VIEW', lessonId, 15);
      return;
    }

    // Timer: After 10 seconds of reaching video and watching, open form modal & pause video
    const timer = setTimeout(() => {
      if (!hasVisitorToken()) {
        setShowVisitorModal(true);
        if (iframeRef.current && iframeRef.current.contentWindow) {
          try {
            iframeRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
          } catch (e) {}
        }
      }
    }, 10000);

    return () => clearTimeout(timer);
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

  const { 
    lesson_title, 
    description, 
    youtube_video_id, 
    youtube_download_link, 
    trade, 
    semester, 
    module,
    classTranslations,
    mediumTranslations,
    subjectTranslations,
    videoTranslations
  } = lesson;

  const displayTitle = (videoTranslations && videoTranslations[language]?.title)
    ? videoTranslations[language].title
    : lesson_title;

  const displayDesc = (videoTranslations && videoTranslations[language]?.description)
    ? videoTranslations[language].description
    : description;

  const displayTradeName = (classTranslations && classTranslations[language]?.name)
    ? classTranslations[language].name
    : t(trade);

  const displaySemesterName = (mediumTranslations && mediumTranslations[language]?.name)
    ? mediumTranslations[language].name
    : t(semester);

  const displayModuleName = (subjectTranslations && subjectTranslations[language]?.name)
    ? subjectTranslations[language].name
    : t(module);

  const coursePlaylist = getCoursePlaylist(lessons, trade, semester);
  const modulesInCourse = Array.from(new Set(coursePlaylist.map(item => item.module))).filter(Boolean);

  const currentIndex = coursePlaylist.findIndex(item => item.id === lessonId);
  const prevLesson = currentIndex > 0 ? coursePlaylist[currentIndex - 1] : null;
  const nextLesson = currentIndex !== -1 && currentIndex < coursePlaylist.length - 1 ? coursePlaylist[currentIndex + 1] : null;

  useEffect(() => {
    if (module) {
      setOpenModules(prev => ({ ...prev, [module]: true }));
    }
  }, [module]);

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.origin !== 'https://www.youtube.com' && e.origin !== 'http://www.youtube.com') return;
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data && data.event === 'onStateChange' && data.info === 0) {
          if (nextLesson) {
            navigateToLesson(nextLesson.id);
          }
        }
      } catch (err) {}
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [nextLesson, navigateToLesson]);

  const currentModuleLessons = coursePlaylist.filter(
    item => item.module.toLowerCase() === module.toLowerCase()
  );

  const isSearchActive = searchQuery.trim() !== '';
  const searchResults = isSearchActive ? searchLessons(coursePlaylist, searchQuery) : [];

  const renderTestResource = () => {
    let testUrl = null;
    let isModal = false;
    let quizData = null;

    if (videoTest) {
      if (videoTest.optionType === 'pdf') {
        const pdfUrl = videoTest.translations?.[language]?.pdfUrl || '';
        if (pdfUrl.trim()) testUrl = pdfUrl;
      } else if (videoTest.optionType === 'google_form') {
        const formUrl = videoTest.translations?.[language]?.googleFormUrl || '';
        if (formUrl.trim()) testUrl = formUrl;
      } else if (videoTest.optionType === 'mcq') {
        const filteredQuestions = (videoTest.questions || []).map(q => {
          const qText = q.question?.[language] || '';
          const qOpts = q.options?.[language] || [];
          const hasOptions = qOpts.length > 0 && qOpts.every(o => typeof o === 'string' && o.trim() !== '');
          if (qText.trim() !== '' && hasOptions) {
            return { ...q, displayText: qText, displayOptions: qOpts };
          }
          return null;
        }).filter(Boolean);
        
        if (filteredQuestions.length > 0) {
          isModal = true;
          quizData = filteredQuestions;
        }
      }
    }

    if (!testUrl && !isModal && lesson?.pdf_drive_id) {
      testUrl = `https://drive.google.com/file/d/${lesson.pdf_drive_id}/view`;
    }

    if (isModal) {
      return (
        <button
          onClick={() => {
            if (!hasVisitorToken()) {
              setShowVisitorModal(true);
              if (iframeRef.current && iframeRef.current.contentWindow) {
                try { iframeRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*'); } catch (e) {}
              }
              return;
            }
            trackActivity('TEST_START', videoTest?.id || lessonId);
            setActiveQuizQuestions(quizData);
            setQuizTitle(videoTest.translations?.[language]?.title || 'Quiz');
            setCurrentQuestionIdx(0);
            setUserAnswers({});
            setQuizFinished(false);
            setShowQuizModal(true);
          }}
          className="btn-modern-outline"
          style={{ borderColor: '#f59e0b', color: '#f59e0b' }}
        >
          <i className="bi bi-patch-question-fill text-warning"></i> Test/Worksheet
        </button>
      );
    }

    if (testUrl) {
      return (
        <a
          href={testUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!hasVisitorToken()) {
              e.preventDefault();
              setShowVisitorModal(true);
              if (iframeRef.current && iframeRef.current.contentWindow) {
                try { iframeRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*'); } catch (err) {}
              }
            } else {
              trackActivity('PDF_VIEW', lessonId);
            }
          }}
          className="btn-modern-outline"
          style={{ borderColor: '#10b981', color: '#10b981' }}
        >
          <i className="bi bi-file-earmark-pdf-fill text-success"></i> Test/Worksheet
        </a>
      );
    }

    return (
      <span className="btn-modern-outline" style={{ opacity: 0.5, pointerEvents: 'none' }}>
        <i className="bi bi-file-earmark-pdf-fill"></i> No Worksheet
      </span>
    );
  };

  return (
    <div className="container py-4">
      <div className="animate-slide-up">
        <PremiumBreadcrumb
          backTo={`/trade/${encodeURIComponent(trade)}/semester/${encodeURIComponent(semester)}/module/${encodeURIComponent(module)}`}
          crumbs={[
            { label: t('breadcrumb.home'), to: '/' },
            { label: displayTradeName.toUpperCase(), to: `/trade/${encodeURIComponent(trade)}` },
            { label: displaySemesterName, to: `/trade/${encodeURIComponent(trade)}/semester/${encodeURIComponent(semester)}` },
            { label: displayModuleName },
          ]}
        />
      </div>

      <div className="row g-4 mt-2">
        {/* Main Content */}
        <div className="col-12 col-lg-8 animate-slide-up stagger-1">
          {/* Next/Prev Lesson Continuity Navigation Bar (At top of video, single line, compact) */}
          <div className="d-flex justify-content-between align-items-center mb-3 px-1">
            {prevLesson ? (
              <button onClick={() => navigateToLesson(prevLesson.id)} className="btn btn-sm d-flex align-items-center gap-2 fw-semibold text-heading border-0 p-0 text-decoration-none" style={{ background: 'transparent' }}>
                <i className="bi bi-arrow-left-circle-fill fs-5 flex-shrink-0" style={{ color: 'var(--brand-primary)' }}></i>
                <span className="text-truncate text-start" style={{ maxWidth: '240px', fontSize: '0.85rem' }}>
                  <span className="text-muted-custom me-1">{t('vp.prevModule') || 'Prev'}:</span>
                  <span className="fw-bold">{prevLesson.lesson_title}</span>
                </span>
              </button>
            ) : <div />}
            {nextLesson ? (
              <button onClick={() => navigateToLesson(nextLesson.id)} className="btn btn-sm d-flex align-items-center gap-2 fw-semibold text-heading border-0 p-0 text-decoration-none ms-auto" style={{ background: 'transparent' }}>
                <span className="text-truncate text-end" style={{ maxWidth: '240px', fontSize: '0.85rem' }}>
                  <span className="text-muted-custom me-1">
                    {nextLesson.module.toLowerCase() !== module.toLowerCase() ? `${t('vp.nextModule') || 'Next'}:` : (t('vp.nextVideos') || 'Next')}:
                  </span>
                  <span className="fw-bold">{nextLesson.lesson_title}</span>
                </span>
                <i className="bi bi-arrow-right-circle-fill fs-5 flex-shrink-0" style={{ color: 'var(--brand-primary)' }}></i>
              </button>
            ) : <div />}
          </div>

          {/* Video Player */}
          <div className="bento-item p-3 mb-4" style={{ borderRadius: '24px' }}>
            <div className="position-relative w-100 overflow-hidden" style={{ paddingTop: '56.25%', borderRadius: '16px', background: 'var(--text-heading)' }}>
              {youtube_video_id ? (
                <iframe
                  ref={iframeRef}
                  className="position-absolute top-0 start-0 w-100 h-100 border-0"
                  src={`https://www.youtube.com/embed/${youtube_video_id}?autoplay=0&rel=0&enablejsapi=1`}
                  allowFullScreen
                  title={displayTitle}
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
              <h1 className="h3 fw-bold" style={{ color: 'var(--text-heading)' }}>{displayTitle}</h1>
              <ShareButton />
            </div>

            <div className="d-flex flex-wrap gap-2 mb-4">
              <span className="badge rounded-pill" style={{ background: 'var(--brand-accent)', color: 'var(--text-heading)', padding: '6px 12px' }}>{displayTradeName.toUpperCase()}</span>
              <span className="badge rounded-pill" style={{ background: 'var(--brand-secondary)', color: '#fff', padding: '6px 12px' }}>{displayModuleName}</span>
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {displayDesc || 'Explore this comprehensive lesson to enhance your knowledge and skills in this module.'}
            </p>

            <hr style={{ borderColor: 'var(--border-subtle)', margin: '1.5rem 0' }} />

            <h4 className="h6 fw-bold mb-3" style={{ color: 'var(--brand-primary)' }}>Required Resources</h4>
            <div className="d-flex flex-wrap gap-3">
              {renderTestResource()}
              {youtube_download_link && (
                <a
                  href={youtube_download_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!hasVisitorToken()) {
                      e.preventDefault();
                      setShowVisitorModal(true);
                      if (iframeRef.current && iframeRef.current.contentWindow) {
                        try { iframeRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*'); } catch (err) {}
                      }
                    } else {
                      trackActivity('VIDEO_VIEW', lessonId, 15);
                    }
                  }}
                  className="btn-modern"
                >
                  <i className="bi bi-download"></i> Download Video
                </a>
              )}
            </div>

            {/* Secure Optional Star Rating Bar */}
            <div className="mt-4 pt-3 border-top d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="d-flex align-items-center gap-2">
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--brand-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
                  <i className="bi bi-star-fill fs-5"></i>
                </div>
                <div>
                  <h5 className="m-0 fw-bold" style={{ fontSize: '0.95rem', color: 'var(--text-heading)' }}>
                    Rate this video lesson <span className="badge bg-secondary ms-1 fw-normal" style={{ fontSize: '0.65rem', opacity: 0.8 }}>Optional</span>
                  </h5>
                  <p className="m-0 text-muted-custom" style={{ fontSize: '0.75rem' }}>
                    {ratingSubmitted ? 'Thank you! Your feedback has been securely recorded.' : 'How helpful was this visual explanation for your studies?'}
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-center gap-1 bg-dark bg-opacity-10 p-2 rounded-pill px-3" style={{ border: '1px solid var(--border-subtle)' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    disabled={ratingSubmitted || ratingLoading}
                    onClick={() => handleStarRating(star)}
                    onMouseEnter={() => !ratingSubmitted && setHoverStar(star)}
                    onMouseLeave={() => !ratingSubmitted && setHoverStar(0)}
                    className="btn p-1 border-0 shadow-none d-flex align-items-center justify-content-center"
                    style={{
                      color: (hoverStar || starRating) >= star ? '#ffc107' : 'var(--text-secondary)',
                      opacity: (hoverStar || starRating) >= star ? 1 : 0.4,
                      transform: (hoverStar === star && !ratingSubmitted) ? 'scale(1.25)' : 'scale(1)',
                      transition: 'all 0.15s ease',
                      cursor: ratingSubmitted ? 'default' : 'pointer'
                    }}
                    title={`Rate ${star} out of 5 stars`}
                  >
                    <i className={`bi ${ (hoverStar || starRating) >= star ? 'bi-star-fill' : 'bi-star' } fs-4`}></i>
                  </button>
                ))}
                {ratingSubmitted && (
                  <span className="badge ms-2 px-2 py-1 rounded-pill" style={{ background: 'var(--accent-green)', color: '#fff', fontSize: '0.7rem' }}>
                    <i className="bi bi-check-circle-fill me-1"></i> Recorded
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Course Playlist Sidebar */}
        <div className="col-12 col-lg-4 animate-slide-up stagger-2">
          <div className="bento-item p-4" style={{ borderRadius: '24px', height: '100%' }}>
            <h3 className="h5 fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-heading)' }}>
              <i className="bi bi-collection-play-fill text-primary" style={{ color: 'var(--brand-primary) !important' }}></i> {t('vp.moduleVideoSeq') || 'Course Playlist'}
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
              {isSearchActive ? (
                searchResults.length > 0 ? (
                  searchResults.map(rel => {
                    const isCurrent = rel.id === lessonId;
                    const relTitle = (rel.videoTranslations && rel.videoTranslations[language]?.title)
                      ? rel.videoTranslations[language].title
                      : rel.lesson_title;
                    const relModuleName = (rel.subjectTranslations && rel.subjectTranslations[language]?.name)
                      ? rel.subjectTranslations[language].name
                      : rel.module;
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
                          <FallbackImage src={rel.thumbnail} alt={relTitle} fallbackType="video" iconSize={20} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {isCurrent && (
                            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
                              <i className="bi bi-play-fill text-white fs-4"></i>
                            </div>
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="fw-bold mb-1 text-truncate" style={{ fontSize: '0.85rem', color: isCurrent ? 'var(--brand-primary)' : 'var(--text-heading)' }}>
                            {relTitle}
                          </h4>
                          <p className="m-0 text-truncate" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{relModuleName}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-muted small">No matching lessons found</div>
                )
              ) : (
                modulesInCourse.map((modName, idx) => {
                  const modLessons = coursePlaylist.filter(item => item.module.toLowerCase() === modName.toLowerCase());
                  const isCurrentMod = modName.toLowerCase() === module.toLowerCase();
                  const isOpen = openModules[modName] !== undefined ? openModules[modName] : isCurrentMod;
                  return (
                    <div key={idx} className="d-flex flex-column gap-1 mb-2">
                      {/* Module Header */}
                      <div
                        onClick={() => setOpenModules(prev => ({ ...prev, [modName]: !isOpen }))}
                        className="d-flex align-items-center justify-content-between p-2.5 rounded-3"
                        style={{
                          cursor: 'pointer',
                          background: isCurrentMod ? 'var(--brand-primary)' : 'var(--bg-primary)',
                          color: isCurrentMod ? '#ffffff' : 'var(--text-heading)',
                          border: '1px solid var(--border-subtle)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div className="d-flex align-items-center gap-2 overflow-hidden">
                          <i className={`bi bi-folder-${isOpen ? 'open-fill' : 'fill'}`} style={{ color: isCurrentMod ? '#fff' : 'var(--brand-secondary)' }}></i>
                          <span className="fw-bold text-truncate" style={{ fontSize: '0.8rem' }}>{modName}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                          <span className="badge rounded-pill" style={{ background: isCurrentMod ? 'rgba(255,255,255,0.2)' : 'var(--badge-bg)', color: isCurrentMod ? '#fff' : 'var(--brand-primary)', fontSize: '0.65rem' }}>
                            {modLessons.length}
                          </span>
                          <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`} style={{ fontSize: '0.75rem' }}></i>
                        </div>
                      </div>

                      {/* Module Lessons List */}
                      {isOpen && (
                        <div className="d-flex flex-column gap-1 ps-2 mt-1 border-start ms-2" style={{ borderColor: isCurrentMod ? 'var(--brand-primary)' : 'var(--border-subtle)' }}>
                          {modLessons.map(rel => {
                            const isCurrent = rel.id === lessonId;
                            const relTitle = (rel.videoTranslations && rel.videoTranslations[language]?.title)
                              ? rel.videoTranslations[language].title
                              : rel.lesson_title;
                            return (
                              <div
                                key={rel.id}
                                onClick={() => navigateToLesson(rel.id)}
                                className="d-flex align-items-center gap-2.5 p-2 rounded-3"
                                style={{
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  background: isCurrent ? 'var(--badge-bg)' : 'transparent',
                                  border: `1px solid ${isCurrent ? 'var(--brand-primary)' : 'transparent'}`
                                }}
                                onMouseEnter={e => {
                                  if (!isCurrent) e.currentTarget.style.background = 'var(--badge-bg)';
                                }}
                                onMouseLeave={e => {
                                  if (!isCurrent) e.currentTarget.style.background = 'transparent';
                                }}
                              >
                                <div className="position-relative flex-shrink-0" style={{ width: '70px', height: '42px', borderRadius: '8px', overflow: 'hidden' }}>
                                  <FallbackImage src={rel.thumbnail} alt={relTitle} fallbackType="video" iconSize={18} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  {isCurrent && (
                                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
                                      <i className="bi bi-play-fill text-white fs-5"></i>
                                    </div>
                                  )}
                                </div>
                                <div className="overflow-hidden flex-grow-1">
                                  <h4 className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.8rem', color: isCurrent ? 'var(--brand-primary)' : 'var(--text-heading)' }}>
                                    {relTitle}
                                  </h4>
                                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{rel.duration || '15 Min'}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

      {/* MCQ Quiz Modal */}
      {showQuizModal && activeQuizQuestions.length > 0 && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center animate-fade-in"
          style={{
            backgroundColor: 'rgba(15, 12, 30, 0.6)',
            backdropFilter: 'blur(12px)',
            zIndex: 1050,
            padding: '20px'
          }}
        >
          <div
            className="card border rounded-4 p-4 shadow-lg w-100 animate-zoom-in"
            style={{
              maxWidth: '550px',
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)'
            }}
          >
            <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3" style={{ borderColor: 'var(--border-subtle)' }}>
              <h5 className="m-0 fw-bold" style={{ color: 'var(--brand-primary)' }}>{quizTitle}</h5>
              <button
                onClick={() => setShowQuizModal(false)}
                className="btn btn-sm btn-light rounded-circle p-1 border-0"
                style={{ color: 'var(--text-secondary)' }}
              >
                <i className="bi bi-x fs-5"></i>
              </button>
            </div>

            {!quizFinished ? (
              <div>
                {/* Question info */}
                <div className="d-flex justify-content-between mb-2">
                  <span className="small text-muted">Question {currentQuestionIdx + 1} of {activeQuizQuestions.length}</span>
                </div>

                {/* Question text */}
                <h6 className="fw-bold mb-3" style={{ fontSize: '1rem', color: 'var(--text-heading)' }}>
                  {activeQuizQuestions[currentQuestionIdx].displayText}
                </h6>

                {/* Options list */}
                <div className="d-flex flex-column gap-2 mb-4">
                  {activeQuizQuestions[currentQuestionIdx].displayOptions.map((opt, idx) => {
                    const isSelected = userAnswers[currentQuestionIdx] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setUserAnswers({ ...userAnswers, [currentQuestionIdx]: idx });
                        }}
                        className="btn btn-sm py-2.5 px-3 rounded-3 text-start border transition-all d-flex align-items-center justify-content-between"
                        style={{
                          backgroundColor: isSelected ? 'var(--brand-accent)' : 'transparent',
                          color: isSelected ? 'var(--brand-primary)' : 'var(--text-primary)',
                          borderColor: isSelected ? 'var(--brand-primary)' : 'var(--border-subtle)',
                          fontWeight: isSelected ? '600' : '400'
                        }}
                      >
                        <span>{opt}</span>
                        {isSelected && <i className="bi bi-check-circle-fill text-primary" style={{ color: 'var(--brand-primary)' }}></i>}
                      </button>
                    );
                  })}
                </div>

                {/* Navigation buttons */}
                <div className="d-flex justify-content-between pt-3 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                  <button
                    disabled={currentQuestionIdx === 0}
                    onClick={() => setCurrentQuestionIdx(currentQuestionIdx - 1)}
                    className="btn btn-light btn-sm px-3 rounded-pill"
                  >
                    Previous
                  </button>
                  {currentQuestionIdx < activeQuizQuestions.length - 1 ? (
                    <button
                      disabled={userAnswers[currentQuestionIdx] === undefined}
                      onClick={() => setCurrentQuestionIdx(currentQuestionIdx + 1)}
                      className="btn btn-primary btn-sm px-4 rounded-pill"
                      style={{ backgroundColor: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' }}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      disabled={userAnswers[currentQuestionIdx] === undefined}
                      onClick={() => {
                        setQuizFinished(true);
                        trackActivity('TEST_SUBMIT', videoTest?.id || lessonId);
                      }}
                      className="btn btn-success btn-sm px-4 rounded-pill"
                    >
                      Submit Quiz
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-3">
                <i className="bi bi-trophy-fill text-warning display-4 mb-2 d-block"></i>
                <h5 className="fw-bold mb-2">Quiz Completed!</h5>
                
                {/* Compute score */}
                {(() => {
                  let score = 0;
                  activeQuizQuestions.forEach((q, idx) => {
                    if (userAnswers[idx] === q.correctIndex) score++;
                  });
                  return (
                    <p className="lead mb-4">
                      You scored <strong className="text-primary">{score}</strong> out of <strong>{activeQuizQuestions.length}</strong>!
                    </p>
                  );
                })()}

                <button
                  onClick={() => setShowQuizModal(false)}
                  className="btn btn-primary px-4 rounded-pill"
                  style={{ backgroundColor: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Visitor Onboarding Modal */}
      <VisitorModal
        isOpen={showVisitorModal}
        onClose={() => setShowVisitorModal(false)}
        onSuccess={() => {
          setShowVisitorModal(false);
          trackActivity('VIDEO_VIEW', lessonId, 15);
          if (iframeRef.current && iframeRef.current.contentWindow) {
            try {
              iframeRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            } catch (e) {}
          }
        }}
        videoTitle={displayTitle}
      />
    </div>
  );
}
