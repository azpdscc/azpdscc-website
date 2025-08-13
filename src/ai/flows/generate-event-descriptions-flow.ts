
'use server';
/**
 * @fileOverview An AI flow to generate compelling event descriptions.
 *
 * - generateEventDescriptions: Takes a prompt about an event and generates short and full descriptions.
 * - GenerateEventDescriptionsInput: The input type for the flow.
 * - GenerateEventDescriptionsOutput: The return type for the flow.
 */
import 'dotenv/config';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Input schema for the flow
const GenerateEventDescriptionsInputSchema = z.object({
  prompt: z.string().describe("A simple prompt or name for the event."),
});
export type GenerateEventDescriptionsInput = z.infer<
  typeof GenerateEventDescriptionsInputSchema
>;

// Output schema for the flow, designed for structured JSON output
const GenerateEventDescriptionsOutputSchema = z.object({
  description: z.string().describe("A concise, engaging one-sentence description suitable for an event card. Max 150 characters."),
  fullDescription: z.string().describe("A detailed, appealing paragraph describing the event for its main page. This should be inviting and informative, highlighting the key experiences for attendees. Min 50 words."),
});
export type GenerateEventDescriptionsOutput = z.infer<
  typeof GenerateEventDescriptionsOutputSchema
>;

/**
 * Public function to trigger the description generation flow.
 * @param input The prompt for the event.
 * @returns A promise that resolves to the generated descriptions.
 */
export async function generateEventDescriptions(
  input: GenerateEventDescriptionsInput
): Promise<GenerateEventDescriptionsOutput> {
  return generateEventDescriptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEventDescriptionPrompt',
  input: { schema: GenerateEventDescriptionsInputSchema },
  output: { schema: GenerateEventDescriptionsOutputSchema },
  prompt: `You are an expert event marketer for a community organization (PDSCC). Your task is to write compelling descriptions for an event based on its name.

      The tone should be vibrant, welcoming, and community-focused. The descriptions should appeal to the Phoenix Punjabi Indian community and AZ Desis.

      Event Name: "{{{prompt}}}"

      Generate two descriptions:
      1.  A short, catchy description for an event listing card (max 150 characters).
      2.  A full, detailed description for the event's dedicated page (at least 50 words), elaborating on the activities, atmosphere, and what makes the event special. You can invent plausible activities based on the event name (e.g., fireworks for Diwali, Bhangra for Vaisakhi).

      Return the output in the requested JSON format.`,
});


// The main Genkit flow
const generateEventDescriptionsFlow = ai.defineFlow(
  {
    name: 'generateEventDescriptionsFlow',
    inputSchema: GenerateEventDescriptionsInputSchema,
    outputSchema: GenerateEventDescriptionsOutputSchema,
  },
  async (input) => {
    
    const { output } = await prompt(input);

    if (!output) {
      throw new Error('AI failed to generate descriptions.');
    }

    return output;
  }
);
