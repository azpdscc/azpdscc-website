
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { sendDonationReceipt } from '@/ai/flows/send-donation-receipt-flow';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
    amount: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, { message: "Please enter a valid amount." }),
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email(),
    zelleSenderName: z.string().min(2, "Please enter the name on your Zelle account to help us verify payment."),
});

type ZelleDonationFormValues = z.infer<typeof formSchema>;

export function DonationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<ZelleDonationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
      name: '',
      email: '',
      zelleSenderName: '',
    },
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<ZelleDonationFormValues> = async (data) => {
    setIsLoading(true);
    
    try {
        const response = await sendDonationReceipt({
            donorName: data.name,
            donorEmail: data.email,
            amount: parseFloat(data.amount),
            date: new Date().toISOString(),
            isMonthly: false, // Zelle payments are one-time only
            paymentMethod: 'zelle',
            zelleSenderName: data.zelleSenderName,
        });

        if (response.success) {
            toast({
                title: "Information Received!",
                description: "Thank you! We will confirm your donation and send a receipt once the Zelle payment is verified by our team.",
            });
            form.reset();
        } else {
             toast({
                variant: 'destructive',
                title: "An Error Occurred",
                description: response.message || "Could not process the donation at this time. Please try again.",
            });
        }

    } catch (error) {
        console.error("Zelle donation form submission error:", error);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6 border-t">
        <p className="text-sm text-muted-foreground">Please fill out the form below so we can correctly attribute your Zelle donation and send your receipt.</p>
        <FormField control={form.control} name="amount" render={({ field }) => (
            <FormItem>
                <FormLabel>Donation Amount (USD)</FormLabel>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <FormControl>
                        <Input {...field} type="number" placeholder="50.00" className="pl-8" />
                    </FormControl>
                </div>
                <FormMessage />
            </FormItem>
        )} />
        <FormField name="name" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField name="email" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormDescription>Your tax receipt will be sent here.</FormDescription><FormMessage /></FormItem>
        )} />
         <FormField name="zelleSenderName" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>Name on Zelle Account</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormDescription>This is required to match your payment to your donation.</FormDescription><FormMessage /></FormItem>
        )} />
        <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Zelle Information
        </Button>
      </form>
    </Form>
  );
}
