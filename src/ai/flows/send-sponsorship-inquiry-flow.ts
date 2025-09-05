
'use server';
/**
 * @fileOverview A flow to handle sponsorship inquiries.
 *
 * - sendSponsorshipInquiry: Processes a new inquiry and sends notifications.
 * - SponsorshipInquiryInput: The input type for the flow.
 * - SponsorshipInquiryOutput: The return type for the flow.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { sendEmail } from '@/services/email';

// Input schema for the sponsorship inquiry flow
const SponsorshipInquiryInputSchema = z.object({
  companyName: z.string().describe("The name of the potential sponsor's company."),
  contactName: z.string().describe("The name of the contact person."),
  email: z.string().email().describe("The contact person's email address."),
  phone: z.string().describe("The contact person's phone number."),
  sponsorshipLevel: z.string().describe("The sponsorship level they are interested in."),
  message: z.string().optional().describe("An optional message from the potential sponsor."),
  smsConsent: z.boolean().describe("Whether the user agreed to receive SMS messages."),
});
export type SponsorshipInquiryInput = z.infer<typeof SponsorshipInquiryInputSchema>;

// Output schema for the flow
const SponsorshipInquiryOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type SponsorshipInquiryOutput = z.infer<typeof SponsorshipInquiryOutputSchema>;

/**
 * Public function to trigger the sponsorship inquiry flow.
 * @param input The inquiry details.
 * @returns A promise that resolves to the flow's output.
 */
export async function sendSponsorshipInquiry(input: SponsorshipInquiryInput): Promise<SponsorshipInquiryOutput> {
  return sendSponsorshipInquiryFlow(input);
}

// AI prompt to generate a confirmation email for the potential sponsor
const confirmationEmailPrompt = ai.definePrompt({
  name: 'sponsorshipConfirmationEmailPrompt',
  input: { schema: z.object({
    contactName: z.string(),
    sponsorshipLevel: z.string(),
  })},
  output: { format: 'text' },
  prompt: `
    Generate a polite and professional confirmation email body for a company that has expressed interest in sponsoring PDSCC.
    The tone should be appreciative and set clear expectations for the next steps.

    Details:
    - Contact Name: {{{contactName}}}
    - Level of Interest: {{{sponsorshipLevel}}}

    Start the email with "Dear {{{contactName}}},".
    Thank them for their interest in sponsoring PDSCC at the {{{sponsorshipLevel}}} level.
    Let them know their inquiry has been received and our partnership team will review their message and get back to them within 2-3 business days to discuss the opportunity further.
    End with a warm closing like "Sincerely," followed by "The PDSCC Partnership Team".
  `,
});

// The main Genkit flow
const sendSponsorshipInquiryFlow = ai.defineFlow(
  {
    name: 'sendSponsorshipInquiryFlow',
    inputSchema: SponsorshipInquiryInputSchema,
    outputSchema: SponsorshipInquiryOutputSchema,
  },
  async (input) => {
    try {
      // 1. Generate the confirmation email for the potential sponsor
      const { output: sponsorEmailBody } = await confirmationEmailPrompt({
          contactName: input.contactName,
          sponsorshipLevel: input.sponsorshipLevel,
      });
      if (!sponsorEmailBody) {
        throw new Error('Failed to generate confirmation email.');
      }
      const sponsorEmailHtml = sponsorEmailBody.replace(/\n/g, '<br>');

      // 2. Prepare the notification email for the admin
      const adminEmailText = `
        A new sponsorship inquiry has been received from the PDSCC website.

        Company Details:
        - Company Name: ${input.companyName}
        - Contact Name: ${input.contactName}
        - Email: ${input.email}
        - Phone: ${input.phone}
        - SMS Consent: ${input.smsConsent ? 'Yes' : 'No'}

        Inquiry Details:
        - Sponsorship Level of Interest: ${input.sponsorshipLevel}
        - Message: ${input.message || 'No message provided.'}

        Action Required: Please follow up with this lead within 2-3 business days.
      `;

      // 3. Send the emails
      // Send to potential sponsor
      await sendEmail({
        from: 'PDSCC Partnerships <info@azpdscc.org>',
        to: input.email,
        subject: 'Thank You for Your Interest in Sponsoring PDSCC!',
        html: sponsorEmailHtml,
      });

      // Send to admin
      await sendEmail({
        from: 'Sponsorship Bot <noreply@azpdscc.org>',
        to: 'admin@azpdscc.org', // Admin's email for sponsorship leads
        subject: `New Sponsorship Inquiry: ${input.companyName} (${input.sponsorshipLevel})`,
        text: adminEmailText,
      });
     
      return { success: true, message: "Thank you for your interest! A confirmation has been sent to your email." };
    } catch (error) {
      console.error('Sponsorship inquiry flow failed:', error);
       const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during your inquiry.';
      return { success: false, message: errorMessage };
    }
  }
);
