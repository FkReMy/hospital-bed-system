// src/components/navigation/Breadcrumbs.jsx
/**
 * Breadcrumbs Component
 * 
 * Production-ready, reusable breadcrumb navigation for the staff dashboard.
 * Provides clear hierarchical path from home to current page, improving UX
 * and orientation in deep navigation.
 * 
 * Features:
 * - Dynamic crumbs from router location
 * - Home link always first
 * - Truncated long labels with ellipsis
 * - Clickable links for navigation
 * - Responsive: collapses to "..." on small screens if needed
 * - Unified styling with premium dashboard aesthetic
 * - Accessible (ARIA labels, proper link semantics)
 * 
 * Used in Topbar (center section) or below PageHeader
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import './Breadcrumbs.module.scss';

/**
 * Optional manual crumbs prop for custom pages
 * Otherwise auto-generated from pathname
 * 
 * Props:
 * - crumbs: Array<{ label: string, path?: string }> - manual override
 * - maxItems: number - max visible items before truncation (default: 5)
 */
const Breadcrumbs = ({ crumbs, maxItems = 5 }) => {
  const location = useLocation();

  // Auto-generate crumbs from current path
  const generatedCrumbs = React.useMemo(() => {
    const paths = location.pathname.split('/').filter(p => p);
    const items = [
      { label: 'Home', path: '/dashboard', icon: Home },
    ];

    let accumulatedPath = '';

    paths.forEach((segment, index) => {
      accumulatedPath += `/${segment}`;
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      items.push({
        label,
        path: accumulatedPath,
      });
    });

    return items;
  }, [location.pathname]);

  const finalCrumbs = crumbs || generatedCrumbs;

  // Truncate if too many items
  const visibleCrumbs = finalCrumbs.length > maxItems
    ? [
        finalCrumbs[0],
        { label: '...', path: null },
        ...finalCrumbs.slice(-2),
      ]
    : finalCrumbs;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {visibleCrumbs.map((crumb, index) => {
          const isLast = index === visibleCrumbs.length - 1;
          const Icon = crumb.icon;

          return (
            <li key={index} className="breadcrumb-item">
              {crumb.path ? (
                <Link
                  to={crumb.path}
                  className={`breadcrumb-link ${isLast ? 'current' : ''}`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {Icon && <Icon className="breadcrumb-icon" size={16} />}
                  <span className="breadcrumb-label">{crumb.label}</span>
                </Link>
              ) : (
                <span className="breadcrumb-ellipsis" aria-hidden="true">
                  {crumb.label}
                </span>
              )}

              {!isLast && (
                <ChevronRight className="separator-icon" size={16} aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;