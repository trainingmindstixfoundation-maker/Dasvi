import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../services/i18n';
import { ProfileCard } from './ui/profile-card';
import { PlayCircle, Languages } from 'lucide-react';

const SEMESTER_IMAGES = {
  'english':    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=800&fit=crop&auto=format&q=80',
  'hindi':      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&h=800&fit=crop&auto=format&q=80',
  'marathi':    'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&h=800&fit=crop&auto=format&q=80',
  'tech':       'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=800&fit=crop&auto=format&q=80',
  'growth':     'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=800&fit=crop&auto=format&q=80',
  'career':     'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=800&fit=crop&auto=format&q=80',
  'assessment': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=800&fit=crop&auto=format&q=80',
};

const getSemesterImage = (semName) => {
  const lower = semName.toLowerCase();
  for (const [key, url] of Object.entries(SEMESTER_IMAGES)) {
    if (lower.includes(key)) return url;
  }
  return 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=800&fit=crop&auto=format&q=80';
};

export default function SemesterCard({ tradeName, semesterName, videoCount, moduleCount, mediumTranslations, classTranslations }) {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const image = getSemesterImage(semesterName);
  const linkTo = `/trade/${encodeURIComponent(tradeName)}/semester/${encodeURIComponent(semesterName)}`;

  let displayName = '';
  if (mediumTranslations && mediumTranslations[language]?.name) {
    displayName = mediumTranslations[language].name;
  } else {
    displayName = t(semesterName);
  }

  let displayTradeName = '';
  if (classTranslations && classTranslations[language]?.name) {
    displayTradeName = classTranslations[language].name;
  } else {
    displayTradeName = t(tradeName);
  }

  return (
    <div className="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3 mb-4 d-flex justify-content-center">
      <div className="profile-card-wrap">
        <ProfileCard
          name={displayName}
          description={`${displayTradeName.toUpperCase()} — ${t('semesterCard.description')}`}
          image={image}
          isVerified={true}
          followers={moduleCount}
          following={videoCount}
          followersLabel={t('semesterCard.modules')}
          followingLabel={t('semesterCard.videoLessons')}
          followersIcon={Languages}
          followingIcon={PlayCircle}
          buttonLabel="View Modules"
          onFollow={() => navigate(linkTo)}
          onClick={() => navigate(linkTo)}
        />
      </div>
    </div>
  );
}
