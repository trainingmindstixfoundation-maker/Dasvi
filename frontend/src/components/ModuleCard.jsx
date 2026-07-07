import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../services/i18n';
import { ProfileCard } from './ui/profile-card';
import { BookOpen, PlayCircle, FlaskConical, Calculator, Globe, FileText, Briefcase, MessageSquare, Code } from 'lucide-react';

const MODULE_IMAGES = {
  'mathematics':        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=800&fit=crop&auto=format&q=80',
  'science':            'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=800&fit=crop&auto=format&q=80',
  'physics':            'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&h=800&fit=crop&auto=format&q=80',
  'english grammar':    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=800&fit=crop&auto=format&q=80',
  'microsoft word':     'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=800&fit=crop&auto=format&q=80',
  'microsoft excel':    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=800&fit=crop&auto=format&q=80',
  'technical programs': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=800&fit=crop&auto=format&q=80',
  'communication':      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=800&fit=crop&auto=format&q=80',
  'resume building':    'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=800&fit=crop&auto=format&q=80',
  'introductions':      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=800&fit=crop&auto=format&q=80',
  'mcqs':               'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=800&fit=crop&auto=format&q=80',
};

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=800&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&h=800&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=800&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&h=800&fit=crop&auto=format&q=80',
];

const MODULE_ICONS = {
  'mathematics':        Calculator,
  'science':            FlaskConical,
  'physics':            FlaskConical,
  'english grammar':    Globe,
  'microsoft word':     FileText,
  'microsoft excel':    FileText,
  'technical programs': Code,
  'communication':      MessageSquare,
  'resume building':    Briefcase,
  'introductions':      MessageSquare,
  'mcqs':               FileText,
};

export default function ModuleCard({ tradeName, semesterName, moduleName, lessonCount, googleFormUrl, index = 0, subjectTranslations, classTranslations, mediumTranslations }) {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const moduleKey = moduleName.toLowerCase();

  const image = MODULE_IMAGES[moduleKey]
    || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

  const linkTo = `/trade/${encodeURIComponent(tradeName)}/semester/${encodeURIComponent(semesterName)}/module/${encodeURIComponent(moduleName)}`;

  let displayModuleName = '';
  if (subjectTranslations && subjectTranslations[language]?.name) {
    displayModuleName = subjectTranslations[language].name;
  } else {
    displayModuleName = t(moduleName);
  }

  let displayTradeName = '';
  if (classTranslations && classTranslations[language]?.name) {
    displayTradeName = classTranslations[language].name;
  } else {
    displayTradeName = t(tradeName);
  }

  let displaySemesterName = '';
  if (mediumTranslations && mediumTranslations[language]?.name) {
    displaySemesterName = mediumTranslations[language].name;
  } else {
    displaySemesterName = t(semesterName);
  }

  return (
    <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3 mb-4 d-flex justify-content-center">
      <div className="profile-card-wrap">
      <ProfileCard
        name={displayModuleName}
        description={`${displayTradeName.toUpperCase()} • ${displaySemesterName}`}
        image={image}
        isVerified={!!googleFormUrl}
        followers={lessonCount}
        following={lessonCount}
        followersLabel={lessonCount === 1 ? (t('moduleCard.video')) : (t('moduleCard.videos'))}
        followingLabel={t('tradeCard.lectures')}
        followersIcon={MODULE_ICONS[moduleKey] || BookOpen}
        followingIcon={PlayCircle}
        buttonLabel={t('moduleCard.viewLessons') || 'View Lessons'}
        onClick={() => navigate(linkTo)}
        onFollow={() => navigate(linkTo)}
      />
      </div>
    </div>
  );
}
