
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { sendSponsorshipInquiry } from '@/ai/flows/send-sponsorship-inquiry-flow';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Checkbox } from '../ui/checkbox';
import Link from 'next/link';
import { Label } from '../ui/label';


const formSchema = z.object({
  companyName: z.string().min(2, "Company name is required."),
  contactName: z.string().min(2, "Contact name is required."),
  email: z.string().email(),
  phone: z.string().min(10, "Please enter a valid phone number."),
  sponsorshipLevel: z.enum(['Diamond', 'Gold', 'Silver', 'Bronze', 'Other'], {
    required_error: "Please select a sponsorship level.",
  }),
  message: z.string().max(1000, "Message cannot exceed 1000 characters.").optional(),
  smsConsent: z.boolean().refine(val => val === true, {
    message: 'You must consent to receive text messages to continue.',
  }),
});

type SponsorshipFormValues = z.infer<typeof formSchema>;

export function SponsorshipForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { toast } = useToast();
  const form = useForm<SponsorshipFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      sponsorshipLevel: undefined,
      message: "",
      smsConsent: false,
    },
  });

  const onSubmit: SubmitHandler<SponsorshipFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await sendSponsorshipInquiry(data);

      if (response.success) {
        setSuccessMessage(response.message);
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
        description: "Could not send your inquiry at this time. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
        <Card className="shadow-xl">
            <CardHeader>
                <CardTitle className="font-headline text-3xl text-center">Become a Sponsor</CardTitle>
                <CardDescription className="text-center">
                    Fill out the form below to start the conversation. We'll be in touch shortly to discuss partnership opportunities.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField name="companyName" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Company Name</FormLabel><FormControl><Input placeholder="Your Company Inc." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField name="contactName" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Your Name</FormLabel><FormControl><Input placeholder="Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormField name="email" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="you@company.com" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField name="phone" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="(555) 555-5555" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <FormField name="sponsorshipLevel" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Sponsorship Level of Interest</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a level" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Diamond">Diamond ($20,000+)</SelectItem>
                            <SelectItem value="Gold">Gold ($10,000)</SelectItem>
                            <SelectItem value="Silver">Silver ($5,000)</SelectItem>
                            <SelectItem value="Bronze">Bronze ($2,500)</SelectItem>
                            <SelectItem value="Other">Other/Custom</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )} />
                    <FormField name="message" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Message (Optional)</FormLabel>
                        <FormControl><Textarea placeholder="Tell us about your company or ask any questions you may have." {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />
                    
                    <FormField
                      control={form.control}
                      name="smsConsent"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-3 rounded-md border p-4">
                          <div className="flex items-start gap-3">
                             <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="sms-consent-sponsor"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <Label htmlFor="sms-consent-sponsor" className="font-normal">
                                By providing your phone number, you agree to receive text messages from Phoenix Desi Sports and Cultural Club about events and promotions. Message and data rates may apply. Message frequency varies. You can reply STOP at any time to opt out.
                              </Label>
                            </div>
                          </div>
                          <div className="text-sm ml-7">
                            <Link href="/terms-of-service" className="underline hover:text-primary">Terms of Service</Link> | <Link href="/privacy-policy" className="underline hover:text-primary">Privacy Policy</Link>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Inquiry
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
                    <AlertDialogTitle className="text-center">Inquiry Sent!</AlertDialogTitle>
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
