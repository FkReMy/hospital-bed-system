#!/usr/bin/env node
/**
 * Firebase Test Data Seeding Script
 * 
 * This script populates Firebase Authentication and Firestore with test users
 * for the Hospital Bed Management System (HBMS).
 * 
 * Features:
 * - Creates test users in Firebase Authentication
 * - Creates matching user profiles in Firestore
 * - Implements default password policy: {username}@12345!
 * - Creates required hospital roles: Admin, Doctor, Nurse, Hospital Staff, Patient
 * - Sets mustChangePassword flag for first-time login
 * 
 * Usage:
 *   node scripts/seedFirebaseTestData.js
 * 
 * Prerequisites:
 *   - Firebase Admin SDK credentials (serviceAccountKey.json)
 *   - Environment variables configured
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
let serviceAccount;
try {
  const serviceAccountPath = join(__dirname, '../serviceAccountKey.json');
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
} catch (error) {
  console.error('❌ Error: serviceAccountKey.json not found.');
  console.error('   Please download your Firebase Admin SDK private key from:');
  console.error('   Firebase Console > Project Settings > Service Accounts > Generate New Private Key');
  console.error('   Save it as serviceAccountKey.json in the project root directory.');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();
const db = admin.firestore();

/**
 * Default password policy: {username}@12345!
 */
const generateDefaultPassword = (username) => `${username}@12345!`;

/**
 * Test users to create
 * Format: { email, username, full_name, role, department_id }
 */
const TEST_USERS = [
  // Admin
  {
    email: 'admin@hospital.com',
    username: 'admin',
    full_name: 'System Administrator',
    role: 'admin',
    department_id: null,
  },
  
  // Doctors
  {
    email: 'dr.ahmed@hospital.com',
    username: 'dr_ahmed',
    full_name: 'Dr. Ahmed Hassan',
    role: 'doctor',
    department_id: 'emergency', // Will be created if doesn't exist
  },
  {
    email: 'dr.sarah@hospital.com',
    username: 'dr_sarah',
    full_name: 'Dr. Sarah Johnson',
    role: 'doctor',
    department_id: 'cardiology',
  },
  
  // Nurses
  {
    email: 'nurse.sara@hospital.com',
    username: 'nurse_sara',
    full_name: 'Sara Wilson',
    role: 'nurse',
    department_id: 'emergency',
  },
  {
    email: 'nurse.james@hospital.com',
    username: 'nurse_james',
    full_name: 'James Miller',
    role: 'nurse',
    department_id: 'icu',
  },
  
  // Hospital Staff (Reception/Operations)
  {
    email: 'staff.reception@hospital.com',
    username: 'staff_reception',
    full_name: 'Maria Garcia',
    role: 'reception',
    department_id: null,
  },
  
  // Patient (for testing patient-facing features)
  {
    email: 'patient.john@example.com',
    username: 'patient_john',
    full_name: 'John Doe',
    role: 'patient',
    department_id: null,
  },
];

/**
 * Create or update user in Firebase Auth
 */
async function createAuthUser(email, password) {
  try {
    // Try to get existing user
    try {
      const existingUser = await auth.getUserByEmail(email);
      console.log(`   ℹ️  Auth user already exists: ${email} (UID: ${existingUser.uid})`);
      return existingUser;
    } catch (error) {
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }
    
    // Create new user
    const userRecord = await auth.createUser({
      email,
      password,
      emailVerified: true, // Auto-verify for test users
    });
    
    console.log(`   ✅ Created Auth user: ${email} (UID: ${userRecord.uid})`);
    return userRecord;
  } catch (error) {
    console.error(`   ❌ Error creating Auth user ${email}:`, error.message);
    throw error;
  }
}

/**
 * Create or update user profile in Firestore
 */
async function createFirestoreProfile(uid, userData) {
  try {
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    
    const profileData = {
      email: userData.email,
      full_name: userData.full_name,
      role: userData.role,
      roles: [userData.role],
      department_id: userData.department_id,
      status: 'active',
      mustChangePassword: true, // Force password change on first login
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    if (userDoc.exists) {
      await userRef.update({
        ...profileData,
        created_at: userDoc.data().created_at, // Preserve original creation time
      });
      console.log(`   ℹ️  Updated Firestore profile: ${userData.email}`);
    } else {
      await userRef.set(profileData);
      console.log(`   ✅ Created Firestore profile: ${userData.email}`);
    }
    
    return profileData;
  } catch (error) {
    console.error(`   ❌ Error creating Firestore profile for ${userData.email}:`, error.message);
    throw error;
  }
}

/**
 * Create sample departments if they don't exist
 */
async function createSampleDepartments() {
  console.log('\n📋 Creating sample departments...');
  
  const departments = [
    { id: 'emergency', name: 'Emergency', description: 'Emergency Department' },
    { id: 'icu', name: 'ICU', description: 'Intensive Care Unit' },
    { id: 'cardiology', name: 'Cardiology', description: 'Heart and Cardiovascular Care' },
    { id: 'surgery', name: 'Surgery', description: 'Surgical Department' },
  ];
  
  for (const dept of departments) {
    const deptRef = db.collection('departments').doc(dept.id);
    const deptDoc = await deptRef.get();
    
    if (!deptDoc.exists) {
      await deptRef.set({
        name: dept.name,
        description: dept.description,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`   ✅ Created department: ${dept.name}`);
    } else {
      console.log(`   ℹ️  Department already exists: ${dept.name}`);
    }
  }
}

/**
 * Main seeding function
 */
async function seedTestData() {
  console.log('🌱 Starting Firebase Test Data Seeding...\n');
  console.log('📝 Default Password Policy: {username}@12345!');
  console.log('   Example: admin@12345!, dr_ahmed@12345!, nurse_sara@12345!\n');
  
  try {
    // Create departments first
    await createSampleDepartments();
    
    // Create users
    console.log('\n👥 Creating test users...\n');
    
    for (const user of TEST_USERS) {
      console.log(`Processing: ${user.full_name} (${user.email})`);
      
      const password = generateDefaultPassword(user.username);
      
      // Create Auth user
      const authUser = await createAuthUser(user.email, password);
      
      // Create Firestore profile
      await createFirestoreProfile(authUser.uid, user);
      
      console.log(`   🔑 Default password: ${password}`);
      console.log(`   👤 Role: ${user.role}`);
      console.log('');
    }
    
    console.log('✨ Seeding completed successfully!\n');
    console.log('📋 Test Users Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Role          | Email                           | Password');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    TEST_USERS.forEach((user) => {
      const rolePadded = user.role.padEnd(13);
      const emailPadded = user.email.padEnd(32);
      const password = generateDefaultPassword(user.username);
      console.log(`${rolePadded} | ${emailPadded} | ${password}`);
    });
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: All users must change their password on first login!');
    console.log('\n🔒 Next Steps:');
    console.log('   1. Test login with any of the above credentials');
    console.log('   2. User will be prompted to change password');
    console.log('   3. After password change, normal login will work');
    console.log('\n✅ Firebase Authentication and Firestore are now populated with test data.');
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Run the seeder
seedTestData();
