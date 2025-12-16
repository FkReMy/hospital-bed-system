// src/components/ui/label.jsx
/**
 * Label Component
 * 
 * Production-ready, accessible form label component.
 * Used with inputs, selects, textareas, checkboxes, and radio buttons.
 * 
 * Features:
 * - Accessible with proper htmlFor association
 * - Supports required indicator
 * - Dark/light theme compatible
 * - Consistent typography
 * - Proper cursor behavior
 * 
 * Usage:
 * <Label htmlFor="email" required>Email Address</Label>
 * <Input id="email" type="email" />
 */

import React from 'react';
import './label.scss';

const Label = React.forwardRef(({ 
  children, 
  htmlFor,
  required = false,
  className = '', 
  ...props 
}, ref) => (
    <label
      className={`label ${className}`}
      htmlFor={htmlFor}
      ref={ref}
      {...props}
    >
      {children}
      {required && <span aria-label="required" className="label-required">*</span>}
    </label>
  ));

Label.displayName = 'Label';

export default Label;
