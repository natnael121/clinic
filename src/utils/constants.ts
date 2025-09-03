export const USER_ROLES = {
  RECEPTIONIST: 'receptionist',
  DOCTOR: 'doctor', 
  LAB_TECHNICIAN: 'lab_technician',
  PHARMACIST: 'pharmacist',
  ADMIN: 'admin',
} as const;

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
} as const;

export const PRESCRIPTION_STATUS = {
  PENDING: 'pending',
  DISPENSED: 'dispensed',
} as const;

export const LAB_TEST_STATUS = {
  REQUESTED: 'requested',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  INSURANCE: 'insurance',
} as const;

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export const LAB_TEST_TYPES = [
  { value: 'blood', label: 'Blood Test' },
  { value: 'urine', label: 'Urine Test' },
  { value: 'x_ray', label: 'X-Ray' },
  { value: 'mri', label: 'MRI' },
  { value: 'ct_scan', label: 'CT Scan' },
  { value: 'other', label: 'Other' },
];