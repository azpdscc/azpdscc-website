
"use client";

import { useState, useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { vendorApplicationAction } from '@/app/admin/vendors/actions';
import type { VendorApplicationState } from '@/app/admin/vendors/actions';


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const boothOptions: { [key: string]: string } = {
  '10x10-own': '10x10 Booth (Own Canopy) - $250',
  '10x10-our': '10x10 Booth (Our Canopy) - $350',
  '10x20-own': '10x20 Booth (Own Canopy) - $500',
  '10x20-our': '10x20 Booth (Our Canopy) - $650',
};

const boothPrices: { [key: string]: number } = {
  '10x10-own': 250,
  '10x10-our': 350,
  '10x20-own': 500,
  '10x20-our': 650,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Application
        </Button>
    )
}

function VendorFormContent({ baseUrl }: { baseUrl: string }) {
    const [step, setStep] = useState(1);
    const { toast } = useToast();

    const initialState: VendorApplicationState = { errors: {}, message: '' };
    const actionWithBaseUrl = vendorApplicationAction.bind(null, baseUrl);
    const [formState, formAction] = useActionState(actionWithBaseUrl, initialState);
    
    // We use a different form instance here to manage client-side state and validation triggers
    const form = useForm({
        defaultValues: {
            name: "",
            organization: "",
            email: "",
            phone: "",
            boothType: undefined,
            productDescription: "",
            paymentSent: false,
            zelleSenderName: "",
            zelleDateSent: undefined,
        },
    });

    useEffect(() => {
        if (formState.success) {
            toast({
                title: "Application Submitted!",
                description: formState.message,
            });
            form.reset();
            setStep(1);
        } else if (formState.message || formState.errors?._form) {
            toast({
                variant: 'destructive',
                title: "Submission Failed",
                description: formState.message || formState.errors?._form?.join(', '),
            });
        }
    }, [formState, toast, form]);

    const triggerValidation = async (fields: (keyof z.infer<typeof form.schema>)[]) => {
        const result = await form.trigger(fields);
        if (result) {
            setStep(prev => prev + 1);
        }
    };
    
    const selectedBoothType = form.watch('boothType');
    const totalPrice = selectedBoothType ? boothPrices[selectedBoothType] : 0;

    return (
        <Form {...form}>
            <form action={formAction} className="space-y-8">
                <div className="flex items-center space-x-4 mb-8">
                {[1, 2, 3].map(s => (
                    <div key={s} className="flex items-center">
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                        s < step && "bg-green-500 text-white",
                        s === step && "bg-primary text-primary-foreground",
                        s > step && "bg-secondary text-secondary-foreground"
                    )}>{s}</div>
                    {s < 3 && <div className={cn("w-16 h-1", s < step ? 'bg-green-500' : 'bg-secondary')} />}
                    </div>
                ))}
                </div>

                {step === 1 && (
                <section className="space-y-4">
                    <h2 className="font-headline text-2xl">Step 1: Contact Information</h2>
                    <FormField name="name" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage>{formState.errors?.name}</FormMessage></FormItem>
                    )} />
                    <FormField name="organization" render={({ field }) => (
                    <FormItem><FormLabel>Organization (Optional)</FormLabel><FormControl><Input placeholder="Your Company LLC" {...field} /></FormControl><FormMessage>{formState.errors?.organization}</FormMessage></FormItem>
                    )} />
                    <FormField name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage>{formState.errors?.email}</FormMessage></FormItem>
                    )} />
                    <FormField name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="(555) 555-5555" {...field} /></FormControl><FormMessage>{formState.errors?.phone}</FormMessage></FormItem>
                    )} />
                    <Button type="button" onClick={() => triggerValidation(['name', 'email', 'phone'])}>Next</Button>
                </section>
                )}

                {step === 2 && (
                <section className="space-y-4">
                    <h2 className="font-headline text-2xl">Step 2: Booth Details</h2>
                    <FormField name="boothType" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Booth Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a booth type" /></SelectTrigger></FormControl>
                        <SelectContent>
                            {Object.entries(boothOptions).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage>{formState.errors?.boothType}</FormMessage>
                    </FormItem>
                    )} />
                    <FormField name="productDescription" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Product/Service Description</FormLabel>
                        <FormControl><Textarea placeholder="Describe what you will be selling or offering at your booth..." {...field} /></FormControl>
                        <FormMessage>{formState.errors?.productDescription}</FormMessage>
                    </FormItem>
                    )} />
                    <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                    <Button type="button" onClick={() => triggerValidation(['boothType', 'productDescription'])}>Proceed to Payment</Button>
                    </div>
                </section>
                )}

                {step === 3 && (
                <section className="space-y-6">
                    <h2 className="font-headline text-2xl">Step 3: Payment & Confirmation</h2>
                    <div className="p-6 border rounded-lg bg-secondary">
                    <h3 className="font-headline font-bold text-lg">Application Summary</h3>
                    <p><strong>Booth Type:</strong> {selectedBoothType ? boothOptions[selectedBoothType] : 'N/A'}</p>
                    <p className="font-bold text-xl mt-2">Total Amount Due: <span className="text-primary">${totalPrice}</span></p>
                    </div>
                    
                    <div className="p-6 border-2 border-primary/50 rounded-lg bg-primary/5">
                        <h3 className="font-headline font-bold text-lg text-primary">Complete Your Booth Payment via Zelle</h3>
                        <p className="mt-2 text-muted-foreground">Please send the total amount of <strong>${totalPrice}</strong> via Zelle to:</p>
                        <p className="text-2xl font-mono bg-background p-2 rounded-md text-center my-4">admin@azpdscc.org</p>
                        <p className="font-bold text-destructive">Important: You must include your name or organization name in the Zelle memo for us to identify your payment.</p>
                        <p className="mt-2 text-sm text-muted-foreground">Your booth registration will be confirmed only after payment is received and verified by our team.</p>
                    </div>

                    <h3 className="font-headline text-lg">Confirm Your Payment</h3>
                    <FormField name="zelleSenderName" render={({ field }) => (
                    <FormItem><FormLabel>Name on Zelle Account</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage>{formState.errors?.zelleSenderName}</FormMessage></FormItem>
                    )} />
                    <FormField name="zelleDateSent" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Date Sent</FormLabel>
                        <Popover>
                        <PopoverTrigger asChild><FormControl>
                            <Button variant={"outline"} className={cn("w-full sm:w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="h-4 w-4 opacity-50 ml-auto" />
                            </Button>
                        </FormControl></PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                        </PopoverContent>
                        </Popover><FormMessage>{formState.errors?.zelleDateSent}</FormMessage>
                    </FormItem>
                    )} />
                    <FormField name="paymentSent" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} name={field.name} /></FormControl>
                        <div className="space-y-1 leading-none">
                        <FormLabel>I confirm that I have sent the Zelle payment of ${totalPrice}.</FormLabel>
                        <FormMessage>{formState.errors?.paymentSent}</FormMessage>
                        </div>
                    </FormItem>
                    )} />

                    {formState.errors?._form && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{formState.errors._form.join(', ')}</AlertDescription>
                    </Alert>
                    )}
                    
                    <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                    <SubmitButton />
                    </div>
                </section>
                )}
            </form>
        </Form>
    );
}

export function ApplicationForm() {
  const [baseUrl, setBaseUrl] = useState<string | null>(null);

  useEffect(() => {
    // This effect runs only on the client, ensuring window is available.
    setBaseUrl(window.location.origin);
  }, []);

  // Render a loading state or nothing until the baseUrl is available
  if (!baseUrl) {
    return <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  return <VendorFormContent baseUrl={baseUrl} />;
}
