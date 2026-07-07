import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

export default function CustomSelect({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  searchPlaceholder = 'Search...',
  showSearch = true,
  disabled = false,
  size = 'default'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset search query when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  const selectedOption = options.find(opt => String(opt.value) === String(value));

  const filteredOptions = options.filter(opt =>
    String(opt.label).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (val) => {
    if (disabled) return;
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-heading)', fontFamily: 'var(--font-heading)' }}>
          {label}
        </label>
      )}
      <div className="relative">
        {/* Dropdown Trigger */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full d-flex align-items-center justify-content-between rounded-3 border text-start outline-none transition-all ${size === 'sm' ? 'px-2 py-1.5' : 'px-3 py-2.5'}`}
          style={{
            backgroundColor: 'var(--input-bg)',
            borderColor: isOpen ? 'var(--brand-secondary)' : 'var(--input-border)',
            color: selectedOption ? 'var(--text-primary)' : 'var(--text-secondary)',
            boxShadow: isOpen ? '0 0 0 3px rgba(124, 111, 191, 0.15)' : 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            fontSize: size === 'sm' ? '0.85rem' : '1rem'
          }}
        >
          <span className="text-truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            size={18}
            className="ms-2 flex-shrink-0 transition-transform"
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              color: 'var(--text-secondary)'
            }}
          />
        </button>

        {/* Dropdown List Container */}
        {isOpen && (
          <div
            className="position-absolute w-100 mt-1 rounded-3 border shadow-lg overflow-hidden animate-slide-up"
            style={{
              zIndex: 1060,
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-subtle)',
              maxHeight: '300px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Search Input inside Dropdown */}
            {showSearch && options.length > 5 && (
              <div className="p-2 border-bottom" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="position-relative">
                  <Search
                    size={14}
                    className="position-absolute top-50 translate-middle-y ms-2.5"
                    style={{ color: 'var(--text-secondary)' }}
                  />
                  <input
                    type="text"
                    className="form-control form-control-sm ps-5 rounded-pill border-0"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      fontSize: '0.875rem',
                      backgroundColor: 'var(--search-bg)',
                      color: 'var(--text-primary)',
                      height: '32px'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}

            {/* Scrollable list of options */}
            <div className="overflow-y-auto py-1 flex-grow-1" style={{ maxHeight: '200px' }}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const isSelected = String(opt.value) === String(value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className="w-100 d-flex align-items-center justify-content-between px-3 py-2 text-start border-0 outline-none transition-colors"
                      style={{
                        backgroundColor: isSelected ? 'var(--brand-accent)' : 'transparent',
                        color: isSelected ? 'var(--brand-primary)' : 'var(--text-primary)',
                        fontWeight: isSelected ? '600' : '400',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'var(--search-bg)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <span className="text-truncate">{opt.label}</span>
                      {isSelected && <Check size={16} style={{ color: 'var(--brand-primary)' }} />}
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-2.5 text-center text-muted small">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
