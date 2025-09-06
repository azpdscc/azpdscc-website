
'use server';
/**
 * @fileOverview A flow to handle contact form inquiries.
 *
 * - sendContactInquiry: Processes a new inquiry, sends emails, and returns a status.
 * - ContactInquiryInput: The input type for the flow.
 * - ContactInquiryOutput: The return type for the flow.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Resend } from 'resend';

// Input schema for the contact inquiry flow
const ContactInquiryInputSchema = z.object({
  name: z.string().describe("The name of the person making the inquiry."),
  email: z.string().email().describe("The email address of the person."),
  subject: z.string().describe("The subject of the inquiry."),
  message: z.string().describe("The content of the message."),
});
export type ContactInquiryInput = z.infer<typeof ContactInquiryInputSchema>;

// Output schema for the flow
const ContactInquiryOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type ContactInquiryOutput = z.infer<typeof ContactInquiryOutputSchema>;

/**
 * Public function to trigger the contact inquiry flow.
 * @param input The inquiry details.
 * @returns A promise that resolves to the flow's output.
 */
export async function sendContactInquiry(input: ContactInquiryInput): Promise<ContactInquiryOutput> {
  return sendContactInquiryFlow(input);
}

// AI prompt to generate a confirmation auto-reply
const confirmationEmailPrompt = ai.definePrompt({
  name: 'contactConfirmationEmailPrompt',
  input: { schema: z.object({ name: z.string() }) },
  output: { format: 'text' },
  prompt: `
    Generate a simple, polite confirmation email body for a user who has just submitted a contact form to PDSCC.
    The tone should be professional and reassuring.

    Details:
    - User's Name: {{{name}}}

    Start the email with "Dear {{{name}}},".
    Thank them for contacting PDSCC.
    Let them know that their message has been received and that the team will review it and get back to them as soon as possible.
    End with a warm closing like "Sincerely," followed by "The PDSCC Team".
  `,
});

// The main Genkit flow
const sendContactInquiryFlow = ai.defineFlow(
  {
    name: 'sendContactInquiryFlow',
    inputSchema: ContactInquiryInputSchema,
    outputSchema: ContactInquiryOutputSchema,
  },
  async (input) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        console.error("Resend API key is not configured.");
        return { success: false, message: "The email service is not configured. Please contact the administrator." };
    }
    const resend = new Resend(resendApiKey);
    
    try {
      // 1. Generate the confirmation email for the user
      const { output: userEmailBody } = await confirmationEmailPrompt({ name: input.name });
      if (!userEmailBody) {
        // Fallback in case AI fails
        console.warn("AI confirmation email generation failed. Using fallback text.");
      }
      const userEmailHtml = (userEmailBody || `Dear ${input.name},\n\nThank you for contacting PDSCC. We have received your message and will get back to you shortly.\n\nSincerely,\nThe PDSCC Team`).replace(/\n/g, '<br>');

      // 2. Prepare the notification email for the admin
      const adminEmailText = `
        You have a new contact form submission from the PDSCC website.

        From: ${input.name} (${input.email})
        Subject: ${input.subject}
        Message: ${input.message}
      `;

      // 3. Send both emails
      // Send to user
      await resend.emails.send({
        from: 'PDSCC Info <info@azpdscc.org>',
        to: input.email,
        subject: "We've Received Your Message | PDSCC",
        html: userEmailHtml,
      });

      // Send to admin
      await resend.emails.send({
        from: 'Contact Form Bot <noreply@azpdscc.org>',
        to: 'admin@azpdscc.org', // Admin's email address
        subject: `New Inquiry: ${input.subject}`,
        text: adminEmailText,
      });
     
      return { success: true, message: "Thank you for your message! A confirmation has been sent to your email." };
    } catch (error) {
      console.error('Contact inquiry flow failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while sending your message.';
      return { success: false, message: errorMessage };
    }
  }
);
