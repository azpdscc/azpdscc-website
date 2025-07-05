'use server';
/**
 * @fileOverview Provides a smart booth placement suggestion to vendors based on their selected booth type and product offering.
 *
 * - suggestBoothPlacement - A function that suggests an ideal booth placement.
 * - BoothPlacementInput - The input type for the suggestBoothPlacement function.
 * - BoothPlacementOutput - The return type for the suggestBoothPlacement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BoothPlacementInputSchema = z.object({
  boothType: z.string().describe('The type of booth selected by the vendor (e.g., 10x10, Food Stall).'),
  productDescription: z.string().describe('A description of the products or services the vendor will offer.'),
  event: z.string().optional().describe('The name of the event for which the booth is being requested.'),
});
export type BoothPlacementInput = z.infer<typeof BoothPlacementInputSchema>;

const BoothPlacementOutputSchema = z.object({
  suggestedLocation: z.string().describe('The suggested booth location within the event venue.'),
  reasoning: z.string().describe('The reasoning behind the suggested location.'),
});
export type BoothPlacementOutput = z.infer<typeof BoothPlacementOutputSchema>;

export async function suggestBoothPlacement(input: BoothPlacementInput): Promise<BoothPlacementOutput> {
  return suggestBoothPlacementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'boothPlacementPrompt',
  input: {schema: BoothPlacementInputSchema},
  output: {schema: BoothPlacementOutputSchema},
  prompt: `You are an expert event planner specializing in vendor booth placement. Given the following information about a vendor's booth, suggest an ideal location within the event venue and explain your reasoning.\n\nBooth Type: {{{boothType}}}\nProduct Description: {{{productDescription}}}\nEvent: {{{event}}}\n\nSuggest an ideal booth location and explain why it is a good fit, considering factors such as foot traffic, proximity to related vendors, and the overall event layout.`,
});

const suggestBoothPlacementFlow = ai.defineFlow(
  {
    name: 'suggestBoothPlacementFlow',
    inputSchema: BoothPlacementInputSchema,
    outputSchema: BoothPlacementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
