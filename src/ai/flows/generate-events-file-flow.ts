
'use server';
/**
 * @fileOverview An AI flow to generate the full content of the events data file.
 *
 * - generateEventsFile: Takes new event data and existing events, and returns the full TS file content.
 * - GenerateEventsFileInput: The input type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { events as existingEventsData, teamMembers } from '@/lib/data';
import type { Event } from '@/lib/types';

const GenerateEventsFileInputSchema = z.object({
  newEvent: z.any().describe('The new event object to add.'),
  existingEvents: z
    .string()
    .describe('A JSON string representing the array of existing event objects.'),
});
export type GenerateEventsFileInput = z.infer<
  typeof GenerateEventsFileInputSchema
>;

const EventsFileContentSchema = z.object({
  fileContent: z.string().describe('The entire, complete TypeScript code for the data.ts file.'),
});

// Helper function to manually generate the file content as a fallback
const generateFileContentManually = (newEvent: Event): string => {
  const highestId = existingEventsData.reduce((maxId, event) => Math.max(event.id, maxId), 0);
  const newEventWithId = { ...newEvent, id: highestId + 1 };

  const updatedEvents = [...existingEventsData, newEventWithId];
  
  const eventsString = JSON.stringify(updatedEvents, null, 2)
    // Remove quotes from keys to make it look like a JS object literal
    .replace(/"([^"]+)":/g, '$1:');

  const teamMembersString = JSON.stringify(teamMembers, null, 2)
    .replace(/"([^"]+)":/g, '$1:');

  return `
import type { Event, TeamMember } from './types';

export const events: Event[] = ${eventsString};

export const teamMembers: TeamMember[] = ${teamMembersString};
  `.trim();
};


export async function generateEventsFile(
  input: GenerateEventsFileInput
): Promise<string> {
  try {
    const { output } = await generateEventsFileFlow(input);
    if (output?.fileContent) {
      return output.fileContent;
    }
    // If AI fails or returns empty content, use the manual fallback
    console.warn("AI generation failed or returned empty. Using manual fallback.");
    return generateFileContentManually(input.newEvent);
  } catch (error) {
    console.error("Error in generateEventsFile flow, switching to manual fallback:", error);
    return generateFileContentManually(input.newEvent);
  }
}

const generateEventsFileFlow = ai.defineFlow(
  {
    name: 'generateEventsFileFlow',
    inputSchema: GenerateEventsFileInputSchema,
    outputSchema: EventsFileContentSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: `
        You are a TypeScript code generation assistant. Your task is to update an events data file.
        You will be given a JSON string of existing events and a new event object.
        Your goal is to add the new event to the list of existing events and generate the complete content for a TypeScript file named 'data.ts'.

        - The new event should be added to the end of the 'events' array.
        - The 'id' of the new event must be unique. Find the highest existing 'id' and add 1 to it for the new event's 'id'.
        - Ensure the final output is a single, valid TypeScript file string.
        - Do not include any explanations or markdown formatting. Only output the raw file content.
        - Preserve the 'teamMembers' export and its data.

        Here is the existing events data as a JSON string:
        \`\`\`json
        {{{existingEvents}}}
        \`\`\`

        Here is the new event to add:
        \`\`\`json
        {{{JSONstringify newEvent}}}
        \`\`\`
      `,
      context: {
        JSONstringify: (obj: any) => JSON.stringify(obj, null, 2),
      },
      config: {
        temperature: 0.3,
      },
      output: {
        format: 'json',
        schema: EventsFileContentSchema,
      },
    });

    if (!output || !output.fileContent) {
        throw new Error("AI failed to generate file content.");
    }

    return output;
  }
);
