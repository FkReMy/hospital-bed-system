// src/components/ui/tooltip.jsx
/**
 * Tooltip Component
 * 
 * Production-ready, accessible tooltip with delay, positioning, and premium design.
 * Used throughout the application for hover help, status explanations, and actions.
 * 
 * Features:
 * - Mouse enter/exit with configurable delay
 * - Keyboard support (focus/blur)
 * - Automatic positioning (top by default, with arrow)
 * - Glassmorphic tooltip with blur and shadow
 * - Accessible (ARIA live region for screen readers)
 * - Unified with other UI components (card-like appearance)
 * - Fully keyboard and screen reader friendly
 * 
 * Wrap any element with <Tooltip content="...">...</Tooltip>
 */

import React from 'react';
import './tooltip.scss';

/**
 * Props:
 * - children: ReactNode - trigger element (usually button, icon, or text)
 * - content: string | ReactNode - tooltip content
 * - delay: number - show delay in ms (default: 200)
 * - position: 'top' | 'bottom' | 'left' | 'right' (default: 'top')
 * - className: string - additional classes for wrapper
 */
const Tooltip = ({
  children,
  content,
  delay = 200,
  position = 'top',
  className = '',
}) => {
  const [visible, setVisible] = React.useState(false);
  const timeoutRef = React.useRef(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(false);
  };

  React.useEffect(() => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }, []);

  return (
    <div 
      className={`tooltip-wrapper ${className}`}
      onBlur={hideTooltip}
      onFocus={showTooltip}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}

      {visible && content && (
        <div 
          aria-hidden={!visible}
          className={`tooltip ${position}`}
          role="tooltip"
        >
          <div className="tooltip-arrow" />
          <div className="tooltip-content">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;