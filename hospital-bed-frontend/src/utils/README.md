# Firestore Connection Verification Utility

## Purpose

This utility provides automated tests to verify that the bed management system is properly connected to Firebase Firestore and all operations work correctly.

## Usage

### In Browser Console (Development)

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the application in your browser

3. Open browser console (F12)

4. Run the verification:
   ```javascript
   import { verifyConnection } from './src/utils/verifyFirestoreConnection.js';
   verifyConnection();
   ```

### Programmatic Usage

```javascript
import { verifyConnection, quickConnectionTest, testBedOperations } from '@utils/verifyFirestoreConnection';

// Full verification suite
const results = await verifyConnection();
console.log(results);

// Quick test (just checks if we can read beds)
const isConnected = await quickConnectionTest();
console.log('Connected:', isConnected);

// Test bed operations (requires test data)
await testBedOperations('bed-id-123', 'patient-id-456');
```

### Integration with App

You can add the verification to your app's initialization:

```javascript
// In main.jsx or App.jsx
import { verifyConnection } from './utils/verifyFirestoreConnection';

// Only run in development
if (import.meta.env.DEV) {
  verifyConnection().then(results => {
    if (results.failed === 0) {
      console.log('✅ Firestore connection verified');
    } else {
      console.warn('⚠️  Firestore connection issues detected');
    }
  });
}
```

## Test Coverage

The verification utility runs the following tests:

1. ✅ **Firebase is initialized** - Checks that Firestore db instance exists
2. ✅ **Can connect to Firestore** - Verifies can access Firestore collections
3. ✅ **Can read beds collection** - Fetches all beds from Firestore
4. ✅ **Can read departments collection** - Fetches all departments
5. ✅ **Can read bed assignments collection** - Fetches assignment history
6. ✅ **Can read rooms collection** - Checks rooms collection exists
7. ✅ **Can read patients collection** - Checks patients collection exists
8. ✅ **Can setup real-time listener** - Tests Firestore onSnapshot listener
9. ✅ **Bed data has correct structure** - Validates data format
10. ✅ **Firebase configuration is valid** - Checks .env variables

## Expected Output

### Successful Test Run

```
🔍 Starting Firestore Connection Verification...

✅ Firebase is initialized
✅ Can connect to Firestore
✅ Can read beds collection
   └─ Found 25 bed(s)
✅ Can read departments collection
   └─ Found 4 department(s)
✅ Can read bed assignments collection
   └─ Found 12 assignment(s)
✅ Can read rooms collection
   └─ Found 10 room(s)
✅ Can read patients collection
   └─ Found 8 patient(s)
✅ Can setup real-time listener
✅ Bed data has correct structure
   └─ Validated structure for bed: 101-A
✅ Firebase configuration is valid

==================================================
📊 Test Results Summary
==================================================
Total Tests: 10
✅ Passed: 10
❌ Failed: 0
==================================================

🎉 All tests passed! Firestore connection is working correctly.
```

### Failed Test Example

```
🔍 Starting Firestore Connection Verification...

✅ Firebase is initialized
✅ Can connect to Firestore
❌ Can read beds collection Missing permission
✅ Can read departments collection
   └─ Found 4 department(s)
...

==================================================
📊 Test Results Summary
==================================================
Total Tests: 10
✅ Passed: 9
❌ Failed: 1
==================================================

⚠️  Some tests failed. Check the errors above for details.
```

## Troubleshooting

### "Firebase not initialized"
- Check that `.env` file exists with correct Firebase config
- Restart dev server after creating/updating `.env`

### "Permission denied" errors
- Ensure Firestore is in test mode OR
- Check Firestore security rules allow authenticated access
- Verify user is logged in

### "Cannot read beds collection"
- Check that `beds` collection exists in Firestore Console
- Verify Firestore database is created
- Check security rules

### "Missing or default config values"
- Copy `.env.example` to `.env`
- Fill in actual Firebase project values
- Don't use demo/placeholder values

## Integration with CI/CD

You can use this utility in automated tests:

```javascript
// test-firestore.spec.js
import { verifyConnection } from './src/utils/verifyFirestoreConnection';

describe('Firestore Connection', () => {
  it('should connect successfully', async () => {
    const results = await verifyConnection();
    expect(results.failed).toBe(0);
  });
});
```

## Related Documentation

- See `BED_MANAGEMENT_FIRESTORE_CONNECTION.md` for architecture details
- See `FIREBASE_SETUP.md` for Firebase setup instructions
- See `hospital-bed-frontend/src/services/firebase/README.md` for Firebase services documentation

## Notes

- All tests are read-only (no data modifications)
- Tests run asynchronously
- Real-time listener test includes a 500ms delay for initialization
- Configuration validation excludes sensitive data from logs
- Test results include detailed error messages for debugging

## Support

If tests fail consistently:
1. Review error messages in console
2. Check Firebase Console for collection structure
3. Verify Firestore security rules
4. Check network connectivity to Firebase
5. Ensure Firebase project is properly configured

---

**Last Updated**: December 17, 2024
