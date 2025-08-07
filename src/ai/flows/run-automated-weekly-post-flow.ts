
'use server';
/**
 * @fileOverview An AI flow to automate the creation of weekly blog posts.
 * This flow is designed to be triggered by a scheduler (e.g., a cron job).
 * 
 * - runAutomatedWeeklyPost: Fetches a pending topic, generates a blog post,
 *   saves it, and updates the topic's status.
 */
import 'dotenv/config';
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { generateBlogPost } from './generate-blog-post-flow';
import { getNextPendingPost, updateScheduledBlogPost } from '@/services/scheduled-blog';
import { createBlogPost } from '@/services/blog';
import { format } from 'date-fns';

const AutomationOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  publishedPostId: z.string().optional(),
});
export type AutomationOutput = z.infer<typeof AutomationOutputSchema>;

/**
 * Executes the automated weekly blog posting process.
 * This function should be called by a scheduler.
 * @returns {Promise<AutomationOutput>} An object indicating the result of the operation.
 */
export async function runAutomatedWeeklyPost(): Promise<AutomationOutput> {
  return runAutomatedWeeklyPostFlow();
}

const runAutomatedWeeklyPostFlow = ai.defineFlow(
  {
    name: 'runAutomatedWeeklyPostFlow',
    outputSchema: AutomationOutputSchema,
  },
  async () => {
    console.log('Starting automated weekly post flow...');

    // 1. Fetch the next pending post from the schedule
    const scheduledPost = await getNextPendingPost();

    if (!scheduledPost) {
      console.log('No pending blog posts to publish.');
      return { success: true, message: 'No pending blog posts to publish.' };
    }
    
    console.log(`Found pending post: "${scheduledPost.topic}" (ID: ${scheduledPost.id})`);

    try {
      // 2. Generate the blog post content using the existing flow
      const generatedContent = await generateBlogPost({ topic: scheduledPost.topic });

      // 3. Create the new blog post in the database
      const newPostData = {
        ...generatedContent,
        author: scheduledPost.author,
        date: format(new Date(), 'MMMM dd, yyyy'),
        image: scheduledPost.image, // Use the pre-selected image
      };

      const newPostId = await createBlogPost(newPostData);
      console.log(`Successfully created new blog post with ID: ${newPostId}`);

      // 4. Update the scheduled post's status to "Published"
      await updateScheduledBlogPost(scheduledPost.id, { status: 'Published' });
      console.log(`Updated scheduled post status to "Published" for ID: ${scheduledPost.id}`);

      return {
        success: true,
        message: `Successfully published blog post: "${generatedContent.title}"`,
        publishedPostId: newPostId,
      };

    } catch (error) {
      console.error('Error during automated blog post creation:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      return {
        success: false,
        message: `Failed to publish post for topic "${scheduledPost.topic}". Error: ${errorMessage}`,
      };
    }
  }
);
