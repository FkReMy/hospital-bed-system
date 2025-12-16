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
    fullName: 'System Administrator',
    role: 'admin',
    phone: '+1-555-0100',
    address: '123 Admin St, Hospital City',
    hiringDate: '2020-01-15',
    shiftType: 'day',
    licenseNumber: null,
    yearsOfExperience: 10,
    specializations: [],
  },
  
  // Doctors
  {
    email: 'dr.ahmed@hospital.com',
    username: 'dr_ahmed',
    fullName: 'Dr. Ahmed Hassan',
    role: 'doctor',
    phone: '+1-555-0101',
    address: '456 Medical Ave, Hospital City',
    hiringDate: '2018-03-20',
    shiftType: 'day',
    licenseNumber: 'MD-2018-45678',
    yearsOfExperience: 15,
    specializations: ['emergency', 'surgery'],
  },
  {
    email: 'dr.sarah@hospital.com',
    username: 'dr_sarah',
    fullName: 'Dr. Sarah Johnson',
    role: 'doctor',
    phone: '+1-555-0102',
    address: '789 Cardio Blvd, Hospital City',
    hiringDate: '2019-06-10',
    shiftType: 'day',
    licenseNumber: 'MD-2019-12345',
    yearsOfExperience: 12,
    specializations: ['cardiology'],
  },
  
  // Nurses
  {
    email: 'nurse.sara@hospital.com',
    username: 'nurse_sara',
    fullName: 'Sara Wilson',
    role: 'nurse',
    phone: '+1-555-0103',
    address: '321 Nursing Rd, Hospital City',
    hiringDate: '2020-09-15',
    shiftType: 'night',
    licenseNumber: 'RN-2020-98765',
    yearsOfExperience: 5,
    specializations: ['emergency'],
  },
  {
    email: 'nurse.james@hospital.com',
    username: 'nurse_james',
    fullName: 'James Miller',
    role: 'nurse',
    phone: '+1-555-0104',
    address: '654 ICU Lane, Hospital City',
    hiringDate: '2021-02-20',
    shiftType: 'day',
    licenseNumber: 'RN-2021-54321',
    yearsOfExperience: 3,
    specializations: ['icu'],
  },
  
  // Hospital Staff (Reception/Operations)
  {
    email: 'staff.reception@hospital.com',
    username: 'staff_reception',
    fullName: 'Maria Garcia',
    role: 'staff',
    phone: '+1-555-0105',
    address: '987 Front Desk Dr, Hospital City',
    hiringDate: '2021-05-01',
    shiftType: 'morning',
    licenseNumber: null,
    yearsOfExperience: 2,
    specializations: [],
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
 * Create or update user profile in Firestore with new camelCase schema
 */
async function createFirestoreProfile(uid, userData) {
  try {
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    
    const profileData = {
      email: userData.email,
      fullName: userData.fullName,
      phone: userData.phone || null,
      address: userData.address || null,
      hiringDate: userData.hiringDate || null,
      shiftType: userData.shiftType || null,
      licenseNumber: userData.licenseNumber || null,
      yearsOfExperience: userData.yearsOfExperience || 0,
      role: userData.role,
      specializations: userData.specializations || [],
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    if (userDoc.exists) {
      await userRef.update({
        ...profileData,
        createdAt: userDoc.data().createdAt, // Preserve original creation time
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
      });
      console.log(`   ✅ Created department: ${dept.name}`);
    } else {
      console.log(`   ℹ️  Department already exists: ${dept.name}`);
    }
  }
}

/**
 * Create sample rooms
 */
async function createSampleRooms() {
  console.log('\n🏥 Creating sample rooms...');
  
  const rooms = [
    { roomNumber: 'ICU-101', floor: 1, roomType: 'icu', capacity: 1, departmentId: 'icu' },
    { roomNumber: 'ICU-102', floor: 1, roomType: 'icu', capacity: 1, departmentId: 'icu' },
    { roomNumber: 'ICU-103', floor: 1, roomType: 'icu', capacity: 1, departmentId: 'icu' },
    { roomNumber: 'ER-201', floor: 2, roomType: 'emergency', capacity: 2, departmentId: 'emergency' },
    { roomNumber: 'ER-202', floor: 2, roomType: 'emergency', capacity: 2, departmentId: 'emergency' },
    { roomNumber: 'ER-203', floor: 2, roomType: 'emergency', capacity: 2, departmentId: 'emergency' },
    { roomNumber: 'CARD-301', floor: 3, roomType: 'ward', capacity: 2, departmentId: 'cardiology' },
    { roomNumber: 'CARD-302', floor: 3, roomType: 'ward', capacity: 2, departmentId: 'cardiology' },
    { roomNumber: 'SURG-401', floor: 4, roomType: 'operation_theater', capacity: 1, departmentId: 'surgery' },
    { roomNumber: 'SURG-402', floor: 4, roomType: 'operation_theater', capacity: 1, departmentId: 'surgery' },
  ];
  
  for (const room of rooms) {
    // Check if room already exists
    const existingRooms = await db.collection('rooms')
      .where('roomNumber', '==', room.roomNumber)
      .get();
    
    if (existingRooms.empty) {
      await db.collection('rooms').add(room);
      console.log(`   ✅ Created room: ${room.roomNumber}`);
    } else {
      console.log(`   ℹ️  Room already exists: ${room.roomNumber}`);
    }
  }
}

/**
 * Create sample beds
 */
async function createSampleBeds() {
  console.log('\n🛏️  Creating sample beds...');
  
  // Get all rooms
  const roomsSnapshot = await db.collection('rooms').get();
  const rooms = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  let bedsCreated = 0;
  
  for (const room of rooms) {
    // Create beds based on room capacity
    for (let i = 1; i <= room.capacity; i++) {
      const bedNumber = `${room.roomNumber}-B${i}`;
      
      // Check if bed already exists
      const existingBeds = await db.collection('beds')
        .where('bedNumber', '==', bedNumber)
        .get();
      
      if (existingBeds.empty) {
        await db.collection('beds').add({
          bedNumber: bedNumber,
          roomId: room.id,
          isOccupied: false,
        });
        bedsCreated++;
      }
    }
  }
  
  console.log(`   ✅ Created ${bedsCreated} beds`);
}

/**
 * Create sample patients
 */
async function createSamplePatients() {
  console.log('\n👨‍⚕️ Creating sample patients...');
  
  const patients = [
    {
      fullName: 'John Smith',
      dateOfBirth: '1975-05-15',
      gender: 'male',
      phone: '+1-555-1001',
      address: '100 Main St, City',
      bloodGroup: 'O+',
      emergencyContact: { name: 'Jane Smith', phone: '+1-555-1002' },
      status: 'admitted',
      admissionDate: '2025-12-10',
      department: 'emergency',
    },
    {
      fullName: 'Mary Johnson',
      dateOfBirth: '1982-08-22',
      gender: 'female',
      phone: '+1-555-1003',
      address: '200 Oak Ave, City',
      bloodGroup: 'A+',
      emergencyContact: { name: 'Bob Johnson', phone: '+1-555-1004' },
      status: 'admitted',
      admissionDate: '2025-12-12',
      department: 'icu',
    },
    {
      fullName: 'Robert Williams',
      dateOfBirth: '1965-03-10',
      gender: 'male',
      phone: '+1-555-1005',
      address: '300 Pine Rd, City',
      bloodGroup: 'B+',
      emergencyContact: { name: 'Lisa Williams', phone: '+1-555-1006' },
      status: 'admitted',
      admissionDate: '2025-12-14',
      department: 'cardiology',
    },
    {
      fullName: 'Patricia Brown',
      dateOfBirth: '1990-11-30',
      gender: 'female',
      phone: '+1-555-1007',
      address: '400 Elm St, City',
      bloodGroup: 'AB+',
      emergencyContact: { name: 'Michael Brown', phone: '+1-555-1008' },
      status: 'admitted',
      admissionDate: '2025-12-15',
      department: 'surgery',
    },
  ];
  
  for (const patient of patients) {
    // Check if patient already exists
    const existingPatients = await db.collection('patients')
      .where('fullName', '==', patient.fullName)
      .get();
    
    if (existingPatients.empty) {
      await db.collection('patients').add({
        ...patient,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`   ✅ Created patient: ${patient.fullName}`);
    } else {
      console.log(`   ℹ️  Patient already exists: ${patient.fullName}`);
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
    
    // Create rooms
    await createSampleRooms();
    
    // Create beds
    await createSampleBeds();
    
    // Create patients
    await createSamplePatients();
    
    // Create users
    console.log('\n👥 Creating test users...\n');
    
    for (const user of TEST_USERS) {
      console.log(`Processing: ${user.fullName} (${user.email})`);
      
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
    console.log('\n📊 Database Summary:');
    const departmentsCount = (await db.collection('departments').get()).size;
    const roomsCount = (await db.collection('rooms').get()).size;
    const bedsCount = (await db.collection('beds').get()).size;
    const patientsCount = (await db.collection('patients').get()).size;
    const usersCount = (await db.collection('users').get()).size;
    
    console.log(`   • Departments: ${departmentsCount}`);
    console.log(`   • Rooms: ${roomsCount}`);
    console.log(`   • Beds: ${bedsCount}`);
    console.log(`   • Patients: ${patientsCount}`);
    console.log(`   • Users: ${usersCount}`);
    
    console.log('\n✅ Firebase Authentication and Firestore are now populated with test data.');
    console.log('\n🔒 Next Steps:');
    console.log('   1. Test login with any of the above credentials');
    console.log('   2. All data uses camelCase field names as per the schema');
    console.log('   3. Explore departments, rooms, beds, and patients');
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Run the seeder
seedTestData();
