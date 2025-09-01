'use server';
/**
 * @fileOverview An AI flow for a general-purpose website chatbot.
 *
 * - chat: Takes a history of messages and generates the next response.
 */
import { ai } from '@/ai/genkit';
import { type ChatInput, type ChatOutput } from '@/ai/schemas/chatbot-schema';

/**
 * Public function to trigger the chatbot flow.
 * @param input The chat history.
 * @returns A promise that resolves to the AI's next message.
 */
export async function chat(input: ChatInput): Promise<ChatOutput> {
  const llmResponse = await ai.generate({
    prompt: `You are a friendly and helpful assistant for the PDSCC (Phoenix Desi Sports and Cultural Club) website.
      Your goal is to answer user questions based on the general knowledge of a non-profit community organization that runs events like Vaisakhi Mela and Teeyan Da Mela, offers vendor booths, performance slots, and sponsorships.

      Keep your answers concise and to the point.

      - If you don't know the answer, say "I'm not sure about that. For specific questions, it's best to contact the PDSCC team directly."
      - Gently guide users towards the main pages of the website if their question is general. For example, if they ask about events, mention they can see all the details on the Events page.
      - Do not make up event dates or specific details. Refer them to the respective pages or the contact form.`,
    history: input.history,
    output: {
      format: 'text',
    },
    config: {
      temperature: 0.5,
    },
  });

  return llmResponse.text;
}
