
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';

const formSchema = z.object({
    paymentMethod: z.enum(['zelle', 'credit-card'], { required_error: "Please select a payment method." }),
    frequency: z.enum(['one-time', 'monthly'], { required_error: "Please select a frequency." }),
    amount: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, { message: "Please enter a valid amount." }),
    customAmount: z.string().optional(),
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email(),
    zelleSenderName: z.string().optional(),
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
        if (!data.cardNumber?.match(/^\d{16}$/)) {
             ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please enter a valid 16-digit card number.", path: ['cardNumber'] });
        }
        if (!data.expiryDate?.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
             ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please use MM/YY format.", path: ['expiryDate'] });
        }
        if (!data.cvc?.match(/^\d{3,4}$/)) {
             ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please enter a valid CVC.", path: ['cvc'] });
        }
    }
});


type DonationFormValues = z.infer<typeof formSchema>;

export function DonationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: undefined,
      frequency: 'one-time',
      amount: "50",
      customAmount: '',
      name: '',
      email: '',
      zelleSenderName: '',
      cardNumber: '',
      expiryDate: '',
      cvc: '',
    },
    mode: 'onBlur',
  });
  
  const paymentMethod = form.watch('paymentMethod');
  const frequency = form.watch('frequency');
  const amount = form.watch('amount');
  const customAmount = form.watch('customAmount');

  const finalAmount = (customAmount && parseFloat(customAmount) > 0) ? customAmount : amount;
  const oneTimeAmounts = ["25", "50", "100", "250"];
  const monthlyAmounts = ["10", "25", "50", "100"];
  const selectedAmounts = frequency === 'one-time' ? oneTimeAmounts : monthlyAmounts;

  const onSubmit: SubmitHandler<DonationFormValues> = async (data) => {
    setIsLoading(true);
    // Use the custom amount if it's filled out, otherwise use the selected amount
    const finalData = {
        ...data,
        amount: (data.customAmount && parseFloat(data.customAmount) > 0) ? data.customAmount : data.amount,
    }

    try {
        const response = await sendDonationReceipt({
            donorName: finalData.name,
            donorEmail: finalData.email,
            amount: parseFloat(finalData.amount),
            date: new Date().toISOString(),
            isMonthly: finalData.frequency === 'monthly',
            paymentMethod: finalData.paymentMethod,
            zelleSenderName: finalData.zelleSenderName,
        });

        if (response.success) {
            if (finalData.paymentMethod === 'credit-card') {
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
            form.reset({
                frequency: 'one-time',
                amount: '50',
                paymentMethod: undefined,
                customAmount: '',
                name: '',
                email: '',
                zelleSenderName: '',
                cardNumber: '',
                expiryDate: '',
                cvc: '',
            });
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
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2">
        <Card className="shadow-2xl">
          <CardHeader>
              <CardTitle className="font-headline text-3xl">Make a Donation</CardTitle>
              <CardDescription>Your generous contribution helps us continue our mission.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                    <FormItem className="space-y-4">
                        <FormLabel className="text-lg font-semibold">1. Choose your payment method</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} value={field.value} className="grid md:grid-cols-2 gap-4">
                                <FormItem>
                                   <RadioGroupItem value="credit-card" id="payment-cc" className="sr-only peer" />
                                   <FormLabel htmlFor="payment-cc" className="border-2 rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary">
                                        <CreditCard className="h-8 w-8 text-primary" strokeWidth={1.5} />
                                        <span className="font-semibold">Credit Card</span>
                                   </FormLabel>
                                </FormItem>
                                <FormItem>
                                   <RadioGroupItem value="zelle" id="payment-zelle" className="sr-only peer" />
                                   <FormLabel htmlFor="payment-zelle" className="border-2 rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary">
                                        <Banknote className="h-8 w-8 text-primary" strokeWidth={1.5} />
                                        <span className="font-semibold">Zelle</span>
                                   </FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <AnimatePresence>
                {paymentMethod && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                    >
                        <FormField control={form.control} name="frequency" render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-lg font-semibold">2. Select frequency</FormLabel>
                            <FormControl>
                              <RadioGroup onValueChange={(value) => {
                                  field.onChange(value);
                                  const newDefaultAmount = value === 'one-time' ? '50' : '25';
                                  form.setValue('amount', newDefaultAmount);
                                  form.setValue('customAmount', '');
                              }} value={field.value} className="flex gap-4">
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
                                <FormLabel className="text-lg font-semibold">3. Choose an amount (USD)</FormLabel>
                                 <FormControl>
                                    <ToggleGroup type="single" value={field.value} onValueChange={(value) => { if(value) { field.onChange(value); form.setValue('customAmount', '')} }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {selectedAmounts.map(val => (
                                            <ToggleGroupItem key={val} value={val} aria-label={`Donate $${val}`} className="h-16 text-xl" >${val}</ToggleGroupItem>
                                        ))}
                                    </ToggleGroup>
                                </FormControl>
                            </FormItem>
                        )}/>
                        
                        <FormField control={form.control} name="customAmount" render={({ field }) => (
                            <FormItem>
                            <FormLabel htmlFor="custom-amount" className="sr-only">Custom Amount</FormLabel>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                <FormControl>
                                    <Input {...field} id="custom-amount" type="number" placeholder="Or enter a custom amount" className="pl-8" onChange={(e) => {
                                        field.onChange(e);
                                        if(e.target.value) form.setValue('amount', '')
                                    }}/>
                                </FormControl>
                            </div>
                             <FormMessage />
                          </FormItem>
                        )} />

                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">4. Your Information</h2>
                            <FormField name="name" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField name="email" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormDescription>Your receipt will be sent here.</FormDescription><FormMessage /></FormItem>
                            )} />
                        </div>

                        {paymentMethod === 'credit-card' && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">5. Credit Card Details</h2>
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
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">5. Zelle Payment</h2>
                                <div className="p-4 border-2 border-primary/50 rounded-lg bg-primary/5">
                                    <h3 className="font-headline font-bold text-lg text-primary">Complete Your Donation via Zelle</h3>
                                    <p className="mt-2 text-muted-foreground">1. Please send <strong>${finalAmount}</strong> via Zelle to:</p>
                                    <p className="text-2xl font-mono bg-background p-2 rounded-md text-center my-4">admin@azpdscc.org</p>
                                    <p className="mt-2 text-muted-foreground">2. After sending, fill out your Zelle account name below and submit this form.</p>
                                    <p className="font-bold text-destructive mt-2">Important: Your donation receipt will be emailed after our team manually verifies the transaction.</p>
                                </div>
                                 <FormField name="zelleSenderName" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Name on Zelle Account</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormDescription>This is required to match your payment to your donation.</FormDescription><FormMessage /></FormItem>
                                )} />
                            </div>
                        )}

                        <Button type="submit" size="lg" disabled={!paymentMethod || isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {paymentMethod === 'credit-card' ? `Donate $${finalAmount}` : 'Submit Information'}
                        </Button>
                    </motion.div>
                )}
                </AnimatePresence>

              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
          <Card className="bg-secondary shadow-lg h-full flex flex-col sticky top-24">
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
    </div>
  );
}

    