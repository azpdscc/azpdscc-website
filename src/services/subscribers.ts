
/**
 * @fileoverview This file contains functions for interacting with the subscribers
 * collection in Firebase Firestore. It handles checking for and adding new subscribers.
 */

import { db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

const subscribersCollectionRef = collection(db, 'subscribers');

/**
 * Checks if an email address is already subscribed.
 * @param {string} email - The email to check.
 * @returns {Promise<boolean>} True if the email exists, false otherwise.
 */
export async function isSubscribed(email: string): Promise<boolean> {
    try {
        const docRef = doc(db, 'subscribers', email);
        const docSnap = await getDoc(docRef);
        return docSnap.exists();
    } catch (error) {
        console.error("Error checking subscription status:", error);
        // Fail safe: assume not subscribed if there's an error.
        return false;
    }
}


/**
 * Adds a new email to the subscribers collection.
 * Uses the email as the document ID to prevent duplicates.
 * @param {{ email: string, name?: string, phone?: string, smsConsent?: boolean }} subscriberData - The subscriber's data.
 * @returns {Promise<void>}
 */
export async function addSubscriber(subscriberData: { email: string, name?: string, phone?: string, smsConsent?: boolean }): Promise<void> {
    const subscriberDoc = doc(db, 'subscribers', subscriberData.email);
    await setDoc(subscriberDoc, {
        email: subscriberData.email,
        name: subscriberData.name || '',
        phone: subscriberData.phone || '',
        smsConsent: subscriberData.smsConsent || false,
        subscribedAt: serverTimestamp()
    }, { merge: true }); // Use merge to avoid overwriting phone if they re-subscribe
}
