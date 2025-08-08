
/**
 * @fileoverview This file contains functions for interacting with vendor applications
 * in Firebase Firestore. This is used for the QR code check-in system.
 */

import { db } from '@/lib/firebase';
import type { VendorApplication } from '@/lib/types';
import { collection, doc, getDoc, addDoc, updateDoc, Timestamp, serverTimestamp } from 'firebase/firestore';

// Using a separate collection for test data to not interfere with any future live data
const vendorApplicationsCollectionRef = collection(db, 'vendorApplications_test');

/**
 * Creates a new test vendor application in Firestore to simulate a vendor submission.
 * @param {Pick<VendorApplication, 'name' | 'organization' | 'boothType'>} appData - The basic data for the test vendor.
 * @returns {Promise<string>} The ID of the newly created document.
 */
export async function createTestVendorApplication(appData: Pick<VendorApplication, 'name' | 'organization' | 'boothType'>): Promise<string> {
    const dataToSave = {
        ...appData,
        createdAt: serverTimestamp(),
        checkInStatus: 'pending' as const,
    };
    const docRef = await addDoc(vendorApplicationsCollectionRef, dataToSave);
    return docRef.id;
}

/**
 * Fetches a single vendor application by its ID from Firestore.
 * @param {string} id - The ID of the application to fetch.
 * @returns {Promise<VendorApplication | null>} A promise that resolves to the application object or null if not found.
 */
export async function getVendorApplicationById(id: string): Promise<VendorApplication | null> {
    try {
        const docRef = doc(db, 'vendorApplications_test', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.warn(`No vendor application found with id: ${id}.`);
            return null;
        }
        
        const data = docSnap.data();
        
        return { id: docSnap.id, ...data } as VendorApplication;
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
    const appDoc = doc(db, 'vendorApplications_test', id);
    await updateDoc(appDoc, {
        checkInStatus: 'checkedIn',
        checkedInAt: serverTimestamp(),
    });
}
