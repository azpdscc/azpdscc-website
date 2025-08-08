
import { Suspense } from 'react';
import { getVendorApplicationById } from '@/services/vendorApplications';
import { VerifyTicketClient, TicketNotFound } from '@/components/admin/verify-ticket-client';
import { Skeleton } from '@/components/ui/skeleton';

function VerifyTicketSkeleton() {
    return (
        <div className="max-w-md mx-auto space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <div className="space-y-2 pt-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-2/3" />
            </div>
             <Skeleton className="h-12 w-full mt-4" />
        </div>
    )
}

async function VerifyTicket({ ticketId }: { ticketId: string }) {
    if (!ticketId) {
        return <TicketNotFound />;
    }
    const ticket = await getVendorApplicationById(ticketId);

    if (!ticket) {
        return <TicketNotFound />;
    }

    return <VerifyTicketClient ticket={ticket} />;
}

export default function VerifyTicketPage({ searchParams }: { searchParams: { id: string } }) {
    const ticketId = searchParams.id;
    
    return (
        <div className="container mx-auto p-4 md:p-8">
            <Suspense fallback={<VerifyTicketSkeleton />}>
                <VerifyTicket ticketId={ticketId} />
            </Suspense>
        </div>
    );
}
