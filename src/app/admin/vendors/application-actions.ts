
'use server';

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

type ValidatedData = {
    name: string;
    organization?: string;
    email: string;
    phone: string;
    boothType: string;
    totalPrice: number;
    productDescription: string;
    zelleSenderName: string;
    zelleDateSent: Date;
    paymentSent: boolean;
}

export async function processVendorApplicationAction(
  baseUrl: string,
  data: ValidatedData,
): Promise<VendorApplicationState> {
  if (!baseUrl) {
    return {
      errors: {
        _form: ['Could not determine the base URL. Please try again.'],
      },
    };
  }

  try {
    // 1. Create a ticket record in Firestore to get an ID
    const ticketId = await createVendorApplication({
        name: data.name,
        organization: data.organization,
        boothType: data.boothType,
    });

    // 2. Generate the verification and QR code URLs
    const verificationUrl = new URL(`/verify-ticket?id=${ticketId}`, baseUrl).toString();
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verificationUrl)}`;

    // 3. Prepare the full application data for the email flow
    const applicationData: VendorApplicationFormData = {
        name: data.name,
        organization: data.organization,
        email: data.email,
        phone: data.phone,
        boothType: data.boothType,
        totalPrice: data.totalPrice,
        productDescription: data.productDescription,
        zelleSenderName: data.zelleSenderName,
        zelleDateSent: format(data.zelleDateSent, "PPP"),
        paymentConfirmed: data.paymentSent,
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
