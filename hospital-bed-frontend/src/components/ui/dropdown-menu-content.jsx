// src/components/ui/dropdown-menu-content.jsx
/**
 * DropdownMenuContent Component
 * 
 * Content container for dropdown menu items.
 */

import React from 'react';
import { DropdownMenuContext } from './dropdown-menu.jsx';

const DropdownMenuContent = ({ 
  children, 
  className = '',
  align = 'end', // 'start' | 'end' | 'center'
  ...props 
}) => {
  const { isOpen } = React.useContext(DropdownMenuContext);

  if (!isOpen) return null;

  return (
    <div
      className={`dropdown-menu-content dropdown-menu-content-${align} ${className}`}
      role="menu"
      {...props}
    >
      {children}
    </div>
  );
};

DropdownMenuContent.displayName = 'DropdownMenuContent';

export default DropdownMenuContent;
