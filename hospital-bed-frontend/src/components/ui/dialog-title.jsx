// src/components/ui/dialog-title.jsx
/**
 * DialogTitle Component
 * 
 * Title for dialog
 */

import React from 'react';

const DialogTitle = ({ children, className = '', ...props }) => {
  return (
    <h2 className={`dialog-title ${className}`} {...props}>
      {children}
    </h2>
  );
};

DialogTitle.displayName = 'DialogTitle';

export default DialogTitle;
