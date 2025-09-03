import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Patient } from '../types';
import { isAfter, startOfDay } from 'date-fns';

export function usePatients(doctorId?: string, userRole?: string) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, [doctorId, userRole]);

  const fetchPatients = async () => {
    try {
      let q = query(collection(db, 'patients'), orderBy('created_at', 'desc'));
      
      // If doctor is viewing, only show their assigned patients
      if (doctorId && userRole === 'doctor') {
        q = query(
          collection(db, 'patients'), 
          where('assigned_doctor_id', '==', doctorId),
          orderBy('created_at', 'desc')
        );
      }
      
      const querySnapshot = await getDocs(q);
      
      let patientsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Patient[];
      
      // Filter out inactive cards for non-receptionists
      if (userRole !== 'receptionist' && userRole !== 'admin') {
        patientsData = patientsData.filter(patient => {
          // Check if card is expired
          const isExpired = isAfter(new Date(), new Date(patient.card_expiry_date));
          if (isExpired) return false;
          
          // Check daily activation requirement
          if (patient.daily_activation_required) {
            const today = startOfDay(new Date());
            const lastActivation = patient.last_daily_activation 
              ? startOfDay(new Date(patient.last_daily_activation))
              : null;
            
            if (!lastActivation || lastActivation < today) {
              return false; // Card needs daily activation
            }
          }
          
          return patient.card_status === 'active';
        });
      }
      
      setPatients(patientsData);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPatient = async (patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const docRef = await addDoc(collection(db, 'patients'), {
        ...patientData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      
      await fetchPatients(); // Refresh the list
      return { id: docRef.id, error: null };
    } catch (error) {
      return { id: null, error };
    }
  };

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    try {
      await updateDoc(doc(db, 'patients', id), {
        ...updates,
        updated_at: serverTimestamp(),
      });
      
      await fetchPatients(); // Refresh the list
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return {
    patients,
    loading,
    addPatient,
    updatePatient,
    refetch: fetchPatients,
  };
}