
/**
 * @fileoverview This file contains functions for logging administrator actions,
 * such as successful logins, to the `adminLogs` collection in Firebase Firestore.
 */

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const adminLogsCollectionRef = collection(db, 'adminLogs');

interface AdminLogData {
    action: 'admin-login';
    userId: string;
    email: string;
    name: string; // Name of the person logging in
    timestamp: any;
}

/**
 * Creates a log entry for a successful admin login.
 * @param {object} logData - The data for the log entry.
 * @param {string} logData.userId - The Firebase Auth UID of the user.
 * @param {string} logData.email - The email of the user.
 * @param {string} logData.name - The name entered during login.
 * @returns {Promise<void>}
 */
export async function createAdminLoginLog(logData: { userId: string; email: string; name: string; }): Promise<void> {
    try {
        const logEntry: AdminLogData = {
            action: 'admin-login',
            userId: logData.userId,
            email: logData.email,
            name: logData.name,
            timestamp: serverTimestamp(),
        };
        await addDoc(adminLogsCollectionRef, logEntry);
    } catch (error) {
        console.error("Error creating admin login log:", error);
        // Depending on requirements, you might want to handle this error more actively.
        // For now, we log it to the console.
    }
}
