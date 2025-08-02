
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { sendDonationReceipt } from '@/ai/flows/send-donation-receipt-flow';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CreditCard, Banknote, HandHeart } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
    frequency: z.enum(['one-time', 'monthly'], { required_error: "Please select a frequency." }),
    amount: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, { message: "Please enter a valid amount." }),
    customAmount: z.string().optional(),
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email(),
    paymentMethod: z.enum(['zelle', 'credit-card'], { required_error: "Please select a payment method." }),
    // Zelle fields
    zelleSenderName: z.string().optional(),
    // Credit card fields (for validation simulation)
    cardNumber: z.string().optional(),
    expiryDate: z.string().optional(),
    cvc: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.paymentMethod === 'zelle' && (!data.zelleSenderName || data.zelleSenderName.length < 2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter the name on your Zelle account to help us verify payment.",
        path: ['zelleSenderName'],
      });
    }
    if (data.paymentMethod === 'credit-card') {
        if (!data.cardNumber) {
             ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Card number is required.", path: ['cardNumber'] });
        }
        if (!data.expiryDate) {
             ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Expiry date is required.", path: ['expiryDate'] });
        }
        if (!data.cvc) {
             ctx.addIssue({ code: z.ZodIssueCode.custom, message: "CVC is required.", path: ['cvc'] });
        }
    }
});


type DonationFormValues = z.infer<typeof formSchema>;

export function DonationForm() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      frequency: 'one-time',
      amount: "50",
      customAmount: "",
      name: "",
      email: "",
      paymentMethod: undefined,
      zelleSenderName: "",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
    },
    mode: 'onBlur',
  });

  const triggerValidation = async (fields: (keyof DonationFormValues)[]) => {
    const result = await form.trigger(fields);
    if (result) {
      if (step === 1) { // When moving from amount selection, also set the final amount
          const customAmount = form.getValues('customAmount');
          if (customAmount) {
              form.setValue('amount', customAmount);
          }
      }
      setStep(prev => prev + 1);
    }
  };

  const onSubmit: SubmitHandler<DonationFormValues> = async (data) => {
    setIsLoading(true);

    try {
        const response = await sendDonationReceipt({
            donorName: data.name,
            donorEmail: data.email,
            amount: parseFloat(data.amount),
            date: new Date(),
            isMonthly: data.frequency === 'monthly',
            paymentMethod: data.paymentMethod,
            zelleSenderName: data.zelleSenderName,
        });

        if (response.success) {
            if (data.paymentMethod === 'credit-card') {
                toast({
                    title: "Payment Successful!",
                    description: "Thank you for your generous donation. A receipt has been sent to your email.",
                });
            } else { // Zelle
                toast({
                    title: "Information Received!",
                    description: "Thank you! We will confirm your donation and send a receipt once the Zelle payment is verified by our team.",
                });
            }
            form.reset();
            setStep(1);
        } else {
             toast({
                variant: 'destructive',
                title: "An Error Occurred",
                description: response.message || "Could not process the donation at this time. Please try again.",
            });
        }

    } catch (error) {
        console.error("Donation form submission error:", error);
        toast({
            variant: 'destructive',
            title: "An Error Occurred",
            description: "Could not process the donation at this time. Please try again.",
        });
    }

    setIsLoading(false);
  };

  const paymentMethod = form.watch('paymentMethod');
  const amount = form.watch('amount');
  const customAmount = form.watch('customAmount');

  const oneTimeAmounts = ["25", "50", "100", "250"];
  const monthlyAmounts = ["10", "25", "50", "100"];
  const selectedAmounts = form.watch('frequency') === 'one-time' ? oneTimeAmounts : monthlyAmounts;
  const finalAmount = customAmount || amount;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className={cn("lg:col-span-3", step === 1 && "lg:col-span-2")}>
        <Card className="shadow-2xl">
          <CardHeader>
              <CardTitle className="font-headline text-3xl">Make a Donation</CardTitle>
              <CardDescription>Your generous contribution helps us continue our mission.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Step 1: Amount */}
                {step === 1 && (
                  <section className="space-y-6 animate-in fade-in-50">
                    <FormField control={form.control} name="frequency" render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Frequency</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="one-time" /></FormControl>
                              <FormLabel className="font-normal">One-Time</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="monthly" /></FormControl>
                              <FormLabel className="font-normal">Monthly</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    
                    <FormField control={form.control} name="amount" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Select an amount (USD)</FormLabel>
                             <FormControl>
                                <ToggleGroup type="single" defaultValue={field.value} onValueChange={(value) => { if(value) { field.onChange(value); form.setValue('customAmount', '')} }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {selectedAmounts.map(val => (
                                        <ToggleGroupItem key={val} value={val} aria-label={`Donate $${val}`} className="h-16 text-xl" >${val}</ToggleGroupItem>
                                    ))}
                                </ToggleGroup>
                            </FormControl>
                        </FormItem>
                    )}/>
                    
                    <FormField control={form.control} name="customAmount" render={({ field }) => (
                        <FormItem>
                        <FormLabel htmlFor="custom-amount-one-time" className="sr-only">Custom Amount</FormLabel>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <FormControl>
                                <Input {...field} id="custom-amount-one-time" type="number" placeholder="Or enter a custom amount" className="pl-8" onChange={(e) => {
                                    field.onChange(e);
                                    if(e.target.value) form.setValue('amount', '')
                                }}/>
                            </FormControl>
                        </div>
                         <FormMessage />
                      </FormItem>
                    )} />
                    
                    <Button type="button" onClick={() => triggerValidation(['frequency', 'amount', 'customAmount'])}>Next: Your Details</Button>
                  </section>
                )}

                {/* Step 2: Details */}
                {step === 2 && (
                    <section className="space-y-4 animate-in fade-in-50">
                        <h2 className="font-headline text-2xl">Your Information</h2>
                        <FormField name="name" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField name="email" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormDescription>Your receipt will be sent here.</FormDescription><FormMessage /></FormItem>
                        )} />
                        <div className="flex gap-4">
                            <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                            <Button type="button" onClick={() => triggerValidation(['name', 'email'])}>Next: Payment</Button>
                        </div>
                    </section>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                  <section className="space-y-6 animate-in fade-in-50">
                    <h2 className="font-headline text-2xl">Payment Method</h2>
                     <div className="p-4 border rounded-lg bg-secondary">
                        <p className="font-bold text-xl">Donation Amount: <span className="text-primary">${finalAmount}</span> ({form.getValues('frequency') === 'monthly' ? 'per month' : 'one-time'})</p>
                     </div>
                     
                     <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid md:grid-cols-2 gap-4">
                                   <Label htmlFor="payment-cc" className={cn("border-2 rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary", paymentMethod === 'credit-card' && 'border-primary ring-2 ring-primary')}>
                                        <RadioGroupItem value="credit-card" id="payment-cc" className="sr-only" />
                                        <CreditCard className="h-8 w-8 text-primary" strokeWidth={1.5} />
                                        <span className="font-semibold">Credit Card</span>
                                   </Label>
                                   <Label htmlFor="payment-zelle" className={cn("border-2 rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary", paymentMethod === 'zelle' && 'border-primary ring-2 ring-primary')}>
                                        <RadioGroupItem value="zelle" id="payment-zelle" className="sr-only" />
                                        <Banknote className="h-8 w-8 text-primary" strokeWidth={1.5} />
                                        <span className="font-semibold">Zelle</span>
                                   </Label>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                     )} />

                    {paymentMethod === 'credit-card' && (
                        <div className="space-y-4 animate-in fade-in-50">
                             <Alert>
                                <CreditCard className="h-4 w-4" />
                                <AlertTitle>This is a simulated form.</AlertTitle>
                                <AlertDescription>
                                    Please do not enter real credit card information. This form is for demonstration purposes only.
                                </AlertDescription>
                            </Alert>
                            <FormField name="cardNumber" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input placeholder="**** **** **** 1234" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <div className="grid grid-cols-2 gap-4">
                                <FormField name="expiryDate" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input placeholder="MM/YY" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField name="cvc" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>CVC</FormLabel><FormControl><Input placeholder="123" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'zelle' && (
                        <div className="space-y-4 animate-in fade-in-50">
                            <div className="p-4 border-2 border-primary/50 rounded-lg bg-primary/5">
                                <h3 className="font-headline font-bold text-lg text-primary">Complete Your Donation via Zelle</h3>
                                <p className="mt-2 text-muted-foreground">1. Please send <strong>${finalAmount}</strong> via Zelle to:</p>
                                <p className="text-2xl font-mono bg-background p-2 rounded-md text-center my-4">admin@azpdscc.org</p>
                                <p className="mt-2 text-muted-foreground">2. After sending, fill out your Zelle account name below and submit this form.</p>
                                <p className="font-bold text-destructive mt-2">Important: Your donation receipt will be emailed after our team manually verifies the transaction.</p>
                            </div>
                             <FormField name="zelleSenderName" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Name on Zelle Account</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormDescription>This is required to match your payment to your donation.</FormMessage /></FormItem>
                            )} />
                        </div>
                    )}

                     <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                        <Button type="submit" disabled={!paymentMethod || isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {paymentMethod === 'credit-card' ? `Donate $${finalAmount}` : 'Submit Information'}
                        </Button>
                    </div>

                  </section>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {step === 1 && (
        <div className="lg:col-span-1">
          <Card className="bg-secondary shadow-lg h-full flex flex-col">
            <CardHeader>
              <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 rounded-full p-4">
                      <HandHeart className="h-10 w-10 text-primary" strokeWidth={1.5} />
                  </div>
              </div>
              <CardTitle className="font-headline text-center text-3xl">Give the Gift of Time</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-center text-muted-foreground">
                  Volunteers are the heart of our organization. If you'd like to help with events, outreach, or administrative tasks, we'd love to have you. <Link href="/about" className="text-primary hover:underline">Learn more about our mission</Link>.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="default" size="lg" className="w-full">
                <Link href="/volunteer">Sign Up to Volunteer</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
