
'use server';

import { z } from 'zod';
import { createVendorApplication } from '@/services/vendorApplications';
import { sendVendorApplication } from '@/ai/flows/send-vendor-application-flow';
import type { VendorApplicationFormData } from '@/lib/types';
import { format } from 'date-fns';

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
  success?: boolean;
  message?: string;
};

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

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  organization: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(10, "Please enter a valid phone number."),
  boothType: z.enum(['10x10-own', '10x10-our', '10x20-own', '10x20-our']),
  productDescription: z.string().min(20, "Description must be at least 20 characters.").max(500),
  zelleSenderName: z.string().min(2, "Zelle sender name is required."),
  zelleDateSent: z.coerce.date({ required_error: "Please select the date you sent the payment." }),
  paymentSent: z.boolean().refine(val => val === true, {
    message: 'You must confirm payment has been sent.',
  }),
});


export async function vendorApplicationAction(
    baseUrl: string,
    prevState: VendorApplicationState,
    formData: FormData
): Promise<VendorApplicationState> {
    if (!baseUrl) {
      return {
        errors: { _form: ['Could not determine the base URL. Please try again.'] },
      };
    }

    const boothTypeKey = formData.get('boothType') as string;

    const validatedFields = formSchema.safeParse({
        name: formData.get('name'),
        organization: formData.get('organization'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        boothType: boothTypeKey,
        productDescription: formData.get('productDescription'),
        zelleSenderName: formData.get('zelleSenderName'),
        zelleDateSent: formData.get('zelleDateSent'),
        paymentSent: formData.get('paymentSent') === 'on',
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        // 1. Create a ticket record in Firestore to get an ID
        const ticketId = await createVendorApplication({
            name: validatedFields.data.name,
            organization: validatedFields.data.organization,
            boothType: boothOptions[boothTypeKey],
        });

        // 2. Generate the verification and QR code URLs
        const verificationUrl = new URL(`/verify-ticket?id=${ticketId}`, baseUrl).toString();
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verificationUrl)}`;

        // 3. Prepare the full application data for the email flow
        const applicationData: VendorApplicationFormData = {
            name: validatedFields.data.name,
            organization: validatedFields.data.organization,
            email: validatedFields.data.email,
            phone: validatedFields.data.phone,
            boothType: boothOptions[boothTypeKey],
            totalPrice: boothPrices[boothTypeKey],
            productDescription: validatedFields.data.productDescription,
            zelleSenderName: validatedFields.data.zelleSenderName,
            zelleDateSent: format(validatedFields.data.zelleDateSent, "PPP"),
            paymentConfirmed: validatedFields.data.paymentSent,
            qrCodeUrl: qrCodeUrl,
        };

        // 4. Send the email with the QR code
        const emailResult = await sendVendorApplication(applicationData);

        if (emailResult.success) {
          return { success: true, message: emailResult.message };
        } else {
          return { success: false, message: emailResult.message };
        }

    } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred.';
        return {
            errors: {
                _form: ['Failed to process application.', message],
            },
        };
    }
}
