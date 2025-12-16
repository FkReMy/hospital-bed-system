// src/components/ui/dialog-description.jsx
/**
 * DialogDescription Component
 * 
 * Description/subtitle for dialog
 */

import React from 'react';

const DialogDescription = ({ children, className = '', ...props }) => {
  return (
    <p className={`dialog-description ${className}`} {...props}>
      {children}
    </p>
  );
};

DialogDescription.displayName = 'DialogDescription';

export default DialogDescription;
