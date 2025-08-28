
'use server';

import { z } from 'zod';
import { createVendorApplicationForReview } from '@/services/vendorApplications';
import { sendVendorApplication, sendVendorApplicationReceipt } from '@/ai/flows/send-vendor-application-flow';
import type { VendorApplication, VendorApplicationFormData } from '@/lib/types';
import { format } from 'date-fns';
import { getEvents } from '@/services/events';
import { revalidatePath } from 'next/cache';

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
    smsConsent?: string[];
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

const VendorApplicationInputSchema = z.object({
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
  smsConsent: z.boolean().refine(val => val === true, {
    message: 'You must consent to receive text messages to continue.',
  }),
});


export async function vendorApplicationAction(
    prevState: VendorApplicationState,
    formData: FormData
): Promise<VendorApplicationState> {
    
    const validatedFields = VendorApplicationInputSchema.safeParse({
        name: formData.get('name'),
        organization: formData.get('organization'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        boothType: formData.get('boothType'),
        productDescription: formData.get('productDescription'),
        zelleSenderName: formData.get('zelleSenderName'),
        zelleDateSent: formData.get('zelleDateSent'),
        paymentSent: formData.get('paymentSent') === 'on',
        smsConsent: formData.get('smsConsent') === 'on',
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    const boothTypeKey = validatedFields.data.boothType;

    try {
        const allEvents = await getEvents();
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const upcomingEvents = allEvents
            .filter(e => new Date(e.date) >= now)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;

        if (!nextEvent) {
             return { errors: { _form: ['There are no upcoming events available for registration.'] }};
        }

        const applicationData: VendorApplicationFormData = {
            ...validatedFields.data,
            eventId: nextEvent.id,
            eventName: nextEvent.name,
            eventDate: nextEvent.date,
            boothType: boothOptions[boothTypeKey],
            totalPrice: String(boothPrices[boothTypeKey]),
            zelleDateSent: format(validatedFields.data.zelleDateSent, "PPP"),
        };
        
        await createVendorApplicationForReview(applicationData);

        const emailResult = await sendVendorApplicationReceipt(applicationData);

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


export async function verifyAndSendTicketAction(baseUrl: string, application: VendorApplication): Promise<{ success: boolean, message: string }> {
    if (!baseUrl) {
        return { success: false, message: 'Could not determine the application URL. Cannot send ticket.' };
    }
    if (!application.id) {
         return { success: false, message: 'Application ID is missing.' };
    }

    try {
        const verificationUrl = new URL(`/admin/check-in?ticketId=${application.id}`, baseUrl).toString();
        
        const applicationWithQr = {
            ...application,
            qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verificationUrl)}`,
        };

        const emailResult = await sendVendorApplication(applicationWithQr);
        
        if (!emailResult.success) {
            throw new Error(emailResult.message);
        }
        
        revalidatePath('/admin/vendors');

        return { success: true, message: "Verification successful! Ticket has been sent to the vendor." };

    } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred while sending the ticket."
        return { success: false, message };
    }
}
