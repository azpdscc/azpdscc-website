
/**
 * @fileoverview This file contains functions for interacting with vendor applications
 * in Firebase Firestore. This is used for the QR code check-in system.
 */

import { db } from '@/lib/firebase';
import type { VendorApplication } from '@/lib/types';
import { collection, doc, getDoc, addDoc, updateDoc, Timestamp, serverTimestamp, query, getDocs, orderBy } from 'firebase/firestore';

// This collection will store all vendor applications for events.
const vendorApplicationsCollectionRef = collection(db, 'vendorApplications');

/**
 * Creates a new vendor application in Firestore for check-in purposes.
 * @param {Pick<VendorApplication, 'name' | 'organization' | 'boothType'>} appData - The basic data for the vendor.
 * @returns {Promise<string>} The ID of the newly created document.
 */
export async function createVendorApplication(appData: Pick<VendorApplication, 'name' | 'organization' | 'boothType'>): Promise<string> {
    const dataToSave = {
        ...appData,
        createdAt: serverTimestamp(),
        checkInStatus: 'pending' as const,
    };
    const docRef = await addDoc(vendorApplicationsCollectionRef, dataToSave);
    return docRef.id;
}

/**
 * Fetches all vendor applications from Firestore, ordered by creation date.
 * @returns {Promise<VendorApplication[]>}
 */
export async function getVendorApplications(): Promise<VendorApplication[]> {
    try {
        const q = query(vendorApplicationsCollectionRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const applications = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const serializedData = {
                ...data,
                createdAt: data.createdAt?.toDate().toISOString(),
                checkedInAt: data.checkedInAt ? data.checkedInAt.toDate().toISOString() : undefined,
            }
            return { id: doc.id, ...serializedData } as VendorApplication;
        });
        return applications;
    } catch (error) {
        console.error("Error fetching vendor applications:", error);
        return [];
    }
}


/**
 * Fetches a single vendor application by its ID from Firestore.
 * @param {string} id - The ID of the application to fetch.
 * @returns {Promise<VendorApplication | null>} A promise that resolves to the application object or null if not found.
 */
export async function getVendorApplicationById(id: string): Promise<VendorApplication | null> {
    try {
        const docRef = doc(db, 'vendorApplications', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.warn(`No vendor application found with id: ${id}.`);
            return null;
        }
        
        const data = docSnap.data();
        
        // Convert Timestamps to serializable ISO strings before returning
        const serializedData = {
            ...data,
            createdAt: data.createdAt?.toDate().toISOString(),
            checkedInAt: data.checkedInAt ? data.checkedInAt.toDate().toISOString() : undefined,
        }

        return { id: docSnap.id, ...serializedData } as VendorApplication;
    } catch (error) {
        console.error("Error fetching vendor application by id:", error);
        return null;
    }
}

/**
 * Updates the check-in status of a vendor application in Firestore.
 * @param {string} id - The ID of the application document to update.
 * @returns {Promise<void>}
 */
export async function checkInVendor(id: string): Promise<void> {
    const appDoc = doc(db, 'vendorApplications', id);
    await updateDoc(appDoc, {
        checkInStatus: 'checkedIn',
        checkedInAt: serverTimestamp(),
    });
}
