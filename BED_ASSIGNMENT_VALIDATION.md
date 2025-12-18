# Bed Assignment Validation Implementation

## Overview

This document describes the bed assignment validation logic implemented to prevent illogical bed assignments based on department matching and patient status.

## Validation Rules

The system now enforces the following validation rules when assigning a bed to a patient:

### 1. Department Matching
- **Rule**: A patient can only be assigned to a bed in the same department
- **Implementation**: Shared validation in `bedAssignmentValidation.js` validates that `patient.department === bed.departmentId`
- **Error Message**: "Patient department does not match bed department"
- **UI Behavior**: The AssignBedDialog automatically filters the patient list to show only patients with a matching department
- **Note**: Patients without a department assignment are excluded from the eligible list to ensure proper department matching

### 2. Prevent Duplicate Assignments
- **Rule**: A patient cannot be assigned to more than one bed at the same time
- **Implementation**: Before assignment, the system queries for any active (non-discharged) assignments for the patient
- **Error Message**: "Patient is already assigned to another bed"
- **Database Query**: Checks `bedAssignments` collection for records with `patientId` and `dischargedAt === null`

### 3. Bed Availability
- **Rule**: Only available beds can be assigned to patients
- **Implementation**: Validates `bed.isOccupied === false` before assignment
- **Error Message**: "Bed is already occupied"

### 4. Entity Validation
- **Rule**: Both bed and patient must exist in the database
- **Error Messages**: 
  - "Bed not found"
  - "Patient not found"

## Modified Files

### 1. `/hospital-bed-frontend/src/services/firebase/bedAssignmentValidation.js` (NEW)

**Purpose**: Centralized validation logic to ensure consistency across services

**Key Function**:
```javascript
export const validateBedAssignment = async (bedId, patientId)
```

**Validation Steps**:
1. Validates required IDs
2. Checks bed exists and is available
3. Checks patient exists
4. Prevents duplicate assignments
5. Validates department matching

**Returns**: Validated bed and patient data objects
**Throws**: Error with descriptive message if validation fails

### 2. `/hospital-bed-frontend/src/services/firebase/bedAssignmentFirebase.js`

**Changes**:
- Added import for `validateBedAssignment` utility
- Simplified `create()` function to use shared validation
- Removed duplicate validation code (now uses shared utility)

**Code Structure**:
```javascript
export const create = async (data) => {
  // 1. Extract IDs
  // 2. Call shared validation
  // 3. Create assignment
}
```

### 3. `/hospital-bed-frontend/src/services/firebase/bedFirebase.js`

**Changes**:
- Added import for `validateBedAssignment` utility
- Simplified `assign()` function to use shared validation
- Removed duplicate validation code (now uses shared utility)

**Code Structure**:
```javascript
export const assign = async (payload) => {
  // 1. Extract and normalize IDs
  // 2. Call shared validation
  // 3. Create assignment record
  // 4. Update bed status to occupied
}
```

### 4. `/hospital-bed-frontend/src/components/beds/AssignBedDialog.jsx`

**Changes**:
- Enhanced patient filtering to only show patients with matching departments
- Patients without department assignment are excluded (not eligible for assignment)
- Added `selectedPatient` tracking to detect department mismatches
- Improved `departmentMismatch` logic with explicit comment explaining condition
- Enhanced patient dropdown to show department information
- Added user-friendly messages when no eligible patients are available

**UI Enhancements**:
- Patients are strictly filtered by department
- Department name is displayed in patient dropdown
- Warning message shown only when patient has a department but it doesn't match
- Clear feedback when no eligible patients exist

## Testing the Validation

### Manual Testing Steps

1. **Test Department Matching**:
   - Navigate to Bed Management page
   - Select a bed from the Emergency department
   - Try to assign a patient from ICU department
   - Expected: Patient should not appear in the filtered list
   - If patient appears due to missing department data, a warning should display

2. **Test Duplicate Assignment Prevention**:
   - Assign a patient to a bed (e.g., Patient A to Bed 101)
   - Try to assign the same patient to another bed (e.g., Patient A to Bed 102)
   - Expected: Error message "Patient is already assigned to another bed"

3. **Test Bed Availability**:
   - Try to assign a patient to an already occupied bed
   - Expected: Error message "Bed is already occupied"
   - UI should disable assignment button for occupied beds

4. **Test Missing Entity**:
   - Attempt to assign with invalid patient or bed ID (through API call)
   - Expected: Error messages "Patient not found" or "Bed not found"

### Automated Testing (Future)

Recommended test cases for future implementation:

```javascript
describe('Bed Assignment Validation', () => {
  test('should prevent assignment when departments do not match', async () => {
    // Create bed in Emergency department
    // Create patient in ICU department
    // Attempt assignment
    // Expect error
  });

  test('should prevent double assignment of same patient', async () => {
    // Assign patient to bed 1
    // Attempt to assign same patient to bed 2
    // Expect error
  });

  test('should prevent assignment to occupied bed', async () => {
    // Assign patient A to bed
    // Attempt to assign patient B to same bed
    // Expect error
  });

  test('should allow assignment when all validations pass', async () => {
    // Create matching department bed and patient
    // Assign patient to bed
    // Expect success
  });
});
```

## Data Model

### Patient Document Structure
```javascript
{
  id: "patient_id",
  fullName: "John Doe",
  department: "emergency", // Department ID
  status: "admitted",
  // ... other fields
}
```

### Bed Document Structure
```javascript
{
  id: "bed_id",
  bedNumber: "ER-201-B1",
  departmentId: "emergency", // Department ID
  roomId: "room_id",
  isOccupied: false,
  // ... other fields
}
```

### Bed Assignment Document Structure
```javascript
{
  id: "assignment_id",
  patientId: "patient_id",
  bedId: "bed_id",
  assignedBy: "user_id",
  assignedAt: Timestamp,
  dischargedAt: null, // null for active assignments
  notes: "Optional notes"
}
```

## Error Handling

All validation errors are thrown as Error objects with descriptive messages:

```javascript
try {
  await bedApi.assign({ bed_id: bedId, patient_id: patientId });
} catch (error) {
  // error.message will contain:
  // - "Patient department does not match bed department"
  // - "Patient is already assigned to another bed"
  // - "Bed is already occupied"
  // - "Bed not found"
  // - "Patient not found"
}
```

The UI layer (React Query mutations) catches these errors and displays them to users via toast notifications.

## Benefits

1. **Data Integrity**: Prevents illogical bed assignments in the database
2. **Better UX**: Users see only valid options in the UI
3. **Clear Feedback**: Descriptive error messages help users understand why an assignment failed
4. **Consistent Validation**: Same rules enforced in both API layers (bedApi and bedAssignmentApi)
5. **Department Compliance**: Ensures patients are assigned to appropriate department beds

## Future Enhancements

Potential improvements for consideration:

1. **Firestore Index Optimization**: Add a compound index on `(patientId, dischargedAt)` in the `bedAssignments` collection for optimal query performance with large datasets
2. **Flexible Department Matching**: Add a flag to allow cross-department assignments in emergency situations
3. **Assignment History**: Track all attempted assignments including failures for audit purposes
4. **Capacity Management**: Prevent assignments when department is at capacity
5. **Patient Status Validation**: Only allow assignments for patients with specific status (e.g., "admitted" but not "discharged")
6. **Role-Based Overrides**: Allow admins to override department matching in special cases
7. **Real-time Validation**: Show bed availability status in real-time using Firebase listeners

## Firestore Index Configuration

For optimal performance, add the following composite index in Firebase Console:

**Collection**: `bedAssignments`
**Fields**: 
- `patientId` (Ascending)
- `dischargedAt` (Ascending)

Alternatively, add to `firestore.indexes.json`:
```json
{
  "indexes": [
    {
      "collectionGroup": "bedAssignments",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "patientId", "order": "ASCENDING" },
        { "fieldPath": "dischargedAt", "order": "ASCENDING" }
      ]
    }
  ]
}
```

## Migration Notes

This is a non-breaking change:
- Existing assignments are not affected
- New validation only applies to future assignments
- No database schema changes required
- All existing API interfaces remain unchanged
