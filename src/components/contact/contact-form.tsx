
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { sendContactInquiry } from '@/ai/flows/send-contact-inquiry-flow';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, "Your name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(20, "Your message should be at least 20 characters long.").max(1000, "Message cannot exceed 1000 characters."),
});

type ContactFormValues = z.infer<typeof formSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await sendContactInquiry(data);

      if (response.success) {
        toast({
          title: "Message Sent!",
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
      console.error('Contact form submission error:', error);
      toast({
        variant: 'destructive',
        title: "An Error Occurred",
        description: "Could not send your message at this time. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Send us a Message</CardTitle>
        <CardDescription>Fill out the form below and we will get back to you as soon as possible.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField name="name" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Your Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="email" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Your Email</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="subject" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="Question about an event" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="message" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl><Textarea rows={6} placeholder="Please type your message here..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Message
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
