
'use server';
/**
 * @fileOverview A flow to handle vendor applications, sending notifications and a ticket.
 *
 * - sendVendorApplication: Processes a new vendor application.
 * - VendorApplicationInput: The input type for the flow.
 * - VendorApplicationOutput: The return type for the flow.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Resend } from 'resend';

// This is the most complete schema, including the optional QR code and required eventName.
// It is used for generating the final ticket email.
const VendorApplicationTicketSchema = z.object({
  id: z.string().optional(),
  name: z.string().describe("The full name of the contact person."),
  organization: z.string().optional().describe("The name of the vendor's organization."),
  email: z.string().email().describe("The vendor's email address."),
  phone: z.string().describe("The vendor's phone number."),
  boothType: z.string().describe("The type of booth selected, e.g., '10x10 Booth (Our Canopy) - $350'"),
  totalPrice: z.number().describe("The total price for the selected booth."),
  productDescription: z.string().describe("The description of products/services offered."),
  zelleSenderName: z.string().describe("The name on the Zelle account used for payment."),
  zelleDateSent: z.string().describe("The date the Zelle payment was sent."),
  paymentConfirmed: z.boolean().optional().describe("Whether the vendor confirmed they sent the payment."),
  qrCodeUrl: z.string().url().optional().describe("The URL of the QR code image to include in the ticket."),
  eventName: z.string().describe("The name of the event the vendor is applying for."),
});

// This is the public-facing schema for the form submission. `eventName` is optional here
// because it's retrieved on the server.
export const VendorApplicationInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().describe("The full name of the contact person."),
  organization: z.string().optional().describe("The name of the vendor's organization."),
  email: z.string().email().describe("The vendor's email address."),
  phone: z.string().describe("The vendor's phone number."),
  boothType: z.string().describe("The type of booth selected, e.g., '10x10 Booth (Our Canopy) - $350'"),
  totalPrice: z.number().describe("The total price for the selected booth."),
  productDescription: z.string().describe("The description of products/services offered."),
  zelleSenderName: z.string().describe("The name on the Zelle account used for payment."),
  zelleDateSent: z.string().describe("The date the Zelle payment was sent."),
  paymentConfirmed: z.boolean().optional().describe("Whether the vendor confirmed they sent the payment."),
  eventName: z.string().optional(),
});
export type VendorApplicationInput = z.infer<typeof VendorApplicationInputSchema>;


// Output schema for the flow
const VendorApplicationOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type VendorApplicationOutput = z.infer<typeof VendorApplicationOutputSchema>;

/**
 * Public function to trigger the vendor ticket sending flow AFTER admin verification.
 * This now expects the full application object.
 * @param input The vendor application details including QR code and eventName.
 * @returns A promise that resolves to the flow's output.
 */
export async function sendVendorApplication(input: z.infer<typeof VendorApplicationTicketSchema>): Promise<VendorApplicationOutput> {
  return sendVendorTicketFlow(input);
}

/**
 * Public function to trigger the vendor application receipt flow.
 * @param input The vendor application details.
 * @returns A promise that resolves to the flow's output.
 */
export async function sendVendorApplicationReceipt(input: VendorApplicationInput): Promise<VendorApplicationOutput> {
  return sendVendorReceiptFlow(input);
}


// AI prompt to generate a vendor ticket email
const vendorTicketEmailPrompt = ai.definePrompt({
  name: 'vendorTicketEmailPrompt',
  input: { schema: VendorApplicationTicketSchema },
  output: { format: 'text' },
  prompt: `
    Generate an HTML email to be sent to a vendor as their event ticket and confirmation.
    The email should be professional, welcoming, and clearly structured.
    The subject line should be: "Your Vendor Booth Confirmation for {{{eventName}}}".

    Use modern, clean HTML with inline CSS for maximum email client compatibility.
    The email should have a main container with a light gray background (#f4f4f4) and a white content area with rounded corners.

    The email must contain the following sections:
    1.  A header with the "PDSCC" logo text and the title "Vendor Confirmation & Ticket".
    2.  A personalized greeting: "Dear {{{name}}},".
    3.  A confirmation message: "Thank you for registering as a vendor for the upcoming {{{eventName}}}! Your payment has been confirmed, and we're excited to have you."
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

// The main Genkit flow for sending the final ticket
const sendVendorTicketFlow = ai.defineFlow(
  {
    name: 'sendVendorTicketFlow',
    inputSchema: VendorApplicationTicketSchema, // Use the correct, strict schema
    outputSchema: VendorApplicationOutputSchema,
  },
  async (input) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        console.error("Resend API key is not configured.");
        return { success: false, message: "Server configuration error. Please contact support." };
    }

    try {
      const { output: vendorEmailHtml } = await vendorTicketEmailPrompt(input);

      if (!vendorEmailHtml) {
        return { success: false, message: 'Failed to generate vendor ticket.' };
      }

      const resend = new Resend(resendApiKey);

      await resend.emails.send({
        from: 'PDSCC Vendors <vendors@azpdscc.org>',
        to: input.email,
        subject: `Your Vendor Booth Confirmation for ${input.eventName}`,
        html: vendorEmailHtml,
      });

      return { success: true, message: "Ticket sent to vendor." };
    } catch (error) {
      console.error('Vendor ticket flow failed:', error);
      return { success: false, message: 'An error occurred while sending the ticket.' };
    }
  }
);


// --- New Flow for Initial Application Receipt ---

const vendorReceiptEmailPrompt = ai.definePrompt({
  name: 'vendorReceiptEmailPrompt',
  input: { schema: VendorApplicationTicketSchema },
  output: { format: 'text' },
  prompt: `
    Generate a simple, professional HTML email to be sent to a vendor confirming their application has been received and is pending payment verification.
    The subject line should be: "We've Received Your Vendor Application for {{{eventName}}}".

    Use modern, clean HTML.
    
    The email must contain:
    1.  A greeting: "Dear {{{name}}},".
    2.  A confirmation message: "Thank you for applying to be a vendor at the upcoming {{{eventName}}}. We have received your application and Zelle payment information."
    3.  Next Steps: "Our team will now verify your payment. Once confirmed, you will receive a separate email containing your official booth ticket and QR code for check-in. This process may take 1-2 business days."
    4.  A closing: "We appreciate your interest and will be in touch soon," followed by "The PDSCC Team".
  `,
});

// The flow that sends the initial receipt and admin notification
const sendVendorReceiptFlow = ai.defineFlow(
  {
    name: 'sendVendorReceiptFlow',
    inputSchema: VendorApplicationInputSchema,
    outputSchema: VendorApplicationOutputSchema,
  },
  async (input) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        console.error("Resend API key is not configured.");
        return { success: false, message: "Server configuration error. Please contact support." };
    }

    try {
        const eventName = input.eventName || "our upcoming event";

        // Cast the input to the schema expected by the prompt
        const promptInput = {
            ...input,
            eventName,
            totalPrice: input.totalPrice, 
            zelleSenderName: input.zelleSenderName || '',
            zelleDateSent: input.zelleDateSent || '',
            productDescription: input.productDescription || ''
        } as z.infer<typeof VendorApplicationTicketSchema>;


        const { output: vendorEmailHtml } = await vendorReceiptEmailPrompt(promptInput);
        
        if (!vendorEmailHtml) {
            return { success: false, message: 'Failed to generate receipt email.' };
        }

        const adminEmailText = `
A new vendor application has been submitted and is awaiting payment verification for the event: ${eventName}.

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

Action Required: Please verify the Zelle payment and then approve this application in the admin vendor dashboard to send their ticket.
      `;

      const resend = new Resend(resendApiKey);

      await resend.emails.send({
        from: 'PDSCC Vendors <vendors@azpdscc.org>',
        to: input.email,
        subject: `We've Received Your Vendor Application for ${eventName}`,
        html: vendorEmailHtml,
      });

      await resend.emails.send({
        from: 'Vendor Bot <noreply@azpdscc.org>',
        to: 'admin@azpdscc.org',
        subject: `New VENDOR APP for ${eventName} - PENDING VERIFICATION`,
        text: adminEmailText,
      });

      return { success: true, message: "Application submitted! A confirmation receipt has been sent to your email. You will receive your official ticket once payment is verified." };
    } catch (error) {
        console.error('Vendor receipt flow failed:', error);
        return { success: false, message: 'An error occurred while sending your application receipt.' };
    }
  }
);
