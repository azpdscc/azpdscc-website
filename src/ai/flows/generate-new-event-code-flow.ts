
'use server';
/**
 * @fileOverview An AI flow to generate the code for a new event and update the events data file.
 *
 * - generateNewEventCode: Takes new event details and a list of existing events, then generates
 *   the complete, updated `data.ts` file content.
 * - GenerateNewEventCodeInput: The input type for the flow.
 * - GenerateNewEventCodeOutput: The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Event } from '@/lib/types';
import { format } from 'date-fns';

const createSlug = (name: string) => {
    return name
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}

const NewEventSchema = z.object({
    name: z.string(),
    date: z.string(),
    time: z.string(),
    locationName: z.string(),
    locationAddress: z.string(),
    image: z.string().url(),
    category: z.enum(['Cultural', 'Food', 'Music', 'Dance']),
    description: z.string(),
    fullDescription: z.string(),
});

const GenerateNewEventCodeInputSchema = z.object({
  newEvent: NewEventSchema,
  existingEvents: z.array(z.any()).describe("An array of existing event objects to be preserved."),
});
export type GenerateNewEventCodeInput = z.infer<typeof GenerateNewEventCodeInputSchema>;

const GenerateNewEventCodeOutputSchema = z.object({
  fileContent: z.string().describe("The complete and final code for the `src/lib/data.ts` file as a single string, including imports, types, and the full events array with the new event added."),
  socialPosts: z.string().describe("A set of 3 engaging social media posts (for Facebook, Instagram, and Twitter) to announce the new event, including relevant hashtags like #PhoenixIndianCommunity, #AZIndia, #AZPDSCC, and event-specific tags."),
});
export type GenerateNewEventCodeOutput = z.infer<typeof GenerateNewEventCodeOutputSchema>;


export async function generateNewEventCode(
  input: GenerateNewEventCodeInput
): Promise<GenerateNewEventCodeOutput> {
  // Manually add the new event to the list before sending to the AI
  const newEventWithIdAndSlug: Event = {
      ...input.newEvent,
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Generate a unique-enough ID
      slug: createSlug(input.newEvent.name),
  };

  // Combine new event with existing ones, placing the new one at the top.
  const allEvents = [newEventWithIdAndSlug, ...input.existingEvents];

  // Pass the full, combined list to the AI prompt
  return generateNewEventCodeFlow({ allEvents });
}

const prompt = ai.definePrompt({
    name: 'generateEventFilePrompt',
    input: { schema: z.object({ allEvents: z.array(z.any()) }) },
    output: { schema: GenerateNewEventCodeOutputSchema },
    prompt: `
      You are an expert web developer and social media manager for a community organization (PDSCC).
      Your task is to generate two things based on a list of event objects:
      1. The complete file content for a TypeScript file located at \`src/lib/data.ts\`.
      2. A series of social media posts to announce the newest event.

      The list of events provided is the complete and final list. The newest event is the first one in the array.

      **TASK 1: Generate \`data.ts\` File Content**
      - The file must start with the necessary type imports: \`import type { Event, TeamMember } from './types';\`
      - It must define and export a constant named \`events\` of type \`Event[]\`.
      - This \`events\` array must contain ALL the event objects provided in the input, in the exact same order.
      - Ensure all string values within the objects are properly escaped for a TypeScript file. Use double quotes for all keys and string values.
      - Each event object MUST include all fields: id, slug, name, date, time, locationName, locationAddress, image, description, fullDescription, category.
      - After the events array, include an empty exported array for team members: \`export const teamMembers: TeamMember[] = [];\`
      - The final output must be a single, clean string of the entire file's content, ready to be saved.

      **TASK 2: Generate Social Media Posts**
      - Identify the newest event (it's the first one in the provided array).
      - Write 3 distinct, engaging social media posts for it: one for Facebook, one for Instagram, and one for Twitter/X.
      - The tone should be exciting and community-focused.
      - Include relevant details like the event name, date, and a call to action (e.g., "Find out more on our website!").
      - Use relevant hashtags: #AZPDSCC #PhoenixIndianCommunity #AZIndia #[EventCategory] #[EventName] (e.g., #Diwali #CulturalFestival).

      **Provided Events Data:**
      \`\`\`json
      {{{json allEvents}}}
      \`\`\`

      Return the final output in the requested JSON format.
    `,
});

// The main Genkit flow
const generateNewEventCodeFlow = ai.defineFlow(
  {
    name: 'generateNewEventCodeFlow',
    inputSchema: z.object({ allEvents: z.array(z.any()) }),
    outputSchema: GenerateNewEventCodeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate event code.');
    }
    return output;
  }
);
