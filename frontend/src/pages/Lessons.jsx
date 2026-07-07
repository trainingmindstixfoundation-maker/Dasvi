import React from 'react';
import { useParams } from 'react-router-dom';
import LessonCard from '../components/LessonCard';
import PremiumBreadcrumb from '../components/PremiumBreadcrumb';
import { getLessons, getModuleGoogleForm, searchLessons, resolveTradeName, resolveSemesterName, resolveModuleName } from '../services/csvService';
import { useLanguage } from '../services/i18n';
import ShareButton from '../components/ShareButton';

export default function Lessons({ lessons, searchQuery = '', setSearchQuery }) {
  const { tradeName, semester, moduleName } = useParams();
  const { t, language } = useLanguage();
  const normalizedTrade = resolveTradeName(lessons, tradeName);
  const normalizedSemester = resolveSemesterName(lessons, normalizedTrade, semester);
  const normalizedModule = resolveModuleName(lessons, normalizedTrade, normalizedSemester, moduleName);

  // Retrieve lessons matching normalized trade + semester + module
  const matchedLessons = getLessons(lessons, normalizedTrade, normalizedSemester, normalizedModule);

  // Dynamically resolve trade and semester for flat route compatibility
  const resolvedTrade = normalizedTrade || (matchedLessons[0]?.trade || '');
  const resolvedSemester = normalizedSemester || (matchedLessons[0]?.semester || '');
  const resolvedModule = normalizedModule || (matchedLessons[0]?.module || moduleName);

  // Retrieve translation maps
  const tradeLessons = lessons.filter(item => item.trade.toLowerCase() === resolvedTrade.toLowerCase());
  const classTranslations = tradeLessons.find(item => item.classTranslations)?.classTranslations || null;

  const semLessons = tradeLessons.filter(item => item.semester.toLowerCase() === resolvedSemester.toLowerCase());
  const mediumTranslations = semLessons.find(item => item.mediumTranslations)?.mediumTranslations || null;

  const modLessons = semLessons.filter(item => item.module.toLowerCase() === resolvedModule.toLowerCase());
  const subjectTranslations = modLessons.find(item => item.subjectTranslations)?.subjectTranslations || null;

  let displayTradeName = '';
  if (classTranslations && classTranslations[language]?.name) {
    displayTradeName = classTranslations[language].name;
  } else {
    displayTradeName = t(resolvedTrade);
  }

  let displaySemesterName = '';
  if (mediumTranslations && mediumTranslations[language]?.name) {
    displaySemesterName = mediumTranslations[language].name;
  } else {
    displaySemesterName = t(resolvedSemester);
  }

  let displayModuleName = '';
  if (subjectTranslations && subjectTranslations[language]?.name) {
    displayModuleName = subjectTranslations[language].name;
  } else {
    displayModuleName = t(resolvedModule);
  }

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
          ...(resolvedTrade ? [{ label: displayTradeName.toUpperCase(), to: `/trade/${encodeURIComponent(resolvedTrade)}` }] : []),
          ...(resolvedSemester ? [{ label: displaySemesterName, to: `/trade/${encodeURIComponent(resolvedTrade)}/semester/${encodeURIComponent(resolvedSemester)}` }] : []),
          { label: displayModuleName.toUpperCase() },
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
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-4 row-cols-xl-4 g-4">
          {filteredLessons.map(lesson => (
            <div className="col d-flex justify-content-center" key={lesson.id}>
              <div className="profile-card-wrap">
                <LessonCard 
                  lesson={lesson} 
                  googleFormUrl={moduleFormUrl} 
                  classTranslations={classTranslations}
                  mediumTranslations={mediumTranslations}
                  subjectTranslations={subjectTranslations}
                />
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
