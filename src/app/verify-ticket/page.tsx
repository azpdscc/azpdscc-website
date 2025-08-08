
import { Suspense } from 'react';
import { getVendorApplicationById } from '@/services/vendorApplications';
import { VerifyTicketClient, TicketNotFound } from '@/components/admin/verify-ticket-client';
import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '@/components/logo';

// This is a public page layout, so we add a simple header and footer for context.
function PublicPageLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-secondary/50">
            <header className="bg-background border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Logo />
                </div>
            </header>
            <main className="flex-grow">
                {children}
            </main>
            <footer className="bg-card border-t">
                <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
                     <p>&copy; {new Date().getFullYear()} AZPDSCC.org. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}


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
        <PublicPageLayout>
            <div className="container mx-auto p-4 md:p-8">
                <Suspense fallback={<VerifyTicketSkeleton />}>
                    <VerifyTicket ticketId={ticketId} />
                </Suspense>
            </div>
        </PublicPageLayout>
    );
}
