
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { sendWelcomeEmail } from '@/ai/flows/send-welcome-email-flow';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Checkbox } from '../ui/checkbox';


const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  smsConsent: z.boolean().optional(),
}).refine(data => {
  // If phone is provided, smsConsent must be true.
  if (data.phone && data.phone.trim().length > 0) {
    return data.smsConsent === true;
  }
  return true;
}, {
  message: "You must consent to SMS messages to provide a phone number.",
  path: ["smsConsent"], // Attach error to smsConsent field
});


type SubscribeFormValues = z.infer<typeof formSchema>;

export function SubscribeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { toast } = useToast();
  const form = useForm<SubscribeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      smsConsent: false,
    },
  });

  const onSubmit: SubmitHandler<SubscribeFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await sendWelcomeEmail(data);

      if (response.success) {
        setSuccessMessage(response.message);
        setShowSuccessDialog(true);
        form.reset();
      } else {
        toast({
          variant: 'destructive',
          title: "Subscription Failed",
          description: response.message,
        });
      }
    } catch (error) {
      console.error('Subscription form error:', error);
      toast({
        variant: 'destructive',
        title: "An Error Occurred",
        description: "Could not process your subscription at this time. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
                 <FormField name="name" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel className="sr-only">First Name</FormLabel>
                        <FormControl>
                            <Input placeholder="First Name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField name="email" control={form.control} render={({ field }) => (
                    <FormItem>
                         <FormLabel className="sr-only">Email</FormLabel>
                        <FormControl>
                            <Input type="email" placeholder="Enter your email address" {...field} required/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
            
            <FormField name="phone" control={form.control} render={({ field }) => (
                <FormItem>
                    <FormLabel className="sr-only">Phone Number</FormLabel>
                    <FormControl>
                        <Input type="tel" placeholder="Phone Number (for Raffle Tickets)" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField
                control={form.control}
                name="smsConsent"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-3 rounded-md border p-4 bg-secondary/50">
                    <div className="flex items-start gap-3">
                        <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="sms-consent-footer"
                        />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                        <FormLabel htmlFor="sms-consent-footer" className="font-normal text-xs text-muted-foreground">
                            By providing your phone number, you agree to receive SMS notifications from PDSCC about your electronic raffle tickets and raffle updates. Msg & data rates may apply. Msg freq varies. Reply STOP to opt-out.
                        </FormLabel>
                        </div>
                    </div>
                    <div className="text-xs ml-7 text-muted-foreground">
                        <Link href="/terms-of-service" className="underline hover:text-primary">Terms</Link> | <Link href="/privacy-policy" className="underline hover:text-primary">Privacy</Link> | <Link href="/sms-policy" className="underline hover:text-primary">SMS Policy</Link>
                    </div>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <span>Subscribe</span>
                )}
            </Button>
        </form>
        </Form>
        <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <AlertDialogTitle className="text-center">Subscription Successful!</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        {successMessage}
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
