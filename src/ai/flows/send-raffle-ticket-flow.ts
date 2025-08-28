
'use server';
/**
 * @fileOverview A flow to handle electronic raffle ticket registrations.
 *
 * - sendRaffleTicket: Processes a new registration and notifies admin.
 * - RaffleTicketInput: The input type for the flow.
 * - RaffleTicketOutput: The return type for the flow.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Resend } from 'resend';

// Input schema for the raffle ticket flow
const RaffleTicketInputSchema = z.object({
  name: z.string().describe("The name of the person registering."),
  phone: z.string().describe("The person's phone number."),
  smsConsent: z.boolean().describe("Whether the user agreed to receive SMS messages."),
});
export type RaffleTicketInput = z.infer<typeof RaffleTicketInputSchema>;

// Output schema for the flow
const RaffleTicketOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type RaffleTicketOutput = z.infer<typeof RaffleTicketOutputSchema>;

/**
 * Public function to trigger the raffle ticket flow.
 * @param input The registration details.
 * @returns A promise that resolves to the flow's output.
 */
export async function sendRaffleTicket(input: RaffleTicketInput): Promise<RaffleTicketOutput> {
  return sendRaffleTicketFlow(input);
}


// The main Genkit flow
const sendRaffleTicketFlow = ai.defineFlow(
  {
    name: 'sendRaffleTicketFlow',
    inputSchema: RaffleTicketInputSchema,
    outputSchema: RaffleTicketOutputSchema,
  },
  async (input) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        console.error("Resend API key is not configured. Ensure RESEND_API_KEY is set in the server environment.");
        throw new Error("Server configuration error for sending emails.");
    }
    const resend = new Resend(resendApiKey);

    try {
      // For now, we will just send an email to the admin.
      // In a real implementation, this would trigger an SMS service.
      const adminEmailText = `
        A new user has registered for an electronic raffle ticket.

        Name: ${input.name}
        Phone: ${input.phone}
        SMS Consent: ${input.smsConsent ? 'Yes' : 'No'}

        Action Required: Please process this registration in the Honest Raffles system.
      `;

      await resend.emails.send({
        from: 'Raffle Bot <noreply@azpdscc.org>',
        to: 'admin@azpdscc.org', // Admin's email for raffle notifications
        subject: `New Raffle Registration: ${input.name}`,
        text: adminEmailText,
      });
     
      return { success: true, message: "Thank you! Your raffle ticket information will be sent to your phone shortly." };
    } catch (error) {
      console.error('Raffle ticket flow failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("Server configuration error")) {
          throw new Error("Server configuration error for sending emails.");
      }
      return { success: false, message: 'An error occurred while sending your registration.' };
    }
  }
);
