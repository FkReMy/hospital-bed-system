// src/components/common/GlassCard.jsx
/**
 * GlassCard Component
 * 
 * Reusable glassmorphic card component with the new calming healthcare design.
 * Foundation for all elevated content blocks in the HBMS dashboard.
 * 
 * Features:
 * - Glassmorphic background with blur and subtle border (bg-white/80 backdrop-blur-md)
 * - Hover lift with enhanced shadow
 * - Responsive padding
 * - Interactive variant (clickable)
 * - Fully accessible and performant
 * 
 * Design System:
 * - Uses Tailwind classes for new healthcare color palette
 * - bg-white/80 backdrop-blur-md border border-gray-200/50 shadow-lg rounded-2xl
 */

import React from 'react';

/**
 * Props:
 * - children: ReactNode - card content
 * - className: string - additional Tailwind classes
 * - onClick: () => void - optional click handler
 * - interactive: boolean - adds hover lift and cursor pointer
 */
const GlassCard = React.forwardRef(
  (
    {
      children,
      className = '',
      onClick,
      interactive = false,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'bg-white/80 backdrop-blur-md border border-gray-200/50 shadow-lg rounded-2xl p-6';
    const interactiveClasses = interactive 
      ? 'cursor-pointer hover:-translate-y-1 transition-transform duration-300' 
      : '';
    
    const interactiveProps = interactive && onClick
      ? {
          role: 'button',
          tabIndex: 0,
          onClick,
          onKeyDown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick?.(e);
            }
          },
        }
      : {};

    return (
      <div
        className={`${baseClasses} ${interactiveClasses} ${className}`}
        ref={ref}
        {...interactiveProps}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export default GlassCard;
