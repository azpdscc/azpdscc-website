
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { sendVolunteerInquiry } from '@/ai/flows/send-volunteer-inquiry-flow';
import { Loader2, CheckCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Label } from './ui/label';


const interests = [
    { id: 'event-setup', label: 'Event Setup & Teardown' },
    { id: 'registration', label: 'Registration & Guest Services' },
    { id: 'cultural-activities', label: 'Cultural Activities & Workshops' },
    { id: 'vendor-assistance', label: 'Vendor & Sponsor Assistance' },
    { id: 'marketing', label: 'Marketing & Community Outreach' },
    { id: 'other', label: 'Other (please specify in message)' },
];

const volunteerFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number.").optional().or(z.literal('')),
  interests: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one area of interest.",
  }),
  message: z.string().max(500, "Message cannot exceed 500 characters.").optional(),
  smsConsent: z.boolean().refine(val => val === true, {
    message: 'You must consent to receive text messages to continue.',
  }),
});

type VolunteerFormValues = z.infer<typeof volunteerFormSchema>;

export function VolunteerForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { toast } = useToast();
  const form = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      interests: [],
      message: "",
      smsConsent: false,
    },
  });

  const onSubmit: SubmitHandler<VolunteerFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await sendVolunteerInquiry(data);

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
      console.error('Volunteer form submission error:', error);
      toast({
        variant: 'destructive',
        title: "An Error Occurred",
        description: "Could not send your application at this time. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
                <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="email" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="jane.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
            
            <FormField name="phone" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="(555) 555-5555" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            
            <FormField
            control={form.control}
            name="interests"
            render={() => (
                <FormItem>
                <div className="mb-4">
                    <FormLabel className="text-base">Areas of Interest</FormLabel>
                    <FormDescription>
                    Select all areas where you would like to help.
                    </FormDescription>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {interests.map((item) => (
                    <FormField
                        key={item.id}
                        control={form.control}
                        name="interests"
                        render={({ field }) => {
                        return (
                            <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                            >
                            <FormControl>
                                <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                    return checked
                                    ? field.onChange([...(field.value || []), item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                            (value) => value !== item.id
                                        )
                                        )
                                }}
                                />
                            </FormControl>
                            <FormLabel className="font-normal">
                                {item.label}
                            </FormLabel>
                            </FormItem>
                        )
                        }}
                    />
                    ))}
                </div>
                <FormMessage />
                </FormItem>
            )}
            />
            
            <FormField name="message" control={form.control} render={({ field }) => (
            <FormItem>
                <FormLabel>Additional Comments (Optional)</FormLabel>
                <FormControl><Textarea placeholder="Let us know if you have any specific skills or questions." {...field} /></FormControl>
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
                        id="sms-consent-volunteer"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <Label htmlFor="sms-consent-volunteer" className="font-normal">
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
            Submit Application
            </Button>
        </form>
        </Form>
        <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <AlertDialogTitle className="text-center">Thank You for Volunteering!</AlertDialogTitle>
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
