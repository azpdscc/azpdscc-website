
'use client';

import { useState, useTransition } from 'react';
import type { VendorApplication } from '@/lib/types';
import { checkInVendorAction } from '@/app/admin/verify-ticket/actions';
import { format } from 'date-fns';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, Loader2, UserCheck, Calendar, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VerifyTicketClientProps {
    ticket: VendorApplication;
}

export function VerifyTicketClient({ ticket }: VerifyTicketClientProps) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const [checkInStatus, setCheckInStatus] = useState(ticket.checkInStatus);
    const [checkedInAt, setCheckedInAt] = useState(ticket.checkedInAt);
    
    const handleCheckIn = () => {
        startTransition(async () => {
            const result = await checkInVendorAction(ticket.id);
            if (result.success) {
                toast({
                    title: 'Success!',
                    description: result.message,
                    variant: 'default'
                });
                setCheckInStatus('checkedIn');
                setCheckedInAt(new Date()); // Simulate timestamp update on client
            } else {
                 toast({
                    title: 'Error',
                    description: result.message,
                    variant: 'destructive'
                });
            }
        });
    }

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                    <UserCheck /> Vendor Check-In
                </CardTitle>
                <CardDescription>Verify vendor details and check them into the event.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div>
                    <p className="font-semibold">Vendor Name</p>
                    <p className="text-muted-foreground">{ticket.name}</p>
                 </div>
                 <div>
                    <p className="font-semibold">Booth Type</p>
                    <p className="text-muted-foreground">{ticket.boothType}</p>
                 </div>
                 <div>
                    <p className="font-semibold">Application Date</p>
                    <p className="text-muted-foreground">{format(ticket.createdAt.toDate(), 'PPP p')}</p>
                 </div>
                 <div>
                    <p className="font-semibold">Status</p>
                    <Badge variant={checkInStatus === 'checkedIn' ? 'default' : 'secondary'} className={checkInStatus === 'checkedIn' ? 'bg-green-600' : ''}>
                        {checkInStatus === 'checkedIn' ? 'Checked In' : 'Pending Check-In'}
                    </Badge>
                    {checkInStatus === 'checkedIn' && checkedInAt && (
                         <p className="text-xs text-muted-foreground mt-1">
                            at {format(checkedInAt instanceof Date ? checkedInAt : checkedInAt.toDate(), 'PPP p')}
                        </p>
                    )}
                 </div>
            </CardContent>
            <CardFooter>
                {checkInStatus === 'pending' ? (
                    <Button className="w-full" size="lg" onClick={handleCheckIn} disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2" />}
                        Confirm and Check-In Vendor
                    </Button>
                ) : (
                    <Alert variant="default" className="bg-green-50 border-green-200 text-green-800 w-full">
                        <CheckCircle2 className="h-4 w-4 !text-green-800" />
                        <AlertTitle>Already Checked In</AlertTitle>
                        <AlertDescription>This vendor has already been checked in.</AlertDescription>
                    </Alert>
                )}
            </CardFooter>
        </Card>
    );
}

export function TicketNotFound() {
    return (
         <Card className="max-w-md mx-auto">
             <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-2xl text-destructive">
                    <XCircle/> Invalid Ticket
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Ticket Not Found</AlertTitle>
                    <AlertDescription>
                        The ticket ID is invalid or does not exist. Please ask the vendor to show their original confirmation email.
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    )
}
