
'use server';
/**
 * @fileOverview A flow to generate and send a volunteer hours confirmation letter.
 *
 * - sendVolunteerLetter: Processes the details, generates an HTML letter, and sends it.
 * - VolunteerLetterInput: The input type for the flow.
 * - VolunteerLetterOutput: The return type for the flow.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Resend } from 'resend';

// Input schema for the flow
const VolunteerLetterInputSchema = z.object({
  volunteerName: z.string().describe("The full name of the volunteer."),
  volunteerEmail: z.string().email().describe("The volunteer's email address."),
  eventName: z.string().describe("The name of the event they volunteered at."),
  dateOfService: z.string().describe("The date of the event in 'Month Day, YYYY' format."),
  hoursVolunteered: z.number().positive().describe("The total number of hours volunteered."),
  dutiesDescription: z.string().optional().describe("A brief, optional description of the duties performed."),
});
export type VolunteerLetterInput = z.infer<typeof VolunteerLetterInputSchema>;

// Output schema for the flow
const VolunteerLetterOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type VolunteerLetterOutput = z.infer<typeof VolunteerLetterOutputSchema>;

/**
 * Public function to trigger the volunteer letter flow.
 * @param input The letter details.
 * @returns A promise that resolves to the flow's output.
 */
export async function sendVolunteerLetter(input: VolunteerLetterInput): Promise<VolunteerLetterOutput> {
  return sendVolunteerLetterFlow(input);
}

// AI prompt to generate the official letter
const volunteerLetterPrompt = ai.definePrompt({
  name: 'volunteerLetterPrompt',
  input: { schema: VolunteerLetterInputSchema },
  output: { format: 'text' },
  prompt: `
    Generate a professional HTML email body for a volunteer service confirmation letter.
    The email subject should be: "PDSCC Volunteer Service Confirmation".

    Use clean HTML with inline CSS for compatibility. Structure it like an official letter.

    The letter must contain:
    1.  The PDSCC logo at the top. Use this URL: https://pdscc-images-website-2025.s3.us-east-1.amazonaws.com/Home+Page/SIte++Logo.svg and style it with width="80px".
    2.  The organization's name "Phoenix Desi Sports and Cultural Club (PDSCC)" and address "2259 S Hughes Drive, Buckeye, AZ 85326".
    3.  The current date.
    4.  The volunteer's name: {{{volunteerName}}}
    5.  A formal salutation: "Dear {{{volunteerName}}},".
    6.  The body of the letter, which must state: "This letter is to certify that you have generously contributed your time and effort as a volunteer for the Phoenix Desi Sports and Cultural Club (PDSCC), a registered 501(c)(3) non-profit organization. We are immensely grateful for your dedication."
    7.  A "Service Details" section with the following information clearly laid out:
        -   **Event:** {{{eventName}}}
        -   **Date of Service:** {{{dateOfService}}}
        -   **Total Hours:** {{{hoursVolunteered}}}
        {{#if dutiesDescription}}
        -   **Duties Performed:** {{{dutiesDescription}}}
        {{/if}}
    8.  A closing paragraph: "Your contribution was invaluable to the success of our event and to our mission of serving the community. We look forward to your continued support."
    9.  A formal closing: "Sincerely,".
    10. The signature: "PDSCC Team".

    The entire response must be ONLY the full HTML code for the email body. Do not include any text before or after the <html> tag.
  `,
});

// The main Genkit flow
const sendVolunteerLetterFlow = ai.defineFlow(
  {
    name: 'sendVolunteerLetterFlow',
    inputSchema: VolunteerLetterInputSchema,
    outputSchema: VolunteerLetterOutputSchema,
  },
  async (input) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        console.error("Resend API key is not configured.");
        throw new Error("Server configuration error for sending emails.");
    }
    const resend = new Resend(resendApiKey);

    try {
      // 1. Generate the HTML letter
      const { output: letterHtml } = await volunteerLetterPrompt(input);

      if (!letterHtml) {
        throw new Error('AI failed to generate the volunteer letter.');
      }
      
      // 2. Send the letter to the volunteer
      await resend.emails.send({
        from: 'PDSCC Volunteers <info@azpdscc.org>',
        to: input.volunteerEmail,
        subject: 'PDSCC Volunteer Service Confirmation',
        html: letterHtml,
      });

      // 3. Send a copy to the admin for record-keeping
      await resend.emails.send({
        from: 'Volunteer Bot <noreply@azpdscc.org>',
        to: 'admin@azpdscc.org',
        subject: `Copy of Volunteer Letter for ${input.volunteerName}`,
        html: `A volunteer confirmation letter was sent to ${input.volunteerName} (${input.volunteerEmail}).<br><br><hr><br>${letterHtml}`,
      });
     
      return { success: true, message: `Confirmation letter successfully sent to ${input.volunteerEmail}.` };

    } catch (error) {
      console.error('Volunteer letter flow failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
       if (errorMessage.includes("Server configuration error")) {
          throw new Error("Server configuration error for sending emails.");
      }
      return { success: false, message: `An error occurred: ${errorMessage}` };
    }
  }
);
