# Firestore Database Schema
## Hospital Bed Management System (HBMS)

**Version:** 2.0  
**Date:** December 17, 2025  
**Migration Status:** Complete - PostgreSQL to Firestore

---

## Overview

This document describes the complete Firestore database schema for the Hospital Bed Management System. The schema has been successfully migrated from PostgreSQL to Firebase Firestore with the following key adaptations:

- **Field Naming:** All fields use camelCase (e.g., `fullName`, `createdAt`)
- **Authentication:** Firebase Authentication handles user credentials (no password fields in Firestore)
- **Denormalization:** Many-to-many relationships have been simplified
- **References:** Document IDs are used instead of foreign keys

---

## Collections

### 1. users

**Collection Name:** `users`  
**Document ID:** Firebase Authentication UID (string)

Stores staff user profiles linked to Firebase Authentication accounts.

#### Schema

```json
{
  "email": "string",                        // Unique, from Firebase Auth
  "fullName": "string",                     // Full name of the user
  "phone": "string | null",                 // Phone number
  "address": "string | null",               // Physical address
  "hiringDate": "string (YYYY-MM-DD) | null", // Date hired
  "shiftType": "string | null",             // "morning" | "day" | "night"
  "licenseNumber": "string | null",         // Professional license number
  "yearsOfExperience": "number",            // Years of professional experience
  "role": "string",                         // "admin" | "doctor" | "nurse" | "staff"
  "specializations": "array<string>",       // e.g., ["cardiology", "neurology"]
  "isActive": "boolean",                    // Active status (default: true)
  "createdAt": "Timestamp",                 // Account creation timestamp
  "updatedAt": "Timestamp"                  // Last update timestamp
}
```

#### Example

```json
{
  "email": "dr.sarah@hospital.com",
  "fullName": "Dr. Sarah Johnson",
  "phone": "+1-555-0102",
  "address": "789 Cardio Blvd, Hospital City",
  "hiringDate": "2019-06-10",
  "shiftType": "day",
  "licenseNumber": "MD-2019-12345",
  "yearsOfExperience": 12,
  "role": "doctor",
  "specializations": ["cardiology"],
  "isActive": true,
  "createdAt": "Timestamp(2019-06-10T00:00:00Z)",
  "updatedAt": "Timestamp(2025-12-17T12:00:00Z)"
}
```

#### Indexes

- `email` - Unique (enforced by Firebase Auth)
- `role` - For filtering users by role
- `isActive` - For filtering active users

---

### 2. departments

**Collection Name:** `departments`  
**Document ID:** Auto-generated or custom string (e.g., "icu")

Stores hospital department information.

#### Schema

```json
{
  "name": "string",                         // Department name (unique)
  "description": "string | null"            // Department description
}
```

#### Example

```json
{
  "name": "ICU",
  "description": "Intensive Care Unit"
}
```

---

### 3. rooms

**Collection Name:** `rooms`  
**Document ID:** Auto-generated

Stores hospital room information.

#### Schema

```json
{
  "roomNumber": "string",                   // Unique room identifier (e.g., "ICU-101")
  "floor": "number | null",                 // Floor number
  "roomType": "string",                     // "ward" | "icu" | "operation_theater" | "consultation" | "emergency"
  "capacity": "number",                     // Number of beds (default: 1)
  "departmentId": "string"                  // Reference to departments document ID
}
```

#### Example

```json
{
  "roomNumber": "ICU-101",
  "floor": 1,
  "roomType": "icu",
  "capacity": 1,
  "departmentId": "icu"
}
```

#### Indexes

- `roomNumber` - Unique (enforced at application level)
- `departmentId` - For filtering rooms by department
- `roomType` - For filtering rooms by type

---

### 4. beds

**Collection Name:** `beds`  
**Document ID:** Auto-generated

Stores individual bed information.

#### Schema

```json
{
  "bedNumber": "string",                    // Unique bed identifier (e.g., "ICU-101-B1")
  "roomId": "string",                       // Reference to rooms document ID
  "isOccupied": "boolean"                   // Occupancy status (default: false)
}
```

#### Example

```json
{
  "bedNumber": "ICU-101-B1",
  "roomId": "abc123def456",
  "isOccupied": false
}
```

#### Indexes

- `bedNumber` - Unique (enforced at application level)
- `roomId` - For querying beds by room
- `isOccupied` - For filtering available beds

---

### 5. patients

**Collection Name:** `patients`  
**Document ID:** Auto-generated

Stores patient information and medical records.

#### Schema

```json
{
  "fullName": "string",                     // Patient full name
  "dateOfBirth": "string (YYYY-MM-DD)",     // Date of birth
  "gender": "string | null",                // "male" | "female" | other
  "phone": "string | null",                 // Contact phone number
  "address": "string | null",               // Physical address
  "bloodGroup": "string | null",            // Blood type (e.g., "O+", "AB-")
  "emergencyContact": {                     // Emergency contact information
    "name": "string | null",
    "phone": "string | null"
  },
  "status": "string | null",                // "admitted" | "discharged" | "transferred"
  "admissionDate": "string (YYYY-MM-DD) | null", // Date admitted
  "department": "string | null",            // Current department ID or name
  "createdAt": "Timestamp"                  // Record creation timestamp
}
```

#### Example

```json
{
  "fullName": "John Smith",
  "dateOfBirth": "1975-05-15",
  "gender": "male",
  "phone": "+1-555-1001",
  "address": "100 Main St, City",
  "bloodGroup": "O+",
  "emergencyContact": {
    "name": "Jane Smith",
    "phone": "+1-555-1002"
  },
  "status": "admitted",
  "admissionDate": "2025-12-10",
  "department": "emergency",
  "createdAt": "Timestamp(2025-12-10T08:00:00Z)"
}
```

#### Indexes

- `fullName` - For searching patients
- `status` - For filtering by admission status
- `department` - For filtering by department

---

### 6. bedAssignments

**Collection Name:** `bedAssignments`  
**Document ID:** Auto-generated

Stores bed assignment history and current assignments.

#### Schema

```json
{
  "patientId": "string",                    // Reference to patients document ID
  "bedId": "string",                        // Reference to beds document ID
  "assignedAt": "Timestamp",                // Assignment timestamp
  "dischargedAt": "Timestamp | null",       // Discharge timestamp (null = currently admitted)
  "assignedBy": "string",                   // UID of user who made the assignment
  "notes": "string | null"                  // Assignment notes
}
```

#### Example

```json
{
  "patientId": "patient123",
  "bedId": "bed456",
  "assignedAt": "Timestamp(2025-12-10T08:30:00Z)",
  "dischargedAt": null,
  "assignedBy": "user789",
  "notes": "Patient requires monitoring"
}
```

#### Indexes

- `patientId` - For querying assignments by patient
- `bedId` - For querying assignments by bed
- `dischargedAt` - For finding active assignments (null values)

---

### 7. appointments

**Collection Name:** `appointments`  
**Document ID:** Auto-generated

Stores patient appointment information.

#### Schema

```json
{
  "patientId": "string",                    // Reference to patients document ID
  "doctorId": "string",                     // UID reference to users (doctor)
  "appointmentDate": "Timestamp",           // Appointment date and time
  "status": "string",                       // "scheduled" | "completed" | "cancelled" | "no_show"
  "reason": "string | null",                // Reason for appointment
  "notes": "string | null",                 // Additional notes
  "createdBy": "string",                    // UID of user who created appointment
  "createdAt": "Timestamp"                  // Creation timestamp
}
```

#### Example

```json
{
  "patientId": "patient123",
  "doctorId": "doctor456",
  "appointmentDate": "Timestamp(2025-12-20T14:00:00Z)",
  "status": "scheduled",
  "reason": "Routine checkup",
  "notes": "Follow-up from previous visit",
  "createdBy": "staff789",
  "createdAt": "Timestamp(2025-12-15T10:00:00Z)"
}
```

#### Indexes

- `patientId` - For querying appointments by patient
- `doctorId` - For querying appointments by doctor
- `appointmentDate` - For sorting by date
- `status` - For filtering by status

---

### 8. prescriptions

**Collection Name:** `prescriptions`  
**Document ID:** Auto-generated

Stores patient prescription information.

#### Schema

```json
{
  "patientId": "string",                    // Reference to patients document ID
  "doctorId": "string",                     // UID reference to users (doctor)
  "appointmentId": "string | null",         // Reference to appointments document ID
  "prescribedAt": "Timestamp",              // Prescription timestamp
  "medicationName": "string",               // Name of medication
  "dosage": "string",                       // Dosage information
  "frequency": "string",                    // Frequency (e.g., "twice daily")
  "duration": "string | null",              // Duration (e.g., "7 days")
  "instructions": "string | null",          // Additional instructions
  "isDispensed": "boolean"                  // Dispensed status (default: false)
}
```

#### Example

```json
{
  "patientId": "patient123",
  "doctorId": "doctor456",
  "appointmentId": "appt789",
  "prescribedAt": "Timestamp(2025-12-15T16:00:00Z)",
  "medicationName": "Amoxicillin",
  "dosage": "500mg",
  "frequency": "Three times daily",
  "duration": "7 days",
  "instructions": "Take with food",
  "isDispensed": false
}
```

#### Indexes

- `patientId` - For querying prescriptions by patient
- `doctorId` - For querying prescriptions by doctor
- `isDispensed` - For filtering by dispensed status

---

## Key Schema Adaptations from SQL to Firestore

### 1. Field Naming Convention
- **SQL:** snake_case (e.g., `full_name`, `created_at`)
- **Firestore:** camelCase (e.g., `fullName`, `createdAt`)

### 2. Password Management
- **SQL:** `password_hash` field in users table
- **Firestore:** No password fields - handled exclusively by Firebase Authentication

### 3. Relationships
- **SQL:** Foreign keys with JOIN operations
- **Firestore:** Document ID references, data fetched with separate queries

### 4. Timestamps
- **SQL:** TIMESTAMP data type
- **Firestore:** Firestore Timestamp objects

### 5. Many-to-Many Relationships
- **SQL:** Junction tables (e.g., `user_roles`, `user_specializations`)
- **Firestore:** Simplified to single fields or arrays (e.g., `role` string, `specializations` array)

### 6. Bed Occupancy Status
- **SQL:** `status` enum field with values like "available", "occupied", "maintenance"
- **Firestore:** Simple `isOccupied` boolean

### 7. Assignment Tracking
- **SQL:** `status` field with "active"/"discharged"
- **Firestore:** `dischargedAt` timestamp (null = active)

---

## Security Rules

All collections are protected by Firestore security rules defined in `firestore.rules`:

- **Authentication Required:** All operations require authenticated users
- **Role-Based Access Control:** Access is controlled based on user roles
- **Read Access:** Generally allowed for authenticated users
- **Write Access:** Restricted based on role and operation type
- **Admin Privileges:** Full access to all collections

---

## Data Population

To populate the database with test data, run:

```bash
npm run seed
```

This will create:
- 6 staff users (admin, doctors, nurses, staff)
- 4 departments (Emergency, ICU, Cardiology, Surgery)
- 10 rooms across departments
- 15+ beds based on room capacity
- 4 sample patients

---

## Migration Notes

### Completed Migration Tasks

1. ✅ All field names converted to camelCase
2. ✅ Password fields removed from Firestore
3. ✅ Foreign keys replaced with document references
4. ✅ Many-to-many relationships simplified
5. ✅ Timestamp fields updated to Firestore Timestamps
6. ✅ All Firebase service files updated
7. ✅ Security rules configured
8. ✅ Data seeding script updated

### Breaking Changes

- **API Changes:** All API responses now use camelCase field names
- **Query Changes:** Filter and order fields use camelCase
- **Collection Names:** `bed_assignments` → `bedAssignments`

---

## Best Practices

1. **Always use camelCase** for field names in new documents
2. **Never store passwords** in Firestore - use Firebase Auth
3. **Use document references** (IDs) instead of embedding full documents
4. **Add indexes** for frequently queried fields
5. **Validate data** at application level before writing
6. **Use transactions** for operations affecting multiple documents
7. **Implement security rules** before production deployment

---

## Support

For issues or questions about the schema:
1. Refer to the schema documentation above
2. Check Firebase service implementations in `/hospital-bed-frontend/src/services/firebase/`
3. Review Firestore security rules in `/hospital-bed-frontend/firestore.rules`

---

**Schema Version:** 2.0  
**Last Updated:** December 17, 2025  
**Status:** ✅ Production Ready
