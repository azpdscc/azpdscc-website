
/**
 * @fileoverview This file contains functions for interacting with the scheduledBlogPosts
 * collection in Firebase Firestore, used for automating blog publications.
 */

import { db } from '@/lib/firebase';
import type { ScheduledBlogPost, ScheduledBlogPostFormData } from '@/lib/types';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';

const scheduledBlogCollectionRef = collection(db, 'scheduledBlogPosts');

/**
 * Fetches all scheduled blog posts from Firestore, ordered by scheduled date ascending.
 * @returns {Promise<ScheduledBlogPost[]>} A promise resolving to an array of scheduled posts.
 */
export async function getScheduledBlogPosts(): Promise<ScheduledBlogPost[]> {
  try {
    const q = query(scheduledBlogCollectionRef, orderBy('scheduledDate', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ScheduledBlogPost));
  } catch (error) {
    console.error("Error fetching scheduled blog posts:", error);
    return [];
  }
}

/**
 * Fetches a single scheduled blog post by its ID from Firestore.
 * @param {string} id - The ID of the scheduled post to fetch.
 * @returns {Promise<ScheduledBlogPost | null>} A promise resolving to the post or null if not found.
 */
export async function getScheduledBlogPostById(id: string): Promise<ScheduledBlogPost | null> {
    try {
        const docRef = doc(db, 'scheduledBlogPosts', id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as ScheduledBlogPost : null;
    } catch (error) {
        console.error("Error fetching scheduled post by ID:", error);
        return null;
    }
}

/**
 * Fetches the next pending scheduled blog post that is due to be published.
 * @returns {Promise<ScheduledBlogPost | null>} The next post to be published, or null if none are due.
 */
export async function getNextPendingPost(): Promise<ScheduledBlogPost | null> {
    try {
        const today = new Date().toISOString().split('T')[0];
        const q = query(
            scheduledBlogCollectionRef, 
            where('status', '==', 'Pending'),
            where('scheduledDate', '<=', today),
            orderBy('scheduledDate', 'asc'),
            limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return null;
        }
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as ScheduledBlogPost;
    } catch (error) {
        console.error("Error fetching next pending post:", error);
        return null;
    }
}

/**
 * Creates a new scheduled blog post in Firestore.
 * @param {ScheduledBlogPostFormData} postData - The data for the new scheduled post.
 * @returns {Promise<string>} The ID of the newly created document.
 */
export async function createScheduledBlogPost(postData: ScheduledBlogPostFormData): Promise<string> {
    const docRef = await addDoc(scheduledBlogCollectionRef, postData);
    return docRef.id;
}


/**
 * Updates an existing scheduled blog post in Firestore.
 * @param {string} id - The ID of the document to update.
 * @param {Partial<ScheduledBlogPostFormData>} postData - Fields to update.
 * @returns {Promise<void>}
 */
export async function updateScheduledBlogPost(id: string, postData: Partial<ScheduledBlogPostFormData>): Promise<void> {
    const postDoc = doc(db, 'scheduledBlogPosts', id);
    await updateDoc(postDoc, postData);
}

/**
 * Deletes a scheduled blog post from Firestore.
 * @param {string} id - The ID of the document to delete.
 * @returns {Promise<void>}
 */
export async function deleteScheduledBlogPost(id: string): Promise<void> {
    const postDoc = doc(db, 'scheduledBlogPosts', id);
    await deleteDoc(postDoc);
}
