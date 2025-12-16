# Firebase Test Data Seeding

This directory contains scripts for populating Firebase with test data for the Hospital Bed Management System.

## Quick Start

1. **Download Firebase Admin SDK credentials**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Navigate to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file as `serviceAccountKey.json` in the project root directory

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the seeding script**:
   ```bash
   npm run seed
   ```

## What Gets Created

### Test Users
The script creates 7 test users with the following credentials:

| Role      | Email                        | Password                   |
|-----------|------------------------------|----------------------------|
| Admin     | admin@hospital.com           | admin@12345!               |
| Doctor    | dr.ahmed@hospital.com        | dr_ahmed@12345!            |
| Doctor    | dr.sarah@hospital.com        | dr_sarah@12345!            |
| Nurse     | nurse.sara@hospital.com      | nurse_sara@12345!          |
| Nurse     | nurse.james@hospital.com     | nurse_james@12345!         |
| Reception | staff.reception@hospital.com | staff_reception@12345!     |
| Patient   | patient.john@example.com     | patient_john@12345!        |

### Departments
- Emergency
- ICU (Intensive Care Unit)
- Cardiology
- Surgery

### User Properties
Each user is created with:
- Firebase Authentication account
- Firestore user profile document
- `mustChangePassword: true` flag (forces password change on first login)
- Active status
- Assigned role and department (where applicable)

## Password Policy

All test users follow this default password format:
```
{username}@12345!
```

This password must be changed on first login.

## Security Notes

⚠️ **IMPORTANT**: 
- The `serviceAccountKey.json` file contains sensitive credentials
- It is already added to `.gitignore` and should NEVER be committed to version control
- Use test mode Firestore rules during development
- Update security rules before deploying to production

## Troubleshooting

### Error: serviceAccountKey.json not found
**Solution**: Download the service account key from Firebase Console as described in step 1 above.

### Error: Permission denied
**Solution**: Ensure the service account has the necessary permissions (Firebase Admin SDK should have full access by default).

### Error: Module not found
**Solution**: Run `npm install` to install dependencies.

## See Also

- [TESTING_GUIDE.md](../TESTING_GUIDE.md) - Comprehensive testing procedures
- [FIREBASE_SETUP.md](../FIREBASE_SETUP.md) - Firebase project setup instructions
