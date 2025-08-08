
'use client';

import { useActionState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { QrTestFormState } from './actions';
import { generateQrCodeAction } from './actions';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubmitButton } from '@/components/admin/submit-button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, QrCode } from 'lucide-react';

const initialState: QrTestFormState = {};

export default function QrTestPage() {
    const [state, formAction] = useActionState(generateQrCodeAction, initialState);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">QR Code System Test</CardTitle>
                    <CardDescription>
                        This page is a safe environment to test the end-to-end QR code generation and verification flow without affecting the live vendor application form.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div>
                            <Label htmlFor="vendorName">Vendor Name</Label>
                            <Input id="vendorName" name="vendorName" defaultValue="Test Vendor Inc." />
                            {state?.errors?.vendorName && <p className="text-destructive text-sm mt-1">{state.errors.vendorName.join(', ')}</p>}
                        </div>
                        <div>
                            <Label htmlFor="boothType">Booth Type</Label>
                            <Input id="boothType" name="boothType" defaultValue="10x10 Food Stall" />
                             {state?.errors?.boothType && <p className="text-destructive text-sm mt-1">{state.errors.boothType.join(', ')}</p>}
                        </div>

                        <SubmitButton isEditing={false} createText="Generate Test QR Code" />

                        {state?.errors?._form && (
                          <Alert variant="destructive" className="mt-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{state.errors._form.join(', ')}</AlertDescription>
                          </Alert>
                        )}
                    </form>
                </CardContent>

                {state?.result && (
                    <CardFooter className="flex flex-col items-start gap-4 pt-6 border-t">
                        <h3 className="font-headline text-lg font-bold">Test Result</h3>
                        <div className="flex flex-col sm:flex-row gap-6 items-center">
                            <img src={state.result.qrCodeUrl} alt="Generated QR Code" width={200} height={200} className="border-4 border-foreground" />
                            <div className="space-y-2">
                                <p><strong>Ticket ID:</strong> {state.result.ticketId}</p>
                                <p><strong>QR Code URL (from qrserver.com):</strong></p>
                                <Input readOnly value={state.result.qrCodeUrl} className="text-xs" />
                                <p><strong>Verification Link (encoded in QR):</strong></p>
                                <Link href={state.result.verificationUrl} target="_blank" className="text-primary hover:underline break-all text-sm">{state.result.verificationUrl}</Link>
                            </div>
                        </div>
                         <Alert className="mt-4">
                            <QrCode className="h-4 w-4" />
                            <AlertTitle>How to Test</AlertTitle>
                            <AlertDescription>
                                Open the camera app on your phone and point it at the QR code above, or click the verification link to simulate what your event staff will see.
                            </AlertDescription>
                        </Alert>
                    </CardFooter>
                )}
            </Card>
        </div>
    )
}
