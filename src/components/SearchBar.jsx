import React from 'react';

export default function SearchBar({ value, onChange, placeholder = "Search for trades, modules, topics or lessons..." }) {
  return (
    <div className="position-relative w-100 mx-auto mb-4" style={{ maxWidth: '650px' }}>
      <span className="position-absolute top-50 start-0 translate-middle-y ms-4 text-neon">
        <i className="bi bi-search fs-5"></i>
      </span>
      <input 
        type="text" 
        className="form-control search-input ps-5 py-3 w-100" 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search items"
      />
      {value && (
        <button 
          className="btn position-absolute top-50 end-0 translate-middle-y me-3 text-secondary border-0 bg-transparent hover-neon"
          onClick={() => onChange('')}
          style={{ cursor: 'pointer' }}
          aria-label="Clear search"
        >
          <i className="bi bi-x-circle-fill fs-5"></i>
        </button>
      )}
    </div>
  );
}
