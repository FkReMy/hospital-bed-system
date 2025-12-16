// src/components/ui/dropdown-menu-trigger.jsx
/**
 * DropdownMenuTrigger Component
 * 
 * Trigger button for dropdown menu.
 */

import React from 'react';
import { DropdownMenuContext } from './dropdown-menu.jsx';

const DropdownMenuTrigger = ({ children, asChild = false, className = '' }) => {
  const { isOpen, setIsOpen } = React.useContext(DropdownMenuContext);

  const handleClick = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e) => {
        handleClick(e);
        children.props.onClick?.(e);
      },
      'aria-expanded': isOpen,
      'aria-haspopup': 'true',
    });
  }

  return (
    <button
      type="button"
      className={`dropdown-menu-trigger ${className}`}
      onClick={handleClick}
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      {children}
    </button>
  );
};

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

export default DropdownMenuTrigger;
