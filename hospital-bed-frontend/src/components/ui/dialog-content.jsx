// src/components/ui/dialog-content.jsx
/**
 * DialogContent Component
 * 
 * Content wrapper for dialog body
 */


const DialogContent = ({ children, className = '', ...props }) => (
    <div className={`dialog-content-wrapper ${className}`} {...props}>
      {children}
    </div>
  );

DialogContent.displayName = 'DialogContent';

export default DialogContent;
