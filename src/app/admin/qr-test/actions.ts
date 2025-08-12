
'use server';

import { z } from 'zod';
import { createVendorApplication } from '@/services/vendorApplications';
import { getEvents } from '@/services/events';
import { format } from 'date-fns';

export type QrTestFormState = {
  errors?: {
    vendorName?: string[];
    boothType?: string[];
    _form?: string[];
  };
  result?: {
    ticketId: string;
    qrCodeUrl: string;
    verificationUrl: string;
  }
};

const schema = z.object({
  vendorName: z.string().min(2, "Vendor name must be at least 2 characters."),
  boothType: z.string().min(1, "Booth type is required."),
});

export async function generateQrCodeAction(
  baseUrl: string, // The base URL is now passed in from the client
  prevState: QrTestFormState,
  formData: FormData
): Promise<QrTestFormState> {
  
  if (!baseUrl) {
    return {
      errors: {
        _form: ['Could not determine the base URL. Please refresh the page and try again.'],
      },
    };
  }

  const validatedFields = schema.safeParse({
    vendorName: formData.get('vendorName'),
    boothType: formData.get('boothType'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // In a test environment, we'll just grab the next upcoming event
    const allEvents = await getEvents();
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const upcomingEvents = allEvents
        .filter(e => new Date(e.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : { id: 'test-event', name: 'Test Event', date: format(new Date(), 'MMMM dd, yyyy') };


    const ticketId = await createVendorApplication({
        name: validatedFields.data.vendorName,
        boothType: validatedFields.data.boothType,
        eventId: nextEvent.id,
        eventName: nextEvent.name,
        eventDate: nextEvent.date,
    });

    // Point to the consolidated admin check-in page
    const verificationUrl = new URL(`/admin/check-in?ticketId=${ticketId}`, baseUrl).toString();
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verificationUrl)}`;
    
    return {
      result: {
        ticketId,
        qrCodeUrl,
        verificationUrl
      }
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unknown error occurred.';
    return {
      errors: {
        _form: ['Failed to generate QR code.', message],
      },
    };
  }
}
