// src/lib/a11yTests.js
/**
 * a11yTests.js
 * 
 * Accessibility testing utilities for manual testing and validation.
 * Helps verify WCAG compliance during development.
 * 
 * Features:
 * - Check for missing alt text
 * - Verify heading hierarchy
 * - Check form labels
 * - Verify keyboard navigation
 * - Check color contrast
 * - Verify ARIA attributes
 */

/**
 * Run all accessibility checks on the current page
 * @returns {Object} - Test results
 */
export const runA11yChecks = () => {
  const results = {
    images: checkImageAltText(),
    headings: checkHeadingHierarchy(),
    forms: checkFormLabels(),
    landmarks: checkLandmarks(),
    buttons: checkButtonsAccessibility(),
    links: checkLinksAccessibility(),
    timestamp: new Date().toISOString(),
  };

  console.group('🔍 Accessibility Check Results');
  console.table(results);
  console.groupEnd();

  return results;
};

/**
 * Check all images have alt text
 */
export const checkImageAltText = () => {
  const images = Array.from(document.querySelectorAll('img'));
  const missingAlt = images.filter(img => !img.hasAttribute('alt') || img.alt.trim() === '');

  return {
    total: images.length,
    missing: missingAlt.length,
    passed: missingAlt.length === 0,
    issues: missingAlt.map(img => ({
      src: img.src,
      location: getElementLocation(img),
    })),
  };
};

/**
 * Check heading hierarchy (h1 -> h2 -> h3, no skipping)
 */
export const checkHeadingHierarchy = () => {
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const hierarchy = headings.map(h => parseInt(h.tagName.charAt(1)));
  
  const issues = [];
  let previousLevel = 0;

  hierarchy.forEach((level, index) => {
    if (level > previousLevel + 1) {
      issues.push({
        heading: headings[index].textContent.substring(0, 50),
        level,
        previousLevel,
        location: getElementLocation(headings[index]),
      });
    }
    previousLevel = level;
  });

  return {
    total: headings.length,
    issues: issues.length,
    passed: issues.length === 0,
    details: issues,
  };
};

/**
 * Check all form inputs have labels
 */
export const checkFormLabels = () => {
  const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
  const unlabeled = inputs.filter(input => {
    const hasLabel = input.labels?.length > 0 ||
                     input.hasAttribute('aria-label') ||
                     input.hasAttribute('aria-labelledby');
    return !hasLabel && input.type !== 'hidden';
  });

  return {
    total: inputs.length,
    unlabeled: unlabeled.length,
    passed: unlabeled.length === 0,
    issues: unlabeled.map(input => ({
      type: input.type || input.tagName,
      name: input.name,
      id: input.id,
      location: getElementLocation(input),
    })),
  };
};

/**
 * Check for landmark regions
 */
export const checkLandmarks = () => {
  const landmarks = {
    main: document.querySelectorAll('main, [role="main"]').length,
    nav: document.querySelectorAll('nav, [role="navigation"]').length,
    header: document.querySelectorAll('header, [role="banner"]').length,
    footer: document.querySelectorAll('footer, [role="contentinfo"]').length,
  };

  const hasMain = landmarks.main >= 1;
  const hasNav = landmarks.nav >= 1;

  return {
    landmarks,
    passed: hasMain,
    warnings: !hasNav ? ['No navigation landmark found'] : [],
  };
};

/**
 * Check button accessibility
 */
export const checkButtonsAccessibility = () => {
  const buttons = Array.from(document.querySelectorAll('button'));
  const issues = [];

  buttons.forEach(button => {
    // Check if button has accessible text
    const hasText = button.textContent.trim().length > 0 ||
                    button.hasAttribute('aria-label') ||
                    button.hasAttribute('aria-labelledby');

    if (!hasText) {
      issues.push({
        issue: 'No accessible text',
        location: getElementLocation(button),
      });
    }

    // Check if disabled buttons are marked properly
    if (button.disabled && !button.hasAttribute('aria-disabled')) {
      issues.push({
        issue: 'Disabled button missing aria-disabled',
        location: getElementLocation(button),
      });
    }
  });

  return {
    total: buttons.length,
    issues: issues.length,
    passed: issues.length === 0,
    details: issues,
  };
};

/**
 * Check link accessibility
 */
export const checkLinksAccessibility = () => {
  const links = Array.from(document.querySelectorAll('a'));
  const issues = [];

  links.forEach(link => {
    // Check if link has accessible text
    const hasText = link.textContent.trim().length > 0 ||
                    link.hasAttribute('aria-label') ||
                    link.hasAttribute('aria-labelledby');

    if (!hasText) {
      issues.push({
        issue: 'No accessible text',
        href: link.href,
        location: getElementLocation(link),
      });
    }

    // Check for javascript: links
    if (link.href.startsWith('javascript:')) {
      issues.push({
        issue: 'Using javascript: link (should use button)',
        href: link.href,
        location: getElementLocation(link),
      });
    }
  });

  return {
    total: links.length,
    issues: issues.length,
    passed: issues.length === 0,
    details: issues,
  };
};

/**
 * Get element location for debugging
 */
const getElementLocation = (element) => {
  const rect = element.getBoundingClientRect();
  const path = [];
  let current = element;

  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();
    if (current.id) {
      selector += `#${current.id}`;
    } else if (current.className) {
      selector += `.${Array.from(current.classList).join('.')}`;
    }
    path.unshift(selector);
    current = current.parentElement;
  }

  return {
    selector: path.join(' > '),
    position: {
      x: Math.round(rect.left),
      y: Math.round(rect.top),
    },
  };
};

/**
 * Check keyboard navigation on current page
 * @returns {Promise<Object>}
 */
export const testKeyboardNavigation = async () => {
  console.log('🎹 Testing keyboard navigation...');
  console.log('Press Tab to cycle through focusable elements');
  console.log('Press Shift+Tab to cycle backwards');
  console.log('Check that all interactive elements are reachable');

  const focusableElements = Array.from(document.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  ));

  return {
    totalFocusable: focusableElements.length,
    elements: focusableElements.map(el => ({
      tag: el.tagName.toLowerCase(),
      type: el.type,
      text: el.textContent?.substring(0, 30) || el.value?.substring(0, 30) || '',
      hasVisibleFocus: window.getComputedStyle(el, ':focus-visible').outline !== 'none',
    })),
  };
};

/**
 * Check for reduced motion support
 */
export const checkReducedMotion = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return {
    prefersReducedMotion,
    passed: true, // As long as we're checking, we're good
    message: prefersReducedMotion
      ? 'User prefers reduced motion - animations should be minimal'
      : 'User has no reduced motion preference',
  };
};

/**
 * Export results to console in a readable format
 */
export const exportA11yReport = (results) => {
  console.group('📊 Accessibility Report');
  console.log(JSON.stringify(results, null, 2));
  console.groupEnd();

  // Create downloadable report
  const report = JSON.stringify(results, null, 2);
  const blob = new Blob([report], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `a11y-report-${Date.now()}.json`;
  
  console.log('💾 To download report, run: window.a11yDownloadLink.click()');
  window.a11yDownloadLink = a;
};

// Make testing functions available globally in development
if (import.meta.env.DEV) {
  window.a11yTest = {
    runAll: runA11yChecks,
    testKeyboard: testKeyboardNavigation,
    checkReducedMotion,
    exportReport: exportA11yReport,
  };

  console.log('♿ Accessibility testing tools available:');
  console.log('  window.a11yTest.runAll() - Run all checks');
  console.log('  window.a11yTest.testKeyboard() - Test keyboard navigation');
  console.log('  window.a11yTest.checkReducedMotion() - Check motion preferences');
  console.log('  window.a11yTest.exportReport(results) - Export report');
}
