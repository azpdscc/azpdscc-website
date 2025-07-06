'use server';
/**
 * @fileOverview An AI flow to generate social media posts for a new event.
 *
 * - generateSocialPosts: Takes event details and returns tailored social media content.
 * - GenerateSocialPostsInput: The input type for the flow.
 * - GenerateSocialPostsOutput: The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateSocialPostsInputSchema = z.object({
  name: z.string().describe('The name of the event.'),
  description: z.string().describe('The short description of the event.'),
  date: z.string().describe('The date of the event (e.g., "April 19, 2025").'),
  slug: z.string().describe('The URL slug for the event page.'),
});
export type GenerateSocialPostsInput = z.infer<
  typeof GenerateSocialPostsInputSchema
>;

const GenerateSocialPostsOutputSchema = z.object({
  twitterPost: z
    .string()
    .describe('A tweet for the event. Max 280 chars. Must include relevant hashtags and the event link.'),
  facebookPost: z
    .string()
    .describe('A Facebook/Instagram post for the event. More descriptive. Must include relevant hashtags and the event link.'),
});
export type GenerateSocialPostsOutput = z.infer<
  typeof GenerateSocialPostsOutputSchema
>;

export async function generateSocialPosts(
  input: GenerateSocialPostsInput
): Promise<GenerateSocialPostsOutput> {
  const { output } = await generateSocialPostsFlow(input);
  return output!;
}

const generateSocialPostsFlow = ai.defineFlow(
  {
    name: 'generateSocialPostsFlow',
    inputSchema: GenerateSocialPostsInputSchema,
    outputSchema: GenerateSocialPostsOutputSchema,
  },
  async (input) => {
    const eventUrl = `https://www.azpdscc.org/events/${input.slug}`;
    const { output } = await ai.generate({
      prompt: `
        You are a social media marketing expert for a community organization called PDSCC, which serves the Phoenix Indian community.
        Your task is to generate exciting and engaging social media posts to announce a new event.

        Event Details:
        - Name: {{{name}}}
        - Date: {{{date}}}
        - Description: {{{description}}}
        - Link: ${eventUrl}

        Generate two posts:
        1.  **Twitter Post:** Make it concise, under 280 characters. Use an energetic tone. Include the link and hashtags like #PDSCC #PhoenixIndianCommunity #ArizonaEvents #[EventName] (e.g., #Diwali).
        2.  **Facebook/Instagram Post:** Make it more descriptive and engaging. Use emojis to add visual appeal. Encourage interaction (e.g., "Tag a friend you want to go with!"). Include the event link and a similar set of hashtags.

        The tone should be celebratory, professional, and welcoming.
      `,
      output: {
        format: 'json',
        schema: GenerateSocialPostsOutputSchema,
      },
    });

    return output!;
  }
);
