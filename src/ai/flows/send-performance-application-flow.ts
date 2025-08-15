
'use server';
/**
 * @fileOverview A flow to handle performance applications.
 *
 * - sendPerformanceApplication: Processes a new application, saves it, and sends notifications.
 * - PerformanceApplicationInput: The input type for the flow.
 * - PerformanceApplicationOutput: The return type for the flow.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Resend } from 'resend';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Input schema for the performance application flow
const PerformanceApplicationInputSchema = z.object({
  groupName: z.string().describe("The name of the performing group or individual."),
  contactName: z.string().describe("The name of the main contact person."),
  email: z.string().email().describe("The contact person's email address."),
  phone: z.string().describe("The contact person's phone number."),
  event: z.string().describe("The event they are applying for (e.g., 'Vaisakhi Mela')."),
  performanceType: z.string().describe("The type of performance (e.g., 'Bhangra', 'Singing')."),
  participants: z.number().int().positive().describe("The number of participants in the performance."),
  auditionLink: z.string().url().optional().describe("An optional URL to the performer's audition video."),
  specialRequests: z.string().optional().describe("Any special requests or technical needs."),
});
export type PerformanceApplicationInput = z.infer<typeof PerformanceApplicationInputSchema>;

// Output schema for the flow
const PerformanceApplicationOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type PerformanceApplicationOutput = z.infer<typeof PerformanceApplicationOutputSchema>;

/**
 * Public function to trigger the performance application flow.
 * @param input The application details.
 * @returns A promise that resolves to the flow's output.
 */
export async function sendPerformanceApplication(input: PerformanceApplicationInput): Promise<PerformanceApplicationOutput> {
  return sendPerformanceApplicationFlow(input);
}

// AI prompt to generate a confirmation email for the performer
const confirmationEmailPrompt = ai.definePrompt({
  name: 'performanceConfirmationEmailPrompt',
  input: { schema: z.object({
    contactName: z.string(),
    groupName: z.string(),
    event: z.string(),
  })},
  output: { format: 'text' },
  prompt: `
    Generate a polite and professional confirmation email body for a group that has applied to perform at a PDSCC event.
    The tone should be appreciative and set clear expectations for the next steps.

    Details:
    - Contact Name: {{{contactName}}}
    - Group Name: {{{groupName}}}
    - Event: {{{event}}}

    Start the email with "Dear {{{contactName}}},".
    Thank them for applying to perform with "{{{groupName}}}" at the upcoming {{{event}}}.
    Let them know their application has been received and our cultural team will review it.
    Mention that they will be contacted if their performance is selected.
    End with a warm closing like "Sincerely," followed by "The PDSCC Cultural Team".
  `,
});

// The main Genkit flow
const sendPerformanceApplicationFlow = ai.defineFlow(
  {
    name: 'sendPerformanceApplicationFlow',
    inputSchema: PerformanceApplicationInputSchema,
    outputSchema: PerformanceApplicationOutputSchema,
  },
  async (input) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        console.error("Resend API key is not configured.");
        return { success: false, message: "Server configuration error. Please contact support." };
    }

    try {
      // 1. Save the application to Firestore
      await addDoc(collection(db, 'performanceRegistrations'), {
          ...input,
          status: 'Pending', // Initial status
          submittedAt: serverTimestamp(),
      });

      // 2. Generate the confirmation email for the performer
      const { output: performerEmailBody } = await confirmationEmailPrompt({
          contactName: input.contactName,
          groupName: input.groupName,
          event: input.event,
      });

      if (!performerEmailBody) {
        throw new Error("Failed to generate performer confirmation email.");
      }
      const performerEmailHtml = performerEmailBody.replace(/\n/g, '<br>');

      // 3. Prepare the notification email for the admin/cultural team
      const adminEmailText = `
A new performance application has been received for ${input.event}.

Group Name: ${input.groupName}
Contact Name: ${input.contactName}
Email: ${input.email}
Phone: ${input.phone}

Event: ${input.event}
Performance Type: ${input.performanceType}
Number of Participants: ${input.participants}

Audition Link:
${input.auditionLink || 'Not provided'}

Special Requests:
${input.specialRequests || 'None'}

Action Required: Please review this application in the performance dashboard.
      `;

      // 4. Send the emails
      const resend = new Resend(resendApiKey);

      // Send to performer
      await resend.emails.send({
        from: 'PDSCC Cultural Team <info@azpdscc.org>',
        to: input.email,
        subject: `Your Performance Application for ${input.event} has been Received!`,
        html: performerEmailHtml,
      });

      // Send to admin
      await resend.emails.send({
        from: 'Performers Bot <noreply@azpdscc.org>',
        to: 'admin@azpdscc.org', // This should be the cultural team's email
        subject: `New Performance Application: ${input.groupName} for ${input.event}`,
        text: adminEmailText,
      });
     
      return { success: true, message: "Thank you for your application! A confirmation has been sent to your email." };
    } catch (error) {
      console.error('Performance application flow failed:', error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      return { success: false, message: `An error occurred: ${errorMessage}` };
    }
  }
);
