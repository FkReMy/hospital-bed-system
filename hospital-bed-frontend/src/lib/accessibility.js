// src/lib/accessibility.js
/**
 * accessibility.js
 * 
 * Accessibility utilities and helpers for the HBMS application.
 * Provides functions for WCAG compliance, ARIA management, and keyboard navigation.
 * 
 * Features:
 * - Focus management utilities
 * - ARIA attribute helpers
 * - Keyboard event handlers
 * - Screen reader announcements
 * - Skip link helpers
 * - Color contrast checkers
 */

/**
 * Trap focus within a modal/dialog
 * @param {HTMLElement} element - The container element
 * @param {Function} onEscape - Callback when Escape is pressed
 */
export const trapFocus = (element, onEscape = null) => {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  const focusableElements = element.querySelectorAll(focusableSelectors);
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && onEscape) {
      onEscape();
      return;
    }

    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  };

  element.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
};

/**
 * Get focusable elements within a container
 * @param {HTMLElement} container
 * @returns {HTMLElement[]}
 */
export const getFocusableElements = (container) => {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll(selector));
};

/**
 * Announce to screen readers using live region
 * @param {string} message
 * @param {string} priority - 'polite' | 'assertive'
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Generate unique ID for ARIA relationships
 * @param {string} prefix
 * @returns {string}
 */
export const generateAriaId = (prefix = 'aria') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check if an element is visible
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export const isElementVisible = (element) => {
  if (!element) return false;
  
  const style = window.getComputedStyle(element);
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0'
  );
};

/**
 * Focus an element with optional delay
 * @param {HTMLElement|string} elementOrSelector
 * @param {number} delay - Delay in ms (default: 0)
 */
export const focusElement = (elementOrSelector, delay = 0) => {
  const element = typeof elementOrSelector === 'string'
    ? document.querySelector(elementOrSelector)
    : elementOrSelector;

  if (!element) return;

  setTimeout(() => {
    element.focus();
  }, delay);
};

/**
 * Save and restore focus (useful for modals)
 * @returns {Function} - Call to restore focus
 */
export const saveFocus = () => {
  const activeElement = document.activeElement;
  
  return () => {
    if (activeElement && typeof activeElement.focus === 'function') {
      activeElement.focus();
    }
  };
};

/**
 * Keyboard navigation handler
 * Handles arrow keys, Home, End navigation
 * @param {KeyboardEvent} event
 * @param {HTMLElement[]} items
 * @param {number} currentIndex
 * @param {Function} onNavigate - Callback with new index
 * @param {Object} options - { orientation: 'vertical' | 'horizontal' }
 */
export const handleKeyboardNavigation = (
  event,
  items,
  currentIndex,
  onNavigate,
  options = { orientation: 'vertical' }
) => {
  const { orientation } = options;
  const { key } = event;

  let newIndex = currentIndex;

  // Determine navigation keys based on orientation
  const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
  const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';

  switch (key) {
    case nextKey:
      event.preventDefault();
      newIndex = (currentIndex + 1) % items.length;
      break;
    case prevKey:
      event.preventDefault();
      newIndex = (currentIndex - 1 + items.length) % items.length;
      break;
    case 'Home':
      event.preventDefault();
      newIndex = 0;
      break;
    case 'End':
      event.preventDefault();
      newIndex = items.length - 1;
      break;
    case 'Enter':
    case ' ':
      // Let the calling component handle activation
      break;
    default:
      return;
  }

  if (newIndex !== currentIndex) {
    onNavigate(newIndex);
    items[newIndex]?.focus();
  }
};

/**
 * Check color contrast ratio (WCAG AA requires 4.5:1, AAA requires 7:1)
 * @param {string} color1 - Hex color
 * @param {string} color2 - Hex color
 * @returns {number} - Contrast ratio
 */
export const getContrastRatio = (color1, color2) => {
  const getLuminance = (hex) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = ((rgb >> 16) & 0xff) / 255;
    const g = ((rgb >> 8) & 0xff) / 255;
    const b = (rgb & 0xff) / 255;

    const [rs, gs, bs] = [r, g, b].map(c =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
};

/**
 * Check if contrast meets WCAG standards
 * @param {string} foreground - Hex color
 * @param {string} background - Hex color
 * @param {string} level - 'AA' | 'AAA'
 * @returns {boolean}
 */
export const meetsContrastRequirement = (foreground, background, level = 'AA') => {
  const ratio = getContrastRatio(foreground, background);
  const requirement = level === 'AAA' ? 7 : 4.5;
  return ratio >= requirement;
};

/**
 * ARIA roles for common patterns
 */
export const ariaRoles = {
  navigation: 'navigation',
  main: 'main',
  complementary: 'complementary',
  contentinfo: 'contentinfo',
  banner: 'banner',
  search: 'search',
  form: 'form',
  dialog: 'dialog',
  alertdialog: 'alertdialog',
  alert: 'alert',
  status: 'status',
  menu: 'menu',
  menubar: 'menubar',
  menuitem: 'menuitem',
  tablist: 'tablist',
  tab: 'tab',
  tabpanel: 'tabpanel',
  listbox: 'listbox',
  option: 'option',
};

/**
 * Common ARIA attributes
 */
export const ariaAttributes = {
  expanded: (isExpanded) => ({ 'aria-expanded': isExpanded }),
  selected: (isSelected) => ({ 'aria-selected': isSelected }),
  checked: (isChecked) => ({ 'aria-checked': isChecked }),
  disabled: (isDisabled) => ({ 'aria-disabled': isDisabled }),
  hidden: (isHidden) => ({ 'aria-hidden': isHidden }),
  label: (label) => ({ 'aria-label': label }),
  labelledBy: (id) => ({ 'aria-labelledby': id }),
  describedBy: (id) => ({ 'aria-describedby': id }),
  controls: (id) => ({ 'aria-controls': id }),
  current: (value) => ({ 'aria-current': value }),
  live: (priority) => ({ 'aria-live': priority }),
};
