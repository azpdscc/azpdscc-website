
/**
 * @fileoverview This file contains functions for interacting with the scheduledBlogPosts
 * collection in Firebase Firestore.
 */

import { db } from '@/lib/firebase';
import type { ScheduledBlogPost } from '@/lib/types';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

const scheduledBlogCollectionRef = collection(db, 'scheduledBlogPosts');

/**
 * Fetches all scheduled blog posts from Firestore, ordered by publish date descending.
 * @returns {Promise<ScheduledBlogPost[]>}
 */
export async function getScheduledBlogPosts(): Promise<ScheduledBlogPost[]> {
  try {
    const q = query(scheduledBlogCollectionRef, orderBy('publishDate', 'desc'));
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Ensure publishDate is a string in the "Month Day, YYYY" format for consistency
      const date = data.publishDate instanceof Timestamp ? data.publishDate.toDate() : new Date(data.publishDate);
      return {
        id: doc.id,
        ...data,
        publishDate: format(date, 'MMMM dd, yyyy'),
      } as ScheduledBlogPost;
    });
    return posts;
  } catch (error) {
    console.error("Error fetching scheduled posts from Firestore:", error);
    return [];
  }
}

/**
 * Creates a new scheduled blog post record in Firestore.
 * This is called *after* the draft has already been created.
 * @param {Omit<ScheduledBlogPost, 'id' | 'status'>} postData
 * @returns {Promise<string>} The ID of the newly created document.
 */
export async function createScheduledBlogPost(postData: Omit<ScheduledBlogPost, 'id' | 'status'>): Promise<string> {
    const dataToSave = {
        ...postData,
        publishDate: postData.publishDate, // Expects a Date object
        status: 'Pending' as const, 
    };
    const docRef = await addDoc(scheduledBlogCollectionRef, dataToSave);
    return docRef.id;
}


/**
 * Deletes a scheduled blog post from Firestore.
 * @param {string} id - The ID of the post to delete.
 */
export async function deleteScheduledBlogPost(id: string): Promise<void> {
    const postDoc = doc(db, 'scheduledBlogPosts', id);
    await deleteDoc(postDoc);
}
