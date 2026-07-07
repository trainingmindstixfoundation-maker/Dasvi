import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../services/i18n';
import { ProfileCard } from './ui/profile-card';
import { Play, FileText } from 'lucide-react';

const LESSON_FALLBACKS = [
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&h=600&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&h=600&fit=crop&auto=format&q=80',
];

export default function LessonCard({ lesson, googleFormUrl, classTranslations, mediumTranslations, subjectTranslations }) {
  const { id, lesson_title, description, trade, module: mod } = lesson;
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Verify if a Google Form is explicitly present
  const csvGoogleFormUrl = (lesson.google_forms && lesson.google_forms.trim() !== '')
    ? lesson.google_forms
    : (googleFormUrl && googleFormUrl.trim() !== '' && googleFormUrl !== "https://docs.google.com/forms/d/e/1FAIpQLSfF5Z3-MindstixFeedbackForm2026/viewform?usp=sf_link")
      ? googleFormUrl
      : null;

  const hasGoogleForm = !!csvGoogleFormUrl;

  // YouTube thumbnail
  const ytThumb = lesson.youtube_video_id && !lesson.youtube_video_id.startsWith('lesson-')
    ? `https://img.youtube.com/vi/${lesson.youtube_video_id}/mqdefault.jpg`
    : null;

  const image = ytThumb
    || lesson.thumbnail
    || LESSON_FALLBACKS[Math.abs(id?.charCodeAt?.(0) ?? 0) % LESSON_FALLBACKS.length];

  let displayTitle = '';
  if (lesson.videoTranslations && lesson.videoTranslations[language]?.title) {
    displayTitle = lesson.videoTranslations[language].title;
  } else {
    displayTitle = t(lesson_title);
  }

  let displayDesc = '';
  if (lesson.videoTranslations && lesson.videoTranslations[language]?.description) {
    displayDesc = lesson.videoTranslations[language].description;
  } else {
    displayDesc = t(description) || t('vp.watchVisualDemo');
  }

  let displayModuleName = '';
  if (subjectTranslations && subjectTranslations[language]?.name) {
    displayModuleName = subjectTranslations[language].name;
  } else {
    displayModuleName = t(mod);
  }

  let displayTradeName = '';
  if (classTranslations && classTranslations[language]?.name) {
    displayTradeName = classTranslations[language].name;
  } else {
    displayTradeName = t(trade);
  }

  return (
    <ProfileCard
      name={displayTitle}
      description={displayDesc}
      image={image}
      isVerified={hasGoogleForm}
      followers={1}
      following={0}
      followersLabel={displayModuleName || 'module'}
      followingLabel={displayTradeName?.toUpperCase() || 'trade'}
      followersIcon={Play}
      followingIcon={FileText}
      buttonLabel={t('lessonCard.playVideo') || 'Play Video'}
      onFollow={() => navigate(`/lesson/${encodeURIComponent(id)}`)}
      onClick={() => navigate(`/lesson/${encodeURIComponent(id)}`)}
    />
  );
}
