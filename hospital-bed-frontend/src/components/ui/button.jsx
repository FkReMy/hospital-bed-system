// src/components/ui/button.jsx
/**
 * Button Component
 * 
 * Production-ready, fully accessible button with variants, sizes,
 * loading state, and icon support. The single source of truth for all buttons
 * in the HBMS application.
 * 
 * Used in:
 * - Topbar, Sidebar, forms, dialogs, cards, tables
 * - All actions (Add, Save, Cancel, Delete, Assign, etc.)
 * 
 * Features:
 * - Variants: default, destructive, outline, secondary, ghost, link
 * - Sizes: sm, md, lg, icon
 * - Loading spinner with text disable
 * - Left/right icon slots
 * - Disabled state handling
 * - Premium glassmorphic design with hover/focus states
 * - Unified across the entire system
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import './button.scss';

/**
 * Props:
 * - variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
 * - size: 'sm' | 'md' | 'lg' | 'icon'
 * - isLoading: boolean - shows spinner and disables button
 * - disabled: boolean
 * - children: ReactNode
 * - className: string
 * - type: 'button' | 'submit' | 'reset' (default: 'button')
 * - onClick: () => void
 * - asChild: boolean - when true, clones the child element and merges props
 * - All standard button HTML attributes
 */
const Button = React.forwardRef(
  (
    {
      variant = 'default',
      size = 'md',
      isLoading = false,
      disabled = false,
      children,
      className = '',
      type = 'button',
      asChild = false,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;
    const buttonClasses = `button ${variant} ${size} ${isLoading ? 'loading' : ''} ${className}`;

    // If asChild is true, clone the child element and merge props
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...props,
        ref,
        className: `${buttonClasses} ${children.props.className || ''}`.trim(),
        disabled: isDisabled,
      });
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={buttonClasses}
        {...props}
      >
        {isLoading && (
          <Loader2 className="loadingSpinner" size={size === 'icon' ? 16 : size === 'sm' ? 14 : 18} />
        )}

        <span className="buttonContent">
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;