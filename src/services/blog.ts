
/**
 * @fileoverview This file contains functions for interacting with the blogPosts
 * collection in Firebase Firestore.
 */

import { db } from '@/lib/firebase';
import type { BlogPost, BlogPostFormData } from '@/lib/types';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';

const blogCollectionRef = collection(db, 'blogPosts');

/**
 * Fetches all blog posts from the Firestore database, ordered by date descending.
 * @returns {Promise<BlogPost[]>} A promise that resolves to an array of blog posts.
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    // Note: Firestore queries require a composite index for ordering by one field
    // and filtering by another if you add a where clause. For now, order by date.
    // To sort by status and then date, a composite index on (status, date) is needed.
    const q = query(blogCollectionRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Firestore returns a Timestamp, convert it to a string date format
      const date = data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date;
      return {
        id: doc.id,
        ...data,
        date: date,
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
        const date = data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date;

        return { id: docSnap.id, ...data, date } as BlogPost;
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
        const q = query(blogCollectionRef, where('slug', '==', slug));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.warn(`No blog post found with slug: ${slug}.`);
            return null;
        }
        
        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();
        const date = data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date;
        
        return { id: docSnap.id, ...data, date } as BlogPost;

    } catch (error) {
        console.error("Error fetching blog post by slug:", error);
        return null;
    }
}


/**
 * Creates a new blog post in Firestore.
 * @param {BlogPostFormData} postData - The data for the new post.
 * @returns {Promise<string>} The ID of the newly created document.
 */
export async function createBlogPost(postData: BlogPostFormData): Promise<string> {
    const docRef = await addDoc(blogCollectionRef, postData);
    return docRef.id;
}


/**
 * Updates an existing blog post in Firestore.
 * @param {string} id - The ID of the post document to update.
 * @param {Partial<BlogPostFormData>} postData - An object with the fields to update.
 * @returns {Promise<void>}
 */
export async function updateBlogPost(id: string, postData: Partial<BlogPostFormData>): Promise<void> {
    const postDoc = doc(db, 'blogPosts', id);
    await updateDoc(postDoc, postData);
}

/**
 * Deletes a blog post from Firestore.
 * @param {string} id - The ID of the post document to delete.
 * @returns {Promise<void>}
 */
export async function deleteBlogPost(id: string): Promise<void> {
    const postDoc = doc(db, 'blogPosts', id);
    await deleteDoc(postDoc);
}
