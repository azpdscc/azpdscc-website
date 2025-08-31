
/**
 * @fileoverview This file contains functions for interacting with the blogPosts
 * collection in Firebase Firestore. It now uses the Firebase Admin SDK for write
 * operations to ensure server-side actions have the correct permissions.
 */

import { db } from '@/lib/firebase';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import type { BlogPost, BlogPostFormData } from '@/lib/types';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp, writeBatch } from 'firebase/firestore';
import { format } from 'date-fns';

// Use the client SDK for reads, which is fine for public data
const clientDb = db; 

// Use the admin SDK for any write operations (create, update, delete)
// This requires the service account credentials to be configured on the server.
const adminDb = getAdminFirestore();

/**
 * Fetches all blog posts from the Firestore database, ordered by date descending.
 * @returns {Promise<BlogPost[]>} A promise that resolves to an array of blog posts.
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
    try {
      const q = query(collection(clientDb, 'blogPosts'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Firestore Timestamps need to be converted to JS Dates, then formatted.
        const date = data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date);
        
        return {
          id: doc.id,
          ...data,
          date: format(date, 'MMMM dd, yyyy'),
          status: data.status,
        } as BlogPost;
      });
      return posts;
    } catch (error) {
      console.error("Error fetching blog posts from Firestore:", error);
      return [];
    }
}


/**
 * Fetches a single blog post by its ID from Firestore.
 * @param {string} id - The ID of the blog post to fetch.
 * @returns {Promise<BlogPost | null>} A promise that resolves to the post object or null if not found.
 */
export async function getBlogPostById(id: string): Promise<BlogPost | null> {
    try {
        const docRef = doc(clientDb, 'blogPosts', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.warn(`No blog post found with id: ${id}.`);
            return null;
        }

        const data = docSnap.data();
        const date = data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date);

        return { id: docSnap.id, ...data, date: format(date, 'MMMM dd, yyyy') } as BlogPost;
    } catch (error) {
        console.error("Error fetching blog post by id:", error);
        return null;
    }
}

/**
 * Fetches a single blog post by its slug from Firestore.
 * @param {string} slug - The slug of the blog post to fetch.
 * @returns {Promise<BlogPost | null>} A promise that resolves to the post object or null if not found.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        const q = query(collection(clientDb, 'blogPosts'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.warn(`No blog post found with slug: ${slug}.`);
            return null;
        }
        
        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();
        const date = data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date);
        
        return { id: docSnap.id, ...data, date: format(date, 'MMMM dd, yyyy') } as BlogPost;

    } catch (error) {
        console.error("Error fetching blog post by slug:", error);
        return null;
    }
}


/**
 * Creates a new blog post in Firestore using the Admin SDK.
 * @param {BlogPostFormData} postData - The data for the new post. The status will be added.
 * @returns {Promise<string>} The ID of the newly created document.
 */
export async function createBlogPost(postData: BlogPostFormData): Promise<string> {
    const dataToSave = {
        ...postData,
        date: Timestamp.fromDate(postData.date), // Store as a Timestamp for correct querying
    };
    const docRef = await adminDb.collection('blogPosts').add(dataToSave);
    return docRef.id;
}


/**
 * Updates an existing blog post in Firestore using the Admin SDK.
 * @param {string} id - The ID of the post document to update.
 * @param {Partial<BlogPostFormData>} postData - An object with the fields to update.
 * @returns {Promise<void>}
 */
export async function updateBlogPost(id: string, postData: Partial<BlogPostFormData>): Promise<void> {
    const postDoc = adminDb.collection('blogPosts').doc(id);
    const dataToUpdate: any = { ...postData };
    if (postData.date) {
        // Ensure date is a Timestamp for consistency
        dataToUpdate.date = Timestamp.fromDate(postData.date);
    }
    await postDoc.update(dataToUpdate);
}

/**
 * Deletes a blog post from Firestore using the Admin SDK.
 * @param {string} id - The ID of the post document to delete.
 * @returns {Promise<void>}
 */
export async function deleteBlogPost(id: string): Promise<void> {
    const postDoc = adminDb.collection('blogPosts').doc(id);
    await postDoc.delete();
}
