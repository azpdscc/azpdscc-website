
'use server';
/**
 * @fileOverview A flow to handle a new email subscription and optional SMS opt-in.
 *
 * - sendWelcomeEmail: Processes a new subscriber, sends emails, and returns a status.
 * - WelcomeEmailInput: The input type for the flow.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Resend } from 'resend';
import { addSubscriber, isSubscribed } from '@/services/subscribers';

// Input schema for the welcome email flow, now including an optional name and phone fields.
const WelcomeEmailInputSchema = z.object({
  email: z.string().email().describe("The new subscriber's email address."),
  name: z.string().optional().describe("The new subscriber's first name, if provided."),
  phone: z.string().optional().describe("The new subscriber's phone number, if provided for SMS."),
  smsConsent: z.boolean().optional().describe("Whether the user agreed to receive SMS messages."),
});
export type WelcomeEmailInput = z.infer<typeof WelcomeEmailInputSchema>;

// Output schema for the flow
const WelcomeEmailOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type WelcomeEmailOutput = z.infer<typeof WelcomeEmailOutputSchema>;

/**
 * Public function to trigger the welcome email flow.
 * @param input The subscriber details.
 * @returns A promise that resolves to the flow's output.
 */
export async function sendWelcomeEmail(input: WelcomeEmailInput): Promise<WelcomeEmailOutput> {
  return sendWelcomeEmailFlow(input);
}

// AI prompt to generate a confirmation email, now personalized.
const welcomeEmailPrompt = ai.definePrompt({
  name: 'welcomeEmailPrompt',
  input: { schema: WelcomeEmailInputSchema },
  output: { format: 'text' },
  prompt: `
    Generate a warm and friendly welcome email body for a new subscriber to the PDSCC mailing list.
    The tone should be celebratory and inviting.
    
    {{#if name}}
    Start the email with a big, friendly "Welcome to the community, {{{name}}}!".
    {{else}}
    Start the email with a big, friendly "Welcome to the community!".
    {{/if}}

    Thank them for subscribing and let them know they'll now be the first to hear about upcoming festivals, events, and community news.
    Encourage them to connect on social media (without providing links).
    
    {{#if phone}}
    Also, thank them for providing their phone number and mention that they will receive their electronic raffle tickets via SMS for upcoming events.
    {{/if}}

    End with "Warmly," followed by "The PDSCC Team".
  `,
});

// The main Genkit flow
const sendWelcomeEmailFlow = ai.defineFlow(
  {
    name: 'sendWelcomeEmailFlow',
    inputSchema: WelcomeEmailInputSchema,
    outputSchema: WelcomeEmailOutputSchema,
  },
  async (input) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        console.error("Resend API key is not configured. Ensure RESEND_API_KEY is set in the server environment.");
        throw new Error("Server configuration error for sending emails.");
    }
    const resend = new Resend(resendApiKey);

    try {
      // 1. Check if the email is already subscribed
      const alreadySubscribed = await isSubscribed(input.email);
      if (alreadySubscribed) {
        return { success: true, message: "This email is already on our mailing list. Thank you!" };
      }

      // 2. Add the new subscriber to the database
      await addSubscriber({ email: input.email, name: input.name, phone: input.phone, smsConsent: input.smsConsent });

      // 3. Generate the welcome email body for the user
      const { output: welcomeEmailBody } = await welcomeEmailPrompt(input);
      if (!welcomeEmailBody) {
        throw new Error("AI welcome email generation failed.");
      }
      const welcomeEmailHtml = (welcomeEmailBody).replace(/\n/g, '<br>');

      // 4. Send the welcome email to the user
      await resend.emails.send({
        from: 'PDSCC Info <info@azpdscc.org>',
        to: input.email,
        subject: '🎉 Welcome to the PDSCC Community!',
        html: welcomeEmailHtml,
      });

      // 5. Send a notification email to the admin
      let adminEmailText = `A new user has subscribed to the newsletter:\n\nEmail: ${input.email}\nName: ${input.name || 'Not provided'}`;
      if (input.phone && input.smsConsent) {
        adminEmailText += `\n\nThis user also opted-in for SMS raffle tickets:\nPhone: ${input.phone}`;
      }
      
      await resend.emails.send({
        from: 'Newsletter Bot <noreply@azpdscc.org>',
        to: 'admin@azpdscc.org',
        subject: 'New Newsletter Subscriber',
        text: adminEmailText,
      });
     
      return { success: true, message: "Subscription successful! A welcome email has been sent." };
    } catch (error) {
      console.error('Welcome email flow failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      if (errorMessage.includes("Server configuration error")) {
          throw new Error("Server configuration error for sending emails.");
      }
      return { success: false, message: `An error occurred while subscribing: ${errorMessage}` };
    }
  }
);
