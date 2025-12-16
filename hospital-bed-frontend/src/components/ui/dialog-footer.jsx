// src/components/ui/dialog-footer.jsx
/**
 * DialogFooter Component
 * 
 * Footer section for dialog (usually contains action buttons)
 */


const DialogFooter = ({ children, className = '', ...props }) => (
    <div className={`dialog-footer ${className}`} {...props}>
      {children}
    </div>
  );

DialogFooter.displayName = 'DialogFooter';

export default DialogFooter;
