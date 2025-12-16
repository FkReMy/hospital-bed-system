// src/components/ui/dialog-header.jsx
/**
 * DialogHeader Component
 * 
 * Header section for dialog (contains title and description)
 */


const DialogHeader = ({ children, className = '', ...props }) => (
    <div className={`dialog-header ${className}`} {...props}>
      {children}
    </div>
  );

DialogHeader.displayName = 'DialogHeader';

export default DialogHeader;
