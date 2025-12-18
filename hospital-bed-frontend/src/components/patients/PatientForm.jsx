// src/components/patients/PatientForm.jsx
/**
 * PatientForm Component
 * 
 * Production-ready form for creating or editing patients.
 * Used in PatientListPage for patient registration.
 * 
 * Features:
 * - Full validation with clear error feedback
 * - Department selection
 * - Patient information fields (name, DOB, gender, contact, etc.)
 * - Emergency contact information
 * - Blood group selection
 * - Loading/submission states
 * - Accessible form controls
 * - Unified UI with global components (Input, Select, Button, Dialog, etc.)
 * 
 * Integrates with Firebase patientFirebase service for API calls
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Button from '@components/ui/button.jsx';
import Input from '@components/ui/input.jsx';
import Select from '@components/ui/select.jsx';
import Textarea from '@components/ui/textarea.jsx';
import Label from '@components/ui/label.jsx';
import DialogHeader from '@components/ui/dialog-header.jsx';
import DialogTitle from '@components/ui/dialog-title.jsx';
import DialogDescription from '@components/ui/dialog-description.jsx';
import { User, Phone, MapPin, Droplet } from 'lucide-react';
import './PatientForm.scss';

// Validation schema using Zod - strict and healthcare-appropriate
const patientSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other'], { required_error: 'Gender is required' }),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20),
  address: z.string().min(5, 'Address must be at least 5 characters').max(500),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  emergencyContactName: z.string().min(2, 'Emergency contact name is required').max(100),
  emergencyContactPhone: z.string().min(10, 'Emergency contact phone must be at least 10 digits').max(20),
  department: z.string().min(1, 'Department is required'),
  admissionDate: z.string().optional(),
  status: z.string().optional(),
});

const PatientForm = ({
  initialData = null, // null for create, object for edit
  onSuccess, // callback after successful submission
  onCancel,
  departments = [], // pre-fetched departments
  isLoading = false,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: initialData
      ? {
          fullName: initialData.fullName || initialData.full_name || '',
          dateOfBirth: initialData.dateOfBirth || initialData.date_of_birth || '',
          gender: initialData.gender || '',
          phone: initialData.phone || initialData.phone_number || '',
          address: initialData.address || '',
          bloodGroup: initialData.bloodGroup || initialData.blood_group || '',
          emergencyContactName: initialData.emergencyContact?.name || initialData.emergency_contact?.name || '',
          emergencyContactPhone: initialData.emergencyContact?.phone || initialData.emergency_contact?.phone || '',
          department: initialData.department || initialData.department_id || '',
          admissionDate: initialData.admissionDate || initialData.admission_date || new Date().toISOString().split('T')[0],
          status: initialData.status || 'admitted',
        }
      : {
          fullName: '',
          dateOfBirth: '',
          gender: '',
          phone: '',
          address: '',
          bloodGroup: '',
          emergencyContactName: '',
          emergencyContactPhone: '',
          department: '',
          admissionDate: new Date().toISOString().split('T')[0],
          status: 'admitted',
        },
  });

  const onSubmit = (data) => {
    // Transform data for backend
    const payload = {
      fullName: data.fullName.trim(),
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      phone: data.phone.trim(),
      address: data.address.trim(),
      bloodGroup: data.bloodGroup,
      emergencyContact: {
        name: data.emergencyContactName.trim(),
        phone: data.emergencyContactPhone.trim(),
      },
      department: data.department,
      admissionDate: data.admissionDate,
      status: data.status || 'admitted',
    };

    // Call onSuccess with transformed data
    onSuccess?.(payload);
  };

  return (
    <form className="patient-form space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <DialogHeader>
        <DialogTitle>
          {initialData ? 'Edit Patient' : 'Register New Patient'}
        </DialogTitle>
        <DialogDescription>
          {initialData
            ? 'Update patient information below.'
            : 'Fill in the details to register a new patient.'}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label required htmlFor="fullName">
            <User className="inline w-4 h-4 mr-2" />
            Full Name
          </Label>
          <Input
            id="fullName"
            {...register('fullName')}
            disabled={isLoading}
            placeholder="Enter patient's full name"
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        {/* Date of Birth & Gender */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label required htmlFor="dateOfBirth">
              Date of Birth
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              {...register('dateOfBirth')}
              disabled={isLoading}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label required htmlFor="gender">
              Gender
            </Label>
            <Select
              id="gender"
              {...register('gender')}
              disabled={isLoading}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
            {errors.gender && (
              <p className="text-sm text-destructive">{errors.gender.message}</p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label required htmlFor="phone">
            <Phone className="inline w-4 h-4 mr-2" />
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            disabled={isLoading}
            placeholder="Enter phone number"
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label required htmlFor="address">
            <MapPin className="inline w-4 h-4 mr-2" />
            Address
          </Label>
          <Textarea
            id="address"
            {...register('address')}
            disabled={isLoading}
            placeholder="Enter patient's address"
            rows={2}
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address.message}</p>
          )}
        </div>

        {/* Blood Group & Department */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label required htmlFor="bloodGroup">
              <Droplet className="inline w-4 h-4 mr-2" />
              Blood Group
            </Label>
            <Select
              id="bloodGroup"
              {...register('bloodGroup')}
              disabled={isLoading}
            >
              <option value="">Select blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </Select>
            {errors.bloodGroup && (
              <p className="text-sm text-destructive">{errors.bloodGroup.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label required htmlFor="department">
              Department
            </Label>
            <Select
              id="department"
              {...register('department')}
              disabled={isLoading}
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </Select>
            {errors.department && (
              <p className="text-sm text-destructive">{errors.department.message}</p>
            )}
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold mb-4">Emergency Contact</h3>
          
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label required htmlFor="emergencyContactName">
                Contact Name
              </Label>
              <Input
                id="emergencyContactName"
                {...register('emergencyContactName')}
                disabled={isLoading}
                placeholder="Enter emergency contact name"
              />
              {errors.emergencyContactName && (
                <p className="text-sm text-destructive">{errors.emergencyContactName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label required htmlFor="emergencyContactPhone">
                Contact Phone
              </Label>
              <Input
                id="emergencyContactPhone"
                type="tel"
                {...register('emergencyContactPhone')}
                disabled={isLoading}
                placeholder="Enter emergency contact phone"
              />
              {errors.emergencyContactPhone && (
                <p className="text-sm text-destructive">{errors.emergencyContactPhone.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button disabled={isSubmitting} type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button isLoading={isSubmitting} type="submit">
          {initialData ? 'Update Patient' : 'Register Patient'}
        </Button>
      </div>
    </form>
  );
};

export default PatientForm;
