import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  GraduationCap,
  PlayCircle,
  Video,
  Layers,
  FileText,
  Image as ImageIcon,
  User,
  Users,
  HelpCircle,
  Activity,
  Building2,
  Laptop,
  Calculator,
  FlaskConical,
  Globe
} from 'lucide-react';

/**
 * FallbackImage Component
 * Prevents broken image icons and ugly alt messages from appearing.
 * Displays a sleek default icon relative to the page content and usage when an image/SVG fails to render.
 */
export default function FallbackImage({
  src,
  alt = '',
  className = '',
  style = {},
  fallbackType = 'default',
  fallbackIcon: CustomIcon = null,
  fallbackText = '',
  iconSize = 28,
  ...props
}) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  // Determine which icon represents the usage context
  const getContextIcon = () => {
    if (CustomIcon) return <CustomIcon size={iconSize} />;

    switch (fallbackType.toLowerCase()) {
      case 'video':
      case 'lesson':
      case 'lecture':
        return <PlayCircle size={iconSize} style={{ color: 'var(--brand-primary)' }} />;
      case 'trade':
      case 'course':
      case 'career':
        return <GraduationCap size={iconSize} style={{ color: 'var(--brand-primary)' }} />;
      case 'module':
      case 'semester':
      case 'unit':
        return <Layers size={iconSize} style={{ color: 'var(--brand-primary)' }} />;
      case 'class':
      case 'classroom':
        return <BookOpen size={iconSize} style={{ color: 'var(--brand-primary)' }} />;
      case 'user':
      case 'student':
      case 'profile':
      case 'visitor':
        return <User size={iconSize} style={{ color: 'var(--brand-primary)' }} />;
      case 'subject':
      case 'science':
      case 'math':
        return <FlaskConical size={iconSize} style={{ color: 'var(--brand-primary)' }} />;
      case 'test':
      case 'quiz':
      case 'worksheet':
      case 'pdf':
        return <FileText size={iconSize} style={{ color: 'var(--brand-primary)' }} />;
      case 'institute':
      case 'college':
        return <Building2 size={iconSize} style={{ color: 'var(--brand-primary)' }} />;
      default:
        return <ImageIcon size={iconSize} style={{ color: 'var(--text-secondary)', opacity: 0.7 }} />;
    }
  };

  const getContextLabel = () => {
    if (fallbackText) return fallbackText;
    if (alt && alt.length < 30 && !alt.toLowerCase().includes('preview') && !alt.toLowerCase().includes('image')) {
      return alt;
    }
    switch (fallbackType.toLowerCase()) {
      case 'video':
      case 'lesson': return 'Video Lesson';
      case 'trade':
      case 'course': return 'Trade Course';
      case 'module': return 'Course Module';
      case 'class': return 'Classroom';
      case 'user':
      case 'student': return 'Student';
      case 'subject': return 'Subject';
      case 'test':
      case 'quiz': return 'Worksheet';
      default: return 'Resource';
    }
  };

  // If source is missing or image load errored, render context-relative fallback box
  if (!src || hasError) {
    return (
      <div
        className={`d-flex flex-column align-items-center justify-content-center text-center overflow-hidden ${className}`}
        style={{
          width: '100%',
          height: '100%',
          minHeight: style.height || '60px',
          minWidth: style.width || '60px',
          backgroundColor: 'var(--bg-secondary)',
          background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--brand-accent) 100%)',
          border: '1px solid var(--border-subtle)',
          borderRadius: style.borderRadius || '12px',
          padding: '8px',
          color: 'var(--text-primary)',
          boxSizing: 'border-box',
          ...style
        }}
        title={alt || getContextLabel()}
        {...props}
      >
        <div
          className="d-flex align-items-center justify-content-center rounded-circle mb-1"
          style={{
            width: `${Math.max(36, iconSize * 1.3)}px`,
            height: `${Math.max(36, iconSize * 1.3)}px`,
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          {getContextIcon()}
        </div>
        <span
          className="text-truncate d-block fw-semibold"
          style={{
            fontSize: '0.7rem',
            maxWidth: '90%',
            color: 'var(--text-heading)',
            opacity: 0.85,
            letterSpacing: '0.02em',
            textTransform: 'capitalize'
          }}
        >
          {getContextLabel()}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setHasError(true)}
      loading="lazy"
      {...props}
    />
  );
}
