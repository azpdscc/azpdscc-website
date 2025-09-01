/**
 * @fileOverview Schemas and types for the website chatbot.
 */
import { z } from 'zod';

// Input schema for the flow
export const ChatInputSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.string(),
    })
  ),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

// Output schema for the flow
export const ChatOutputSchema = z.string();
export type ChatOutput = z.infer<typeof ChatOutputSchema>;
