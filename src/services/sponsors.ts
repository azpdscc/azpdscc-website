
/**
 * @fileoverview This file contains functions for interacting with the Sponsors
 * collection in Firebase Firestore. It handles all database operations for sponsors.
 */

import { db } from '@/lib/firebase';
import type { Sponsor } from '@/lib/types';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

const sponsorsCollectionRef = collection(db, 'sponsors');

/**
 * Fetches all sponsors from the Firestore database, ordered by name.
 * @returns {Promise<Sponsor[]>} A promise that resolves to an array of sponsors.
 */
export async function getSponsors(): Promise<Sponsor[]> {
  try {
    const q = query(sponsorsCollectionRef, orderBy('name'));
    const querySnapshot = await getDocs(q);
    const sponsors = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Sponsor));
    return sponsors;
  } catch (error) {
    console.error("Error fetching sponsors from Firestore:", error);
    return [];
  }
}

/**
 * Fetches a single sponsor by their ID from Firestore.
 * @param {string} id - The ID of the sponsor to fetch.
 * @returns {Promise<Sponsor | null>} A promise that resolves to the sponsor object or null if not found.
 */
export async function getSponsorById(id: string): Promise<Sponsor | null> {
    try {
        const docRef = doc(db, 'sponsors', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.warn(`No sponsor found with id: ${id}.`);
            return null;
        }

        return { id: docSnap.id, ...docSnap.data() } as Sponsor;
    } catch (error) {
        console.error("Error fetching sponsor by id:", error);
        return null;
    }
}

/**
 * Creates a new sponsor in Firestore.
 * @param {Omit<Sponsor, 'id'>} sponsorData - The data for the new sponsor.
 * @returns {Promise<string>} The ID of the newly created document.
 */
export async function createSponsor(sponsorData: Omit<Sponsor, 'id'>): Promise<string> {
    const docRef = await addDoc(sponsorsCollectionRef, sponsorData);
    return docRef.id;
}


/**
 * Updates an existing sponsor in Firestore.
 * @param {string} id - The ID of the sponsor document to update.
 * @param {Partial<Omit<Sponsor, 'id'>>} sponsorData - An object with the fields to update.
 * @returns {Promise<void>}
 */
export async function updateSponsor(id: string, sponsorData: Partial<Omit<Sponsor, 'id'>>): Promise<void> {
    const sponsorDoc = doc(db, 'sponsors', id);
    await updateDoc(sponsorDoc, sponsorData);
}

/**
 * Deletes a sponsor from Firestore.
 * @param {string} id - The ID of the sponsor document to delete.
 * @returns {Promise<void>}
 */
export async function deleteSponsor(id: string): Promise<void> {
    const sponsorDoc = doc(db, 'sponsors', id);
    await deleteDoc(sponsorDoc);
}
