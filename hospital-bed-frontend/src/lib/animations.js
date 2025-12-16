// src/lib/animations.js
/**
 * animations.js
 * 
 * Reusable animation configurations and utilities for Framer Motion and CSS animations.
 * Provides consistent animation patterns across the application.
 * 
 * Features:
 * - Standard fade, slide, scale animations
 * - Stagger configurations for lists
 * - Page transition variants
 * - Loading and skeleton animations
 * - Hover and tap effects
 */

/**
 * Standard fade in/out animation
 */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

/**
 * Fade in from top (for dropdowns, modals)
 */
export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeOut' }
};

/**
 * Fade in from bottom (for toasts, notifications)
 */
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3, ease: 'easeOut' }
};

/**
 * Scale animation (for modals, popovers)
 */
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2, ease: 'easeOut' }
};

/**
 * Slide in from right (for sidebars, drawers)
 */
export const slideInRight = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: { duration: 0.3, ease: 'easeInOut' }
};

/**
 * Slide in from left (for sidebars)
 */
export const slideInLeft = {
  initial: { x: '-100%' },
  animate: { x: 0 },
  exit: { x: '-100%' },
  transition: { duration: 0.3, ease: 'easeInOut' }
};

/**
 * Stagger container for list items
 */
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

/**
 * Stagger child item (for use with staggerContainer)
 */
export const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

/**
 * Page transition variants
 */
export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3, ease: 'easeInOut' }
};

/**
 * Card hover lift effect
 */
export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -4,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  tap: { scale: 0.98 }
};

/**
 * Button press effect
 */
export const buttonTap = {
  tap: { scale: 0.95 },
  transition: { duration: 0.1 }
};

/**
 * Loading pulse animation (CSS keyframes)
 */
export const pulseAnimation = `
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

/**
 * Shimmer loading effect (CSS keyframes)
 */
export const shimmerAnimation = `
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
`;

/**
 * Bounce animation for alerts/notifications
 */
export const bounceIn = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: [0, 1.1, 1],
    opacity: 1,
    transition: {
      duration: 0.5,
      times: [0, 0.6, 1],
      ease: 'easeOut'
    }
  }
};

/**
 * Rotate animation for loading spinners
 */
export const rotateAnimation = `
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

/**
 * CSS class names for common animations
 */
export const animationClasses = {
  fadeIn: 'animate-fade-in',
  slideIn: 'animate-slide-in',
  scaleIn: 'animate-scale-in',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce'
};

/**
 * Transition timing functions
 */
export const easings = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
};

/**
 * Duration presets (in ms)
 */
export const durations = {
  fast: 150,
  normal: 300,
  slow: 500
};
