// src/components/dashboard/KPICard.jsx
/**
 * KPICard Component
 * 
 * Reusable Key Performance Indicator card with the new healthcare glassmorphism design.
 * Used in dashboard pages to display metrics and statistics.
 * 
 * Features:
 * - Glassmorphic background with blur (bg-white/80 backdrop-blur-md)
 * - Icon with color customization
 * - Label and value display
 * - Optional trend indicator
 * - Hover animation
 * 
 * Design System:
 * - Uses GlassCard component
 * - Healthcare color palette for status indicators
 */

import React from 'react';
import GlassCard from '@components/common/GlassCard.jsx';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Props:
 * - icon: LucideIcon - icon component
 * - iconColor: string - Tailwind color class for icon (e.g., 'text-green-600')
 * - iconBgColor: string - Tailwind color class for icon background (e.g., 'bg-green-50')
 * - label: string - metric label
 * - value: string | number - metric value
 * - trend: object - { value: number, direction: 'up' | 'down' } - optional
 * - onClick: function - optional click handler
 * - className: string - additional classes
 */
const KPICard = ({
  icon: Icon,
  iconColor = 'text-green-600',
  iconBgColor = 'bg-green-50',
  label,
  value,
  trend,
  onClick,
  className = '',
}) => {
  const TrendIcon = trend?.direction === 'up' ? TrendingUp : TrendingDown;
  const trendColor = trend?.direction === 'up' ? 'text-green-600' : 'text-red-600';

  return (
    <GlassCard 
      className={`flex items-center gap-4 ${className}`}
      interactive={!!onClick}
      onClick={onClick}
    >
      {/* Icon */}
      <div className={`flex items-center justify-center w-14 h-14 rounded-xl ${iconBgColor}`}>
        <Icon className={iconColor} size={28} />
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        
        {/* Optional Trend */}
        {trend && (
          <div className={`flex items-center gap-1 mt-1 text-sm ${trendColor}`}>
            <TrendIcon size={16} />
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default KPICard;
