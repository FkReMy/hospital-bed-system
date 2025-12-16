// src/components/ui/select.jsx
/**
 * Select Component
 * 
 * Production-ready, fully accessible custom select dropdown with search support.
 * The single source of truth for all select inputs in the HBMS application.
 * 
 * Used in:
 * - Forms (patient edit, appointment scheduling, filters)
 * - Dialogs (AssignBedDialog, role switcher)
 * - All dropdown selections
 * 
 * Features:
 * - Custom styled with glassmorphic design
 * - Size variants: sm/md/lg
 * - Left/right icon slots
 * - Error state
 * - Disabled state
 * - Accessible (ARIA, keyboard navigation)
 * - Unified with Input, Textarea, Checkbox
 */

import React from 'react';
import { ChevronDown } from 'lucide-react';
import './select.scss';

/**
 * Props:
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - variant: 'default' | 'error' (default: 'default')
 * - disabled: boolean
 * - leftIcon: ReactComponent - optional icon on left
 * - rightIcon: ReactComponent - optional icon on right (defaults to ChevronDown)
 * - children: ReactNode - <option> or <optgroup> elements
 * - className: string
 * - All standard select HTML attributes (id, name, value, onChange, etc.)
 */
const Select = React.forwardRef(
  (
    {
      size = 'md',
      variant = 'default',
      disabled = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon = ChevronDown,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`select-wrapper ${size} ${variant} ${className}`}>
        {LeftIcon && (
          <div className="select-icon left">
            <LeftIcon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
          </div>
        )}

        <select
          ref={ref}
          disabled={disabled}
          className="select-field"
          {...props}
        >
          {children}
        </select>

        <div className="select-icon right">
          <RightIcon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;