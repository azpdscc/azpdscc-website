
'use server';

import { checkInVendor } from '@/services/vendorApplications';
import { revalidatePath } from 'next/cache';

export async function checkInVendorAction(ticketId: string): Promise<{ success: boolean; message: string }> {
    if (!ticketId) {
        return { success: false, message: 'No ticket ID provided.' };
    }
    
    try {
        await checkInVendor(ticketId);
        // Revalidate the path so that if the page is refreshed, it shows the updated status.
        revalidatePath(`/admin/verify-ticket?id=${ticketId}`);
        return { success: true, message: 'Vendor checked in successfully!' };
    } catch (error) {
        console.error('Check-in failed:', error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to check in vendor: ${message}` };
    }
}
