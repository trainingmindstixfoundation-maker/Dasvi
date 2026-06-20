import React from 'react';

/**
 * TextWrapper component for responsive typography.
 * Wraps text using clamp() based styling mapping to sizes: xs, sm, base, md, lg, xl, xxl.
 */
export default function TextWrapper({ 
  children, 
  size = 'base', 
  className = '', 
  style = {}, 
  as: Component = 'span', 
  ...props 
}) {
  const sizeClass = `text-wrapper-${size}`;
  return (
    <Component 
      className={`${sizeClass} ${className}`} 
      style={style} 
      {...props}
    >
      {children}
    </Component>
  );
}
