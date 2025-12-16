// src/components/ui/dialog-footer.jsx
/**
 * DialogFooter Component
 * 
 * Footer section for dialog (usually contains action buttons)
 */

import React from 'react';

const DialogFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`dialog-footer ${className}`} {...props}>
      {children}
    </div>
  );
};

DialogFooter.displayName = 'DialogFooter';

export default DialogFooter;
