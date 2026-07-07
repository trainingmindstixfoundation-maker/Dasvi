import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ModuleCard from '../components/ModuleCard';
import PremiumBreadcrumb from '../components/PremiumBreadcrumb';
import { getModules, getModuleGoogleForm, resolveTradeName, resolveSemesterName } from '../services/csvService';
import { useLanguage } from '../services/i18n';
import ShareButton from '../components/ShareButton';

export default function Modules({ lessons, searchQuery = '', setSearchQuery }) {
  const { tradeName, semester } = useParams();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const resolvedTrade = resolveTradeName(lessons, tradeName);
  const resolvedSemester = resolveSemesterName(lessons, resolvedTrade, semester);

  // Retrieve modules under this trade + semester
  const modules = getModules(lessons, resolvedTrade, resolvedSemester);

  const tradeLessons = lessons.filter(item => item.trade.toLowerCase() === resolvedTrade.toLowerCase());
  const classTranslations = tradeLessons.find(item => item.classTranslations)?.classTranslations || null;

  const semLessons = tradeLessons.filter(item => item.semester.toLowerCase() === resolvedSemester.toLowerCase());
  const mediumTranslations = semLessons.find(item => item.mediumTranslations)?.mediumTranslations || null;

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

  // Helper metric builder
  const getLessonCount = (modName) => {
    return lessons.filter(item =>
      !item.placeholder &&
      item.trade.toLowerCase() === resolvedTrade.toLowerCase() &&
      item.semester.toLowerCase() === resolvedSemester.toLowerCase() &&
      item.module.toLowerCase() === modName.toLowerCase()
    ).length;
  };

  // Filter modules dynamically based on query
  const filteredModules = modules.filter(mod =>
    mod.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="container py-5 flex-grow-1 text-start">
      <PremiumBreadcrumb
        backTo={`/trade/${encodeURIComponent(resolvedTrade)}`}
        crumbs={[
          { label: t('breadcrumb.home'), to: '/' },
          { label: displayTradeName.toUpperCase(), to: `/trade/${encodeURIComponent(resolvedTrade)}` },
          { label: displaySemesterName },
        ]}
      />

      {/* Page Header */}
      <div className="mb-5 pb-3 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-3" style={{ borderColor: 'var(--border-subtle)' }}>
        <div>
          <h1 className="text-heading fw-bold display-6 m-0" style={{ fontFamily: 'var(--font-heading)', color: 'var(--brand-primary)', fontWeight: '800' }}>
            {t('modules.title')}
          </h1>
          <p className="text-muted-custom mt-2 mb-0">
            {t('modules.description')}
          </p>
        </div>
        <ShareButton />
      </div>

      {/* Modules Grid — all trades now use the unified ProfileCard-based ModuleCard */}
      {filteredModules.length > 0 ? (
        <div className="row g-4">
          {filteredModules.map((mod, index) => {
            const formUrl = getModuleGoogleForm(lessons, tradeName, semester, mod);
            const modLessons = lessons.filter(item =>
              item.trade.toLowerCase() === resolvedTrade.toLowerCase() &&
              item.semester.toLowerCase() === resolvedSemester.toLowerCase() &&
              item.module.toLowerCase() === mod.toLowerCase()
            );
            const subjectTrans = modLessons.find(item => item.subjectTranslations)?.subjectTranslations || null;
            return (
              <ModuleCard
                key={mod}
                tradeName={tradeName}
                semesterName={semester}
                moduleName={mod}
                lessonCount={getLessonCount(mod)}
                googleFormUrl={formUrl}
                index={index}
                subjectTranslations={subjectTrans}
                classTranslations={classTranslations}
                mediumTranslations={mediumTranslations}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center text-muted py-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)', borderRadius: '32px' }}>
          <i className="bi bi-journal-x fs-2 mb-2 d-block" style={{ color: 'var(--brand-primary)' }}></i>
          <span>{t('modules.noModules')} "{searchQuery}". {t('trade.tryDifferent')}</span>
        </div>
      )}
    </div>
  );
}
