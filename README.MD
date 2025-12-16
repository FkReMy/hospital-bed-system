# Patient Bed Management System (PBMS)

## Overview

The **Patient Bed Management System (PBMS)** is a real-time, secure, and scalable hospital bed management solution. It is the foundational phase of an Integrated Hospital Management System (IHMS), providing digital transformation for critical patient flow and bed allocation workflows in hospitals.

- **Backend:** C# (.NET 8), ASP.NET Core Web API, Entity Framework Core, SQL Server, SignalR, Serilog.
- **Frontend (Web):** React, Vite, TailwindCSS, Zustand.
- **Mobile:** React Native (for patient-facing application).
- **Infra:** Azure App Service, Azure SQL Database, Azure SignalR, optional Redis.
- **Security:** ASP.NET Identity, JWT, HTTPS/TLS, RBAC, full audit logging.

This repository contains the web frontend. The backend and database (C#/.NET/SQL Server) are tracked in a separate repository.

---

## Features

- **Staff Dashboard:** Real-time overview of all bed statuses, department/room assignment, occupancy trends.
- **Bed Assignment Workflow:** Admitting, assigning, updating, and releasing beds with atomicity and double-book protection.
- **Mobile Patient App:** View-only per-department bed availability in multiple languages (mobile, React Native).
- **Role-Based Access:** Users are assigned clear RBAC: Admin, Doctor, Nurse, Reception.
- **Notifications:** Instant push and dashboard alerts for bed changes (SignalR).
- **Reporting:** Administrative dashboards for occupancy, department load, and historical trends.
- **Audit Logging:** All critical actions captured and reviewable.
- **Accessibility & i18n:** Designed for accessibility and localization (English, Arabic).

---

## Production Environment

- **Scalability:** Deployable cloud architecture with horizontal scaling, stateless frontend, and SignalR.
- **Consistency:** All user flows leverage global shared components for form fields, tables, layout, feedback, and navigation.
- **Security:** End-to-end encryption, secure credential storage, input validation, proper permission checks.
- **Reliability:** Automated database backups, error boundaries, resilient websocket handling, comprehensive error and state feedback.
- **Maintainability:** Modular, commented, and standards-conformant code; all business logic in services/hooks, separated from presentation.

---

## Folder Structure

```
hospital_bed_system/
├── .editorconfig
├── .eslintrc.cjs
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── assets/
    │   └── ...    # Fonts and images
    ├── styles/
    │   └── globals.css
    ├── lib/           # Constants, utility and formatting modules
    │   ├── constants.js
    │   ├── roles.js
    │   ├── utils.js
    │   ├── dateUtils.js
    │   ├── validators.js
    │   └── formatters.js
    ├── services/
    │   ├── api/
    │   │   ├── axiosInstance.js
    │   │   ├── authApi.js
    │   │   ├── userApi.js
    │   │   ├── departmentApi.js
    │   │   ├── patientApi.js
    │   │   ├── roomApi.js
    │   │   ├── bedApi.js
    │   │   ├── bedAssignmentApi.js
    │   │   ├── appointmentApi.js
    │   │   └── prescriptionApi.js
    │   └── realtime/
    │       ├── socketClient.js
    │       ├── bedChannel.js
    │       └── notificationChannel.js
    ├── store/
    │   ├── authStore.js
    │   ├── uiStore.js
    │   ├── bedStore.js
    │   ├── patientStore.js
    │   ├── appointmentStore.js
    │   ├── prescriptionStore.js
    │   └── notificationStore.js
    ├── hooks/
    │   ├── useAuth.js
    │   ├── useAuthGuard.js
    │   ├── useRoleAccess.js
    │   ├── useBedManagement.js
    │   ├── useAppointmentFlow.js
    │   ├── usePatientProfile.js
    │   ├── useNotificationFeed.js
    │   ├── useTheme.js
    │   ├── useMediaQuery.js
    │   └── useWebSocket.js
    ├── router/
    │   ├── index.jsx
    │   ├── routes.jsx
    │   ├── ProtectedRoute.jsx
    │   ├── AdminRoute.jsx
    │   ├── DoctorRoute.jsx
    │   ├── NurseRoute.jsx
    │   └── ReceptionRoute.jsx
    ├── components/
    │   ├── ui/                  # All pages use these primitive components!
    │   │   ├── button.jsx
    │   │   ├── card.jsx
    │   │   ├── dialog.jsx
    │   │   ├── input.jsx
    │   │   ├── label.jsx
    │   │   ├── select.jsx
    │   │   ├── tabs.jsx
    │   │   ├── table.jsx
    │   │   ├── badge.jsx
    │   │   ├── avatar.jsx
    │   │   ├── progress.jsx
    │   │   ├── skeleton.jsx
    │   │   └── tooltip.jsx
    │   ├── layout/
    │   │   ├── AppShell.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── Topbar.jsx
    │   │   └── RoleSwitcher.jsx
    │   ├── navigation/
    │   │   ├── Breadcrumbs.jsx
    │   │   └── RoleAwareNav.jsx
    │   ├── common/
    │   │   ├── EmptyState.jsx
    │   │   ├── LoadingState.jsx
    │   │   └── PageHeader.jsx
    │   ├── notifications/
    │   │   ├── NotificationBell.jsx
    │   │   └── NotificationCenter.jsx
    │   ├── bed-management/
    │   │   ├── BedCard.jsx
    │   │   ├── BedStatusBadge.jsx
    │   │   ├── AssignBedDialog.jsx
    │   │   └── HospitalFloorMap.jsx
    │   ├── patients/
    │   │   ├── PatientSummaryCard.jsx
    │   │   ├── PatientDetailTabs.jsx
    │   │   └── PatientTimeline.jsx
    │   ├── appointments/
    │   │   ├── AppointmentList.jsx
    │   │   ├── AppointmentForm.jsx
    │   │   └── AppointmentStatusBadge.jsx
    │   └── prescriptions/
    │       ├── PrescriptionList.jsx
    │       └── PrescriptionCard.jsx
    └── pages/
        ├── auth/
        ├── dashboards/
        ├── users/
        ├── departments/
        ├── patients/
        ├── rooms/
        ├── beds/
        ├── appointments/
        ├── prescriptions/
        ├── profile/
        ├── reports/
        └── errors/
```

---

## Usage

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [Visual Studio Code](https://code.visualstudio.com/) recommended
- **.NET 8 SDK** for running the backend API
- **SQL Server** (LocalDB, Express, or Full Edition)

### ⚠️ Important: Backend Must Be Running

**The frontend will not work without the backend server running.** You will see `ECONNREFUSED` errors if the backend is not started.

**📖 See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for detailed backend setup instructions.**

### Quick Start

1. **Start the Backend API** (see [BACKEND_SETUP.md](./BACKEND_SETUP.md) for details)
   ```sh
   # In a separate terminal, navigate to backend repository
   cd path/to/backend
   dotnet run
   # Should start on https://localhost:7150
   ```

2. **Install Frontend Dependencies:**  
   ```sh
   cd hospital-bed-frontend
   yarn install
   # or: npm install
   ```

3. **Configure Environment Variables (Optional):**  
   Copy `.env.example` to `.env` if custom configuration is needed.

4. **Start Frontend Development Server:**  
   ```sh
   yarn dev
   # or: npm run dev
   ```

5. **Access the Application:**  
   Open your browser to `http://localhost:5000`

### Backend Configuration

The frontend is configured to proxy API requests to `https://localhost:7150` (default ASP.NET Core HTTPS port).

If your backend runs on a different port, update the `target` in `vite.config.js`:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'https://localhost:YOUR_PORT', // Update this
      // ...
    }
  }
}
```

---

## Troubleshooting

### ECONNREFUSED / HTTP Proxy Errors

If you see errors like these in your terminal or browser console:

```
[vite] http proxy error: /api/api/auth/me
AggregateError [ECONNREFUSED]: 
    at internalConnectMultiple (node:net:1134:18)
    at afterConnectMultiple (node:net:1715:7)
```

Or "Server error. Please try again later." messages in the UI, this means:

**✅ This is EXPECTED BEHAVIOR** - The backend .NET API server is not running.

**Solution:**
1. Start the backend server first (see [BACKEND_SETUP.md](./BACKEND_SETUP.md))
2. The backend should be running on `https://localhost:7150`
3. Then start the frontend with `npm run dev`

The frontend cannot function without the backend - it's a required dependency.

### Security Vulnerabilities (npm audit)

If you see moderate severity vulnerabilities in `esbuild` or `vite`:
- These are **development-only** dependencies
- They do NOT affect production builds
- The vulnerabilities only impact the dev server, not deployed applications
- Run `npm audit fix --force` only if you understand it may introduce breaking changes

### Theme Not Showing Light Mode

The application now defaults to **light mode**. If you're seeing dark mode:
- Clear your browser's localStorage: `localStorage.clear()`
- Refresh the page
- The theme preference is saved in localStorage as `theme`

---

## Key Development Guidelines

- **Use global UI primitives** (`/src/components/ui/*`) for all forms, inputs, tables, buttons, dialogs, etc. Do **not** create ad-hoc UI elements.
- **Centralize constants, roles, and enums** in `/src/lib/*` for maintainability and consistency.
- **All API calls** must use the appropriate service under `/src/services/api/` and handle errors and auth consistently.
- **State management** is handled using `/src/store/*`. Do not duplicate state logic.
- **All navigation** must respect route-level protection: role access managed by `useAuthGuard` and `useRoleAccess`.
- **Accessibility:** Use proper ARIA attributes, keyboard navigation, readable color contrast.
- **i18n (Localization):** Place all user-facing text into a future-proof translation structure.
- **Clean Code & Comments:**  
  - All business logic separated from UI rendering.  
  - All React components, hooks, and services are commented with JSDoc or TypeScript doc-comments (even in JS projects).  
  - Only production-ready stable code—no demos, no experimental code.

---

## Backend Integration

- **API Contract:**  
  - See `/src/services/api/` for all endpoints and contract definitions.
  - Entity schemas match the SQL Server backend structure.
- **Authentication:**  
  - JWT is stored securely (httpOnly cookie preferred for production).
  - Auto-logout and error feedback on auth failure.
- **SignalR Realtime:**  
  - WebSocket client is encapsulated in `/src/services/realtime/socketClient.js`.
  - Event subscriptions for beds and notifications use `bedChannel.js` and `notificationChannel.js`.
- **Error Handling:**  
  - All API and real-time events show user-friendly messages using the global notification/UI system.

---

## Accessibility & Internationalization

- **WCAG color standards and semantic components.**
- **Text and layout adaptable to both LTR/RTL.**
- **Mobile-responsiveness (Tailwind breakpoints, tested up to small tablets).**
- **i18n:** To be extended for Arabic/English, with global translation context.

---

## Security & Compliance

- **Data in transit:** All backend and websocket calls must use HTTPS/WSS.
- **Authentication and authorization enforced on both frontend (route-guarded) and backend.
- **Sensitive actions (bed assignment, discharge, role changes) double-checked and audit logged.
- **Backups:** Automated via Azure SQL, scheduled via backend policy.

---

## Contributing

- All pull requests must pass ESLint, Prettier, and unit tests.
- Do not introduce page-specific components unless global/ui cannot serve that use-case.
- Respect modularity—**business logic in hooks/services only**.

---

## License


---