import React, { useState } from 'react';

export default function ShareButton({ url = window.location.href, title = 'Share', className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Dasvi Platform',
          url: url
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
      // Fallback for clipboard if share fails
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (clipErr) {
        console.error('Clipboard fallback failed', clipErr);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`btn btn-sm d-inline-flex align-items-center gap-2 rounded-pill shadow-sm px-3 py-1 ${className}`}
      style={{
        border: '1px solid var(--border-subtle)',
        backgroundColor: copied ? 'rgba(140, 198, 63, 0.1)' : 'var(--bg-secondary)',
        color: copied ? 'var(--brand-secondary)' : 'var(--brand-primary)',
        fontWeight: '600',
        transition: 'all 0.2s',
        fontSize: '0.85rem'
      }}
      title={title}
    >
      <i className={`bi ${copied ? 'bi-check-circle-fill' : 'bi-share-fill'}`}></i>
      {copied ? 'Copied!' : title}
    </button>
  );
}
