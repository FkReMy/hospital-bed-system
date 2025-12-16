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
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        className={`button ${variant} ${size} ${isLoading ? 'loading' : ''} ${className}`}
        disabled={isDisabled}
        ref={ref}
        type={type}
        {...props}
      >
        {isLoading && (
          <Loader2 className="loading-spinner" size={size === 'icon' ? 16 : size === 'sm' ? 14 : 18} />
        )}

        <span className="button-content">
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;