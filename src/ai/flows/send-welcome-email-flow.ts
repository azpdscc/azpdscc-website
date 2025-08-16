
'use server';
/**
 * @fileOverview A flow to handle a new email subscription.
 *
 * - sendWelcomeEmail: Processes a new subscriber, sends a welcome email, and returns a status.
 * - WelcomeEmailInput: The input type for the flow.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Resend } from 'resend';
import { addSubscriber, isSubscribed } from '@/services/subscribers';

// Input schema for the welcome email flow
const WelcomeEmailInputSchema = z.object({
  email: z.string().email().describe("The new subscriber's email address."),
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

// AI prompt to generate a confirmation email
const welcomeEmailPrompt = ai.definePrompt({
  name: 'welcomeEmailPrompt',
  output: { format: 'text' },
  prompt: `
    Generate a warm and friendly welcome email body for a new subscriber to the PDSCC mailing list.
    The tone should be celebratory and inviting.

    Start the email with a big, friendly "Welcome to the community!".
    Thank them for subscribing and let them know they'll now be the first to hear about upcoming festivals, events, and community news.
    Encourage them to connect on social media (without providing links).
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
        console.error("Resend API key is not configured. Ensure RESEND_API_KEY is set in your environment.");
        return { success: false, message: "Server configuration error. Please contact support." };
    }

    try {
      // 1. Check if the user is already subscribed
      const alreadySubscribed = await isSubscribed(input.email);
      if (alreadySubscribed) {
        return { success: true, message: "This email is already subscribed. Thank you!" };
      }

      // 2. Add the new subscriber to the database
      await addSubscriber(input.email);
      
      const resend = new Resend(resendApiKey);

      // 3. Generate the welcome email body for the user
      const { output: welcomeEmailBody } = await welcomeEmailPrompt({});
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
      await resend.emails.send({
        from: 'Newsletter Bot <noreply@azpdscc.org>',
        to: 'admin@azpdscc.org',
        subject: 'New Newsletter Subscriber',
        text: `A new user has subscribed to the newsletter:\n\nEmail: ${input.email}`,
      });
     
      return { success: true, message: "Subscription successful! A welcome email has been sent." };
    } catch (error) {
      console.error('Welcome email flow failed:', error);
      return { success: false, message: 'An error occurred while subscribing.' };
    }
  }
);
