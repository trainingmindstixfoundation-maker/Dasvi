import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * PremiumBreadcrumb
 * 
 * Clean, text-based breadcrumb:  ← Back / Home / Class 9 / English Medium
 * 
 * - "← Back" navigates to `backTo` or browser history
 * - Each crumb is clickable (except the last = current page, shown in bold)
 * - "/" separators between items
 * - Fully theme-aware via Dasvi CSS vars
 * 
 * Props:
 *  backTo  — href for the ← Back link (falls back to navigate(-1))
 *  crumbs  — array of { label, to? } objects. Last item = current page (bold, no link).
 */
export default function PremiumBreadcrumb({ backTo, crumbs = [] }) {
  const navigate = useNavigate();

  const handleBack = (e) => {
    e.preventDefault();
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0',
        marginBottom: '1.5rem',
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(0.82rem, 0.75rem + 0.4vw, 0.92rem)',
        lineHeight: 1.5,
      }}
    >
      {/* ← Back */}
      <a
        href={backTo || '#'}
        onClick={handleBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          fontWeight: 500,
          transition: 'color 0.2s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--brand-primary)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
        aria-label="Go back"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          style={{ flexShrink: 0 }}
        >
          <path
            d="M13 8H3M7 4l-4 4 4 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back
      </a>

      {/* Separator after Back */}
      <Separator />

      {/* Crumb items */}
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;

        return (
          <React.Fragment key={i}>
            {isLast ? (
              /* Current page — bold, no link */
              <span
                style={{
                  fontWeight: 800,
                  color: 'var(--text-heading)',
                  maxWidth: '280px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={crumb.label}
              >
                {crumb.label}
              </span>
            ) : (
              /* Clickable crumb */
              <Link
                to={crumb.to || '/'}
                style={{
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'color 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--brand-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                {crumb.label}
              </Link>
            )}

            {/* Separator between crumbs (not after last) */}
            {!isLast && <Separator />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

/** Compact "/" separator */
function Separator() {
  return (
    <span
      aria-hidden="true"
      style={{
        margin: '0 8px',
        color: 'var(--text-secondary)',
        opacity: 0.35,
        fontWeight: 400,
        fontSize: '0.95em',
        userSelect: 'none',
      }}
    >
      /
    </span>
  );
}
