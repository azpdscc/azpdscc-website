
/**
 * @fileoverview This file contains functions for interacting with the blogPosts
 * collection in Firebase Firestore.
 */

import { db } from '@/lib/firebase';
import type { BlogPost, BlogPostFormData, ScheduledBlogPost } from '@/lib/types';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp, writeBatch } from 'firebase/firestore';
import { format, parseISO, isPast } from 'date-fns';
import { getScheduledBlogPosts } from './scheduled-blog';

const blogCollectionRef = collection(db, 'blogPosts');
const scheduledBlogCollectionRef = collection(db, 'scheduledBlogPosts');

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
export async function createBlogPost(postData: Partial<BlogPostFormData>): Promise<string> {
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
export async function updateBlogPost(id: string, postData: Partial<Omit<BlogPostFormData, 'status'>>): Promise<void> {
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
 * Processes scheduled blog posts. Finds posts that are due to be published,
 * updates their status in the main blog collection, and marks them as processed
 * in the scheduled collection.
 */
export async function processScheduledBlogPosts(): Promise<void> {
    try {
        // Step 1: Query for all pending posts. This is a simple query and doesn't need a composite index.
        const q = query(
            scheduledBlogCollectionRef, 
            where('status', '==', 'Pending')
        );

        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return; // No pending posts to process
        }

        const batch = writeBatch(db);
        let postsToPublishCount = 0;
        const now = new Date();

        for (const docSnap of querySnapshot.docs) {
            const scheduledPost = { id: docSnap.id, ...docSnap.data() } as ScheduledBlogPost;
            const publishDate = scheduledPost.publishTimestamp ? new Date(scheduledPost.publishTimestamp) : new Date(scheduledPost.publishDate);
            
            // Step 2: In the code, filter for posts whose publication date is in the past.
            if (isPast(publishDate) && scheduledPost.generatedPostId) {
                // Update the status of the actual blog post to 'Published'
                const blogPostRef = doc(db, 'blogPosts', scheduledPost.generatedPostId);
                batch.update(blogPostRef, { status: 'Published' });

                // Update the scheduled post to 'Processed'
                const scheduledPostRef = doc(db, 'scheduledBlogPosts', scheduledPost.id);
                batch.update(scheduledPostRef, {
                    status: 'Processed',
                    processedAt: Timestamp.fromDate(new Date())
                });
                postsToPublishCount++;
            }
        }

        if (postsToPublishCount > 0) {
            await batch.commit();
            console.log(`Successfully processed ${postsToPublishCount} scheduled blog posts.`);
        }

    } catch (error) {
        console.error("Error processing scheduled blog posts:", error);
    }
}
