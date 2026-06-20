import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../services/i18n';
import { ProfileCard } from './ui/profile-card';
import { BookOpen, GraduationCap, Laptop, Compass, Award, PlayCircle } from 'lucide-react';

/**
 * Curated Unsplash images per trade – known-good URLs
 */
const TRADE_IMAGES = {
  'class 9':            'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=800&fit=crop&auto=format&q=80',
  'class 10':           'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&h=800&fit=crop&auto=format&q=80',
  'class 12':           'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=800&fit=crop&auto=format&q=80',
  'skill development':  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=800&fit=crop&auto=format&q=80',
  'career guidance':    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=800&fit=crop&auto=format&q=80',
};

const TRADE_ICONS = {
  'class 9':            BookOpen,
  'class 10':           Award,
  'class 12':           GraduationCap,
  'skill development':  Laptop,
  'career guidance':    Compass,
};

export default function TradeCard({ tradeName, videoCount, moduleCount }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const key = tradeName.toLowerCase();

  const image = TRADE_IMAGES[key]
    || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=800&fit=crop&auto=format&q=80';

  // Use the per-trade description key, fall back to the default
  const descKey = `tradeCard.desc.${key}`;
  const desc = t(descKey) !== descKey ? t(descKey) : t('tradeCard.desc.default');

  return (
    <ProfileCard
      name={t(tradeName).toUpperCase()}
      description={desc}
      image={image}
      isVerified={true}
      followers={moduleCount}
      following={videoCount}
      followersLabel={t('tradeCard.modules')}
      followingLabel={t('tradeCard.lectures')}
      followersIcon={TRADE_ICONS[key] || BookOpen}
      followingIcon={PlayCircle}
      buttonLabel={t('hero.exploreCourses') || 'Explore Courses'}
      onFollow={() => navigate(`/trade/${encodeURIComponent(tradeName)}`)}
      onClick={() => navigate(`/trade/${encodeURIComponent(tradeName)}`)}
      className="w-full"
    />
  );
}
