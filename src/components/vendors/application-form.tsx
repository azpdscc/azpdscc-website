
"use client";

import * as React from 'react';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { vendorApplicationAction } from '@/app/admin/vendors/actions';
import type { VendorApplicationState } from '@/app/admin/vendors/actions';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';


const boothOptions: { [key: string]: string } = {
  '10x10-own': '10x10 Booth (Own Canopy) - $250',
  '10x10-our': '10x10 Booth (Our Canopy) - $350',
  '10x20-own': '10x20 Booth (Own Canopy) - $500',
  '10x20-our': '10x20 Booth (Our Canopy) - $650',
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Application
        </Button>
    )
}

function VendorFormContent({ baseUrl }: { baseUrl: string }) {
    const { toast } = useToast();
    const initialState: VendorApplicationState = { errors: {}, message: '' };
    const actionWithBaseUrl = vendorApplicationAction.bind(null, baseUrl);
    const [state, formAction] = useActionState(actionWithBaseUrl, initialState);
    
    const [zelleDate, setZelleDate] = useState<Date | undefined>();
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const formRef = React.useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!state) return;
        if (state.success) {
            setShowSuccessDialog(true);
        } else if (state.message || state.errors?._form) {
            toast({
                variant: 'destructive',
                title: "Submission Failed",
                description: state.message || state.errors?._form?.join(', '),
            });
        }
    }, [state, toast]);

    const handleDialogClose = () => {
        setShowSuccessDialog(false);
        if (formRef.current) {
            formRef.current.reset();
        }
        setPaymentConfirmed(false);
        setZelleDate(undefined);
    }

    return (
        <>
        <form ref={formRef} action={formAction} className="space-y-8">
            <fieldset className="space-y-4">
                <legend className="font-headline text-2xl">Step 1: Your Information & Booth Details</legend>
                <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" placeholder="John Doe" required />
                    {state?.errors?.name && <p className="text-destructive text-sm mt-1">{state.errors.name.join(', ')}</p>}
                </div>
                <div>
                    <Label htmlFor="organization">Organization (Optional)</Label>
                    <Input id="organization" name="organization" placeholder="Your Company LLC" />
                    {state?.errors?.organization && <p className="text-destructive text-sm mt-1">{state.errors.organization.join(', ')}</p>}
                </div>
                <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                    {state?.errors?.email && <p className="text-destructive text-sm mt-1">{state.errors.email.join(', ')}</p>}
                </div>
                <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="(555) 555-5555" required />
                    {state?.errors?.phone && <p className="text-destructive text-sm mt-1">{state.errors.phone.join(', ')}</p>}
                </div>
                <div>
                    <Label htmlFor="boothType">Booth Type</Label>
                    <Select name="boothType" required>
                        <SelectTrigger><SelectValue placeholder="Select a booth type" /></SelectTrigger>
                        <SelectContent>
                            {Object.entries(boothOptions).map(([value, label]) => (
                                <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {state?.errors?.boothType && <p className="text-destructive text-sm mt-1">{state.errors.boothType.join(', ')}</p>}
                </div>
                <div>
                    <Label htmlFor="productDescription">Product/Service Description</Label>
                    <Textarea id="productDescription" name="productDescription" placeholder="Describe what you will be selling or offering..." required />
                    {state?.errors?.productDescription && <p className="text-destructive text-sm mt-1">{state.errors.productDescription.join(', ')}</p>}
                </div>
            </fieldset>

            <fieldset className="space-y-6">
                 <legend className="font-headline text-2xl">Step 2: Send Payment & Confirm</legend>
                 <div className="p-6 border-2 border-primary/50 rounded-lg bg-primary/5">
                    <h3 className="font-headline font-bold text-lg text-primary">Complete Your Booth Payment via Zelle</h3>
                    <p className="mt-2 text-muted-foreground">Please send your booth payment via Zelle to:</p>
                    <p className="text-2xl font-mono bg-background p-2 rounded-md text-center my-4">admin@azpdscc.org</p>
                    <p className="font-bold text-muted-foreground">Important: Below, after you confirm payment, please enter the name exactly as it appears on your Zelle account.</p>
                </div>
                 <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <Checkbox id="paymentSent" name="paymentSent" checked={paymentConfirmed} onCheckedChange={(checked) => setPaymentConfirmed(checked as boolean)} />
                    <div className="space-y-1 leading-none">
                        <Label htmlFor="paymentSent" className="text-base">I confirm that I have sent the Zelle payment.</Label>
                        {state?.errors?.paymentSent && <p className="text-destructive text-sm mt-1">{state.errors.paymentSent.join(', ')}</p>}
                    </div>
                 </div>
             </fieldset>

             <AnimatePresence>
                {paymentConfirmed && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                         <fieldset className="space-y-4">
                            <legend className="font-headline text-2xl">Step 3: Zelle Payment Information</legend>
                             <div>
                                <Label htmlFor="zelleSenderName">Name on Zelle Account</Label>
                                <Input id="zelleSenderName" name="zelleSenderName" placeholder="This must match the name on your Zelle account" required />
                                {state?.errors?.zelleSenderName && <p className="text-destructive text-sm mt-1">{state.errors.zelleSenderName.join(', ')}</p>}
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="zelleDateSent">Date Sent</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className={cn("w-full sm:w-[240px] pl-3 text-left font-normal", !zelleDate && "text-muted-foreground")}>
                                            {zelleDate ? format(zelleDate, "PPP") : <span>Pick a date</span>}
                                            <CalendarIcon className="h-4 w-4 opacity-50 ml-auto" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={zelleDate} onSelect={setZelleDate} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                                    </PopoverContent>
                                </Popover>
                                <input type="hidden" name="zelleDateSent" value={zelleDate?.toISOString() ?? ''} />
                                {state?.errors?.zelleDateSent && <p className="text-destructive text-sm mt-1">{state.errors.zelleDateSent.join(', ')}</p>}
                            </div>
                        </fieldset>

                        {state?.errors?._form && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{state.errors._form.join(', ')}</AlertDescription>
                            </Alert>
                        )}
                        <SubmitButton />
                    </motion.div>
                )}
             </AnimatePresence>
        </form>

        <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <AlertDialogTitle className="text-center">Application Submitted!</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        {state?.message}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={handleDialogClose}>Close</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </>
    );
}

export function ApplicationForm() {
  const [baseUrl, setBaseUrl] = useState<string | null>(null);

  useEffect(() => {
    // This effect runs only on the client, ensuring window is available.
    setBaseUrl(window.location.origin);
  }, []);

  if (!baseUrl) {
    // Render a loading state or a skeleton while waiting for the base URL.
    return <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  // Only render the form content once the base URL is available.
  return <VendorFormContent baseUrl={baseUrl} />;
}
