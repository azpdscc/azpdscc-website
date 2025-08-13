
/**
 * @fileoverview This file contains functions for interacting with the performanceRegistrations
 * collection in Firebase Firestore.
 */

import { db } from '@/lib/firebase';
import type { PerformanceApplication } from '@/lib/types';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

const performanceCollectionRef = collection(db, 'performanceRegistrations');

/**
 * Fetches all performance applications from Firestore, ordered by submission date descending.
 * @returns {Promise<PerformanceApplication[]>}
 */
export async function getPerformanceApplications(): Promise<PerformanceApplication[]> {
  try {
    const q = query(performanceCollectionRef, orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const applications = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const submittedAt = data.submittedAt instanceof Timestamp ? data.submittedAt.toDate().toISOString() : new Date().toISOString();
      return {
        id: doc.id,
        ...data,
        submittedAt: submittedAt,
      } as PerformanceApplication;
    });
    return applications;
  } catch (error) {
    console.error("Error fetching performance applications from Firestore:", error);
    return [];
  }
}
