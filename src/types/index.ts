export interface User {
  id: string;
  email: string;
  role: 'receptionist' | 'doctor' | 'lab_technician' | 'pharmacist' | 'admin' | 'triage_officer';
  first_name: string;
  last_name: string;
  phone?: string;
  clinic_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  admin_id: string;
  license_number?: string;
  created_at: string;
  updated_at: string;
}

export interface TriageAssessment {
  id: string;
  patient_id: string;
  triage_officer_id: string;
  appointment_id?: string;
  priority_level: 'emergency' | 'urgent' | 'semi_urgent' | 'standard' | 'non_urgent';
  chief_complaint: string;
  vital_signs: {
    temperature?: number;
    blood_pressure_systolic?: number;
    blood_pressure_diastolic?: number;
    heart_rate?: number;
    respiratory_rate?: number;
    oxygen_saturation?: number;
    pain_scale?: number;
  };
  symptoms: string[];
  assessment_notes: string;
  recommended_action: string;
  estimated_wait_time?: number;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  triage_officer?: User;
}

export interface Patient {
  id: string;
  patient_id: string; // Unique clinic ID
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  medical_history?: string;
  allergies?: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  reason?: string;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  doctor?: User;
}

export interface Prescription {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id?: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  status: 'pending' | 'dispensed';
  created_at: string;
  updated_at: string;
  patient?: Patient;
  doctor?: User;
}

export interface LabTest {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id?: string;
  test_name: string;
  test_type: 'blood' | 'urine' | 'x_ray' | 'mri' | 'ct_scan' | 'other';
  status: 'requested' | 'in_progress' | 'completed';
  results?: string;
  results_file_url?: string;
  notes?: string;
  requested_at: string;
  completed_at?: string;
  technician_id?: string;
  patient?: Patient;
  doctor?: User;
  technician?: User;
}

export interface Visit {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id?: string;
  visit_date: string;
  diagnosis: string;
  symptoms?: string;
  treatment_plan?: string;
  notes?: string;
  vital_signs?: {
    temperature?: number;
    blood_pressure?: string;
    heart_rate?: number;
    weight?: number;
    height?: number;
  };
  created_at: string;
  updated_at: string;
  patient?: Patient;
  doctor?: User;
}

export interface Medication {
  id: string;
  name: string;
  generic_name?: string;
  brand_name?: string;
  strength: string;
  form: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'cream' | 'other';
  stock_quantity: number;
  expiry_date: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  patient_id: string;
  appointment_id?: string;
  total_amount: number;
  paid_amount: number;
  payment_method?: 'cash' | 'card' | 'insurance';
  status: 'pending' | 'paid' | 'partial' | 'overdue';
  line_items: {
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }[];
  created_at: string;
  updated_at: string;
  patient?: Patient;
}