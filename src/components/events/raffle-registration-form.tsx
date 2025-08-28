
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { sendRaffleTicket } from '@/ai/flows/send-raffle-ticket-flow';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, Ticket } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import Link from 'next/link';
import { Label } from '../ui/label';

const formSchema = z.object({
  name: z.string().min(2, "Your name must be at least 2 characters."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  smsConsent: z.boolean().refine(val => val === true, {
    message: 'You must check this box to receive your raffle ticket via SMS.',
  }),
});

type RaffleFormValues = z.infer<typeof formSchema>;

export function RaffleRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { toast } = useToast();
  const form = useForm<RaffleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      smsConsent: false,
    },
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<RaffleFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await sendRaffleTicket(data);

      if (response.success) {
        setShowSuccessDialog(true);
        form.reset();
      } else {
        toast({
          variant: 'destructive',
          title: "Submission Failed",
          description: response.message,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: "An Error Occurred",
        description: "Could not send your registration at this time. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="shadow-lg border-primary/20 bg-primary/5">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                <Ticket className="h-10 w-10 text-primary" strokeWidth={1.5} />
            </div>
            <CardTitle className="font-headline text-3xl">Get Your Raffle Tickets via Text</CardTitle>
            <CardDescription>Enter your details below to receive your electronic raffle tickets directly to your phone.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto">
              <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem><FormControl><Input placeholder="Your Name" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
               <FormField name="phone" control={form.control} render={({ field }) => (
                <FormItem><FormControl><Input type="tel" placeholder="Your Phone Number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              
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
                            id="sms-consent-raffle"
                        />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                        <Label htmlFor="sms-consent-raffle" className="font-normal text-xs">
                          By providing your phone number, you agree to receive SMS notifications from PDSCC and Honest Raffles about your electronic raffle tickets and raffle updates. Msg & data rates may apply. Msg freq varies. Reply STOP to opt-out.
                        </Label>
                        </div>
                    </div>
                    <div className="text-xs ml-7">
                        <Link href="/terms-of-service" className="underline hover:text-primary">Terms</Link> | <Link href="/privacy-policy" className="underline hover:text-primary">Privacy</Link> | <Link href="/sms-policy" className="underline hover:text-primary">SMS Policy</Link>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get My Tickets
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <AlertDialogTitle className="text-center">Registration Sent!</AlertDialogTitle>
                  <AlertDialogDescription className="text-center">
                    Thank you! Your raffle ticket information will be sent to your phone shortly.
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
