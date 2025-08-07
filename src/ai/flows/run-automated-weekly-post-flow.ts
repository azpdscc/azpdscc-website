
'use server';
/**
 * @fileOverview A flow to automatically generate a new blog post on a random topic.
 * This is designed to be run by a scheduler (e.g., cron job).
 */
import 'dotenv/config';
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { generateBlogPost } from './generate-blog-post-flow';
import { createBlogPost } from '@/services/blog';
import { format } from 'date-fns';

const topics = [
  'The significance of Vaisakhi in the diaspora',
  'Exploring the different styles of Bhangra',
  'The history and importance of Teeyan Da Mela for Punjabi women',
  'How to tie a traditional Sikh turban (Dastar)',
  'The community spirit of a Langar',
  'The meaning behind popular Punjabi folk songs',
  'Celebrating Lohri: A winter festival of warmth and joy',
  'The role of sports in the Phoenix Desi community',
  'A guide to traditional Punjabi wedding ceremonies',
  'The impact of Punjabi immigration in Arizona',
];

// Output schema for the flow
const AutomatedPostOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  postId: z.string().optional(),
  postTitle: z.string().optional(),
});
export type AutomatedPostOutput = z.infer<typeof AutomatedPostOutputSchema>;

/**
 * Public function to trigger the automated post generation.
 * @returns A promise that resolves to the flow's output.
 */
export async function runAutomatedWeeklyPost(): Promise<AutomatedPostOutput> {
  return runAutomatedWeeklyPostFlow();
}

const runAutomatedWeeklyPostFlow = ai.defineFlow(
  {
    name: 'runAutomatedWeeklyPostFlow',
    outputSchema: AutomatedPostOutputSchema,
  },
  async () => {
    try {
      // 1. Select a random topic
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      console.log(`Generating post for topic: ${randomTopic}`);

      // 2. Generate the blog post content using the existing flow
      const generatedPost = await generateBlogPost({ topic: randomTopic });

      if (!generatedPost) {
        throw new Error('Failed to generate blog post content.');
      }

      // 3. Save the generated post to Firestore as a draft
      const newPostData = {
        ...generatedPost,
        author: 'PDSCC Automated Writer',
        date: format(new Date(), 'MMMM dd, yyyy'),
        image: 'https://placehold.co/800x400.png', // Default placeholder
        status: 'Draft' as const,
      };

      const newPostId = await createBlogPost(newPostData);

      console.log(`Successfully created draft post with ID: ${newPostId}`);

      return {
        success: true,
        message: 'Successfully generated and saved a new draft post.',
        postId: newPostId,
        postTitle: generatedPost.title,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred.';
      console.error('Automated post generation failed:', errorMessage);
      return {
        success: false,
        message: `Automated post generation failed: ${errorMessage}`,
      };
    }
  }
);
