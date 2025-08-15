
'use client';
import { useState, useEffect, useTransition } from 'react';
import type { VendorApplication, VendorApplicationFormData } from '@/lib/types';
import { getVendorApplications } from '@/services/vendorApplications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { verifyVendorPayment } from '@/services/vendorApplications';
import { verifyAndSendTicketAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function VerifyButton({ application, onVerify }: { application: VendorApplicationFormData, onVerify: (app: VendorApplicationFormData) => void }) {
    const [isPending, startTransition] = useTransition();

    const handleVerify = () => {
        startTransition(() => {
            onVerify(application);
        });
    }

    return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
             <Button size="sm" variant="outline" disabled={isPending}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Verify & Send Ticket
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to verify this payment?</AlertDialogTitle>
              <AlertDialogDescription>
                This will mark the payment as verified and send the official ticket with a QR code to the vendor's email ({application.email}). This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleVerify} disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Yes, Verify and Send
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    );
}

export default function ManageVendorsPage() {
    const [applications, setApplications] = useState<VendorApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [baseUrl, setBaseUrl] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        // This effect runs only on the client.
        setBaseUrl(window.location.origin);
        fetchApplications();
    }, []);

    const fetchApplications = () => {
        setIsLoading(true);
        getVendorApplications()
            .then(setApplications)
            .finally(() => setIsLoading(false));
    };
    
    const handleVerifyAndSend = async (application: VendorApplicationFormData) => {
        if (!application.id) {
             toast({ variant: "destructive", title: "Error", description: "Application ID is missing." });
             return;
        }
        if (!baseUrl) {
             toast({ variant: "destructive", title: "Error", description: "Could not determine application URL. Please refresh." });
             return;
        }

        // First, mark as verified in DB
        await verifyVendorPayment(application.id);
        
        // Then, trigger the flow to send the email
        const result = await verifyAndSendTicketAction(baseUrl, application);

        if (result.success) {
            toast({ title: "Success!", description: result.message });
            fetchApplications(); // Refresh the list
        } else {
            toast({ variant: "destructive", title: "Email Failed", description: result.message });
        }
    };


    if (isLoading) {
        return <div className="container mx-auto p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    const pendingApps = applications.filter(app => app.status === 'Pending Verification');
    const verifiedApps = applications.filter(app => app.status === 'Verified');

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Pending Vendor Applications</CardTitle>
                    <CardDescription>These vendors have submitted an application and are awaiting payment verification. Once you confirm their Zelle payment, click "Verify & Send Ticket".</CardDescription>
                </CardHeader>
                <CardContent>
                    {pendingApps.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Vendor</TableHead>
                                    <TableHead>Event</TableHead>
                                    <TableHead>Zelle Details</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingApps.map((app) => (
                                    <TableRow key={app.id}>
                                        <TableCell>
                                            <div className="font-medium">{app.name}</div>
                                            <div className="text-sm text-muted-foreground">{app.email}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div>{app.eventName}</div>
                                            <div className="text-sm text-muted-foreground">{app.boothType}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div>From: <span className="font-semibold">{app.zelleSenderName}</span></div>
                                            <div className="text-sm text-muted-foreground">Sent on: {app.zelleDateSent}</div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <VerifyButton application={app as VendorApplicationFormData} onVerify={handleVerifyAndSend} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                         <Alert>
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertTitle>All Clear!</AlertTitle>
                            <AlertDescription>There are no pending vendor applications to review.</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Verified Applications</CardTitle>
                    <CardDescription>These vendors have been verified and their tickets have been sent.</CardDescription>
                </CardHeader>
                <CardContent>
                     {verifiedApps.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Vendor</TableHead>
                                    <TableHead>Event</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {verifiedApps.map((app) => (
                                    <TableRow key={app.id} className="bg-secondary/40">
                                        <TableCell>
                                            <div className="font-medium">{app.name}</div>
                                            <div className="text-sm text-muted-foreground">{app.email}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div>{app.eventName}</div>
                                            <div className="text-sm text-muted-foreground">{app.boothType}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge>
                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                Verified
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                         <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>No Verified Applications</AlertTitle>
                            <AlertDescription>No vendor payments have been verified yet.</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
