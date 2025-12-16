// src/components/ui/dropdown-menu-item.jsx
/**
 * DropdownMenuItem Component
 * 
 * Individual menu item in dropdown.
 */

import React from 'react';
import { DropdownMenuContext } from './dropdown-menu.jsx';

const DropdownMenuItem = ({ 
  children, 
  onClick,
  disabled = false,
  className = '',
  ...props 
}) => {
  const { setIsOpen } = React.useContext(DropdownMenuContext);

  const handleClick = (e) => {
    if (disabled) return;
    onClick?.(e);
    setIsOpen(false); // Close menu after click
  };

  return (
    <button
      type="button"
      role="menuitem"
      className={`dropdown-menu-item ${disabled ? 'disabled' : ''} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

DropdownMenuItem.displayName = 'DropdownMenuItem';

export default DropdownMenuItem;
