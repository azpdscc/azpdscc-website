
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
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  companyName: z.string().min(2, "Company name is required."),
  contactName: z.string().min(2, "Contact name is required."),
  email: z.string().email(),
  phone: z.string().min(10, "Please enter a valid phone number."),
  sponsorshipLevel: z.enum(['Diamond', 'Gold', 'Silver', 'Bronze', 'Other'], {
    required_error: "Please select a sponsorship level.",
  }),
  message: z.string().max(1000, "Message cannot exceed 1000 characters.").optional(),
});

type SponsorshipFormValues = z.infer<typeof formSchema>;

export function SponsorshipForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    },
  });

  const onSubmit: SubmitHandler<SponsorshipFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await sendSponsorshipInquiry(data);

      if (response.success) {
        toast({
          title: "Inquiry Sent!",
          description: response.message,
        });
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
                
                <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Inquiry
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}
