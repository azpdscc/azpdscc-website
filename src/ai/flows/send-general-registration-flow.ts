
'use server';
/**
 * @fileOverview A flow to handle general vendor registrations.
 *
 * - sendGeneralRegistration: Processes a new vendor registration.
 * - GeneralRegistrationInput: The input type for the flow.
 * - GeneralRegistrationOutput: The return type for the flow.
 */
import 'dotenv/config';
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Resend } from 'resend';

// Input schema for the general registration flow
const GeneralRegistrationInputSchema = z.object({
  businessName: z.string().describe("The name of the business."),
  contactName: z.string().describe("The name of the contact person."),
  email: z.string().email().describe("The vendor's email address."),
  phone: z.string().describe("The vendor's phone number."),
  category: z.string().describe("The primary product category."),
  description: z.string().describe("A short description of the business."),
});
export type GeneralRegistrationInput = z.infer<typeof GeneralRegistrationInputSchema>;

// Output schema for the flow
const GeneralRegistrationOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type GeneralRegistrationOutput = z.infer<typeof GeneralRegistrationOutputSchema>;

/**
 * Public function to trigger the general registration flow.
 * @param input The registration details.
 * @returns A promise that resolves to the flow's output.
 */
export async function sendGeneralRegistration(input: GeneralRegistrationInput): Promise<GeneralRegistrationOutput> {
  return sendGeneralRegistrationFlow(input);
}

// AI prompt to generate a confirmation email for the vendor
const registrationEmailPrompt = ai.definePrompt({
  name: 'registrationEmailPrompt',
  input: { schema: z.object({
    contactName: z.string(),
    businessName: z.string(),
  })},
  output: { format: 'text' },
  prompt: `
    Generate a simple, welcoming confirmation email body for a new vendor who has joined the network.
    The tone should be professional and encouraging.

    Details:
    - Contact Name: {{{contactName}}}
    - Business Name: {{{businessName}}}

    Start the email with "Dear {{{contactName}}},".
    Thank them for registering "{{{businessName}}}" with the PDSCC Vendor Network.
    Mention that they are now on the priority list for notifications about upcoming event opportunities.
    End with a warm closing like "Welcome aboard," followed by "The PDSCC Team".
  `,
});

// The main Genkit flow
const sendGeneralRegistrationFlow = ai.defineFlow(
  {
    name: 'sendGeneralRegistrationFlow',
    inputSchema: GeneralRegistrationInputSchema,
    outputSchema: GeneralRegistrationOutputSchema,
  },
  async (input) => {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
        console.error("Resend API key is not configured. Ensure RESEND_API_KEY is set.");
        return { success: false, message: "Server configuration error: Could not send email. Please contact support." };
    }

    try {
      // 1. Generate the vendor confirmation email
      const { output: vendorEmailBody } = await registrationEmailPrompt({
          businessName: input.businessName,
          contactName: input.contactName
      });
      if (!vendorEmailBody) {
        return { success: false, message: 'Failed to generate confirmation email.' };
      }
      
      const vendorEmailHtml = vendorEmailBody.replace(/\n/g, '<br>');

      // 2. Prepare the notification email for the admin
      const adminEmailText = `
        A new vendor has registered for the network.

        Business Details:
        - Business Name: ${input.businessName}
        - Contact Name: ${input.contactName}
        - Email: ${input.email}
        - Phone: ${input.phone}
        - Category: ${input.category}
        - Description: ${input.description}

        No action is required. They have been added to the general vendor list.
      `;

      // 3. Send the emails
      const resend = new Resend(resendApiKey);

      // Send to vendor
      await resend.emails.send({
        from: 'PDSCC Vendors <vendors@azpdscc.org>',
        to: input.email,
        subject: 'Welcome to the PDSCC Vendor Network!',
        html: vendorEmailHtml,
      });

      // Send to admin
      await resend.emails.send({
        from: 'Vendor Bot <noreply@azpdscc.org>',
        to: 'admin@azpdscc.org',
        subject: 'New General Vendor Registration',
        text: adminEmailText,
      });
     
      return { success: true, message: "Registration successful! A confirmation has been sent to your email." };
    } catch (error) {
      console.error('General registration flow failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return { success: false, message: `An error occurred during registration: ${errorMessage}` };
    }
  }
);
