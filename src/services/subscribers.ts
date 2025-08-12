
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
 * @param {string} email - The email address to add.
 * @returns {Promise<void>}
 */
export async function addSubscriber(email: string): Promise<void> {
    const subscriberDoc = doc(db, 'subscribers', email);
    await setDoc(subscriberDoc, {
        email: email,
        subscribedAt: serverTimestamp()
    });
}
