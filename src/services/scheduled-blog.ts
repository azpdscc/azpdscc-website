
/**
 * @fileoverview This file contains functions for interacting with the scheduledBlogPosts
 * collection in Firebase Firestore. It also includes the logic for processing
 * scheduled posts that are due to be published.
 */

import { db } from '@/lib/firebase';
import type { BlogPost, ScheduledBlogPost, ScheduledBlogPostFormData } from '@/lib/types';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { format, isToday, isPast } from 'date-fns';
import { getBlogPostById, updateBlogPost } from './blog';

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
 * Creates a new scheduled blog post record in Firestore.
 * This is called *after* the draft has already been created.
 * @param {Omit<ScheduledBlogPost, 'id' | 'status'>} postData
 * @returns {Promise<string>} The ID of the newly created document.
 */
export async function createScheduledBlogPost(postData: Omit<ScheduledBlogPost, 'id' | 'status'>): Promise<string> {
    const dataToSave = {
        ...postData,
        publishDate: format(postData.publishDate, 'MMMM dd, yyyy'),
        status: 'Pending' as const, // Pending means it's scheduled but not yet published
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
 * This function is designed to be called from a server-side environment.
 * It now checks for DRAFT posts with a past/present publish date.
 */
export async function processScheduledBlogPosts(): Promise<void> {
    console.log("Checking for scheduled blog posts to publish...");
    
    // Query for all posts that are still in 'Draft' status
    const blogPostsRef = collection(db, 'blogPosts');
    const q = query(blogPostsRef, where('status', '==', 'Draft'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        console.log("No draft posts found to check for publishing.");
        return;
    }

    const postsToPublish: BlogPost[] = [];
    querySnapshot.forEach(docSnap => {
        const post = { id: docSnap.id, ...docSnap.data() } as BlogPost;
        const publishDate = new Date(post.date);

        // Check if the publish date is today or in the past
        if (isToday(publishDate) || isPast(publishDate)) {
            postsToPublish.push(post);
        }
    });

    if (postsToPublish.length === 0) {
        console.log("No due draft posts to publish today.");
        return;
    }

    console.log(`Found ${postsToPublish.length} draft post(s) to publish.`);

    for (const post of postsToPublish) {
        try {
            console.log(`Publishing post: "${post.title}" (ID: ${post.id})`);
            
            // 1. Update the blog post's status to 'Published'
            await updateBlogPost(post.id, {
                status: 'Published'
            });

            // 2. Find and update the corresponding scheduled post's status to 'Processed'
            const scheduleQuery = query(scheduledBlogCollectionRef, where('generatedPostId', '==', post.id));
            const scheduleSnapshot = await getDocs(scheduleQuery);
            if (!scheduleSnapshot.empty) {
                const scheduleDocRef = scheduleSnapshot.docs[0].ref;
                await updateDoc(scheduleDocRef, {
                    status: 'Processed',
                    processedAt: format(new Date(), 'MMMM dd, yyyy HH:mm:ss'),
                });
            }

            console.log(`Successfully published post: "${post.title}"`);

        } catch (error) {
            console.error(`Error publishing post ${post.id}:`, error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            // Optionally, update the scheduled post to an 'Error' status
            const scheduleQuery = query(scheduledBlogCollectionRef, where('generatedPostId', '==', post.id));
            const scheduleSnapshot = await getDocs(scheduleQuery);
             if (!scheduleSnapshot.empty) {
                const scheduleDocRef = scheduleSnapshot.docs[0].ref;
                await updateDoc(scheduleDocRef, {
                    status: 'Error',
                    errorMessage: `Failed during publishing: ${errorMessage}`,
                });
            }
        }
    }
}
