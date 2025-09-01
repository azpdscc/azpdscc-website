
'use server';
/**
 * @fileOverview An AI flow for a general-purpose website chatbot.
 *
 * - chat: Takes a history of messages and generates the next response.
 */
import { ai } from '@/ai/genkit';
import type { ChatInput, ChatOutput } from '@/ai/schemas/chatbot-schema';
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
    system: `You are an AI assistant for the PDSCC website.
      - Your goal is to answer user questions about PDSCC events, vendors, performances, and sponsorships.
      - If a user asks for the date, time, or location of an event, you must use the getEventDetails tool.
      - For vendor setup times, inform them to arrive 2 hours before the event start time.
      - For vendor canopy questions, direct them to the 'Vendors' page for booth options.
      - For performance application status, tell them the cultural team will contact them after review and direct them to the 'Perform' page.
      - If you do not know an answer, say "I'm not sure about that. For specific questions, it's best to contact the PDSCC team directly."
      - Keep answers concise.`,
    prompt: input.history,
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
