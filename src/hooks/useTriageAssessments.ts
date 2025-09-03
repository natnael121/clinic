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
import { TriageAssessment } from '../types';

export function useTriageAssessments(triageOfficerId?: string) {
  const [assessments, setAssessments] = useState<TriageAssessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
  }, [triageOfficerId]);

  const fetchAssessments = async () => {
    try {
      let q = query(collection(db, 'triage_assessments'), orderBy('created_at', 'desc'));
      
      if (triageOfficerId) {
        q = query(
          collection(db, 'triage_assessments'), 
          where('triage_officer_id', '==', triageOfficerId),
          orderBy('created_at', 'desc')
        );
      }
      
      const querySnapshot = await getDocs(q);
      
      const assessmentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as TriageAssessment[];
      
      setAssessments(assessmentsData);
    } catch (error) {
      console.error('Error fetching triage assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTriageAssessment = async (assessmentData: Omit<TriageAssessment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const docRef = await addDoc(collection(db, 'triage_assessments'), {
        ...assessmentData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      
      await fetchAssessments();
      return { id: docRef.id, error: null };
    } catch (error) {
      return { id: null, error };
    }
  };

  const updateTriageAssessment = async (id: string, updates: Partial<TriageAssessment>) => {
    try {
      await updateDoc(doc(db, 'triage_assessments', id), {
        ...updates,
        updated_at: serverTimestamp(),
      });
      
      await fetchAssessments();
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return {
    assessments,
    loading,
    addTriageAssessment,
    updateTriageAssessment,
    refetch: fetchAssessments,
  };
}