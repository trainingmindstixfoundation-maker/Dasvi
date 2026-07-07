import React from 'react';

export function MapPopup({ 
  longitude, 
  latitude, 
  onClose, 
  closeButton = true, 
  children,
  ...props 
}) {
  return (
    <div 
      className="position-absolute bg-white p-4 rounded-4 shadow-lg text-start"
      style={{ 
        bottom: '24px', 
        left: '24px', 
        maxWidth: '360px', 
        width: 'calc(100% - 48px)', 
        zIndex: 20, 
        pointerEvents: 'auto', // Enable pointer events for active popup clicks
        border: '1px solid rgba(28, 68, 133, 0.08)',
        boxShadow: '0 15px 35px rgba(15, 23, 42, 0.12)',
        animation: 'slideUpPopup 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      {...props}
    >
      {closeButton && (
        <button 
          onClick={onClose} 
          className="btn-close position-absolute top-0 end-0 m-3" 
          style={{ fontSize: '0.75rem', cursor: 'pointer' }}
          aria-label="Close popup"
        />
      )}
      {children}
    </div>
  );
}
export default MapPopup;
