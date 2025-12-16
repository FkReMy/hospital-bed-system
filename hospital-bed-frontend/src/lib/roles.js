// src/lib/roles.js
/**
 * roles.js
 * 
 * Central definition of all user roles in the HBMS application.
 * Single source of truth for role strings, permissions, and display info.
 * 
 * Features:
 * - Exact match with backend .NET role names
 * - Display labels and icons
 * - Permission matrix (feature access)
 * - Role hierarchy (for future use)
 * - Unified across frontend (useAuth, useRoleAccess, RoleSwitcher, Sidebar)
 * 
 * All role checks should import from here
 */

import { 
  Shield,      // admin
  Stethoscope, // doctor
  UserPlus,    // nurse
  User,        // reception
} from 'lucide-react';

/**
 * Role definitions - must match backend exactly
 */
export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  RECEPTION: 'reception',
};

// Role metadata for UI
export const ROLE_INFO = {
  [ROLES.ADMIN]: {
    label: 'Administrator',
    icon: Shield,
    color: 'destructive', // red badge for power
    description: 'Full system access',
  },
  [ROLES.DOCTOR]: {
    label: 'Doctor',
    icon: Stethoscope,
    color: 'default',
    description: 'Patient care and appointments',
  },
  [ROLES.NURSE]: {
    label: 'Nurse',
    icon: UserPlus,
    color: 'success',
    description: 'Bed management and patient monitoring',
  },
  [ROLES.RECEPTION]: {
    label: 'Reception',
    icon: User,
    color: 'secondary',
    description: 'Patient registration and scheduling',
  },
};

// Feature permissions matrix
// true = allowed, false = denied
export const ROLE_PERMISSIONS = {
  // Bed Management
  viewBeds: {
    [ROLES.ADMIN]: true,
    [ROLES.DOCTOR]: false,
    [ROLES.NURSE]: true,
    [ROLES.RECEPTION]: true,
  },
  assignBed: {
    [ROLES.ADMIN]: true,
    [ROLES.DOCTOR]: false,
    [ROLES.NURSE]: true,
    [ROLES.RECEPTION]: true,
  },
  dischargeBed: {
    [ROLES.ADMIN]: true,
    [ROLES.DOCTOR]: true,
    [ROLES.NURSE]: true,
    [ROLES.RECEPTION]: false,
  },

  // Patient Management
  viewPatients: {
    [ROLES.ADMIN]: true,
    [ROLES.DOCTOR]: true,
    [ROLES.NURSE]: true,
    [ROLES.RECEPTION]: true,
  },
  editPatient: {
    [ROLES.ADMIN]: true,
    [ROLES.DOCTOR]: true,
    [ROLES.NURSE]: false,
    [ROLES.RECEPTION]: true,
  },

  // Appointments
  viewAppointments: {
    [ROLES.ADMIN]: true,
    [ROLES.DOCTOR]: true,
    [ROLES.NURSE]: true,
    [ROLES.RECEPTION]: true,
  },
  scheduleAppointment: {
    [ROLES.ADMIN]: true,
    [ROLES.DOCTOR]: true,
    [ROLES.NURSE]: false,
    [ROLES.RECEPTION]: true,
  },

  // Reports & Analytics
  viewReports: {
    [ROLES.ADMIN]: true,
    [ROLES.DOCTOR]: false,
    [ROLES.NURSE]: false,
    [ROLES.RECEPTION]: false,
  },

  // System Settings
  manageUsers: {
    [ROLES.ADMIN]: true,
    [ROLES.DOCTOR]: false,
    [ROLES.NURSE]: false,
    [ROLES.RECEPTION]: false,
  },
};

// Helper: get role info
export const getRoleInfo = (role) => ROLE_INFO[role] || {
  label: role,
  icon: User,
  color: 'secondary',
};

// Helper: check permission
export const hasPermission = (role, permission) => ROLE_PERMISSIONS[permission]?.[role] || false;

// All roles array
export const ALL_ROLES = Object.values(ROLES);

// Export default for convenience
export default {
  ROLES,
  ROLE_INFO,
  ROLE_PERMISSIONS,
  getRoleInfo,
  hasPermission,
  ALL_ROLES,
};