
/**
 * @fileoverview This file contains functions for interacting with the blogPosts
 * collection in Firebase Firestore.
 */

import { db } from '@/lib/firebase';
import type { BlogPost, BlogPostFormData } from '@/lib/types';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp, writeBatch } from 'firebase/firestore';
import { format } from 'date-fns';
import { unstable_cache } from 'next/cache';

/**
 * Checks for scheduled blog posts that are due to be published and updates their status.
 * This is called before fetching all posts to ensure the list is up-to-date.
 */
async function processScheduledBlogPosts(): Promise<void> {
    try {
        const now = new Date();
        const draftsQuery = query(collection(db, 'blogPosts'), where('status', '==', 'Draft'));
        const querySnapshot = await getDocs(draftsQuery);

        if (querySnapshot.empty) {
            return; // No drafts to process
        }
        
        const batch = writeBatch(db);
        let postsToPublishCount = 0;

        querySnapshot.docs.forEach(docSnap => {
            const post = docSnap.data() as BlogPost;
            // The date from firestore is a Timestamp, so we convert it to a JS Date
            const postDate = post.date instanceof Timestamp ? post.date.toDate() : new Date(post.date);
            
            if (postDate <= now) {
                const docRef = doc(db, 'blogPosts', docSnap.id);
                batch.update(docRef, { status: 'Published' });
                postsToPublishCount++;
            }
        });

        if (postsToPublishCount > 0) {
            await batch.commit();
            console.log(`Successfully published ${postsToPublishCount} scheduled blog post(s).`);
            // Revalidation should be triggered from server actions, not here.
        }

    } catch (error) {
        console.error("Error processing scheduled blog posts:", error);
    }
}

/**
 * Fetches all blog posts from the Firestore database, ordered by date descending.
 * Uses unstable_cache for tag-based revalidation (ISR).
 * @returns {Promise<BlogPost[]>} A promise that resolves to an array of blog posts.
 */
export const getBlogPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    // Process any due posts before fetching the list.
    await processScheduledBlogPosts();
    try {
      const q = query(collection(db, 'blogPosts'), orderBy('date', 'desc'));
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
  },
  ['blogPosts'], // The cache key for this data fetch
  {
    tags: ['blogPosts'], // The cache tag used for on-demand revalidation
  }
);


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
export const getBlogPostBySlug = unstable_cache(
    async (slug: string): Promise<BlogPost | null> => {
        try {
            const q = query(collection(db, 'blogPosts'), where('slug', '==', slug));
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
    },
    ['blogPostBySlug'],
    {
        tags: ['blogPosts'], 
    }
);


/**
 * Creates a new blog post in Firestore.
 * @param {BlogPostFormData} postData - The data for the new post. The status will be added.
 * @returns {Promise<string>} The ID of the newly created document.
 */
export async function createBlogPost(postData: BlogPostFormData): Promise<string> {
    const dataToSave = {
        ...postData,
        date: Timestamp.fromDate(postData.date), // Store as a Timestamp for correct querying
    };
    const docRef = await addDoc(collection(db, 'blogPosts'), dataToSave);
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
