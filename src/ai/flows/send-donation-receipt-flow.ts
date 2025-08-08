
'use server';
/**
 * @fileOverview A flow to generate and send a donation receipt email.
 *
 * - sendDonationReceipt: Generates an email body and simulates sending a receipt.
 * - DonationReceiptInput: The input type for the flow.
 * - DonationReceiptOutput: The return type for the flow.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Resend } from 'resend';

// Input schema for the donation receipt flow
const DonationReceiptInputSchema = z.object({
  donorName: z.string().describe('The full name of the donor.'),
  donorEmail: z.string().email().describe('The email address of the donor.'),
  amount: z.number().describe('The amount of the donation.'),
  date: z.string().describe('The date of the donation.'),
  isMonthly: z.boolean().describe('Whether the donation is a recurring monthly donation.'),
  paymentMethod: z.string().describe("The payment method used ('zelle' or 'credit-card')."),
  zelleSenderName: z.string().optional().describe('The name on the Zelle account.'),
});
export type DonationReceiptInput = z.infer<typeof DonationReceiptInputSchema>;

// Output schema for the flow
const DonationReceiptOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type DonationReceiptOutput = z.infer<typeof DonationReceiptOutputSchema>;

/**
 * Public function to trigger the donation receipt flow.
 * @param input The donor and donation details.
 * @returns A promise that resolves to the flow's output.
 */
export async function sendDonationReceipt(input: DonationReceiptInput): Promise<DonationReceiptOutput> {
  return sendDonationReceiptFlow(input);
}

// AI-powered prompt to generate a personalized email body for the donor
const receiptEmailPrompt = ai.definePrompt({
  name: 'receiptEmailPrompt',
  input: { schema: DonationReceiptInputSchema },
  output: { format: 'text' },
  prompt: `
    Generate a heartfelt thank you email body for a donation to PDSCC.

    The email should be professional, warm, and suitable for a tax receipt.
    The tone should be appreciative and reflect the community spirit of the organization.

    Details:
    - Donor's Name: {{{donorName}}}
    - Donation Amount: \${{{amount}}}
    - Donation Date: {{{date}}}
    - Donation Type: {{#if isMonthly}}Recurring Monthly{{else}}One-Time{{/if}}

    Start the email with "Dear {{{donorName}}},".
    Thank them for their generous {{#if isMonthly}}monthly{{else}}one-time{{/if}} donation of \${{{amount}}}.
    Mention that their support helps PDSCC continue its mission of celebrating North Indian culture through sports and festivals in the Phoenix community.
    {{#if zelleSenderName}}
    Mention that they will receive an official tax receipt once the Zelle payment has been verified by the team.
    {{else}}
    Include a line stating "This email serves as your official receipt." for tax purposes.
    {{/if}}
    End with a warm closing like "With heartfelt gratitude," followed by "The PDSCC Team".
  `,
});

// The main Genkit flow
const sendDonationReceiptFlow = ai.defineFlow(
  {
    name: 'sendDonationReceiptFlow',
    inputSchema: DonationReceiptInputSchema,
    outputSchema: DonationReceiptOutputSchema,
  },
  async (input) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        console.error("Resend API key is not configured. Ensure RESEND_API_KEY is set.");
        return { success: false, message: "Server configuration error. Please contact support." };
    }

    try {
      const resend = new Resend(resendApiKey);

      // 1. Generate the email content for the donor
      const { output: emailBody } = await receiptEmailPrompt(input);

      if (!emailBody) {
        return { success: false, message: 'Failed to generate email content.' };
      }

      // 2. Send the receipt email to the donor
      await resend.emails.send({
        from: 'PDSCC Donations <receipts@azpdscc.org>',
        to: input.donorEmail,
        subject: 'Thank You for Your Donation to PDSCC!',
        html: emailBody.replace(/\n/g, '<br>'), // Simple conversion of newlines to <br> for HTML email
      });
      
      // 3. Prepare and send the notification email to the admin
      const adminEmailText = `
        You have received a new donation.

        Donor Details:
        - Name: ${input.donorName}
        - Email: ${input.donorEmail}

        Donation Details:
        - Amount: $${input.amount}
        - Frequency: ${input.isMonthly ? 'Monthly' : 'One-Time'}
        - Payment Method: ${input.paymentMethod}

        ${input.paymentMethod === 'zelle' ? `
        Zelle Information:
        - Sender Name: ${input.zelleSenderName || 'Not provided'}
        - Action Required: Please verify this payment in your Zelle account.
        ` : `
        Credit Card Information:
        - Action Required: This was processed automatically. Please check your payment processor's dashboard for details.
        `}
      `;

      await resend.emails.send({
        from: 'Donation Bot <noreply@azpdscc.org>',
        to: 'admin@azpdscc.org',
        subject: `New Donation Received from ${input.donorName}`,
        text: adminEmailText,
      });

      return { success: true, message: 'Donation information processed successfully.' };

    } catch (error) {
      console.error('Donation flow failed:', error);
      // It's helpful to see the actual error in the server logs
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { success: false, message: `Failed to process donation. Error: ${errorMessage}` };
    }
  }
);
