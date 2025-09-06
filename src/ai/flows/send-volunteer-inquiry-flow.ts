
'use server';
/**
 * @fileOverview A flow to handle volunteer sign-ups.
 *
 * - sendVolunteerInquiry: Processes a new volunteer inquiry, sends emails, and returns a status.
 * - VolunteerInquiryInput: The input type for the flow.
 * - VolunteerInquiryOutput: The return type for the flow.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Resend } from 'resend';

// Input schema for the volunteer inquiry flow
const VolunteerInquiryInputSchema = z.object({
  name: z.string().describe("The name of the person volunteering."),
  email: z.string().email().describe("The email address of the volunteer."),
  phone: z.string().optional().describe("The volunteer's phone number."),
  interests: z.array(z.string()).describe("The areas the volunteer is interested in."),
  message: z.string().optional().describe("An optional message from the volunteer."),
  smsConsent: z.boolean().describe("Whether the user agreed to receive SMS messages."),
});
export type VolunteerInquiryInput = z.infer<typeof VolunteerInquiryInputSchema>;

// Output schema for the flow
const VolunteerInquiryOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type VolunteerInquiryOutput = z.infer<typeof VolunteerInquiryOutputSchema>;

/**
 * Public function to trigger the volunteer inquiry flow.
 * @param input The inquiry details.
 * @returns A promise that resolves to the flow's output.
 */
export async function sendVolunteerInquiry(input: VolunteerInquiryInput): Promise<VolunteerInquiryOutput> {
  return sendVolunteerInquiryFlow(input);
}

// AI prompt to generate a confirmation auto-reply
const confirmationEmailPrompt = ai.definePrompt({
  name: 'volunteerConfirmationEmailPrompt',
  input: { schema: z.object({ name: z.string() }) },
  output: { format: 'text' },
  prompt: `
    Generate a simple, polite confirmation email body for a user who has just signed up to volunteer with PDSCC.
    The tone should be warm, appreciative, and professional.

    Details:
    - User's Name: {{{name}}}

    Start the email with "Dear {{{name}}},".
    Thank them for their interest in volunteering with PDSCC.
    Let them know that their submission has been received and that the team will review it and get back to them soon with potential opportunities.
    End with a warm closing like "Sincerely," followed by "The PDSCC Team".
  `,
});

// The main Genkit flow
const sendVolunteerInquiryFlow = ai.defineFlow(
  {
    name: 'sendVolunteerInquiryFlow',
    inputSchema: VolunteerInquiryInputSchema,
    outputSchema: VolunteerInquiryOutputSchema,
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
      const userEmailHtml = (userEmailBody || `Dear ${input.name},\n\nThank you for your interest in volunteering! We have received your submission and will be in touch soon.\n\nSincerely,\nThe PDSCC Team`).replace(/\n/g, '<br>');

      // 2. Prepare the notification email for the admin
      const adminEmailText = `
        You have a new volunteer sign-up from the PDSCC website.

        Name: ${input.name}
        Email: ${input.email}
        Phone: ${input.phone || 'Not provided'}
        SMS Consent: ${input.smsConsent ? 'Yes' : 'No'}
        
        Areas of Interest:
        - ${input.interests.join('\n- ')}

        Message: ${input.message || 'No message provided.'}
      `;

      // 3. Send both emails
      // Send to user
      await resend.emails.send({
        from: 'PDSCC Volunteers <info@azpdscc.org>',
        to: input.email,
        subject: 'Thank You for Your Interest in Volunteering! | PDSCC',
        html: userEmailHtml,
      });

      // Send to admin
      await resend.emails.send({
        from: 'Volunteer Form Bot <noreply@azpdscc.org>',
        to: 'admin@azpdscc.org', // Admin's email address for volunteer notifications
        subject: `New Volunteer Sign-Up: ${input.name}`,
        text: adminEmailText,
      });
     
      return { success: true, message: "Thank you for volunteering! A confirmation has been sent to your email." };
    } catch (error) {
      console.error('Volunteer inquiry flow failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while sending your message.';
      return { success: false, message: errorMessage };
    }
  }
);
