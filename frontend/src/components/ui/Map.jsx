import React from 'react';

export function Map({ center = [19.1947, 72.9537], zoom = 15, children }) {
  const lat = center[0];
  const lon = center[1];
  
  return (
    <div className="w-100 h-100 position-relative rounded-4 overflow-hidden shadow-sm" style={{ minHeight: '420px', backgroundColor: '#e5e9f0', border: '1px solid var(--border-subtle)' }}>
      {/* Interactive Google Map Embed centered at the given coordinates */}
      <iframe 
        width="100%" 
        height="100%" 
        frameBorder="0" 
        scrolling="no" 
        marginHeight="0" 
        marginWidth="0" 
        title="Mindstix Location Map"
        src={`https://maps.google.com/maps?q=${lat},${lon}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`}
        style={{ border: 0 }}
      ></iframe>
      
      {/* Overlays container with pointer-events: none to allow scrolling the map underneath */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ pointerEvents: 'none', zIndex: 10 }}>
        {children}
      </div>
    </div>
  );
}
export default Map;
