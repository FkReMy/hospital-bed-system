// src/components/ui/avatar.jsx
/**
 * Avatar Component
 * 
 * Production-ready, reusable avatar with image fallback to initials.
 * Used throughout the application for user, patient, and doctor profiles.
 * 
 * Features:
 * - Supports image src or fallback initials
 * - Size variants (sm/md/lg/xl)
 * - Online/offline status indicator (optional)
 * - Accessible (alt text, aria-label)
 * - Unified with premium glassmorphic design
 * - High contrast initials on colored background
 */

import './avatar.scss';

/**
 * Props:
 * - src: string - image URL (optional)
 * - alt: string - alt text for image
 * - initials: string - fallback initials (e.g., "JD")
 * - size: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
 * - status: 'online' | 'offline' | null - optional status dot
 * - className: string - additional classes
 */
const Avatar = ({
  src,
  alt = '',
  initials = '',
  size = 'md',
  status = null,
  className = '',
  ...props
}) => {
  const hasImage = src && src.trim() !== '';

  return (
    <div 
      aria-label={alt || `Avatar for ${initials}`}
      className={`avatar ${size} ${status ? `status-${status}` : ''} ${className}`}
      role="img"
      {...props}
    >
      {hasImage ? (
        <img 
          alt={alt} 
          className="avatar-image" 
          src={src}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}

      <div className="avatar-fallback">
        <span className="avatar-initials">{initials || '?'}</span>
      </div>

      {status && (
        <span aria-hidden="true" className="status-indicator" />
      )}
    </div>
  );
};

// Optional: AvatarFallback for explicit fallback control
export const AvatarFallback = ({ children }) => (
  <div className="avatar-fallback">
    {children}
  </div>
);

export default Avatar;