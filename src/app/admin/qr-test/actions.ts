
'use server';

import { z } from 'zod';
import { createTestVendorApplication } from '@/services/vendorApplications';

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
  prevState: QrTestFormState,
  formData: FormData
): Promise<QrTestFormState> {
  
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
    const ticketId = await createTestVendorApplication({
        name: validatedFields.data.vendorName,
        boothType: validatedFields.data.boothType,
    });

    // Use the correct environment variable for the public project URL
    const baseUrl = process.env.NEXT_PUBLIC_PROJECT_URL || 'http://localhost:3000';
    const verificationUrl = new URL(`/admin/verify-ticket?id=${ticketId}`, baseUrl).toString();
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
