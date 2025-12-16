// src/components/ui/dialog-content.jsx
/**
 * DialogContent Component
 * 
 * Content wrapper for dialog body
 */

import React from 'react';

const DialogContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`dialog-content-wrapper ${className}`} {...props}>
      {children}
    </div>
  );
};

DialogContent.displayName = 'DialogContent';

export default DialogContent;
