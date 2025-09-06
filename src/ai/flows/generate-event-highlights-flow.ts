'use server';
/**
 * @fileOverview An AI flow to generate a unique list of event highlights.
 *
 * - generateEventHighlights: Takes an event name and description and returns a list of highlights.
 * - GenerateEventHighlightsInput: The input type for the flow.
 * - GenerateEventHighlightsOutput: The return type for the flow.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Input schema for the flow
const GenerateEventHighlightsInputSchema = z.object({
  eventName: z.string().describe('The name of the event.'),
  eventDescription: z
    .string()
    .describe('The detailed description of the event.'),
});
export type GenerateEventHighlightsInput = z.infer<
  typeof GenerateEventHighlightsInputSchema
>;

// Output schema for the flow, designed for structured JSON output
const GenerateEventHighlightsOutputSchema = z.object({
  highlights: z
    .array(z.string())
    .describe(
      'An array of 3-4 unique, exciting, and concise bullet points that highlight the key attractions of the event. Each highlight should be a short phrase.'
    ),
});
export type GenerateEventHighlightsOutput = z.infer<
  typeof GenerateEventHighlightsOutputSchema
>;

/**
 * Public function to trigger the highlight generation flow.
 * @param input The event name and description.
 * @returns A promise that resolves to the generated highlights.
 */
export async function generateEventHighlights(
  input: GenerateEventHighlightsInput
): Promise<GenerateEventHighlightsOutput> {
  return generateEventHighlightsFlow(input);
}

// The main Genkit flow
const generateEventHighlightsFlow = ai.defineFlow(
  {
    name: 'generateEventHighlightsFlow',
    inputSchema: GenerateEventHighlightsInputSchema,
    outputSchema: GenerateEventHighlightsOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: `Based on the event name and description, generate a list of 3-4 unique and exciting highlights. These should be short, catchy phrases that would attract attendees.

Event Name: "${input.eventName}"
Event Description: "${input.eventDescription}"

Return the output as a JSON object with a single key "highlights" which is an array of strings.`,
      output: {
        format: 'json',
        schema: GenerateEventHighlightsOutputSchema,
      },
      config: {
        temperature: 0.7,
      },
    });

    if (!output) {
      throw new Error('AI failed to generate event highlights.');
    }

    return output;
  }
);
