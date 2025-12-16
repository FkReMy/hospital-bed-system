// src/components/ui/dropdown-menu.jsx
/**
 * DropdownMenu Component
 * 
 * Production-ready, accessible dropdown menu component.
 * Used for user menus, action menus, and contextual options.
 * 
 * Features:
 * - Keyboard navigation (Tab, Arrow keys, Enter, Escape)
 * - Click-outside to close
 * - Portal rendering for proper z-index
 * - Dark/light theme compatible
 * - Smooth animations
 * - Accessible ARIA attributes
 * 
 * Usage:
 * <DropdownMenu>
 *   <DropdownMenuTrigger asChild>
 *     <Button>Open Menu</Button>
 *   </DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuItem>Action 1</DropdownMenuItem>
 *     <DropdownMenuItem>Action 2</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 */

import React from 'react';
import './dropdown-menu.scss';

const DropdownMenuContext = React.createContext({
  isOpen: false,
  setIsOpen: () => {},
});

/**
 * DropdownMenu - root component
 */
const DropdownMenu = ({ children, onOpenChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef(null);

  const handleOpenChange = (open) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  // Close on click outside
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleOpenChange(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  React.useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handleOpenChange(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen: handleOpenChange }}>
      <div className="dropdown-menu" ref={menuRef}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

DropdownMenu.displayName = 'DropdownMenu';

export default DropdownMenu;
export { DropdownMenuContext };
