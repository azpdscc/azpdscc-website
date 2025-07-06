
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { sendDonationReceipt } from '@/ai/flows/send-donation-receipt-flow';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CreditCard, Banknote } from 'lucide-react';

const formSchema = z.object({
    frequency: z.enum(['one-time', 'monthly'], { required_error: "Please select a frequency." }),
    amount: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, { message: "Please enter a valid amount." }),
    customAmount: z.string().optional(),
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email(),
    paymentMethod: z.enum(['zelle', 'credit-card'], { required_error: "Please select a payment method." }),
    // Zelle fields
    zelleSenderName: z.string().optional(),
    zelleTransactionId: z.string().optional(),
    paymentSent: z.boolean().optional(),
    // Credit card fields (for validation simulation)
    cardNumber: z.string().optional(),
    expiryDate: z.string().optional(),
    cvc: z.string().optional(),
}).refine(data => {
    if (data.paymentMethod === 'zelle') {
        return !!data.zelleSenderName && data.zelleSenderName.length >= 2 && data.paymentSent;
    }
    return true;
}, {
    message: "Please fill out the required Zelle confirmation details.",
    path: ['zelleSenderName'],
}).refine(data => {
     if (data.paymentMethod === 'credit-card') {
        return !!data.cardNumber && !!data.expiryDate && !!data.cvc;
    }
    return true;
}, {
    message: "Please fill in all credit card details.",
    path: ['cardNumber']
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
      name: "",
      email: "",
      paymentSent: false,
    },
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
    
    if(data.paymentMethod === 'credit-card') {
        try {
            const result = await sendDonationReceipt({
                donorName: data.name,
                donorEmail: data.email,
                amount: parseFloat(data.amount),
                date: new Date(),
                isMonthly: data.frequency === 'monthly',
            });
            toast({
                title: "Payment Successful!",
                description: "Thank you for your generous donation. A receipt has been sent to your email.",
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "An Error Occurred",
                description: "Could not process the donation at this time. Please try again.",
            });
        }
    } else { // Zelle
         toast({
            title: "Information Received!",
            description: "Thank you! We will confirm your donation once the Zelle payment is verified.",
        });
    }

    setIsLoading(false);
    form.reset();
    setStep(1);
  };

  const paymentMethod = form.watch('paymentMethod');
  const amount = form.watch('amount');
  const customAmount = form.watch('customAmount');

  const oneTimeAmounts = ["25", "50", "100", "250"];
  const monthlyAmounts = ["10", "25", "50", "100"];
  const selectedAmounts = form.watch('frequency') === 'one-time' ? oneTimeAmounts : monthlyAmounts;
  const finalAmount = customAmount || amount;

  return (
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
                        <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input placeholder="**** **** **** 1234" {...field} /></FormControl></FormItem>
                    )}/>
                     <div className="grid grid-cols-2 gap-4">
                        <FormField name="expiryDate" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input placeholder="MM/YY" {...field} /></FormControl></FormItem>
                        )}/>
                        <FormField name="cvc" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>CVC</FormLabel><FormControl><Input placeholder="123" {...field} /></FormControl></FormItem>
                        )}/>
                    </div>
                </div>
            )}

            {paymentMethod === 'zelle' && (
                <div className="space-y-4 animate-in fade-in-50">
                    <div className="p-4 border-2 border-primary/50 rounded-lg bg-primary/5">
                        <h3 className="font-headline font-bold text-lg text-primary">Complete Your Donation via Zelle</h3>
                        <p className="mt-2 text-muted-foreground">Please send <strong>${finalAmount}</strong> via Zelle to:</p>
                        <p className="text-2xl font-mono bg-background p-2 rounded-md text-center my-4">admin@azpdscc.org</p>
                        <p className="font-bold text-destructive">Important: Please include your name in the Zelle memo.</p>
                    </div>
                     <FormField name="zelleSenderName" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Name on Zelle Account</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="paymentSent" render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <div className="space-y-1 leading-none">
                            <FormLabel>I confirm that I have sent the Zelle payment of ${finalAmount}.</FormLabel>
                            </div>
                        </FormItem>
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
  );
}

