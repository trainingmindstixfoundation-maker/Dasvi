import React from 'react';
import { useParams } from 'react-router-dom';
import LessonCard from '../components/LessonCard';
import PremiumBreadcrumb from '../components/PremiumBreadcrumb';
import { getLessons, getModuleGoogleForm, searchLessons, resolveTradeName, resolveSemesterName, resolveModuleName } from '../services/csvService';
import { useLanguage } from '../services/i18n';
import ShareButton from '../components/ShareButton';

export default function Lessons({ lessons, searchQuery = '', setSearchQuery }) {
  const { tradeName, semester, moduleName } = useParams();
  const { t } = useLanguage();
  const normalizedTrade = resolveTradeName(lessons, tradeName);
  const normalizedSemester = resolveSemesterName(lessons, normalizedTrade, semester);
  const normalizedModule = resolveModuleName(lessons, normalizedTrade, normalizedSemester, moduleName);

  // Retrieve lessons matching normalized trade + semester + module
  const matchedLessons = getLessons(lessons, normalizedTrade, normalizedSemester, normalizedModule);

  // Dynamically resolve trade and semester for flat route compatibility
  const resolvedTrade = normalizedTrade || (matchedLessons[0]?.trade || '');
  const resolvedSemester = normalizedSemester || (matchedLessons[0]?.semester || '');
  const resolvedModule = normalizedModule || (matchedLessons[0]?.module || moduleName);

  // Get module-level google form
  const moduleFormUrl = getModuleGoogleForm(lessons, resolvedTrade, resolvedSemester, resolvedModule);

  const backLink = (resolvedTrade && resolvedSemester)
    ? `/trade/${encodeURIComponent(resolvedTrade)}/semester/${encodeURIComponent(resolvedSemester)}`
    : '/';

  // Filter lessons dynamically based on query
  const filteredLessons = searchQuery.trim()
    ? searchLessons(matchedLessons, searchQuery)
    : matchedLessons;

  return (
    <div className="container py-5 flex-grow-1 text-start">
      <PremiumBreadcrumb
        backTo={backLink}
        crumbs={[
          { label: t('breadcrumb.home'), to: '/' },
          ...(resolvedTrade ? [{ label: t(resolvedTrade).toUpperCase(), to: `/trade/${encodeURIComponent(resolvedTrade)}` }] : []),
          ...(resolvedSemester ? [{ label: t(resolvedSemester), to: `/trade/${encodeURIComponent(resolvedTrade)}/semester/${encodeURIComponent(resolvedSemester)}` }] : []),
          { label: t(resolvedModule).toUpperCase() },
        ]}
      />

      {/* Page Header */}
      <div className="mb-5 pb-3 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-3" style={{ borderColor: 'var(--border-subtle)' }}>
        <div>
          <h1 className="text-heading fw-bold display-6 m-0" style={{ fontFamily: 'var(--font-heading)', color: 'var(--brand-primary)', fontWeight: '800' }}>
            {t('lessons.title')}
          </h1>
          <p className="text-muted-custom mt-2 mb-0">
            {t('lessons.description')}
          </p>
        </div>
        <ShareButton />
      </div>

      {/* Unified Lessons Grid — ProfileCard-based, responsive */}
      {filteredLessons.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredLessons.map(lesson => (
            <div className="col d-flex justify-content-center" key={lesson.id}>
              <div className="profile-card-wrap">
                <LessonCard lesson={lesson} googleFormUrl={moduleFormUrl} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted py-5 border rounded-4" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
          <i className="bi bi-play-btn fs-2 mb-2 d-block" style={{ color: 'var(--brand-primary)' }}></i>
          <span>{t('lessons.noLessons')} "{searchQuery}".</span>
        </div>
      )}
    </div>
  );
}
