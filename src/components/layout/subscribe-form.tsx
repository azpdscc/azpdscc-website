
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
import { AnimatePresence, motion } from 'framer-motion';
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
  
  const phoneValue = form.watch('phone');

  return (
    <>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col sm:flex-row w-full items-start gap-2">
                 <FormField name="name" control={form.control} render={({ field }) => (
                    <FormItem className="w-full sm:w-1/3">
                        <FormControl>
                            <Input placeholder="First Name" {...field} className="bg-background h-12"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField name="email" control={form.control} render={({ field }) => (
                    <FormItem className="flex-1">
                        <FormControl>
                            <Input type="email" placeholder="Enter your email address..." {...field} className="bg-background h-12" required/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
            
            <FormField name="phone" control={form.control} render={({ field }) => (
                <FormItem className="w-full">
                    <FormControl>
                        <Input type="tel" placeholder="Phone Number (for Raffle Tickets)" {...field} className="bg-background h-12"/>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />

             <AnimatePresence>
                {phoneValue && phoneValue.length > 0 && (
                     <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                         <FormField
                            control={form.control}
                            name="smsConsent"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-3 rounded-md border p-4 bg-background">
                                <div className="flex items-start gap-3">
                                    <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        id="sms-consent-footer"
                                    />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                    <FormLabel htmlFor="sms-consent-footer" className="font-normal text-xs">
                                        By providing your phone number, you agree to receive SMS notifications from PDSCC about your electronic raffle tickets and raffle updates. Msg & data rates may apply. Msg freq varies. Reply STOP to opt-out.
                                    </FormLabel>
                                    </div>
                                </div>
                                <div className="text-xs ml-7">
                                    <Link href="/terms-of-service" className="underline hover:text-primary">Terms</Link> | <Link href="/privacy-policy" className="underline hover:text-primary">Privacy</Link> | <Link href="/sms-policy" className="underline hover:text-primary">SMS Policy</Link>
                                </div>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <Button type="submit" size="lg" className="w-full h-12" disabled={isSubmitting}>
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
