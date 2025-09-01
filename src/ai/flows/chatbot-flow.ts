
'use server';
/**
 * @fileOverview An AI flow for a general-purpose website chatbot.
 *
 * - chat: Takes a history of messages and generates the next response.
 */
import { ai } from '@/ai/genkit';
import { type ChatInput, type ChatOutput } from '@/ai/schemas/chatbot-schema';
import { getEvents } from '@/services/events';
import { z } from 'zod';

/**
 * A tool that allows the AI to look up details for upcoming events.
 */
const getEventDetailsTool = ai.defineTool(
  {
    name: 'getEventDetails',
    description: 'Get details for a specific upcoming PDSCC event, like Vaisakhi Mela or Teeyan Da Mela. Use this to find the date, time, and location of an event.',
    inputSchema: z.object({
      eventName: z.string().describe('The name of the event to search for, like "Vaisakhi" or "Teeyan".'),
    }),
    outputSchema: z.object({
        name: z.string(),
        date: z.string(),
        time: z.string(),
    }).or(z.string()), // Can return a string if not found
  },
  async ({ eventName }) => {
      const allEvents = await getEvents();
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const upcomingEvents = allEvents
        .filter(e => new Date(e.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const foundEvent = upcomingEvents.find(e => e.name.toLowerCase().includes(eventName.toLowerCase()));

      if (foundEvent) {
          return {
              name: foundEvent.name,
              date: foundEvent.date,
              time: foundEvent.time,
          };
      }

      return `No upcoming event found matching the name "${eventName}". Advise the user to check the Events page for all upcoming events.`;
  }
);


/**
 * Public function to trigger the chatbot flow.
 * @param input The chat history.
 * @returns A promise that resolves to the AI's next message.
 */
export async function chat(input: ChatInput): Promise<ChatOutput> {
  const llmResponse = await ai.generate({
    prompt: `You are a friendly and helpful assistant for the PDSCC (Phoenix Desi Sports and Cultural Club) website.
      Your goal is to answer user questions based on the general knowledge of a non-profit community organization that runs events like Vaisakhi Mela and Teeyan Da Mela, offers vendor booths, performance slots, and sponsorships.

      **If a user asks for the date, time, or location of a specific event, you MUST use the getEventDetails tool to find the information.**
      
      Keep your answers concise and to the point.

      - If you don't know the answer after checking your tools, say "I'm not sure about that. For specific questions, it's best to contact the PDSCC team directly."
      - Gently guide users towards the main pages of the website if their question is general. For example, if they ask about events, mention they can see all the details on the Events page.
      - Do not make up event dates or specific details. Refer them to the respective pages or the contact form.`,
    history: input.history,
    tools: [getEventDetailsTool],
    output: {
      format: 'text',
    },
    config: {
      temperature: 0.3,
    },
  });

  return llmResponse.text;
}
