# Hospital Bed Management System - Frontend

## Overview
This is the Staff Web Dashboard for a Hospital Bed Management System (HBMS). It's built with React, Vite, and SCSS, providing a comprehensive interface for managing hospital beds, patients, appointments, and departments.

## Project Structure
```
hospital-bed-frontend/
├── public/           # Static assets (favicon, logos, manifest)
├── src/
│   ├── assets/       # Fonts and images
│   ├── components/   # Reusable UI components
│   │   ├── analytics/    # Charts and data visualization
│   │   ├── appointments/ # Appointment management components
│   │   ├── beds/         # Bed management components
│   │   ├── common/       # Shared components (empty states, loading)
│   │   ├── layout/       # App shell, sidebar, topbar
│   │   ├── navigation/   # Breadcrumbs, role-aware nav
│   │   ├── notifications/# Notification center
│   │   ├── patients/     # Patient-related components
│   │   ├── prescriptions/# Prescription management
│   │   ├── ui/           # Base UI primitives
│   │   └── uploads/      # File upload components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utilities, constants, formatters
│   ├── pages/        # Page components (routes)
│   ├── router/       # React Router configuration
│   ├── services/     # API clients and realtime services
│   ├── store/        # Zustand state stores
│   └── styles/       # Global SCSS styles
├── package.json
└── vite.config.js
```

## Tech Stack
- **Framework**: React 18.3
- **Build Tool**: Vite 5.4
- **Styling**: SCSS with CSS Modules
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Routing**: React Router DOM v6

## Running the Application
The development server runs on port 5000:
```bash
cd hospital-bed-frontend && npm run dev
```

## Key Features
- Role-based dashboards (Admin, Doctor, Nurse, Reception)
- Bed management with floor map visualization
- Patient management and detail views
- Appointment scheduling and calendar
- Prescription management
- Department and room management
- Real-time notifications via WebSocket
- Dark/light theme support

## Backend Integration
This frontend is designed to work with a .NET backend API. The Vite dev server proxies:
- `/api/*` requests to the backend
- `/hub/*` WebSocket connections for SignalR real-time updates

Note: The backend is not included in this repository. API calls will fail until a backend is connected.

## Recent Changes
- December 16, 2025: Initial Replit setup
  - Configured Vite to run on port 5000 with host 0.0.0.0
  - Added allowedHosts: 'all' for Replit proxy compatibility
