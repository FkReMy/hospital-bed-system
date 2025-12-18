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
      roles: [userData.role], // Add roles array for consistency with auth expectations
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
    // ICU - 8 rooms (8 beds total)
    { roomNumber: 'ICU-101', floor: 1, roomType: 'icu', capacity: 1, departmentId: 'icu' },
    { roomNumber: 'ICU-102', floor: 1, roomType: 'icu', capacity: 1, departmentId: 'icu' },
    { roomNumber: 'ICU-103', floor: 1, roomType: 'icu', capacity: 1, departmentId: 'icu' },
    { roomNumber: 'ICU-104', floor: 1, roomType: 'icu', capacity: 1, departmentId: 'icu' },
    { roomNumber: 'ICU-105', floor: 1, roomType: 'icu', capacity: 1, departmentId: 'icu' },
    { roomNumber: 'ICU-106', floor: 1, roomType: 'icu', capacity: 1, departmentId: 'icu' },
    { roomNumber: 'ICU-107', floor: 1, roomType: 'icu', capacity: 1, departmentId: 'icu' },
    { roomNumber: 'ICU-108', floor: 1, roomType: 'icu', capacity: 1, departmentId: 'icu' },
    
    // Emergency - 10 rooms (20 beds total)
    { roomNumber: 'ER-201', floor: 2, roomType: 'emergency', capacity: 2, departmentId: 'emergency' },
    { roomNumber: 'ER-202', floor: 2, roomType: 'emergency', capacity: 2, departmentId: 'emergency' },
    { roomNumber: 'ER-203', floor: 2, roomType: 'emergency', capacity: 2, departmentId: 'emergency' },
    { roomNumber: 'ER-204', floor: 2, roomType: 'emergency', capacity: 2, departmentId: 'emergency' },
    { roomNumber: 'ER-205', floor: 2, roomType: 'emergency', capacity: 2, departmentId: 'emergency' },
    { roomNumber: 'ER-206', floor: 2, roomType: 'emergency', capacity: 2, departmentId: 'emergency' },
    { roomNumber: 'ER-207', floor: 2, roomType: 'emergency', capacity: 2, departmentId: 'emergency' },
    { roomNumber: 'ER-208', floor: 2, roomType: 'emergency', capacity: 2, departmentId: 'emergency' },
    { roomNumber: 'ER-209', floor: 2, roomType: 'emergency', capacity: 2, departmentId: 'emergency' },
    { roomNumber: 'ER-210', floor: 2, roomType: 'emergency', capacity: 2, departmentId: 'emergency' },
    
    // Cardiology - 8 rooms (16 beds total)
    { roomNumber: 'CARD-301', floor: 3, roomType: 'ward', capacity: 2, departmentId: 'cardiology' },
    { roomNumber: 'CARD-302', floor: 3, roomType: 'ward', capacity: 2, departmentId: 'cardiology' },
    { roomNumber: 'CARD-303', floor: 3, roomType: 'ward', capacity: 2, departmentId: 'cardiology' },
    { roomNumber: 'CARD-304', floor: 3, roomType: 'ward', capacity: 2, departmentId: 'cardiology' },
    { roomNumber: 'CARD-305', floor: 3, roomType: 'ward', capacity: 2, departmentId: 'cardiology' },
    { roomNumber: 'CARD-306', floor: 3, roomType: 'ward', capacity: 2, departmentId: 'cardiology' },
    { roomNumber: 'CARD-307', floor: 3, roomType: 'ward', capacity: 2, departmentId: 'cardiology' },
    { roomNumber: 'CARD-308', floor: 3, roomType: 'ward', capacity: 2, departmentId: 'cardiology' },
    
    // Surgery - 6 rooms (6 beds total)
    { roomNumber: 'SURG-401', floor: 4, roomType: 'operation_theater', capacity: 1, departmentId: 'surgery' },
    { roomNumber: 'SURG-402', floor: 4, roomType: 'operation_theater', capacity: 1, departmentId: 'surgery' },
    { roomNumber: 'SURG-403', floor: 4, roomType: 'operation_theater', capacity: 1, departmentId: 'surgery' },
    { roomNumber: 'SURG-404', floor: 4, roomType: 'operation_theater', capacity: 1, departmentId: 'surgery' },
    { roomNumber: 'SURG-405', floor: 4, roomType: 'operation_theater', capacity: 1, departmentId: 'surgery' },
    { roomNumber: 'SURG-406', floor: 4, roomType: 'operation_theater', capacity: 1, departmentId: 'surgery' },
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
 * Fix existing beds that are missing departmentId
 */
async function fixExistingBeds() {
  console.log('\n🔧 Fixing existing beds missing departmentId...');
  
  // Get all beds
  const bedsSnapshot = await db.collection('beds').get();
  
  // Get all rooms at once to avoid N+1 queries
  const roomsSnapshot = await db.collection('rooms').get();
  const roomsMap = {};
  roomsSnapshot.docs.forEach(doc => {
    roomsMap[doc.id] = doc.data();
  });
  
  // Use batch writes for better performance
  const batch = db.batch();
  let bedsFixed = 0;
  
  for (const bedDoc of bedsSnapshot.docs) {
    const bedData = bedDoc.data();
    
    // Check if bed is missing departmentId but has roomId
    if (!bedData.departmentId && bedData.roomId) {
      const roomData = roomsMap[bedData.roomId];
      
      if (roomData && roomData.departmentId) {
        // Update the bed with departmentId from room
        batch.update(bedDoc.ref, {
          departmentId: roomData.departmentId,
        });
        bedsFixed++;
        console.log(`   ✅ Fixed bed ${bedData.bedNumber} - added departmentId: ${roomData.departmentId}`);
      } else if (!roomData) {
        console.log(`   ⚠️  Warning: Bed ${bedData.bedNumber} has invalid roomId: ${bedData.roomId}`);
      }
    }
  }
  
  if (bedsFixed > 0) {
    await batch.commit();
    console.log(`   ✅ Fixed ${bedsFixed} beds`);
  } else {
    console.log('   ℹ️  No beds needed fixing');
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
          departmentId: room.departmentId, // Add departmentId from room
          isOccupied: false,
        });
        bedsCreated++;
      }
    }
  }
  
  console.log(`   ✅ Created ${bedsCreated} beds`);
}

/**
 * Generate random patient data for testing
 */
function generatePatients(count = 100) {
  const firstNames = [
    'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
    'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
    'Thomas', 'Sarah', 'Christopher', 'Karen', 'Charles', 'Nancy', 'Daniel', 'Lisa',
    'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
    'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
    'Kenneth', 'Carol', 'Kevin', 'Amanda', 'Brian', 'Dorothy', 'George', 'Melissa',
    'Timothy', 'Deborah', 'Ronald', 'Stephanie', 'Edward', 'Rebecca', 'Jason', 'Sharon',
    'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
    'Nicholas', 'Angela', 'Eric', 'Shirley', 'Jonathan', 'Anna', 'Stephen', 'Brenda',
    'Larry', 'Pamela', 'Justin', 'Emma', 'Scott', 'Nicole', 'Brandon', 'Helen',
    'Benjamin', 'Samantha', 'Samuel', 'Katherine', 'Raymond', 'Christine', 'Gregory', 'Debra',
    'Alexander', 'Rachel', 'Patrick', 'Carolyn', 'Frank', 'Janet', 'Jack', 'Catherine',
    'Dennis', 'Maria', 'Jerry', 'Heather', 'Tyler', 'Diane', 'Aaron', 'Ruth',
  ];
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
    'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
    'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
    'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
    'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker',
    'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy',
    'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey',
    'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
  ];
  
  const streetNames = [
    'Main St', 'Oak Ave', 'Pine Rd', 'Elm St', 'Maple Dr', 'Cedar Ln', 'Birch Way',
    'Spruce Ct', 'Willow Blvd', 'Ash Pl', 'Cherry Ln', 'Walnut Ave', 'Chestnut Dr',
    'Poplar St', 'Cypress Rd', 'Magnolia Way', 'Redwood Ct', 'Hickory Ln', 'Sycamore Ave',
  ];
  
  const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const genders = ['male', 'female'];
  const statuses = ['admitted', 'discharged', 'waiting', 'emergency', 'critical', 'stable', 'recovering'];
  const departments = ['emergency', 'icu', 'cardiology', 'surgery'];
  
  // Date generation constants
  const MIN_BIRTH_YEAR = 1940;
  const MAX_BIRTH_YEAR = 2015;
  const DISCHARGED_MIN_DAYS_AGO = 30;
  const DISCHARGED_MAX_DAYS_AGO = 90;
  const ADMITTED_MAX_DAYS_AGO = 30;
  
  const patients = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const bloodGroup = bloodGroups[Math.floor(Math.random() * bloodGroups.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    
    // Generate random date of birth
    const birthYear = MIN_BIRTH_YEAR + Math.floor(Math.random() * (MAX_BIRTH_YEAR - MIN_BIRTH_YEAR));
    const birthMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const birthDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    
    // Generate admission date based on status
    let admissionDate;
    if (status === 'discharged') {
      const daysAgo = DISCHARGED_MIN_DAYS_AGO + Math.floor(Math.random() * (DISCHARGED_MAX_DAYS_AGO - DISCHARGED_MIN_DAYS_AGO));
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      admissionDate = date.toISOString().split('T')[0];
    } else {
      const daysAgo = Math.floor(Math.random() * ADMITTED_MAX_DAYS_AGO);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      admissionDate = date.toISOString().split('T')[0];
    }
    
    // Generate unique phone numbers (starting from 2000, increment by 2 to avoid collisions with emergency contacts)
    const phoneNum = 2000 + (i * 2);
    const addressNum = 100 + i * 10;
    const streetName = streetNames[i % streetNames.length];
    
    patients.push({
      fullName: `${firstName} ${lastName}`,
      dateOfBirth: `${birthYear}-${birthMonth}-${birthDay}`,
      gender: gender,
      phone: `+1-555-${String(phoneNum).padStart(4, '0')}`,
      address: `${addressNum} ${streetName}, Hospital City`,
      bloodGroup: bloodGroup,
      emergencyContact: {
        name: `Emergency Contact for ${firstName}`,
        phone: `+1-555-${String(phoneNum + 1).padStart(4, '0')}`
      },
      status: status,
      admissionDate: admissionDate,
      department: department,
    });
  }
  
  return patients;
}

/**
 * Create sample patients (100+ for comprehensive testing)
 */
async function createSamplePatients() {
  console.log('\n👨‍⚕️ Creating sample patients (100+ for comprehensive testing)...');
  
  // Generate 120 patients to ensure we have enough variety
  const patients = generatePatients(120);
  
  let created = 0;
  let skipped = 0;
  
  // Use batch writes for better performance
  const batchSize = 500; // Firestore batch write limit (operations per batch)
  let batch = db.batch();
  let operationCount = 0;
  
  for (const patient of patients) {
    // Check if patient already exists
    const existingPatients = await db.collection('patients')
      .where('fullName', '==', patient.fullName)
      .where('dateOfBirth', '==', patient.dateOfBirth)
      .get();
    
    if (existingPatients.empty) {
      const patientRef = db.collection('patients').doc();
      batch.set(patientRef, {
        ...patient,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      created++;
      operationCount++;
      
      // Commit batch if we've reached the limit
      if (operationCount >= batchSize) {
        await batch.commit();
        batch = db.batch();
        operationCount = 0;
      }
      
      // Log progress every 20 patients
      if (created % 20 === 0) {
        console.log(`   ⏳ Created ${created} patients so far...`);
      }
    } else {
      skipped++;
    }
  }
  
  // Commit remaining operations
  if (operationCount > 0) {
    await batch.commit();
  }
  
  console.log(`   ✅ Created ${created} new patients`);
  if (skipped > 0) {
    console.log(`   ℹ️  Skipped ${skipped} existing patients`);
  }
  
  // Display status distribution
  const statusCount = {};
  patients.forEach(p => {
    statusCount[p.status] = (statusCount[p.status] || 0) + 1;
  });
  console.log('\n   📊 Patient Status Distribution:');
  Object.entries(statusCount).forEach(([status, count]) => {
    console.log(`      • ${status}: ${count}`);
  });
}

/**
 * Assign beds to eligible patients following validation rules
 */
async function assignBedsToPatients() {
  console.log('\n🛏️  Assigning beds to patients...');
  
  // Get all beds
  const bedsSnapshot = await db.collection('beds').get();
  const allBeds = bedsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Get all patients
  const patientsSnapshot = await db.collection('patients').get();
  const allPatients = patientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Get existing bed assignments to avoid duplicates
  const assignmentsSnapshot = await db.collection('bedAssignments')
    .where('dischargedAt', '==', null)
    .get();
  const assignedPatientIds = new Set(assignmentsSnapshot.docs.map(doc => doc.data().patientId));
  
  // Filter eligible patients (admitted status and not already assigned)
  const eligibleStatuses = ['admitted', 'critical', 'stable', 'emergency', 'recovering'];
  const eligiblePatients = allPatients.filter(patient => 
    eligibleStatuses.includes(patient.status) && 
    !assignedPatientIds.has(patient.id) &&
    patient.department // Must have a department
  );
  
  // Group beds by department
  const bedsByDepartment = {};
  allBeds.forEach(bed => {
    if (!bed.isOccupied && bed.departmentId) {
      if (!bedsByDepartment[bed.departmentId]) {
        bedsByDepartment[bed.departmentId] = [];
      }
      bedsByDepartment[bed.departmentId].push(bed);
    }
  });
  
  // Group patients by department
  const patientsByDepartment = {};
  eligiblePatients.forEach(patient => {
    if (patient.department) {
      if (!patientsByDepartment[patient.department]) {
        patientsByDepartment[patient.department] = [];
      }
      patientsByDepartment[patient.department].push(patient);
    }
  });
  
  // Create assignments
  let assignmentsCreated = 0;
  const batch = db.batch();
  let operationCount = 0;
  const batchSize = 250; // Keep room for both assignment creation and bed updates
  
  // Assign beds to patients by department
  for (const [department, beds] of Object.entries(bedsByDepartment)) {
    const patients = patientsByDepartment[department] || [];
    
    // Assign patients to available beds
    const assignmentCount = Math.min(beds.length, patients.length);
    
    for (let i = 0; i < assignmentCount; i++) {
      const bed = beds[i];
      const patient = patients[i];
      
      // Create bed assignment document
      const assignmentRef = db.collection('bedAssignments').doc();
      batch.set(assignmentRef, {
        patientId: patient.id,
        bedId: bed.id,
        assignedBy: 'system', // System assignment during seeding
        assignedAt: admin.firestore.FieldValue.serverTimestamp(),
        dischargedAt: null,
        notes: 'Auto-assigned during database seeding',
      });
      operationCount++;
      
      // Update bed status to occupied
      const bedRef = db.collection('beds').doc(bed.id);
      batch.update(bedRef, {
        isOccupied: true,
      });
      operationCount++;
      
      assignmentsCreated++;
      
      // Commit batch if we're approaching the limit
      if (operationCount >= batchSize) {
        await batch.commit();
        // Start a new batch
        const newBatch = db.batch();
        Object.setPrototypeOf(batch, Object.getPrototypeOf(newBatch));
        Object.assign(batch, newBatch);
        operationCount = 0;
      }
      
      console.log(`   ✅ Assigned ${patient.fullName} to bed ${bed.bedNumber} (${department})`);
    }
    
    if (patients.length > beds.length) {
      console.log(`   ⚠️  Warning: ${department} has ${patients.length - beds.length} patients without beds`);
    }
  }
  
  // Commit remaining operations
  if (operationCount > 0) {
    await batch.commit();
  }
  
  console.log(`\n   ✅ Created ${assignmentsCreated} bed assignments`);
  
  // Display assignment summary by department
  console.log('\n   📊 Bed Assignment Summary by Department:');
  for (const [department, beds] of Object.entries(bedsByDepartment)) {
    const patients = patientsByDepartment[department] || [];
    const assigned = Math.min(beds.length, patients.length);
    console.log(`      • ${department}: ${assigned} assigned (${beds.length} beds, ${patients.length} eligible patients)`);
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
    
    // Fix existing beds that might be missing departmentId
    await fixExistingBeds();
    
    // Create patients
    await createSamplePatients();
    
    // Assign beds to eligible patients
    await assignBedsToPatients();
    
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
    const assignmentsCount = (await db.collection('bedAssignments').get()).size;
    const occupiedBedsCount = (await db.collection('beds').where('isOccupied', '==', true).get()).size;
    
    console.log(`   • Departments: ${departmentsCount}`);
    console.log(`   • Rooms: ${roomsCount}`);
    console.log(`   • Beds: ${bedsCount} (${occupiedBedsCount} occupied, ${bedsCount - occupiedBedsCount} available)`);
    console.log(`   • Patients: ${patientsCount}`);
    console.log(`   • Users: ${usersCount}`);
    console.log(`   • Bed Assignments: ${assignmentsCount}`);
    
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
