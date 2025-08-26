
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { sendGeneralRegistration } from '@/ai/flows/send-general-registration-flow';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Checkbox } from '../ui/checkbox';
import Link from 'next/link';


const formSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters."),
  contactName: z.string().min(2, "Contact name must be at least 2 characters."),
  email: z.string().email(),
  phone: z.string().min(10, "Please enter a valid phone number."),
  category: z.enum(['Food', 'Apparel', 'Jewelry', 'Crafts', 'Services', 'Other'], {
    required_error: "Please select a product category.",
  }),
  description: z.string().min(10, "Description must be at least 10 characters.").max(300),
  smsConsent: z.boolean().default(false).optional(),
});

type GeneralRegistrationFormValues = z.infer<typeof formSchema>;

export function GeneralRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { toast } = useToast();
  const form = useForm<GeneralRegistrationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      contactName: "",
      email: "",
      phone: "",
      category: undefined,
      description: "",
      smsConsent: false,
    },
  });

  const onSubmit: SubmitHandler<GeneralRegistrationFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await sendGeneralRegistration(data);

      if (response.success) {
        setSuccessMessage(response.message);
        setShowSuccessDialog(true);
        form.reset();
      } else {
        toast({
          variant: 'destructive',
          title: "Registration Failed",
          description: response.message,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: "An Error Occurred",
        description: "Could not process the registration at this time. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField name="businessName" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>Business Name</FormLabel><FormControl><Input placeholder="My Awesome Crafts" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="contactName" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>Contact Person Name</FormLabel><FormControl><Input placeholder="Jane Smith" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid md:grid-cols-2 gap-6">
                <FormField name="email" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="phone" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="(555) 555-5555" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
            <FormField name="category" control={form.control} render={({ field }) => (
            <FormItem>
                <FormLabel>Primary Product Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                <SelectContent>
                    <SelectItem value="Food">Food & Beverage</SelectItem>
                    <SelectItem value="Apparel">Apparel & Accessories</SelectItem>
                    <SelectItem value="Jewelry">Jewelry</SelectItem>
                    <SelectItem value="Crafts">Handmade Crafts & Art</SelectItem>
                    <SelectItem value="Services">Services (e.g., Henna, Photography)</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
            )} />
            <FormField name="description" control={form.control} render={({ field }) => (
            <FormItem>
                <FormLabel>Short Business Description</FormLabel>
                <FormControl><Textarea placeholder="Tell us what makes your business unique..." {...field} /></FormControl>
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
            Join Network
            </Button>
        </form>
        </Form>
        <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <AlertDialogTitle className="text-center">Registration Successful!</AlertDialogTitle>
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
