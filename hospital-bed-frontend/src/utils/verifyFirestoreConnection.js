// src/utils/verifyFirestoreConnection.js
/**
 * Firestore Connection Verification Utility
 * 
 * This utility helps verify that the bed management system is properly
 * connected to Firebase Firestore and all operations work correctly.
 * 
 * Usage:
 * - Import and call verifyConnection() after Firebase is initialized
 * - Check browser console for test results
 * - All tests should pass if connection is working
 */

import { bedFirebase } from '../services/firebase/bedFirebase';
import { bedAssignmentFirebase } from '../services/firebase/bedAssignmentFirebase';
import { db } from '../services/firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

/**
 * Test suite for Firestore connection
 */
export const verifyConnection = async () => {
  console.log('🔍 Starting Firestore Connection Verification...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // Helper function to run a test
  const runTest = async (name, testFn) => {
    try {
      await testFn();
      results.passed++;
      results.tests.push({ name, status: 'PASSED', error: null });
      console.log(`✅ ${name}`);
      return true;
    } catch (error) {
      results.failed++;
      results.tests.push({ name, status: 'FAILED', error: error.message });
      console.error(`❌ ${name}`, error.message);
      return false;
    }
  };

  // Test 1: Firebase initialization
  await runTest('Firebase is initialized', async () => {
    if (!db) {
      throw new Error('Firestore database not initialized');
    }
  });

  // Test 2: Firestore connection
  await runTest('Can connect to Firestore', async () => {
    const testCollection = collection(db, 'beds');
    if (!testCollection) {
      throw new Error('Cannot access Firestore collections');
    }
  });

  // Test 3: Read beds collection
  await runTest('Can read beds collection', async () => {
    const beds = await bedFirebase.getAll();
    if (!Array.isArray(beds)) {
      throw new Error('Beds data is not an array');
    }
    console.log(`   └─ Found ${beds.length} bed(s)`);
  });

  // Test 4: Read departments collection
  await runTest('Can read departments collection', async () => {
    const departments = await bedFirebase.getDepartments();
    if (!Array.isArray(departments)) {
      throw new Error('Departments data is not an array');
    }
    console.log(`   └─ Found ${departments.length} department(s)`);
  });

  // Test 5: Read bed assignments collection
  await runTest('Can read bed assignments collection', async () => {
    const assignments = await bedAssignmentFirebase.getAll();
    if (!Array.isArray(assignments)) {
      throw new Error('Bed assignments data is not an array');
    }
    console.log(`   └─ Found ${assignments.length} assignment(s)`);
  });

  // Test 6: Check rooms collection exists
  await runTest('Can read rooms collection', async () => {
    const roomsSnapshot = await getDocs(collection(db, 'rooms'));
    console.log(`   └─ Found ${roomsSnapshot.size} room(s)`);
  });

  // Test 7: Check patients collection exists
  await runTest('Can read patients collection', async () => {
    const patientsSnapshot = await getDocs(collection(db, 'patients'));
    console.log(`   └─ Found ${patientsSnapshot.size} patient(s)`);
  });

  // Test 8: Real-time listener setup
  await runTest('Can setup real-time listener', async () => {
    let listenerCalled = false;
    const unsubscribe = bedFirebase.subscribeToBeds(() => {
      listenerCalled = true;
    });
    
    // Wait a moment for listener to initialize
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (typeof unsubscribe !== 'function') {
      throw new Error('Subscribe did not return unsubscribe function');
    }
    
    // Cleanup
    unsubscribe();
    
    if (!listenerCalled) {
      throw new Error('Listener was not called');
    }
  });

  // Test 9: Data structure validation for beds
  await runTest('Bed data has correct structure', async () => {
    const beds = await bedFirebase.getAll();
    if (beds.length > 0) {
      const bed = beds[0];
      const requiredFields = ['id', 'bed_number'];
      const missingFields = requiredFields.filter(field => !(field in bed));
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      console.log(`   └─ Validated structure for bed: ${bed.bed_number || bed.id}`);
    } else {
      console.log('   └─ Skipped (no beds to validate)');
    }
  });

  // Test 10: Check Firebase config
  await runTest('Firebase configuration is valid', async () => {
    const config = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    };
    
    const missingKeys = Object.entries(config)
      .filter(([_, value]) => !value || value === 'demo-api-key')
      .map(([key]) => key);
    
    if (missingKeys.length > 0) {
      throw new Error(`Missing or default config values: ${missingKeys.join(', ')}`);
    }
  });

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Test Results Summary`);
  console.log('='.repeat(50));
  console.log(`Total Tests: ${results.passed + results.failed}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log('='.repeat(50));

  if (results.failed === 0) {
    console.log('\n🎉 All tests passed! Firestore connection is working correctly.\n');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above for details.\n');
  }

  return results;
};

/**
 * Quick connection test (minimal)
 * Returns true if connection is working, false otherwise
 */
export const quickConnectionTest = async () => {
  try {
    await bedFirebase.getAll();
    return true;
  } catch (error) {
    console.error('Quick connection test failed:', error);
    return false;
  }
};

/**
 * Test bed operations (requires test data)
 * This is for advanced testing when you have test data
 */
export const testBedOperations = async (testBedId, testPatientId) => {
  console.log('🧪 Testing bed operations...\n');
  
  if (!testBedId || !testPatientId) {
    console.warn('⚠️  testBedId and testPatientId required for operation tests');
    return;
  }

  try {
    // Test assign
    console.log('Testing bed assignment...');
    const assignment = await bedFirebase.assign({
      bedId: testBedId,
      patientId: testPatientId,
      assignedBy: 'test-user',
      notes: 'Test assignment'
    });
    console.log('✅ Bed assigned successfully:', assignment.id);

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test discharge
    console.log('Testing bed discharge...');
    await bedFirebase.discharge(testBedId);
    console.log('✅ Patient discharged successfully');

    console.log('\n🎉 Bed operations test completed successfully!\n');
  } catch (error) {
    console.error('❌ Bed operations test failed:', error.message);
  }
};

export default {
  verifyConnection,
  quickConnectionTest,
  testBedOperations
};
