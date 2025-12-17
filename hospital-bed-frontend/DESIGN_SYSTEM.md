# HBMS Design System - Calming Healthcare Glassmorphism

## Overview

This document describes the new design system for the Hospital Bed Management System (HBMS) frontend. The design emphasizes patient comfort, trust, healing, and accessibility through a calming color palette and glassmorphism aesthetic.

## Color Palette

### Primary Colors (Health & Healing)
- **Main**: `#16A34A` (green-600) - Medical Healing Green
- **Hover**: `#15803D` (green-700) - Deep Health Green
- **Soft Background**: `#ECFDF5` (green-50) - Calm Recovery Green

### Secondary Colors (Trust & Professionalism)
- **Main**: `#2563EB` (blue-600) - Trust Blue
- **Light Background**: `#E0F2FE` (blue-50) - Clean Sky Blue

### Neutral Colors (Cleanliness & Readability)
- **White**: `#FFFFFF` - Pure White (Cards/Containers)
- **Gray Background**: `#F9FAFB` (gray-50) - Light Grey (App Background)
- **Borders**: `#E5E7EB` (gray-200) - Soft Grey
- **Disabled**: `#9CA3AF` (gray-400) - Muted Grey

### Accent Colors (Gentle Attention)
- **Yellow**: `#FACC15` (yellow-400) - Soft Wellness Amber
- **Teal**: `#14B8A6` (teal-500) - Clinical Teal

### Status & Feedback Colors
- **Success/Available**: `#22C55E` (green-500)
- **Warning/Cleaning**: `#F59E0B` (amber-500)
- **Error/Occupied**: `#EF4444` (red-500)
- **Info/Maintenance**: `#0EA5E9` (sky-500)

### Typography Colors
- **Primary**: `#111827` (gray-900) - Near Black
- **Secondary**: `#4B5563` (gray-600) - Cool Grey
- **Muted**: `#6B7280` (gray-500) - Light Grey
- **Links**: `#2563EB` (blue-600) - Trust Blue

## UI Patterns

### Glass Effect
The glassmorphism effect is achieved with:
```jsx
className="bg-white/80 backdrop-blur-md border border-gray-200/50 shadow-lg rounded-2xl"
```

**Usage:**
- Cards and containers
- Sidebar and topbar
- Modal overlays
- Elevated UI elements

### Buttons
- **Primary**: `bg-green-600 text-white hover:bg-green-700 shadow-md`
- **Accent**: `bg-teal-500 text-white hover:bg-teal-600 shadow-lg shadow-teal-500/30`
- **Secondary**: `bg-blue-600 text-white hover:bg-blue-700`
- **Ghost**: `text-gray-600 hover:bg-gray-100`

### Inputs
```jsx
className="bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
```

### Status Badges
Status badges use pill-shaped design with color-coded backgrounds:

```jsx
// Available
className="bg-green-50 text-green-600 border border-green-500/20"

// Occupied
className="bg-red-50 text-red-600 border border-red-500/20"

// Cleaning
className="bg-amber-50 text-amber-600 border border-amber-500/20"

// Maintenance
className="bg-sky-50 text-sky-600 border border-sky-500/20"
```

## Core Components

### GlassCard
Reusable glassmorphic card component:
```jsx
import GlassCard from '@components/common/GlassCard.jsx';

<GlassCard className="p-6">
  {/* Content */}
</GlassCard>
```

**Props:**
- `children`: Content
- `className`: Additional Tailwind classes
- `interactive`: Adds hover effect and cursor pointer
- `onClick`: Click handler

### StatusBadge
Status indicator with healthcare colors:
```jsx
import StatusBadge from '@components/common/StatusBadge.jsx';

<StatusBadge status="available" pulse={true}>
  Available
</StatusBadge>
```

**Props:**
- `status`: 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'success' | 'warning' | 'error' | 'info'
- `pulse`: Boolean - adds pulse animation
- `children`: Badge content (overrides default text)
- `className`: Additional classes

### KPICard
Key Performance Indicator card for dashboards:
```jsx
import KPICard from '@components/dashboard/KPICard.jsx';
import { BedDouble } from 'lucide-react';

<KPICard
  icon={BedDouble}
  iconColor="text-green-600"
  iconBgColor="bg-green-50"
  label="Total Beds"
  value={120}
  trend={{ value: 5, direction: 'up' }}
/>
```

## Backgrounds

### Login/Register Pages
Soft gradient with decorative blurred orbs:
```jsx
className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50"
```

Decorative orbs:
```jsx
<div className="absolute top-0 left-0 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
```

### Dashboard Pages
```jsx
className="bg-gray-50"
```

### Sidebar
```jsx
className="bg-white/90 backdrop-blur-md"
```
- Active link: `bg-green-50 text-primary-600`

## Animations

### Available Animations
- `animate-fade-in`: Fade in with slide up (0.5s)
- `animate-slide-up`: Slide up (0.3s)
- `animate-pulse`: Pulse effect for live status (2s infinite)
- `animate-blob`: Organic blob movement (7s infinite)

### Animation Delays
- `animation-delay-2000`: 2s delay
- `animation-delay-4000`: 4s delay

## Layout Structure

### AppShell
```jsx
<div className="flex h-screen overflow-hidden bg-gray-50">
  <Sidebar />
  <div className="flex-1 flex flex-col ml-[280px]">
    <Topbar />
    <main className="flex-1 overflow-y-auto p-6">
      {children}
    </main>
  </div>
</div>
```

### Sidebar
- Fixed position, left-aligned
- Width: 280px (open) / 80px (collapsed)
- Glassmorphic background: `bg-white/90 backdrop-blur-md`
- Green accent for active links

### Topbar
- Sticky at top
- Background: `bg-white/90 backdrop-blur-md border-b border-gray-200`

## Accessibility

### Focus States
All interactive elements have visible focus states:
```jsx
focus:ring-2 focus:ring-green-500/20 focus:border-green-500
```

### Color Contrast
All text meets WCAG AA standards for contrast ratio.

### Keyboard Navigation
- All buttons and links are keyboard accessible
- Modal dialogs trap focus
- Skip links available where needed

## Migration Strategy

The design system is being gradually migrated from SCSS to Tailwind CSS:

1. **New Components**: Built with Tailwind classes
2. **Updated Components**: Tailwind classes added alongside SCSS
3. **Legacy Components**: Continue using SCSS until migration
4. **Coexistence**: Both systems work together during transition

## Usage Examples

### Dashboard Card
```jsx
<GlassCard className="p-6">
  <h2 className="text-xl font-bold text-gray-900 mb-4">Patient Overview</h2>
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-gray-600">Total Patients</span>
      <span className="text-2xl font-bold text-gray-900">156</span>
    </div>
    <StatusBadge status="success">All Systems Operational</StatusBadge>
  </div>
</GlassCard>
```

### Form Input
```jsx
<Input
  leftIcon={Mail}
  placeholder="Email Address"
  type="email"
  className="bg-gray-50 border border-gray-200 rounded-xl"
/>
```

### KPI Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <KPICard
    icon={BedDouble}
    iconColor="text-green-600"
    iconBgColor="bg-green-50"
    label="Total Beds"
    value={120}
  />
  <KPICard
    icon={Users}
    iconColor="text-blue-600"
    iconBgColor="bg-blue-50"
    label="Patients"
    value={85}
    trend={{ value: 12, direction: 'up' }}
  />
</div>
```

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide React Icons](https://lucide.dev/)
- [Color Palette Tool](https://tailwindcss.com/docs/customizing-colors)

## Support

For questions about the design system, please contact the frontend development team.
