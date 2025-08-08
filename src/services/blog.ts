
/**
 * @fileoverview This file contains functions for interacting with the blogPosts
 * collection in Firebase Firestore.
 */

import { db } from '@/lib/firebase';
import type { BlogPost, BlogPostFormData } from '@/lib/types';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp, writeBatch } from 'firebase/firestore';
import { format } from 'date-fns';

const blogCollectionRef = collection(db, 'blogPosts');

/**
 * Fetches all blog posts from the Firestore database, ordered by date descending.
 * @returns {Promise<BlogPost[]>} A promise that resolves to an array of blog posts.
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const q = query(blogCollectionRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Handle both Timestamp and string dates for compatibility
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
        const q = query(blogCollectionRef, where('slug', '==', slug));
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
 * Creates a new blog post in Firestore.
 * @param {Partial<BlogPostFormData>} postData - The data for the new post. The status will be added.
 * @returns {Promise<string>} The ID of the newly created document.
 */
export async function createBlogPost(postData: BlogPostFormData): Promise<string> {
    const dataToSave = {
        ...postData,
        date: Timestamp.fromDate(postData.date), // Store as a Timestamp for correct querying
    };
    const docRef = await addDoc(blogCollectionRef, dataToSave);
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
    const dataToUpdate: any = { ...postData };
    if (postData.date) {
        // Ensure date is a Timestamp for consistency
        dataToUpdate.date = Timestamp.fromDate(postData.date);
    }
    await updateDoc(postDoc, dataToUpdate);
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


/**
 * Checks for scheduled blog posts that are due to be published and updates their status.
 * This function should be called from a page that receives regular traffic, like the main blog page.
 */
export async function processScheduledBlogPosts(): Promise<void> {
    try {
        const now = Timestamp.now();
        
        // Find all posts that are still drafts and their publish date is in the past.
        const q = query(
            blogCollectionRef, 
            where('status', '==', 'Draft'),
            where('date', '<=', now)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return; // No posts to publish
        }

        // Use a batch write to update all due posts at once for efficiency.
        const batch = writeBatch(db);
        querySnapshot.forEach(docSnap => {
            console.log(`Publishing post: ${docSnap.id}`);
            const docRef = doc(db, 'blogPosts', docSnap.id);
            batch.update(docRef, { status: 'Published' });
        });

        await batch.commit();
        console.log(`Successfully published ${querySnapshot.size} blog post(s).`);

    } catch (error) {
        // This error is often a missing Firestore index.
        console.error("Error processing scheduled blog posts:", error);
        console.error("This may be due to a missing Firestore index. Please check the Firebase console. The query requires a composite index on 'status' (ascending) and 'date' (descending or ascending).");
    }
}
