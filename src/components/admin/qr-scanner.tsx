
'use client';

import { useState, useEffect, useRef } from 'react';
import QrScannerComponent from 'react-qr-scanner';
import { getVendorApplicationById } from '@/services/vendorApplications';
import { checkInVendorAction } from '@/app/admin/check-in/actions';
import { useToast } from '@/hooks/use-toast';
import { VerifyTicketClient, TicketNotFound } from '@/components/admin/verify-ticket-client';
import type { VendorApplication } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle, Camera, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

export function QrScanner() {
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [ticket, setTicket] = useState<VendorApplication | null | 'not-found'>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const stopProcessing = useRef(false);

    useEffect(() => {
        const checkCameraPermission = async () => {
            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    throw new Error('Camera API not available in this browser.');
                }
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setHasCameraPermission(true);
                // We need to stop the tracks to release the camera for the QrReader
                stream.getTracks().forEach(track => track.stop());
            } catch (err) {
                console.error("Camera permission error:", err);
                setHasCameraPermission(false);
                setError("A camera is required to scan QR codes. This feature is intended for mobile devices. Please enable camera permissions in your browser settings if you have a camera.");
            }
        };
        checkCameraPermission();
    }, []);

    useEffect(() => {
        if (!scannedData || stopProcessing.current) return;

        const processScan = async () => {
            setIsLoading(true);
            setTicket(null); // Reset previous ticket state
            setError(null);
            
            try {
                const url = new URL(scannedData);
                const ticketId = url.searchParams.get('ticketId');

                if (ticketId) {
                    const fetchedTicket = await getVendorApplicationById(ticketId);
                    if (fetchedTicket) {
                        setTicket(fetchedTicket);
                    } else {
                        setTicket('not-found');
                    }
                } else {
                    setError("Invalid QR code. The code does not contain a valid ticket ID.");
                }
            } catch (err) {
                setError("Invalid QR code format. Please scan a valid PDSCC ticket.");
            } finally {
                setIsLoading(false);
            }
        };

        processScan();
    }, [scannedData]);


    const handleCheckIn = async (ticketId: string) => {
        const result = await checkInVendorAction(ticketId);
        if (result.success) {
            toast({ title: 'Success!', description: result.message });
            if (ticket && ticket !== 'not-found') {
                setTicket({
                    ...ticket,
                    checkInStatus: 'checkedIn',
                    checkedInAt: new Date().toISOString()
                });
            }
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
    };
    
    const handleReset = () => {
        setScannedData(null);
        setTicket(null);
        setError(null);
        stopProcessing.current = false;
    };
    
    const handleError = (err: any) => {
        console.error(err);
        if (err.name === 'NotAllowedError' || err.name === 'NotFoundError') {
             setError("Camera access is required. Please enable permissions in your browser settings.");
        } else {
             setError("Could not start video source. Ensure you have a working camera connected and enabled.");
        }
        setHasCameraPermission(false);
    }

    if (hasCameraPermission === null) {
        return <div className="flex items-center justify-center p-4 text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Checking for camera permissions...</div>;
    }
    
    if (!hasCameraPermission) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Camera Issue Detected</AlertTitle>
                <AlertDescription>
                    {error || "A camera is required to scan QR codes. This feature is intended for mobile devices. Please enable camera permissions in your browser settings if you have a camera."}
                </AlertDescription>
            </Alert>
        );
    }
    
    if (scannedData && (ticket || error)) {
        return (
            <div className="flex flex-col items-center gap-4">
                {isLoading && <Loader2 className="h-8 w-8 animate-spin" />}
                {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                {ticket === 'not-found' && <TicketNotFound />}
                {ticket && ticket !== 'not-found' && <VerifyTicketClient ticket={ticket} onCheckIn={handleCheckIn} />}
                <Button onClick={handleReset} variant="outline">Scan Another Ticket</Button>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground">Point your camera at a vendor's QR code.</p>
            <div className="w-full max-w-sm rounded-lg overflow-hidden border">
                <QrScannerComponent
                    onScan={(result: any) => {
                        if (result && !scannedData) {
                            stopProcessing.current = true;
                            setScannedData(result.text);
                        }
                    }}
                    onError={handleError}
                    constraints={{ video: { facingMode: 'environment' } }}
                    style={{ width: '100%' }}
                />
            </div>
        </div>
    );
}
