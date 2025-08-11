
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { sendCheckNotification } from '@/ai/flows/send-check-notification-flow';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';


const formSchema = z.object({
    amount: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, { message: "Please enter a valid amount." }),
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email(),
    checkNumber: z.string().optional(),
});

type CheckDonationFormValues = z.infer<typeof formSchema>;

export function CheckDonationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { toast } = useToast();
  const form = useForm<CheckDonationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
      name: '',
      email: '',
      checkNumber: '',
    },
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<CheckDonationFormValues> = async (data) => {
    setIsLoading(true);
    
    try {
        const response = await sendCheckNotification({
            donorName: data.name,
            donorEmail: data.email,
            amount: parseFloat(data.amount),
            checkNumber: data.checkNumber,
        });

        if (response.success) {
            setShowSuccessDialog(true);
            form.reset();
        } else {
             toast({
                variant: 'destructive',
                title: "An Error Occurred",
                description: response.message || "Could not process your notification. Please try again.",
            });
        }

    } catch (error) {
        console.error("Check donation form submission error:", error);
        toast({
            variant: 'destructive',
            title: "An Error Occurred",
            description: "Could not process your notification. Please try again later.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6 border-t mt-6">
            <p className="text-sm text-muted-foreground">Please fill out this form to let us know to expect your check. This helps us with our accounting.</p>
            <FormField control={form.control} name="amount" render={({ field }) => (
                <FormItem>
                    <FormLabel>Donation Amount (USD)</FormLabel>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <FormControl>
                            <Input {...field} type="number" placeholder="100.00" className="pl-8" />
                        </FormControl>
                    </div>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Full Name on Check</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="email" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Your Email Address</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormDescription>We will send a confirmation here once we receive your check.</FormDescription><FormMessage /></FormItem>
            )} />
            <FormField name="checkNumber" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Check Number (Optional)</FormLabel><FormControl><Input placeholder="1234" {...field} /></FormControl><FormDescription>This helps us match your donation.</FormDescription><FormMessage /></FormItem>
            )} />
            <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Notify Us About My Check
            </Button>
        </form>
        </Form>
        <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <AlertDialogTitle className="text-center">Information Received!</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                       Thank you for letting us know! We will look for your check in the mail.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>Close</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}
