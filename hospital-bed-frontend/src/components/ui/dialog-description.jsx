// src/components/ui/dialog-description.jsx
/**
 * DialogDescription Component
 * 
 * Description/subtitle for dialog
 */


const DialogDescription = ({ children, className = '', ...props }) => (
    <p className={`dialog-description ${className}`} {...props}>
      {children}
    </p>
  );

DialogDescription.displayName = 'DialogDescription';

export default DialogDescription;
