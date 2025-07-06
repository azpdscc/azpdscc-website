'use server';
/**
 * @fileOverview An AI flow to generate the full content of the events data file.
 *
 * - generateEventsFile: Takes new event data and existing events, and returns the full TS file content.
 * - GenerateEventsFileInput: The input type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const GenerateEventsFileInputSchema = z.object({
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

export async function generateEventsFile(
  input: GenerateEventsFileInput
): Promise<string> {
  const { output } = await generateEventsFileFlow(input);
  return output?.fileContent || '';
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
        // Higher temperature to encourage creativity in description if needed, but the structure is rigid.
        temperature: 0.3,
      },
      output: {
        format: 'json',
        schema: EventsFileContentSchema,
      },
    });

    return output!;
  }
);
