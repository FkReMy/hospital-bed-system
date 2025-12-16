# Firebase Setup Guide

This guide explains how to set up Firebase for the Hospital Bed Management System frontend application.

## Overview

The application now uses Firebase as the backend for testing and demo purposes instead of the .NET backend. This includes:
- **Firebase Authentication** for user authentication
- **Cloud Firestore** for database storage
- **Real-time updates** via Firestore listeners

## Prerequisites

1. A Google account
2. Node.js and npm installed
3. The hospital-bed-frontend application

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "hospital-bed-system")
4. Follow the prompts to complete project creation

## Step 2: Enable Firebase Services

### Enable Authentication

1. In the Firebase Console, click on "Authentication" in the left sidebar
2. Click "Get started"
3. Click on the "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

### Enable Cloud Firestore

1. In the Firebase Console, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
   - **Important:** Test mode allows read/write access for 30 days. Before deploying to production, you must set up proper security rules.
4. Select a Cloud Firestore location (choose one close to your users)
5. Click "Enable"

## Step 3: Get Firebase Configuration

1. In the Firebase Console, click on the gear icon next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click on the web icon `</>` to add a web app
5. Register your app with a nickname (e.g., "Hospital Bed Frontend")
6. You'll see a configuration object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Step 4: Configure the Frontend Application

1. In the `hospital-bed-frontend` directory, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key_from_firebase
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. Save the file

## Step 5: Set Up Firestore Collections

The application expects the following Firestore collections:

- `users` - Staff user profiles
- `patients` - Patient records
- `departments` - Hospital departments
- `rooms` - Hospital rooms
- `beds` - Hospital beds
- `bed_assignments` - Bed assignment records
- `appointments` - Patient appointments
- `prescriptions` - Patient prescriptions
- `notifications` - User notifications

### Create Sample Data (Optional)

You can manually add sample documents in the Firebase Console:

#### Sample User (for login)
Collection: `users`
Document ID: (auto-generated or use the UID from Firebase Auth)
```json
{
  "email": "admin@hospital.com",
  "full_name": "Admin User",
  "role": "Admin",
  "roles": ["Admin"],
  "department_id": null,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

First, create this user in Firebase Authentication:
1. Go to Authentication > Users
2. Click "Add user"
3. Enter email: admin@hospital.com
4. Enter password: (choose a secure password)
5. Copy the UID of the created user
6. Use this UID as the document ID when creating the user profile in Firestore

#### Sample Department
Collection: `departments`
```json
{
  "name": "Emergency",
  "description": "Emergency Department",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

#### Sample Room
Collection: `rooms`
```json
{
  "name": "Room 101",
  "department_id": "department_id_here",
  "floor": 1,
  "capacity": 2,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

#### Sample Bed
Collection: `beds`
```json
{
  "bed_number": "101-A",
  "department_id": "department_id_here",
  "room_id": "room_id_here",
  "status": "available",
  "current_patient_id": null,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

## Step 6: Run the Application

1. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5000`

4. Log in with the credentials you created in Firebase Authentication

## Security Rules (Important for Production)

Before deploying to production, update your Firestore security rules. In the Firebase Console:

1. Go to Firestore Database
2. Click on the "Rules" tab
3. Replace the default rules with appropriate security rules. Example:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // More specific rules for production:
    // match /users/{userId} {
    //   allow read: if request.auth != null;
    //   allow write: if request.auth.uid == userId || hasRole('Admin');
    // }
  }
}
```

## Troubleshooting

### "Permission denied" errors
- Check that Firestore is in test mode or that your security rules allow access
- Verify the user is authenticated (check Firebase Console > Authentication)

### "Firebase not initialized" errors
- Verify your `.env` file has the correct configuration
- Restart the dev server after changing `.env`

### Login fails
- Check that Email/Password authentication is enabled in Firebase Console
- Verify the user exists in Firebase Authentication
- Verify the user profile document exists in Firestore with matching UID

### Data not showing up
- Verify the collections exist in Firestore
- Check browser console for errors
- Verify security rules allow read access

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloud Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)

## Switching Back to .NET Backend

If you want to switch back to the .NET backend, you would need to:
1. Revert the changes to the API service files
2. Start the .NET backend server
3. Update the Vite proxy configuration

The original backend setup instructions are in `BACKEND_SETUP.md`.
