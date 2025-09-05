
'use server';
/**
 * @fileOverview A flow to handle check donation notifications.
 *
 * - sendCheckNotification: Processes a new check notification and sends an email to admin.
 * - CheckNotificationInput: The input type for the flow.
 * - CheckNotificationOutput: The return type for the flow.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Resend } from 'resend';

// Input schema for the check notification flow
const CheckNotificationInputSchema = z.object({
  donorName: z.string().describe('The full name of the donor.'),
  donorEmail: z.string().email().describe('The email address of the donor.'),
  amount: z.number().describe('The amount of the donation.'),
  checkNumber: z.string().optional().describe('The check number, if provided.'),
});
export type CheckNotificationInput = z.infer<typeof CheckNotificationInputSchema>;

// Output schema for the flow
const CheckNotificationOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type CheckNotificationOutput = z.infer<typeof CheckNotificationOutputSchema>;

/**
 * Public function to trigger the check notification flow.
 * @param input The donor and donation details.
 * @returns A promise that resolves to the flow's output.
 */
export async function sendCheckNotification(input: CheckNotificationInput): Promise<CheckNotificationOutput> {
  return sendCheckNotificationFlow(input);
}

// The main Genkit flow
const sendCheckNotificationFlow = ai.defineFlow(
  {
    name: 'sendCheckNotificationFlow',
    inputSchema: CheckNotificationInputSchema,
    outputSchema: CheckNotificationOutputSchema,
  },
  async (input) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("Resend API key is not configured. Ensure RESEND_API_KEY is set in the server environment.");
      return { success: false, message: 'The email service is not configured correctly. Please contact support.' };
    }
    const resend = new Resend(resendApiKey);

    try {
      // Prepare and send the notification email to the admin
      const adminEmailText = `
        You have received a new Check Donation notification. Please look for this check in the mail.

        Donor Details:
        - Name: ${input.donorName}
        - Email: ${input.donorEmail}

        Donation Details:
        - Amount: $${input.amount}
        - Check Number: ${input.checkNumber || 'Not provided'}
        
        Action Required: Once the check is received, please deposit it and send a formal receipt to the donor's email address.
      `;

      await resend.emails.send({
        from: 'Donation Bot <noreply@azpdscc.org>',
        to: 'admin@azpdscc.org', // Your admin email address
        subject: `Incoming Check Donation from ${input.donorName}`,
        text: adminEmailText,
      });

      return { success: true, message: 'Notification sent successfully.' };

    } catch (error) {
      console.error('Check notification flow failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { success: false, message: `Failed to send notification. Error: ${errorMessage}` };
    }
  }
);
