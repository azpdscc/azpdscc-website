
'use server';
/**
 * @fileOverview A flow to handle vendor applications, sending notifications and a ticket.
 *
 * - sendVendorApplication: Processes a new vendor application.
 * - VendorApplicationInput: The input type for the flow.
 * - VendorApplicationOutput: The return type for the flow.
 */
import 'dotenv/config';
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Resend } from 'resend';
import { getEvents } from '@/services/events';

// Add eventName to the input schema for the email prompt
const VendorApplicationInputWithEventSchema = z.object({
  name: z.string().describe("The full name of the contact person."),
  organization: z.string().optional().describe("The name of the vendor's organization."),
  email: z.string().email().describe("The vendor's email address."),
  phone: z.string().describe("The vendor's phone number."),
  boothType: z.string().describe("The type of booth selected, e.g., '10x10 Booth (Our Canopy) - $350'"),
  totalPrice: z.number().describe("The total price for the selected booth."),
  productDescription: z.string().describe("The description of products/services offered."),
  zelleSenderName: z.string().describe("The name on the Zelle account used for payment."),
  zelleDateSent: z.string().describe("The date the Zelle payment was sent."),
  paymentConfirmed: z.boolean().describe("Whether the vendor confirmed they sent the payment."),
  qrCodeUrl: z.string().url().describe("The URL of the QR code image to include in the ticket."),
  eventName: z.string().describe("The name of the event the vendor is applying for."),
});

// Input schema for the public-facing flow
const VendorApplicationInputSchema = z.object({
  name: z.string().describe("The full name of the contact person."),
  organization: z.string().optional().describe("The name of the vendor's organization."),
  email: z.string().email().describe("The vendor's email address."),
  phone: z.string().describe("The vendor's phone number."),
  boothType: z.string().describe("The type of booth selected, e.g., '10x10 Booth (Our Canopy) - $350'"),
  totalPrice: z.number().describe("The total price for the selected booth."),
  productDescription: z.string().describe("The description of products/services offered."),
  zelleSenderName: z.string().describe("The name on the Zelle account used for payment."),
  zelleDateSent: z.string().describe("The date the Zelle payment was sent."),
  paymentConfirmed: z.boolean().describe("Whether the vendor confirmed they sent the payment."),
  qrCodeUrl: z.string().url().describe("The URL of the QR code image to include in the ticket."),
});
export type VendorApplicationInput = z.infer<typeof VendorApplicationInputSchema>;


// Output schema for the flow
const VendorApplicationOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type VendorApplicationOutput = z.infer<typeof VendorApplicationOutputSchema>;

/**
 * Public function to trigger the vendor application flow.
 * @param input The vendor application details.
 * @returns A promise that resolves to the flow's output.
 */
export async function sendVendorApplication(input: VendorApplicationInput): Promise<VendorApplicationOutput> {
  return sendVendorApplicationFlow(input);
}

// AI prompt to generate a vendor ticket email
const vendorTicketEmailPrompt = ai.definePrompt({
  name: 'vendorTicketEmailPrompt',
  input: { schema: VendorApplicationInputWithEventSchema }, // Use the schema with eventName
  output: { format: 'text' }, // We are generating HTML, so text is fine.
  prompt: `
    Generate an HTML email to be sent to a vendor as their event ticket and confirmation.
    The email should be professional, welcoming, and clearly structured.
    The subject line should be: "Your Vendor Booth Confirmation for {{{eventName}}}".

    Use modern, clean HTML with inline CSS for maximum email client compatibility.
    The email should have a main container with a light gray background (#f4f4f4) and a white content area with rounded corners.

    The email must contain the following sections:
    1.  A header with the "PDSCC" logo text and the title "Vendor Confirmation & Ticket".
    2.  A personalized greeting: "Dear {{{name}}},".
    3.  A confirmation message: "Thank you for registering as a vendor for the upcoming {{{eventName}}}! We've received your application and are excited to have you."
    4.  A "Ticket Details" section with the following information in a styled table or divs:
        -   **Vendor Name:** {{{name}}}
        -   **Organization:** {{{organization}}} (Show only if provided)
        -   **Booth Type:** {{{boothType}}}
        -   **Amount Paid:** \${{{totalPrice}}}
    5.  A QR code for check-in. Use the following image URL: <img src="{{{qrCodeUrl}}}" alt="QR Code for Check-In" style="display: block; margin: 20px auto; border: 5px solid #333;" />
    6.  Instructions: "Please present this email (or the QR code) at the vendor check-in gate on the day of the event."
    7.  A closing: "We look forward to seeing you there," followed by "The PDSCC Team".

    The entire response should be only the HTML code for the email body. Do not include any text before or after the <html> tag.
  `,
});

// The main Genkit flow
const sendVendorApplicationFlow = ai.defineFlow(
  {
    name: 'sendVendorApplicationFlow',
    inputSchema: VendorApplicationInputSchema,
    outputSchema: VendorApplicationOutputSchema,
  },
  async (input) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        console.error("Resend API key is not configured. Ensure RESEND_API_KEY is set.");
        return { success: false, message: "Server configuration error. Please contact support." };
    }

    try {
      // 1. Determine the next upcoming event
      const allEvents = await getEvents();
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const upcomingEvents = allEvents
        .filter(e => new Date(e.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;
      const eventName = nextEvent ? nextEvent.name : "our upcoming PDSCC event";

      // 2. Generate the vendor's ticket email, passing in the event name
      const { output: vendorEmailHtml } = await vendorTicketEmailPrompt({
          ...input,
          eventName: eventName,
      });

      if (!vendorEmailHtml) {
        return { success: false, message: 'Failed to generate vendor ticket.' };
      }

      // 3. Prepare the notification email for the admin
      const adminEmailText = `
A new vendor application has been submitted and paid for the event: ${eventName}.

Here are the details:

Contact Information:
- Full Name: ${input.name}
- Organization: ${input.organization || 'N/A'}
- Email: ${input.email}
- Phone Number: ${input.phone}

Booth Details:
- Booth Type: ${input.boothType}
- Product/Service Description: ${input.productDescription}

Payment Information:
- Total Price: $${input.totalPrice}
- Zelle Sender Name: ${input.zelleSenderName}
- Date Sent: ${input.zelleDateSent}
- Payment Confirmed by Vendor: ${input.paymentConfirmed ? 'Yes' : 'No'}

Please verify the Zelle payment and update records accordingly.
      `;

      // 4. Send the emails
      const resend = new Resend(resendApiKey);

      // Send to vendor
      await resend.emails.send({
        from: 'PDSCC Vendors <vendors@azpdscc.org>',
        to: input.email,
        subject: `Your Vendor Booth Confirmation for ${eventName}`,
        html: vendorEmailHtml,
      });

      // Send to admin
      await resend.emails.send({
        from: 'Vendor Bot <noreply@azpdscc.org>',
        to: 'admin@azpdscc.org',
        subject: `New Paid Vendor Application for ${eventName}!`,
        text: adminEmailText,
      });

      return { success: true, message: "Application submitted! A confirmation ticket has been sent to your email." };
    } catch (error) {
      console.error('Vendor application flow failed:', error);
      return { success: false, message: 'An error occurred while processing your application.' };
    }
  }
);
