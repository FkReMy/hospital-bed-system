# Firebase Services

This directory contains Firebase service adapters that replace the .NET backend API endpoints.

## Overview

All services in this directory provide the same interface as the original API services but use Firebase (Firestore + Auth) instead of HTTP requests to a .NET backend.

## Services

### Core Services

| Service | File | Description |
|---------|------|-------------|
| **Authentication** | `authFirebase.js` | Firebase Auth (email/password) + Firestore user profiles |
| **Beds** | `bedFirebase.js` | Bed CRUD, assignment, discharge, status updates |
| **Patients** | `patientFirebase.js` | Patient CRUD, search, nested relations |
| **Users** | `userFirebase.js` | Staff user management, role management |
| **Appointments** | `appointmentFirebase.js` | Appointment scheduling and management |
| **Departments** | `departmentFirebase.js` | Department CRUD operations |
| **Rooms** | `roomFirebase.js` | Room management |
| **Prescriptions** | `prescriptionFirebase.js` | Prescription management |
| **Notifications** | `notificationFirebase.js` | User notifications with real-time updates |
| **Bed Assignments** | `bedAssignmentFirebase.js` | Assignment history tracking |

### Configuration

| File | Purpose |
|------|---------|
| `firebaseConfig.js` | Firebase initialization and configuration |
| `index.js` | Central export point for all services |

## Usage

### Import from API Layer (Recommended)
```javascript
import authApi from '@services/api/authApi';
import bedApi from '@services/api/bedApi';
// These now use Firebase under the hood
```

### Direct Import (Advanced)
```javascript
import authFirebase from '@services/firebase/authFirebase';
import { db, auth } from '@services/firebase/firebaseConfig';
```

## Firebase Configuration

Firebase is configured via environment variables in `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

See `.env.example` for a template.

## Firestore Collections

The services expect these Firestore collections:

```
users/                  - Staff user profiles (must match Firebase Auth UIDs)
  ├── email            - User email
  ├── full_name        - Full name
  ├── role             - Primary role (Admin, Doctor, Nurse, Reception)
  ├── roles            - Array of roles
  ├── department_id    - Department reference
  └── timestamps       - created_at, updated_at

patients/               - Patient records
  ├── patient_id       - Unique patient identifier
  ├── full_name        - Patient name
  ├── email            - Contact email
  ├── phone_number     - Contact phone
  ├── current_bed_id   - Current bed assignment (if any)
  └── timestamps       - created_at, updated_at

departments/            - Hospital departments
  ├── name             - Department name
  ├── description      - Department description
  └── timestamps       - created_at, updated_at

rooms/                  - Hospital rooms
  ├── name             - Room name/number
  ├── department_id    - Department reference
  ├── floor            - Floor number
  ├── capacity         - Bed capacity
  └── timestamps       - created_at, updated_at

beds/                   - Hospital beds
  ├── bed_number       - Bed identifier
  ├── department_id    - Department reference
  ├── room_id          - Room reference
  ├── status           - available, occupied, maintenance, cleaning
  ├── current_patient_id - Current patient (if occupied)
  └── timestamps       - created_at, updated_at

bed_assignments/        - Bed assignment history
  ├── bed_id           - Bed reference
  ├── patient_id       - Patient reference
  ├── assigned_by      - Staff user ID
  ├── status           - active, discharged
  ├── assigned_at      - Assignment timestamp
  ├── discharged_at    - Discharge timestamp (if applicable)
  └── timestamps       - created_at, updated_at

appointments/           - Patient appointments
  ├── patient_id       - Patient reference
  ├── doctor_id        - Doctor user reference
  ├── appointment_date - Scheduled date/time
  ├── status           - scheduled, completed, cancelled, no_show
  └── timestamps       - created_at, updated_at

prescriptions/          - Patient prescriptions
  ├── patient_id       - Patient reference
  ├── doctor_id        - Prescribing doctor reference
  ├── medication       - Medication details
  ├── dosage           - Dosage information
  ├── status           - active, completed, cancelled
  └── timestamps       - created_at, updated_at

notifications/          - User notifications
  ├── user_id          - Target user reference
  ├── title            - Notification title
  ├── message          - Notification message
  ├── type             - Notification type
  ├── read             - Read status (boolean)
  ├── read_at          - When marked as read
  └── created_at       - Creation timestamp
```

## Real-time Updates

Some services support real-time updates via Firestore listeners:

```javascript
// Example: Subscribe to notifications
import { subscribeToNotifications } from '@services/firebase/notificationFirebase';

const unsubscribe = subscribeToNotifications(userId, (notifications) => {
  console.log('New notifications:', notifications);
});

// Cleanup when done
unsubscribe();
```

## Error Handling

All services throw errors with meaningful messages:

```javascript
try {
  const user = await authFirebase.login({ email, password });
} catch (error) {
  console.error('Login failed:', error.message);
  // "Invalid email or password"
  // "Too many login attempts. Please try again later."
}
```

## Security

- All operations require Firebase Authentication
- Firestore security rules should be configured in production
- Test mode rules expire after 30 days
- Use Firebase Admin SDK for server-side operations (password reset, etc.)

## Setup

See `FIREBASE_SETUP.md` in the project root for complete setup instructions.

## Notes

- These services maintain the same interface as the original .NET backend
- No changes to React components or hooks are required
- Firebase handles authentication tokens automatically
- Timestamps are stored as Firestore Timestamp objects
- All services include JSDoc documentation

## Need Help?

1. Check `FIREBASE_SETUP.md` for setup instructions
2. Check `FIREBASE_INTEGRATION_SUMMARY.md` for integration details
3. Review inline documentation in service files
4. Check Firebase Console for data and authentication status
