
'use server';
/**
 * @fileOverview An AI flow to calculate the dates of variable holidays for a given year.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Schema for a single holiday object in the output
const HolidaySchema = z.object({
  name: z.string().describe("The official name of the holiday."),
  month: z.number().int().min(1).max(12).describe("The month of the holiday (1-12)."),
  day: z.number().int().min(1).max(31).describe("The day of the month for the holiday."),
});

// Input schema for the flow
const CalculateHolidaysInputSchema = z.object({
  year: z.number().int().describe('The year for which to calculate holiday dates.'),
});
export type CalculateHolidaysInput = z.infer<typeof CalculateHolidaysInputSchema>;

// Output schema for the flow, which is an array of holiday objects
const CalculateHolidaysOutputSchema = z.object({
  holidays: z.array(HolidaySchema).describe("An array of calculated holiday objects for the given year."),
});
export type CalculateHolidaysOutput = z.infer<typeof CalculateHolidaysOutputSchema>;


/**
 * Public function to trigger the holiday calculation flow.
 * @param input The year for which to calculate dates.
 * @returns A promise that resolves to the array of calculated holidays.
 */
export async function calculateHolidaysForYear(
  input: CalculateHolidaysInput
): Promise<CalculateHolidaysOutput> {
  return calculateHolidaysFlow(input);
}


// Define the prompt for the AI.
const holidayPrompt = ai.definePrompt({
  name: 'holidayCalculationPrompt',
  input: { schema: CalculateHolidaysInputSchema },
  output: { schema: CalculateHolidaysOutputSchema },
  prompt: `You are an expert on global and cultural calendars. Your task is to calculate the precise dates for a specific list of variable-date holidays for the year {{{year}}}.

The holidays to calculate are:
- Martin Luther King Jr. Day (USA)
- Presidents' Day (USA)
- Holi (Indian)
- Easter (Christian)
- Memorial Day (USA)
- Raksha Bandhan (Indian)
- Janmashtami (Indian)
- Labor Day (USA)
- Ganesh Chaturthi (Indian)
- Navratri (start date, Indian)
- Dussehra (Indian)
- Karva Chauth (Indian)
- Diwali (main day, Indian)
- Guru Nanak Jayanti (Indian)
- Thanksgiving (USA)

Return the output as a JSON object containing a single key "holidays", which is an array of objects. Each object must have "name", "month" (1-12), and "day" (1-31). Do not include any holidays not on this list.
`,
});

// The main Genkit flow
const calculateHolidaysFlow = ai.defineFlow(
  {
    name: 'calculateHolidaysFlow',
    inputSchema: CalculateHolidaysInputSchema,
    outputSchema: CalculateHolidaysOutputSchema,
  },
  async (input) => {
    const { output } = await holidayPrompt(input);

    if (!output) {
      throw new Error('AI failed to calculate holiday dates.');
    }

    return output;
  }
);
