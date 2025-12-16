// src/components/ui/input.jsx
/**
 * Input Component
 * 
 * Production-ready, fully accessible text input with label, error, and icon support.
 * The single source of truth for all text inputs in the HBMS application.
 * 
 * Used in:
 * - Forms (login, patient edit, search, filters)
 * - Dialogs (AssignBedDialog, AppointmentForm)
 * - All text entry fields
 * 
 * Features:
 * - Variants: default, error
 * - Size variants: sm/md/lg
 * - Left/right icon slots
 * - Label and error message support
 * - Disabled and loading states
 * - Premium glassmorphic design with focus ring
 * - Unified with other form controls (select, textarea, checkbox)
 */

import React from 'react';
import './input.scss';

/**
 * Props:
 * - type: string (default: 'text')
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - variant: 'default' | 'error' (default: 'default')
 * - disabled: boolean
 * - leftIcon: ReactComponent - optional icon on left
 * - rightIcon: ReactComponent - optional icon on right
 * - className: string
 * - All standard input HTML attributes (id, name, value, onChange, placeholder, etc.)
 */
const Input = React.forwardRef(
  (
    {
      type = 'text',
      size = 'md',
      variant = 'default',
      disabled = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      className = '',
      ...props
    },
    ref
  ) => (
      <div className={`input-wrapper ${size} ${variant} ${className}`}>
        {LeftIcon && (
          <div className="input-icon left">
            <LeftIcon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
          </div>
        )}

        <input
          className="input-field"
          disabled={disabled}
          ref={ref}
          type={type}
          {...props}
        />

        {RightIcon && (
          <div className="input-icon right">
            <RightIcon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
          </div>
        )}
      </div>
    )
);

Input.displayName = 'Input';

export default Input;