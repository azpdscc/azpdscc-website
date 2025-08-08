
/**
 * @fileoverview This file contains functions for interacting with the scheduledBlogPosts
 * collection in Firebase Firestore. It also includes the logic for processing
 * scheduled posts that are due to be published.
 */

import { db } from '@/lib/firebase';
import type { ScheduledBlogPost, ScheduledBlogPostFormData } from '@/lib/types';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { generateBlogPost } from '@/ai/flows/generate-blog-post-flow';
import { createBlogPost } from './blog';

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
      const date = data.publishDate instanceof Timestamp ? format(data.publishDate.toDate(), 'MMMM dd, yyyy') : data.publishDate;
      return {
        id: doc.id,
        ...data,
        publishDate: date,
      } as ScheduledBlogPost;
    });
    return posts;
  } catch (error) {
    console.error("Error fetching scheduled posts from Firestore:", error);
    return [];
  }
}

/**
 * Creates a new scheduled blog post in Firestore.
 * @param {ScheduledBlogPostFormData} postData
 * @returns {Promise<string>} The ID of the newly created document.
 */
export async function createScheduledBlogPost(postData: ScheduledBlogPostFormData): Promise<string> {
    const dataToSave = {
        title: postData.title,
        image: postData.image,
        publishDate: format(postData.publishDate, 'MMMM dd, yyyy'),
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


/**
 * Processes any scheduled blog posts that are due to be published.
 * This function is designed to be called from a server-side environment (e.g., a page's `getServerSideProps` or in a React Server Component).
 */
export async function processScheduledBlogPosts(): Promise<void> {
    console.log("Checking for scheduled blog posts to process...");
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = format(today, 'MMMM dd, yyyy');

    const q = query(scheduledBlogCollectionRef, where('status', '==', 'Pending'), where('publishDate', '<=', todayString));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        console.log("No pending blog posts to process today.");
        return;
    }

    console.log(`Found ${querySnapshot.docs.length} post(s) to process.`);

    for (const docSnap of querySnapshot.docs) {
        const scheduledPost = { id: docSnap.id, ...docSnap.data() } as ScheduledBlogPost;
        const scheduledPostRef = doc(db, 'scheduledBlogPosts', scheduledPost.id);

        try {
            console.log(`Processing post: "${scheduledPost.title}"`);
            
            // 1. Generate the blog post content using the AI flow
            const generatedContent = await generateBlogPost({ topic: scheduledPost.title });
            
            // 2. Create the new blog post in the main 'blogPosts' collection
            const newPostData = {
                ...generatedContent,
                author: 'PDSCC Team',
                date: new Date(), // This will be formatted by createBlogPost
                image: scheduledPost.image,
                status: 'Published' as const,
            };

            const newPostId = await createBlogPost(newPostData);

            // 3. Update the scheduled post's status to 'Processed'
            await updateDoc(scheduledPostRef, {
                status: 'Processed',
                processedAt: format(new Date(), 'MMMM dd, yyyy HH:mm:ss'),
                generatedPostId: newPostId,
            });

            console.log(`Successfully processed and published post: "${scheduledPost.title}"`);

        } catch (error) {
            console.error(`Error processing scheduled post ${scheduledPost.id}:`, error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            // 4. If an error occurs, update the status to 'Error'
            await updateDoc(scheduledPostRef, {
                status: 'Error',
                errorMessage: errorMessage,
                processedAt: format(new Date(), 'MMMM dd, yyyy HH:mm:ss'),
            });
        }
    }
}
