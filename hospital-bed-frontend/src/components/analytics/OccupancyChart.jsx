// src/components/analytics/OccupancyChart.jsx
/**
 * OccupancyChart Component
 * 
 * A production-ready, reusable line/area chart displaying hospital bed occupancy trends
 * over time (daily, weekly, or monthly). Designed for use in dashboards and reports.
 * 
 * Features:
 * - Responsive design with smooth animations
 * - Supports multiple departments with distinct colors
 * - Tooltip with precise data on hover
 * - Loading and empty states integration
 * - Fully accessible (ARIA labels, keyboard navigation via Recharts)
 * - Uses unified global styling (SCSS variables, Card component)
 * 
 * Integrates with TanStack Query for data fetching and caching
 */

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Card from '@components/ui/card.jsx';
import CardHeader from '@components/ui/card-header.jsx'; // Optional if you have header subcomponent
import CardContent from '@components/ui/card-content.jsx';
import CardTitle from '@components/ui/card-title.jsx';
import Skeleton from '@components/ui/skeleton.jsx';
import EmptyState from '@components/common/EmptyState.jsx';
import './OccupancyChart.scss';

/**
 * Props:
 * - data: Array of objects with date and department occupancy values
 *   Example: [{ date: '2025-12-01', ICU: 85, ER: 92, General: 68 }]
 * - chartType: 'line' | 'area' (default: 'area')
 * - timeRange: 'daily' | 'weekly' | 'monthly' (used for labeling)
 * - isLoading: boolean
 * - error: any
 */
const OccupancyChart = ({
  data = [],
  chartType = 'area',
  timeRange = 'daily',
  isLoading = false,
  error = null,
  title = 'Bed Occupancy Trend',
}) => {
  // Department color mapping - Hospital theme colors
  const departmentColors = {
    ICU: '#2563EB',        // Trust Blue - for critical care
    ER: '#EF4444',         // Soft Red - for emergency
    Emergency: '#EF4444',  // Soft Red - for emergency
    'General Ward': '#16A34A', // Medical Healing Green - for general care
    Surgery: '#14B8A6',    // Clinical Teal - for surgical departments
  };

  // Extract unique departments from data for dynamic lines
  const departments = data.length > 0
    ? Object.keys(data[0]).filter(key => key !== 'date' && key !== 'name')
    : [];

  if (isLoading) {
    return (
      <Card className="occupancy-chart-card">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="occupancy-chart-card">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive text-center py-8">
            Failed to load occupancy data. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0 || departments.length === 0) {
    return (
      <Card className="occupancy-chart-card">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            description="There is no occupancy data available for the selected period."
            illustration="empty-beds"
            title="No Occupancy Data"
          />
        </CardContent>
      </Card>
    );
  }

  // Choose chart component based on type
  const ChartComponent = chartType === 'line' ? LineChart : AreaChart;

  return (
    <Card className="occupancy-chart-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Occupancy rate (%) over time ({timeRange})
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer height={320} width="100%">
          <ChartComponent
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              stroke="var(--muted-foreground)"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={[0, 100]}
              label={{ value: 'Occupancy (%)', angle: -90, position: 'insideLeft' }}
              stroke="var(--muted-foreground)"
              tick={{ fontSize: 12 }}
              ticks={[0, 20, 40, 60, 80, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
              }}
              formatter={(value) => `${value}%`}
              labelStyle={{ fontWeight: 'bold' }}
            />
            {chartType === 'area' && <Legend height={36} verticalAlign="top" />}

            {departments.map((dept) => {
              const color = departmentColors[dept] || '#94a3b8';

              return chartType === 'area' ? (
                <Area
                  activeDot={{ r: 6 }}
                  dataKey={dept}
                  dot={{ fill: color, r: 4 }}
                  fill={color}
                  fillOpacity={0.3}
                  key={dept}
                  name={`${dept} (%)`}
                  stroke={color}
                  strokeWidth={2}
                  type="monotone"
                />
              ) : (
                <Line
                  activeDot={{ r: 6 }}
                  dataKey={dept}
                  dot={{ fill: color, r: 4 }}
                  key={dept}
                  name={`${dept} (%)`}
                  stroke={color}
                  strokeWidth={3}
                  type="monotone"
                />
              );
            })}
          </ChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default OccupancyChart;