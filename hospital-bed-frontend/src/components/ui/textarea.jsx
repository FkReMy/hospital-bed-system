// src/components/ui/textarea.jsx
/**
 * Textarea Component
 * 
 * Production-ready, fully accessible textarea with label, error, and resize support.
 * The single source of truth for all multi-line text inputs in the HBMS application.
 * 
 * Used in:
 * - Forms (notes, instructions, patient history)
 * - Dialogs (AppointmentForm, Prescription notes)
 * - All multi-line entry fields
 * 
 * Features:
 * - Variants: default, error
 * - Size variants: sm/md/lg
 * - Auto-resize option (rows or className)
 * - Disabled state
 * - Premium glassmorphic design with focus ring
 * - Unified with Input, Select, Checkbox
 */

import React from 'react';
import './textarea.scss';

/**
 * Props:
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - variant: 'default' | 'error' (default: 'default')
 * - disabled: boolean
 * - rows: number - optional fixed rows
 * - className: string
 * - All standard textarea HTML attributes (id, name, value, onChange, placeholder, etc.)
 */
const Textarea = React.forwardRef(
  (
    {
      size = 'md',
      variant = 'default',
      disabled = false,
      rows,
      className = '',
      ...props
    },
    ref
  ) => (
      <textarea
        className={`textarea ${size} ${variant} ${className}`}
        disabled={disabled}
        ref={ref}
        rows={rows}
        {...props}
      />
    )
);

Textarea.displayName = 'Textarea';

export default Textarea;