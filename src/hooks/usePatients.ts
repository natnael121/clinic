import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Patient } from '../types';

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const q = query(collection(db, 'patients'), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const patientsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Patient[];
      
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