
'use server';

import { getVendorApplications, checkInVendor } from '@/services/vendorApplications';
import { revalidatePath } from 'next/cache';
import type { VendorApplication } from '@/lib/types';

/**
 * Server action to securely fetch all vendor applications.
 * This action can only be called from the server, protecting the data.
 */
export async function getVendorApplicationsAction(): Promise<{ success: boolean; data?: VendorApplication[]; message?: string }> {
    try {
        const applications = await getVendorApplications();
        return { success: true, data: applications };
    } catch (error) {
        console.error('Failed to fetch vendor applications:', error);
        return { success: false, message: 'Could not retrieve vendor applications.' };
    }
}


export async function checkInVendorAction(ticketId: string): Promise<{ success: boolean; message: string }> {
    if (!ticketId) {
        return { success: false, message: 'No ticket ID provided.' };
    }
    
    try {
        await checkInVendor(ticketId);
        // Revalidate the path for the check-in list to update
        revalidatePath('/admin/check-in');
        return { success: true, message: 'Vendor checked in successfully!' };
    } catch (error) {
        console.error('Check-in failed:', error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to check in vendor: ${message}` };
    }
}
