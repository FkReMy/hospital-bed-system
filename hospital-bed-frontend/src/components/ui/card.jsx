// src/components/ui/card.jsx
/**
 * Card Component
 * 
 * Production-ready, reusable card container with premium glassmorphic design.
 * The foundation for all elevated content blocks in the HBMS dashboard.
 * 
 * Features:
 * - Glassmorphic background with blur and subtle border
 * - Hover lift with enhanced shadow
 * - Optional header, body, footer slots
 * - Responsive padding
 * - Interactive variant (clickable)
 * - Unified across all domain cards (PatientSummaryCard, BedCard, PrescriptionCard, etc.)
 * - Fully accessible and performant
 */

import React from 'react';
import './card.scss';

/**
 * Props:
 * - children: ReactNode - card content
 * - className: string - additional classes
 * - interactive: boolean - adds hover lift and cursor pointer
 * - onClick: () => void - optional click handler
 * - All standard div HTML attributes
 */
const Card = React.forwardRef(
  (
    {
      children,
      className = '',
      interactive = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const interactiveProps = interactive
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
        className={`card ${interactive ? 'interactive' : ''} ${className}`}
        ref={ref}
        {...interactiveProps}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;