// src/components/ui/skeleton.jsx
/**
 * Skeleton Component
 * 
 * Production-ready, reusable skeleton loading placeholder with shimmer animation.
 * Used throughout the application for loading states (cards, tables, lists, etc.).
 * 
 * Features:
 * - Shimmer gradient animation
 * - Customizable width/height via className
 * - Rounded corners matching card/button radius
 * - Dark/light theme compatible
 * - Unified with LoadingState and domain loading components
 * - Fully accessible (aria-hidden)
 */

import React from 'react';
import './skeleton.scss';

/**
 * Props:
 * - className: string - additional classes (e.g., 'h-32 w-full rounded-xl')
 */
const Skeleton = ({ className = '' }) => {
  return (
    <div 
      className={`skeleton ${className}`}
      aria-hidden="true"
    />
  );
};

export default Skeleton;