# Quick Setup Guide for Firebase Testing

This guide provides step-by-step instructions to quickly set up and test the Hospital Bed Management System with Firebase.

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites Checklist
- [ ] Node.js v18+ installed
- [ ] Firebase account created
- [ ] Git repository cloned

---

## Step 1: Firebase Project Setup (2 minutes)

### A. Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Create a project" or "Add project"
3. Name: `hospital-bed-system` (or your preferred name)
4. Disable Google Analytics (optional for testing)
5. Click "Create project"

### B. Enable Authentication
1. In Firebase Console, click "Authentication" in left sidebar
2. Click "Get started"
3. Click "Sign-in method" tab
4. Click on "Email/Password"
5. Enable the first toggle (Email/Password)
6. Click "Save"

### C. Create Firestore Database
1. Click "Firestore Database" in left sidebar
2. Click "Create database"
3. Select "Start in test mode"
4. Choose your location (closest to you)
5. Click "Enable"

### D. Get Firebase Configuration
1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll to "Your apps" section
4. Click the web icon `</>`
5. Register app with nickname: `Hospital Bed Frontend`
6. Copy the configuration object (you'll need this)

### E. Download Service Account Key
1. Still in Project Settings, click "Service accounts" tab
2. Click "Generate new private key"
3. Click "Generate key" in confirmation dialog
4. Save the downloaded JSON file as `serviceAccountKey.json`
5. Move this file to the project root directory

---

## Step 2: Configure Environment (1 minute)

### A. Create Environment File
```bash
cd hospital-bed-system/hospital-bed-frontend
cp .env.example .env
```

### B. Edit .env File
Open `.env` and fill in the values from Firebase config (Step 1D):
```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

## Step 3: Populate Test Data (1 minute)

### A. Install Dependencies
```bash
cd hospital-bed-system
npm install
```

### B. Run Seeding Script
```bash
npm run seed
```

You should see output like:
```
🌱 Starting Firebase Test Data Seeding...
📝 Default Password Policy: {username}@12345!
...
✨ Seeding completed successfully!
```

**This creates 7 test users**:
- admin@hospital.com (password: admin@12345!)
- dr.ahmed@hospital.com (password: dr_ahmed@12345!)
- dr.sarah@hospital.com (password: dr_sarah@12345!)
- nurse.sara@hospital.com (password: nurse_sara@12345!)
- nurse.james@hospital.com (password: nurse_james@12345!)
- staff.reception@hospital.com (password: staff_reception@12345!)
- patient.john@example.com (password: patient_john@12345!)

---

## Step 4: Deploy Security Rules (30 seconds)

```bash
cd hospital-bed-frontend
firebase login
firebase deploy --only firestore:rules
```

---

## Step 5: Run Application (30 seconds)

### A. Install Frontend Dependencies
```bash
cd hospital-bed-frontend
npm install
```

### B. Start Development Server
```bash
npm run dev
```

Application should be running at: http://localhost:5000

---

## Step 6: Test Login (1 minute)

### Test Case 1: Admin Login
1. Open browser to http://localhost:5000/login
2. Email: `admin@hospital.com`
3. Password: `admin@12345!`
4. Click "Sign In"

**Expected**: You'll be redirected to change password page

### Test Case 2: Change Password
1. Enter new password: `NewAdmin@2025!`
2. Confirm password: `NewAdmin@2025!`
3. Click "Change Password"

**Expected**: Redirected to dashboard

### Test Case 3: Login with New Password
1. Logout
2. Login again with `admin@hospital.com` / `NewAdmin@2025!`

**Expected**: Goes directly to dashboard (no password change prompt)

---

## ✅ Success Checklist

After completing all steps, verify:
- [ ] Firebase project created and configured
- [ ] Authentication enabled with Email/Password
- [ ] Firestore database created
- [ ] Service account key downloaded and placed in project root
- [ ] `.env` file configured with Firebase credentials
- [ ] Test data seeded successfully (7 users, 4 departments)
- [ ] Firestore security rules deployed
- [ ] Frontend dependencies installed
- [ ] Application running at http://localhost:5000
- [ ] Can login with test user
- [ ] Password change flow works
- [ ] Can access dashboard after password change

---

## 🐛 Troubleshooting

### Error: "serviceAccountKey.json not found"
**Solution**: Download the service account key from Firebase Console (Step 1E)

### Error: "Firebase not initialized"
**Solution**: Check `.env` file has correct values and restart dev server

### Error: "Permission denied" in Firestore
**Solution**: Deploy security rules with `firebase deploy --only firestore:rules`

### Error: "User profile not found" after login
**Solution**: Run seeding script again: `npm run seed`

### Login button does nothing
**Solution**: Open browser console (F12) and check for errors. Likely Firebase config issue.

### Can't access /change-password page
**Solution**: Verify you're logged in. This is a protected route requiring authentication.

---

## 📖 Next Steps

### For Comprehensive Testing
See `TESTING_GUIDE.md` for detailed test cases covering:
- All authentication scenarios
- Password change validation
- Admin user management
- Firestore data integrity
- Security rule enforcement

### For Understanding Implementation
See `IMPLEMENTATION_SUMMARY.md` for:
- Architecture overview
- Security considerations
- Feature documentation
- Known limitations

---

## 🔑 Default Test Credentials

| Role      | Email                        | Password                |
|-----------|------------------------------|-------------------------|
| Admin     | admin@hospital.com           | admin@12345!            |
| Doctor    | dr.ahmed@hospital.com        | dr_ahmed@12345!         |
| Doctor    | dr.sarah@hospital.com        | dr_sarah@12345!         |
| Nurse     | nurse.sara@hospital.com      | nurse_sara@12345!       |
| Nurse     | nurse.james@hospital.com     | nurse_james@12345!      |
| Reception | staff.reception@hospital.com | staff_reception@12345!  |
| Patient   | patient.john@example.com     | patient_john@12345!     |

⚠️ **Remember**: All users must change password on first login!

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors (F12)
2. Review `TESTING_GUIDE.md` troubleshooting section
3. Verify Firebase Console shows users and data correctly
4. Check that all environment variables are set correctly

---

**Setup Time**: ~5 minutes  
**Updated**: 2025-12-16
