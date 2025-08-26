
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { sendPerformanceApplication } from '@/ai/flows/send-performance-application-flow';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';


const formSchema = z.object({
  groupName: z.string().min(2, "Group/Performer name is required."),
  contactName: z.string().min(2, "Contact name is required."),
  email: z.string().email(),
  phone: z.string().min(10, "Please enter a valid phone number."),
  event: z.enum(['Vaisakhi Mela', 'Teeyan Da Mela'], {
    required_error: "Please select an event.",
  }),
  performanceType: z.enum(['Bhangra', 'Gidda', 'Singing', 'Skit', 'Other'], {
    required_error: "Please select a performance type.",
  }),
  participants: z.string().refine(val => !isNaN(parseInt(val)) && parseInt(val) > 0, { message: "Please enter a valid number of participants." }),
  auditionLink: z.string().url("Please provide a valid URL (e.g., YouTube, Google Drive).").optional().or(z.literal('')),
  specialRequests: z.string().max(500, "Message cannot exceed 500 characters.").optional(),
  smsConsent: z.boolean().default(false).optional(),
});

type PerformanceRegistrationFormValues = z.infer<typeof formSchema>;

export function PerformanceRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { toast } = useToast();
  const form = useForm<PerformanceRegistrationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: "",
      contactName: "",
      email: "",
      phone: "",
      event: undefined,
      performanceType: undefined,
      participants: "1",
      auditionLink: "",
      specialRequests: "",
      smsConsent: false,
    },
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<PerformanceRegistrationFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await sendPerformanceApplication({
          ...data,
          participants: parseInt(data.participants, 10)
      });

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
        description: "Could not send your application at this time. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField name="groupName" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Group / Performer Name</FormLabel><FormControl><Input placeholder="Punjab Bhangra Crew" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            
            <div className="grid md:grid-cols-2 gap-6">
                <FormField name="contactName" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Main Contact Person</FormLabel><FormControl><Input placeholder="Jane Smith" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="phone" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="(555) 555-5555" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>

            <FormField name="email" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

             <div className="grid md:grid-cols-2 gap-6">
                 <FormField name="event" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Event</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select an event" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Vaisakhi Mela">Vaisakhi Mela</SelectItem>
                            <SelectItem value="Teeyan Da Mela">Teeyan Da Mela</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )} />
                <FormField name="performanceType" control={form.control} render={({ field }) => (
                <FormItem>
                    <FormLabel>Type of Performance</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="Bhangra">Bhangra</SelectItem>
                        <SelectItem value="Gidda">Gidda</SelectItem>
                        <SelectItem value="Singing">Singing</SelectItem>
                        <SelectItem value="Skit">Skit / Play</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )} />
            </div>
            
            <FormField name="participants" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Number of Participants</FormLabel><FormControl><Input type="number" min="1" {...field} /></FormControl><FormMessage /></FormItem>
            )} />

             <FormField name="auditionLink" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Audition Video Link (Optional)</FormLabel><FormControl><Input placeholder="https://youtube.com/watch?v=..." {...field} /></FormControl><FormDescription>Please provide a link to a recent performance or rehearsal if you have one.</FormDescription><FormMessage /></FormItem>
            )} />

            <FormField name="specialRequests" control={form.control} render={({ field }) => (
            <FormItem>
                <FormLabel>Special Requests / Technical Needs (Optional)</FormLabel>
                <FormControl><Textarea placeholder="E.g., Number of microphones needed, specific lighting, etc." {...field} /></FormControl>
                <FormMessage />
            </FormItem>
            )} />

            <FormField
              control={form.control}
              name="smsConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      By providing your phone number, you agree to receive SMS notifications about our events and raffle updates. Msg & data rates may apply. You can reply STOP at any time to opt-out.
                    </FormLabel>
                  </div>
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
                    <AlertDialogTitle className="text-center">Application Received!</AlertDialogTitle>
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
