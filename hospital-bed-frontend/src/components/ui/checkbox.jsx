// src/components/ui/checkbox.jsx
/**
 * Checkbox Component
 * 
 * Production-ready, fully accessible checkbox with label support.
 * Used in forms, filters, and settings across the HBMS application.
 * 
 * Features:
 * - Custom styled checkbox with checkmark
 * - Indeterminate state support
 * - Label association for accessibility
 * - Disabled state
 * - Size variants (sm/md/lg)
 * - Unified with premium glassmorphic design and focus states
 * - Matches other form controls (input, select, etc.)
 */

import React from 'react';
import { Check } from 'lucide-react';
import './checkbox.scss';

/**
 * Props:
 * - checked: boolean | 'indeterminate'
 * - onCheckedChange: (checked: boolean) => void
 * - disabled: boolean
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - id: string - required for label association
 * - name: string
 * - children: ReactNode - label text/content
 * - className: string
 */
const Checkbox = React.forwardRef(
  (
    {
      checked = false,
      onCheckedChange,
      disabled = false,
      size = 'md',
      id,
      name,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const isChecked = checked === true || checked === 'indeterminate';
    const isIndeterminate = checked === 'indeterminate';

    return (
      <div className={`checkbox-wrapper ${size} ${className}`}>
        <div className="checkboxContainer">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            name={name}
            checked={isChecked}
            disabled={disabled}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            className="checkboxInput"
            aria-checked={isIndeterminate ? 'mixed' : checked}
            {...props}
          />

          <div className="checkboxCustom">
            {(isChecked && !isIndeterminate) && (
              <Check className="checkmark" size={size === 'sm' ? 12 : size === 'lg' ? 20 : 16} />
            )}
            {isIndeterminate && (
              <div className="indeterminateDash" />
            )}
          </div>
        </div>

        {children && (
          <label htmlFor={id} className="checkboxLabel">
            {children}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;