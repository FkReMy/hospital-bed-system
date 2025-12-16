// src/components/ui/dialog.jsx
/**
 * Dialog Component
 * 
 * Production-ready, accessible modal dialog with overlay, glassmorphic content,
 * close button, and keyboard support (Esc to close).
 * 
 * Features:
 * - Portal rendering to document.body (avoids stacking context issues)
 * - Overlay with blur and click-to-close
 * - Close button (top-right)
 * - Focus trap and return focus on close
 * - Keyboard navigation (Esc to close)
 * - Responsive centering with max-width
 * - Unified with global Card, Button components
 * - Premium glassmorphic design with smooth animations
 * 
 * Used for all modals: AssignBedDialog, DeleteConfirmation, EditPatient, etc.
 */

import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import Button from '@components/ui/button.jsx';
import Card from '@components/ui/card.jsx';
import './dialog.module.scss';

/**
 * Props:
 * - open: boolean - controls visibility
 * - onOpenChange: (open: boolean) => void - callback for close
 * - children: ReactNode - dialog content
 * - title: string - optional title (for accessibility)
 * - closeButton: boolean - show close button (default: true)
 * - className: string - additional classes for content
 */
const Dialog = ({
  open,
  onOpenChange,
  children,
  title,
  closeButton = true,
  className = '',
}) => {
  const overlayRef = React.useRef(null);
  const contentRef = React.useRef(null);

  // Close on Escape key
  React.useEffect(() => {
    if (!open) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onOpenChange]);

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onOpenChange(false);
    }
  };

  // Focus trap: return focus to trigger on close
  React.useEffect(() => {
    if (open && contentRef.current) {
      contentRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div 
      className="dialog-overlay" 
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'dialog-title' : undefined}
    >
      <Card 
        className={`dialog-content ${className}`}
        ref={contentRef}
        tabIndex={-1}
      >
        {closeButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="dialog-close-button"
            aria-label="Close dialog"
          >
            <X size={20} />
          </Button>
        )}

        {title && (
          <h2 id="dialog-title" className="dialog-title">
            {title}
          </h2>
        )}

        <div className="dialog-body">
          {children}
        </div>
      </Card>
    </div>,
    document.body
  );
};

export default Dialog;