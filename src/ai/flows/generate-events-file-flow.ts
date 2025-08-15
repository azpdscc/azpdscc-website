
'use server';
/**
 * @fileOverview An AI flow to generate a JSON file of realistic past events.
 *
 * - generateEventsFile: Creates a JSON string with a list of past event objects.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

// No input schema needed for this flow

// Output schema for the flow, designed for structured JSON output
const GenerateEventsFileOutputSchema = z.object({
  fileContent: z
    .string()
    .describe(
      'A JSON string containing an object with a single key "events", which is an array of 6 realistic past event objects for PDSCC. Each event must have name, date (in "Month Day, YYYY" format, from 2022-2024), time, locationName, locationAddress, image (using https://placehold.co/600x400.png), description, fullDescription, and category (Cultural, Food, Music, or Dance).'
    ),
});
export type GenerateEventsFileOutput = z.infer<
  typeof GenerateEventsFileOutputSchema
>;

/**
 * Public function to trigger the event file generation flow.
 * @returns A promise that resolves to the generated JSON content.
 */
export async function generateEventsFile(): Promise<GenerateEventsFileOutput> {
  return generateEventsFileFlow();
}

// The main Genkit flow
const generateEventsFileFlow = ai.defineFlow(
  {
    name: 'generateEventsFileFlow',
    outputSchema: GenerateEventsFileOutputSchema,
  },
  async () => {
    const { output } = await ai.generate({
      prompt: `You are an expert event planner for a community organization (PDSCC) that serves the Phoenix Punjabi Indian community and AZ Desis. Your task is to generate a JSON data file containing a list of 6 realistic **past** events that the organization might have hosted between 2022 and 2024.

      Instructions:
      1.  Create an array of 6 unique event objects.
      2.  Each event object must have the following fields:
          - \`name\`: A realistic event name (e.g., "Diwali Festival of Lights 2023", "Vaisakhi Mela 2024", "Chand Raat Bazaar").
          - \`date\`: A date from the past (2022-2024) in the format "Month Day, YYYY" (e.g., "November 12, 2023").
          - \`time\`: A realistic time range (e.g., "5:00 PM - 10:00 PM").
          - \`locationName\`: A real, plausible location in the Phoenix metro area (e.g., "Goodyear Ballpark", "Rawhide Western Town").
          - \`locationAddress\`: The corresponding full address for the location.
          - \`image\`: Use the placeholder "https://placehold.co/600x400.png" for all events.
          - \`description\`: A short, one-sentence description (max 150 chars).
          - \`fullDescription\`: A longer, detailed paragraph (min 50 words).
          - \`category\`: One of 'Cultural', 'Food', 'Music', or 'Dance'.
      3.  The final output must be a single JSON string. This string should represent an object with ONE key, "events", whose value is the array of the 6 event objects you created.
      4.  Ensure the generated JSON is perfectly valid. Do not include any explanations or markdown formatting. Only output the raw JSON string.
      `,
      output: {
        format: 'json',
        schema: GenerateEventsFileOutputSchema,
      },
      config: {
        temperature: 0.8, // Allow for creativity in event names and descriptions
      },
    });

    if (!output) {
      throw new Error('AI failed to generate event file content.');
    }

    return output;
  }
);
