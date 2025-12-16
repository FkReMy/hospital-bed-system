# Firebase Testing & Verification Guide
## Hospital Bed Management System (HBMS)

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Test Data Setup](#test-data-setup)
4. [Authentication Testing](#authentication-testing)
5. [Account Creation & Population](#account-creation--population)
6. [First Login & Password Change Flow](#first-login--password-change-flow)
7. [Admin User Management Testing](#admin-user-management-testing)
8. [Firestore Data Integrity](#firestore-data-integrity)
9. [Login & UI Behavior](#login--ui-behavior)
10. [Deployment Checklist](#deployment-checklist)
11. [Troubleshooting](#troubleshooting)

---

## Overview

This guide provides comprehensive testing procedures for the Hospital Bed Management System (HBMS) using Firebase as the backend.

### System Context
- **System Type**: Hospital Bed Management System
- **Domain**: Hospital Operations
- **Deployment**: Firebase Hosting
- **Backend Services**: Firebase Authentication, Firestore Database
- **Architecture**: Frontend → Firebase Auth → Firestore

### Hospital Roles in Scope
- Admin
- Doctor
- Nurse
- Hospital Staff (Reception / Operations)
- Patient

### Out of Scope
⚠️ **Ignore all references to**:
- C# / ASP.NET Core backend
- SQL Server / Azure SQL database
- SignalR
- Entity Framework
- JWT from .NET backend

---

## Prerequisites

### Required Tools
- Node.js (v18 or later)
- npm or yarn
- Firebase CLI: `npm install -g firebase-tools`
- Firebase project with Authentication and Firestore enabled
- Firebase Admin SDK credentials (for data seeding)

### Firebase Project Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Enable Firebase Authentication with Email/Password provider
4. Create Firestore Database (start in test mode for development)
5. Download service account key:
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `serviceAccountKey.json` in project root

### Environment Configuration
1. Copy `.env.example` to `.env` in `hospital-bed-frontend` directory
2. Fill in Firebase configuration from Firebase Console:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

---

## Test Data Setup

### Default Password Policy
All default test users follow this password format:
```
{username}@12345!
```

**Examples**:
- `admin@12345!`
- `dr_ahmed@12345!`
- `nurse_sara@12345!`

### Required Test Users

| Role      | Email                           | Username         | Password            | Full Name            |
|-----------|---------------------------------|------------------|---------------------|----------------------|
| Admin     | admin@hospital.com              | admin            | admin@12345!        | System Administrator |
| Doctor    | dr.ahmed@hospital.com           | dr_ahmed         | dr_ahmed@12345!     | Dr. Ahmed Hassan     |
| Doctor    | dr.sarah@hospital.com           | dr_sarah         | dr_sarah@12345!     | Dr. Sarah Johnson    |
| Nurse     | nurse.sara@hospital.com         | nurse_sara       | nurse_sara@12345!   | Sara Wilson          |
| Nurse     | nurse.james@hospital.com        | nurse_james      | nurse_james@12345!  | James Miller         |
| Reception | staff.reception@hospital.com    | staff_reception  | staff_reception@12345! | Maria Garcia      |
| Patient   | patient.john@example.com        | patient_john     | patient_john@12345! | John Doe             |

### Running the Seeding Script

1. Install Firebase Admin SDK:
   ```bash
   cd hospital-bed-system
   npm install firebase-admin
   ```

2. Ensure `serviceAccountKey.json` is in the project root

3. Run the seeding script:
   ```bash
   node scripts/seedFirebaseTestData.js
   ```

4. Verify output shows successful creation of:
   - Departments (Emergency, ICU, Cardiology, Surgery)
   - All test users in Firebase Authentication
   - All test user profiles in Firestore

### Verifying Test Data in Firebase Console

#### Check Firebase Authentication:
1. Go to Firebase Console → Authentication → Users
2. Verify all 7 users are listed with correct emails
3. Note each user's UID

#### Check Firestore Database:
1. Go to Firebase Console → Firestore Database
2. Check `users` collection:
   - Each document ID should match the Firebase Auth UID
   - Each document should contain:
     - `email`
     - `full_name`
     - `role`
     - `roles` (array)
     - `department_id` (nullable)
     - `status` (should be "active")
     - `mustChangePassword` (should be `true` for new users)
     - `created_at`
     - `updated_at`

3. Check `departments` collection:
   - Should have 4 departments: Emergency, ICU, Cardiology, Surgery

---

## Authentication Testing

### 5.1 Email/Password Provider Verification

**Test Steps**:
1. Go to Firebase Console → Authentication → Sign-in method
2. Verify "Email/Password" is enabled
3. Click on "Email/Password" provider
4. Ensure "Email link (passwordless sign-in)" is NOT enabled (unless desired)

**Expected Result**: ✅ Email/Password provider is enabled

---

### 5.2 Login Flow Testing

#### Test Case 1: Valid Login (Admin)
**Steps**:
1. Navigate to `http://localhost:5000/login`
2. Enter email: `admin@hospital.com`
3. Enter password: `admin@12345!`
4. Click "Sign In"

**Expected Results**:
- ✅ User is authenticated
- ✅ Toast notification: "You must change your password before continuing"
- ✅ Redirected to `/change-password` page
- ✅ No errors in browser console

#### Test Case 2: Valid Login (Other Roles)
**Steps**:
Repeat Test Case 1 for each role:
- Doctor: `dr.ahmed@hospital.com` / `dr_ahmed@12345!`
- Nurse: `nurse.sara@hospital.com` / `nurse_sara@12345!`
- Reception: `staff.reception@hospital.com` / `staff_reception@12345!`

**Expected Results**: Same as Test Case 1

---

### 5.3 Invalid Credentials Testing

#### Test Case 3: Wrong Password
**Steps**:
1. Navigate to `/login`
2. Enter email: `admin@hospital.com`
3. Enter password: `wrongpassword`
4. Click "Sign In"

**Expected Results**:
- ❌ Login fails
- ✅ Error toast: "Invalid email or password"
- ✅ User remains on login page

#### Test Case 4: Non-existent User
**Steps**:
1. Navigate to `/login`
2. Enter email: `nonexistent@hospital.com`
3. Enter password: `anypassword`
4. Click "Sign In"

**Expected Results**:
- ❌ Login fails
- ✅ Error toast: "Invalid email or password"
- ✅ User remains on login page

---

### 5.4 Password Not Stored in Firestore

**Test Steps**:
1. Go to Firebase Console → Firestore Database
2. Select `users` collection
3. Open any user document
4. Inspect all fields

**Expected Results**:
- ✅ NO `password` field exists
- ✅ NO `passwordHash` field exists
- ✅ NO `password_hash` field exists
- ✅ Passwords are ONLY stored in Firebase Authentication (secure)

---

### 5.5 Disabled Users Testing

**Test Steps**:
1. Go to Firebase Console → Authentication → Users
2. Select a test user (e.g., `patient.john@example.com`)
3. Click the overflow menu (⋮) → Disable account
4. Try to login with that user's credentials

**Expected Results**:
- ❌ Login fails
- ✅ Error message indicates account is disabled
- ✅ User cannot access the system

---

## Account Creation & Population

### 6.1 Manual Account Creation Testing

#### Test Case 5: Create New User via Admin Interface
**Prerequisites**: Logged in as Admin

**Steps**:
1. Navigate to Admin Dashboard → User Management
2. Click "Add New User"
3. Fill in:
   - Email: `test.user@hospital.com`
   - Full Name: `Test User`
   - Role: `Nurse`
   - Department: `Emergency`
4. Submit form

**Expected Results**:
- ✅ User created in Firebase Authentication
- ✅ User profile created in Firestore with matching UID
- ✅ `mustChangePassword` set to `true`
- ✅ Success notification displayed
- ✅ New user appears in user list

**Verification**:
1. Check Firebase Console → Authentication
   - New user exists with email `test.user@hospital.com`
2. Check Firestore → `users` collection
   - Document with same UID contains correct user data

---

### 6.2 Account Consistency Checks

#### Scenario 1: Auth User Exists but Firestore Record Missing
**How to Reproduce**:
1. Create user in Firebase Authentication manually
2. Do NOT create Firestore document
3. Try to login

**Expected Issue**:
- Login will fail with error: "User profile not found"

**Fix**:
- Run data seeding script with proper Firestore document creation

#### Scenario 2: Firestore Record Exists but Auth User Missing
**How to Reproduce**:
1. Create Firestore document manually
2. Do NOT create Firebase Auth user
3. Try to login

**Expected Issue**:
- Login will fail with error: "Invalid email or password"

**Fix**:
- Create corresponding Firebase Auth user with matching email

---

### 6.3 Role Assignment Verification

**Test Steps**:
1. For each test user, check Firestore document
2. Verify `role` field matches expected role
3. Verify `roles` array contains at least the primary role

**Expected Results**:
- ✅ Admin has `role: "admin"` and `roles: ["admin"]`
- ✅ Doctors have `role: "doctor"` and `roles: ["doctor"]`
- ✅ Nurses have `role: "nurse"` and `roles: ["nurse"]`
- ✅ Reception has `role: "reception"` and `roles: ["reception"]`

---

## First Login & Password Change Flow

### 7.1 Default Password Login

#### Test Case 6: First Login with Default Password
**Steps**:
1. Login with any test user (e.g., `admin@hospital.com` / `admin@12345!`)
2. Observe behavior

**Expected Results**:
- ✅ Login succeeds
- ✅ Toast: "You must change your password before continuing"
- ✅ Redirected to `/change-password` page
- ✅ Cannot access other pages until password is changed

---

### 7.2 Password Change Validation

#### Test Case 7: Change Password with Valid Password
**Steps**:
1. Login with test user (redirected to `/change-password`)
2. Enter new password: `NewSecure@Pass123`
3. Confirm password: `NewSecure@Pass123`
4. Click "Change Password"

**Expected Results**:
- ✅ Password update succeeds
- ✅ `mustChangePassword` flag set to `false` in Firestore
- ✅ Success toast: "Password changed successfully"
- ✅ Redirected to `/dashboard`

**Verification**:
1. Logout
2. Login again with NEW password
3. Should go directly to dashboard (no password change prompt)

---

#### Test Case 8: Weak Password Validation
**Steps**:
1. At password change page, enter weak password: `123`
2. Try to submit

**Expected Results**:
- ❌ Validation error displayed
- ✅ Shows password requirements:
  - At least 8 characters
  - Contains uppercase and lowercase
  - Contains number
  - Contains special character

---

#### Test Case 9: Password Mismatch
**Steps**:
1. Enter new password: `NewSecure@Pass123`
2. Enter confirm password: `DifferentPassword123!`
3. Click "Change Password"

**Expected Results**:
- ❌ Error: "Passwords do not match"
- ✅ Form not submitted

---

### 7.3 mustChangePassword Flag Behavior

**Test Steps**:
1. Check Firestore before password change:
   ```javascript
   // users/{userId}
   {
     mustChangePassword: true,
     // ... other fields
   }
   ```

2. Change password successfully

3. Check Firestore after password change:
   ```javascript
   // users/{userId}
   {
     mustChangePassword: false,
     updated_at: "2025-12-16T22:00:00.000Z"
   }
   ```

**Expected Results**:
- ✅ Flag changes from `true` to `false`
- ✅ `updated_at` timestamp updated

---

## Admin User Management Testing

### 8.1 View All Users

#### Test Case 10: Admin Can View All Users
**Prerequisites**: Logged in as Admin

**Steps**:
1. Navigate to Admin Dashboard → User Management
2. View user list

**Expected Results**:
- ✅ All users displayed in table/list
- ✅ Each user shows:
  - Full Name
  - Email
  - Role
  - Status (Active/Disabled)
  - Department (if assigned)
- ✅ No password or hash information visible

---

### 8.2 Password Reset Functionality

#### Test Case 11: Admin Reset User Password
**Prerequisites**: Logged in as Admin

**Steps**:
1. Navigate to User Management
2. Select a user (e.g., `nurse.sara@hospital.com`)
3. Click "Reset Password" action
4. Confirm action

**Expected Results**:
- ✅ Password reset email sent to user
- ✅ Success notification: "Password reset email sent successfully"
- ✅ User receives email from Firebase with reset link

**User Verification**:
1. User clicks reset link in email
2. User sets new password
3. User can login with new password

---

### 8.3 Force Password Change on Next Login

#### Test Case 12: Admin Force Password Change
**Prerequisites**: Logged in as Admin

**Steps**:
1. Navigate to User Management
2. Select a user who has already changed password
3. Enable "Force Password Change on Next Login" toggle
4. Save changes

**Expected Results**:
- ✅ `mustChangePassword` flag set to `true` in Firestore
- ✅ Success notification

**User Verification**:
1. Logout
2. Login as that user
3. User redirected to `/change-password` page
4. User must change password before accessing dashboard

---

### 8.4 Admin Cannot View Passwords

#### Test Case 13: Password Security Check
**Test Steps**:
1. Login as Admin
2. Navigate to User Management
3. View user details
4. Inspect page source and network requests

**Expected Results**:
- ✅ No password field visible in UI
- ✅ No password or hash in Firestore documents
- ✅ No password in API responses
- ✅ Firestore rules prevent reading password fields (if they existed)

---

### 8.5 Disable/Enable User

#### Test Case 14: Admin Disable User
**Steps**:
1. Login as Admin
2. Navigate to User Management
3. Select a user
4. Click "Disable Account"
5. Confirm action

**Expected Results**:
- ✅ User disabled in Firebase Authentication
- ✅ User status updated to "inactive" in Firestore (optional)
- ✅ Disabled user cannot login

**Re-enable Steps**:
1. Select same user
2. Click "Enable Account"
3. User can login again

---

## Firestore Data Integrity

### 9.1 User Document Structure Validation

**Expected Structure**:
```javascript
{
  email: "admin@hospital.com",
  full_name: "System Administrator",
  role: "admin",
  roles: ["admin"],
  department_id: null,
  status: "active",
  mustChangePassword: true,
  created_at: Timestamp,
  updated_at: Timestamp
}
```

**Test Steps**:
1. Go to Firestore Console
2. Inspect multiple user documents
3. Verify all required fields exist
4. Check data types are correct

**Expected Results**:
- ✅ All required fields present
- ✅ `roles` is an array
- ✅ Timestamps are Firebase Timestamp objects
- ✅ No sensitive data in plaintext

---

### 9.2 Role Values Consistency

**Valid Roles**:
- `admin`
- `doctor`
- `nurse`
- `reception`
- `patient`

**Test Steps**:
1. Check all user documents
2. Verify `role` field contains only valid values
3. Check `roles` array contains valid role strings

**Expected Results**:
- ✅ No invalid role values
- ✅ Role names are lowercase and consistent

---

### 9.3 Firestore Security Rules Testing

#### Test Case 15: Authenticated User Can Read Users
**Steps**:
1. Login as any user
2. Navigate to any page that displays user information
3. Check browser console for errors

**Expected Results**:
- ✅ User data loads successfully
- ✅ No permission denied errors

---

#### Test Case 16: Unauthenticated User Cannot Read Data
**Steps**:
1. Logout (or open incognito browser)
2. Try to access Firestore directly via browser console:
   ```javascript
   import { collection, getDocs } from 'firebase/firestore';
   import { db } from './firebaseConfig';
   
   // Try to read users without authentication
   const users = await getDocs(collection(db, 'users'));
   ```

**Expected Results**:
- ❌ Request fails
- ✅ Error: "Missing or insufficient permissions"

---

#### Test Case 17: Non-Admin Cannot Delete Users
**Steps**:
1. Login as Nurse or Doctor
2. Try to delete a user (if UI allows)
3. Or attempt via console:
   ```javascript
   import { doc, deleteDoc } from 'firebase/firestore';
   import { db } from './firebaseConfig';
   
   await deleteDoc(doc(db, 'users', 'someUserId'));
   ```

**Expected Results**:
- ❌ Operation fails
- ✅ Error: "Missing or insufficient permissions"

---

## Login & UI Behavior

### 10.1 Login Issues Verification

#### Issue 1: "Login not working properly"
**Symptoms to Check**:
- Login button does nothing
- Infinite loading state
- Error messages not displayed
- Redirect doesn't work

**Test Steps**:
1. Open browser console
2. Navigate to `/login`
3. Enter valid credentials
4. Click "Sign In"
5. Observe console for errors

**Common Issues & Fixes**:
- **Firebase not initialized**: Check `.env` file has correct values
- **CORS errors**: Ensure Firebase domain is allowed
- **Network errors**: Check internet connection
- **Auth state listener issues**: Check useAuth hook implementation

---

#### Issue 2: "Account creation throwing errors"
**Test Steps**:
1. Login as Admin
2. Try to create new user
3. Check console for errors

**Common Issues & Fixes**:
- **Email already exists**: Firebase Auth error `auth/email-already-in-use`
- **Weak password**: Firebase enforces minimum 6 characters
- **Firestore permission denied**: Check security rules
- **Missing fields**: Ensure all required fields are sent

---

### 10.2 Frontend Validation Errors

**Test Steps**:
1. Try to login with empty email
2. Try to login with invalid email format
3. Try to login with empty password

**Expected Results**:
- ✅ Client-side validation prevents submission
- ✅ Appropriate error messages displayed
- ✅ No network requests made for invalid input

---

### 10.3 Firebase Auth Errors

**Common Firebase Error Codes**:
- `auth/user-not-found`: User doesn't exist
- `auth/wrong-password`: Incorrect password
- `auth/email-already-in-use`: Email already registered
- `auth/weak-password`: Password too weak
- `auth/too-many-requests`: Too many failed login attempts
- `auth/requires-recent-login`: Action requires recent authentication

**Test**: Verify appropriate user-friendly messages are shown for each error

---

### 10.4 Firestore Permission Errors

**Test Steps**:
1. Check browser console during app usage
2. Look for Firestore permission errors

**Expected**: No permission errors during normal usage by authenticated users

**If Errors Occur**:
- Check `firestore.rules` file
- Verify rules are deployed: `firebase deploy --only firestore:rules`
- Check user authentication state

---

## Deployment Checklist

### Pre-Deployment

- [ ] All test users created and verified
- [ ] Firestore security rules reviewed and tested
- [ ] All authentication flows tested
- [ ] Password change functionality verified
- [ ] Admin user management tested
- [ ] No console errors during normal usage
- [ ] `.env` file configured with production Firebase credentials
- [ ] `serviceAccountKey.json` is NOT committed to git (add to `.gitignore`)

### Firebase Configuration

- [ ] Firebase Authentication enabled with Email/Password provider
- [ ] Firestore Database created
- [ ] Firestore security rules deployed
- [ ] Firebase Hosting configured (if deploying to Firebase)

### Build & Deploy

```bash
# Navigate to frontend directory
cd hospital-bed-frontend

# Install dependencies
npm install

# Build for production
npm run build

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy to Firebase Hosting (if configured)
firebase deploy --only hosting
```

### Post-Deployment Verification

- [ ] Login with each test user role
- [ ] Verify password change flow works in production
- [ ] Check that Firestore security rules are active
- [ ] Verify no sensitive data exposed in Firestore
- [ ] Test admin user management features
- [ ] Verify disabled users cannot login

---

## Troubleshooting

### Issue: "Firebase not initialized" Error

**Solution**:
1. Check `.env` file exists in `hospital-bed-frontend` directory
2. Verify all `VITE_FIREBASE_*` variables are set
3. Restart dev server: `npm run dev`

---

### Issue: "Permission denied" in Firestore

**Solution**:
1. Check if user is authenticated: `auth.currentUser`
2. Deploy Firestore rules: `firebase deploy --only firestore:rules`
3. Verify rules in Firebase Console → Firestore → Rules tab
4. For testing, temporarily use test mode rules (NOT for production):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

---

### Issue: "User profile not found" After Login

**Solution**:
1. Check Firebase Auth UID matches Firestore document ID
2. Verify user document exists in `users` collection
3. Run seeding script to create missing profiles
4. Or manually create Firestore document with matching UID

---

### Issue: Password Reset Email Not Received

**Solution**:
1. Check spam/junk folder
2. Verify email address is correct in Firebase Authentication
3. Check Firebase Console → Authentication → Templates → Password reset
4. Ensure SMTP is properly configured (uses Firebase's by default)

---

### Issue: Can't Login After Password Change

**Solution**:
1. Clear browser cache and cookies
2. Try incognito/private browsing mode
3. Verify password was actually changed in Firebase Auth
4. Check `mustChangePassword` flag is set to `false` in Firestore

---

### Issue: Admin Can't Reset User Password

**Solution**:
1. Ensure logged in as Admin role
2. Verify user email is correct
3. Check Firebase Auth has user with that email
4. Try from different browser/device

---

## Testing Results Summary

After completing all tests, document results in this format:

### ✅ Passed Tests
- [x] Authentication with Email/Password
- [x] Login with all roles
- [x] Invalid credentials handling
- [x] Password change on first login
- [ ] ...

### ❌ Failed Tests
- Issue: Brief description
- Location: Component/Service name
- Severity: Critical / Major / Minor
- Fix: Proposed solution

### 🔍 Findings
- Authentication: All flows working correctly
- Firestore: Data structure consistent
- Security: No sensitive data exposed
- UI: No blocking issues

---

## Final Assessment

### System Readiness
- [ ] **Ready for online testing**: All critical tests passed
- [ ] **Partially ready**: Minor issues present, documented
- [ ] **Not ready**: Critical issues blocking testing

### Critical Issues (if any)
1. Issue description
2. Impact assessment
3. Required fix

### Recommendations
1. Priority improvements
2. Optional enhancements
3. Future considerations

---

## Appendix

### Useful Commands

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy hosting
firebase deploy --only hosting

# View Firestore data
firebase firestore:data

# View Auth users
firebase auth:export users.json

# Seed test data
node scripts/seedFirebaseTestData.js
```

### Firebase Console URLs
- **Authentication**: https://console.firebase.google.com/project/YOUR_PROJECT/authentication/users
- **Firestore**: https://console.firebase.google.com/project/YOUR_PROJECT/firestore/data
- **Hosting**: https://console.firebase.google.com/project/YOUR_PROJECT/hosting/main

### Support Resources
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

---

**Document Version**: 1.0  
**Last Updated**: 2025-12-16  
**Tested By**: _____________  
**Date**: _____________
