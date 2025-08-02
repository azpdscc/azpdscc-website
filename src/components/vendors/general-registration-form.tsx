
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { sendGeneralRegistration } from '@/ai/flows/send-general-registration-flow';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters."),
  contactName: z.string().min(2, "Contact name must be at least 2 characters."),
  email: z.string().email(),
  phone: z.string().min(10, "Please enter a valid phone number."),
  category: z.enum(['Food', 'Apparel', 'Jewelry', 'Crafts', 'Services', 'Other'], {
    required_error: "Please select a product category.",
  }),
  description: z.string().min(10, "Description must be at least 10 characters.").max(300),
});

type GeneralRegistrationFormValues = z.infer<typeof formSchema>;

export function GeneralRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    },
  });

  const onSubmit: SubmitHandler<GeneralRegistrationFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await sendGeneralRegistration(data);

      if (response.success) {
        toast({
          title: "Registration Successful!",
          description: response.message,
        });
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
        
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Join Network
        </Button>
      </form>
    </Form>
  );
}
