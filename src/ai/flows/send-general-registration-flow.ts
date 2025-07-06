'use server';
/**
 * @fileOverview A flow to handle general vendor registrations.
 *
 * - sendGeneralRegistration: Processes a new vendor registration.
 * - GeneralRegistrationInput: The input type for the flow.
 * - GeneralRegistrationOutput: The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
// TODO: To enable email sending, uncomment the following line and ensure you have a RESEND_API_KEY.
// import { Resend } from 'resend';

// Input schema for the general registration flow
const GeneralRegistrationInputSchema = z.object({
  businessName: z.string().describe("The name of the business."),
  contactName: z.string().describe("The name of the contact person."),
  email: z.string().email().describe("The vendor's email address."),
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

// AI prompt to generate a confirmation email
const registrationEmailPrompt = ai.definePrompt({
  name: 'registrationEmailPrompt',
  input: { schema: GeneralRegistrationInputSchema },
  output: { format: 'text' },
  prompt: `
    Generate a simple, welcoming confirmation email body for a new vendor who has joined the network.
    The tone should be professional and encouraging.

    Details:
    - Contact Name: {{{contactName}}}
    - Business Name: {{{businessName}}}

    Start the email with "Dear {{{contactName}}},".
    Thank them for registering "{{{businessName}}}" with the AZPDSCC Vendor Network.
    Mention that they are now on the priority list for notifications about upcoming event opportunities.
    End with a warm closing like "Welcome aboard," followed by "The AZPDSCC Team".
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
    try {
      // 1. Generate the vendor confirmation email
      const { output: vendorEmailBody } = await registrationEmailPrompt(input);
      if (!vendorEmailBody) {
        return { success: false, message: 'Failed to generate confirmation email.' };
      }
      
      const vendorEmailHtml = vendorEmailBody.replace(/\n/g, '<br>');

      // 2. Prepare the notification email for the admin
      const adminEmailText = `
        A new vendor has registered for the network.

        Details:
        - Business Name: ${input.businessName}
        - Contact Name: ${input.contactName}
        - Email: ${input.email}

        No action is required. They have been added to the general vendor list.
      `;

      // 3. Send the emails (simulated)
      // TODO: Uncomment and configure the following section to send real emails.
      /*
      const resend = new Resend(process.env.RESEND_API_KEY);

      // Send to vendor
      await resend.emails.send({
        from: 'AZPDSCC Vendors <vendors@yourdomain.com>',
        to: input.email,
        subject: 'Welcome to the AZPDSCC Vendor Network!',
        html: vendorEmailHtml,
      });

      // Send to admin
      await resend.emails.send({
        from: 'Vendor Bot <noreply@yourdomain.com>',
        to: 'vendors@azpdscc.org',
        subject: 'New General Vendor Registration',
        text: adminEmailText,
      });
      */
     
      console.log('--- SIMULATED VENDOR REGISTRATION EMAIL ---');
      console.log(`To: ${input.email}`);
      console.log(`Subject: Welcome to the AZPDSCC Vendor Network!`);
      console.log(vendorEmailHtml);
      console.log('-----------------------------------------');
      
      console.log('--- SIMULATED ADMIN NOTIFICATION EMAIL ---');
      console.log('To: vendors@azpdscc.org');
      console.log('Subject: New General Vendor Registration');
      console.log(adminEmailText);
      console.log('-----------------------------------------');


      return { success: true, message: "Registration successful! A confirmation has been sent to your email." };
    } catch (error) {
      console.error('General registration flow failed:', error);
      return { success: false, message: 'An error occurred during registration.' };
    }
  }
);
