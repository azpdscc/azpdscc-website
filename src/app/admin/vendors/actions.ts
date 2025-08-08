
'use server';

import { z } from 'zod';
import { createVendorApplication } from '@/services/vendorApplications';
import { sendVendorApplication } from '@/ai/flows/send-vendor-application-flow';
import { format } from 'date-fns';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  organization: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(10, "Please enter a valid phone number."),
  boothType: z.string(), // This will be the full string e.g. "10x10 Booth..."
  totalPrice: z.number(),
  productDescription: z.string().min(20, "Description must be at least 20 characters.").max(500),
  zelleSenderName: z.string().min(2, "Zelle sender name is required."),
  zelleDateSent: z.coerce.date({ required_error: "Please select the date you sent the payment." }),
  paymentSent: z.coerce.boolean().refine(val => val === true, { message: "You must confirm payment has been sent." }),
});

export type VendorApplicationState = {
    errors?: {
        name?: string[];
        organization?: string[];
        email?: string[];
        phone?: string[];
        boothType?: string[];
        productDescription?: string[];
        zelleSenderName?: string[];
        zelleDateSent?: string[];
        paymentSent?: string[];
         _form?: string[];
    };
    message?: string;
    success?: boolean;
}

export async function processVendorApplicationAction(
    baseUrl: string,
    prevState: VendorApplicationState,
    formData: FormData
): Promise<VendorApplicationState> {

    if (!baseUrl) {
        return {
            success: false,
            message: 'Could not determine the application URL. Please refresh and try again.',
        };
    }

    const boothTypeKey = formData.get('boothType') as string;
    const boothOptions: { [key: string]: string } = {
        '10x10-own': '10x10 Booth (Own Canopy) - $250',
        '10x10-our': '10x10 Booth (Our Canopy) - $350',
        '10x20-own': '10x20 Booth (Own Canopy) - $500',
        '10x20-our': '10x20 Booth (Our Canopy) - $650',
    };
    const boothPrices: { [key: string]: number } = {
        '10x10-own': 250,
        '10x10-our': 350,
        '10x20-own': 500,
        '10x20-our': 650,
    };

    const validatedFields = formSchema.safeParse({
        name: formData.get('name'),
        organization: formData.get('organization'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        boothType: boothOptions[boothTypeKey],
        totalPrice: boothPrices[boothTypeKey],
        productDescription: formData.get('productDescription'),
        zelleSenderName: formData.get('zelleSenderName'),
        zelleDateSent: formData.get('zelleDateSent'),
        paymentSent: formData.get('paymentSent'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        // 1. Create the vendor application record in Firestore to get an ID
        const vendorDataForDb = {
            name: validatedFields.data.name,
            organization: validatedFields.data.organization,
            boothType: validatedFields.data.boothType,
        };
        const ticketId = await createVendorApplication(vendorDataForDb);
        
        // 2. Construct the URLs for the QR code
        const verificationUrl = new URL(`/verify-ticket?id=${ticketId}`, baseUrl).toString();
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verificationUrl)}`;

        // 3. Send the confirmation email with the QR Code
        const emailFlowResult = await sendVendorApplication({
            ...validatedFields.data,
            zelleDateSent: format(validatedFields.data.zelleDateSent, "PPP"),
            qrCodeUrl: qrCodeUrl,
        });

        if (!emailFlowResult.success) {
            return { success: false, message: `Application recorded, but failed to send email: ${emailFlowResult.message}` };
        }
        
        return { success: true, message: emailFlowResult.message };

    } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred.';
        return {
            success: false,
            message: `An unexpected error occurred: ${message}`,
            errors: { _form: ['Failed to process application.', message] },
        };
    }
}
