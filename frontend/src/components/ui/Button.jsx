import React from 'react';

export function Button({ 
  children, 
  variant = 'solid', 
  size = 'sm', 
  className = '', 
  onClick, 
  style = {},
  ...props 
}) {
  let baseClass = "btn fw-bold rounded-pill shadow-sm transition-all ";
  
  if (variant === 'outline') {
    baseClass += "btn-outline-primary ";
  } else if (variant === 'secondary') {
    baseClass += "btn-secondary ";
  } else if (variant === 'link') {
    baseClass += "btn-link text-decoration-none ";
  } else {
    baseClass += "btn-primary text-white ";
  }

  const customStyle = {
    fontSize: size === 'sm' ? '0.78rem' : '0.9rem',
    padding: size === 'sm' ? '0.45rem 1.1rem' : '0.6rem 1.4rem',
    cursor: 'pointer',
    ...style
  };

  return (
    <button 
      className={`${baseClass} ${className}`} 
      onClick={onClick} 
      style={customStyle}
      {...props}
    >
      {children}
    </button>
  );
}
