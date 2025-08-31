
/**
 * @fileoverview This file contains functions for interacting with the blogPosts
 * collection in Firebase Firestore. All functions in this file use the client SDK
 * and are safe to use in both client and server components. Write operations
 * are handled in dedicated Server Actions.
 */

import { db } from '@/lib/firebase';
import type { BlogPost, BlogPostFormData } from '@/lib/types';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

const blogPostsCollectionRef = collection(db, 'blogPosts');

/**
 * Fetches all blog posts from the Firestore database, ordered by date descending.
 * @returns {Promise<BlogPost[]>} A promise that resolves to an array of blog posts.
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
    try {
      const q = query(blogPostsCollectionRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Firestore Timestamps need to be converted to JS Dates, then formatted.
        const date = data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date);
        
        return {
          id: doc.id,
          ...data,
          date: format(date, 'MMMM dd, yyyy'),
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
        const docRef = doc(db, 'blogPosts', id);
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
        const q = query(blogPostsCollectionRef, where('slug', '==', slug));
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

// NOTE: The following CUD functions are now only for use by Server Actions
// that have properly authenticated with the Admin SDK.

/**
 * Creates a new blog post in Firestore.
 * This should ONLY be called from a Server Action.
 * @param {BlogPostFormData} postData - The data for the new post.
 * @returns {Promise<string>} The ID of the newly created document.
 */
export async function createBlogPost(postData: BlogPostFormData): Promise<string> {
    const dataToSave = {
        ...postData,
        date: Timestamp.fromDate(postData.date), // Store as a Timestamp for correct querying
    };
    const docRef = await addDoc(blogPostsCollectionRef, dataToSave);
    return docRef.id;
}


/**
 * Updates an existing blog post in Firestore.
 * This should ONLY be called from a Server Action.
 * @param {string} id - The ID of the post document to update.
 * @param {Partial<BlogPostFormData>} postData - An object with the fields to update.
 * @returns {Promise<void>}
 */
export async function updateBlogPost(id: string, postData: Partial<BlogPostFormData>): Promise<void> {
    const postDoc = doc(db, 'blogPosts', id);
    const dataToUpdate: any = { ...postData };
    if (postData.date) {
        // Ensure date is a Timestamp for consistency
        dataToUpdate.date = Timestamp.fromDate(postData.date);
    }
    await updateDoc(postDoc, dataToUpdate);
}

/**
 * Deletes a blog post from Firestore.
 * This should ONLY be called from a Server Action.
 * @param {string} id - The ID of the post document to delete.
 * @returns {Promise<void>}
 */
export async function deleteBlogPost(id: string): Promise<void> {
    const postDoc = doc(db, 'blogPosts', id);
    await deleteDoc(postDoc);
}
