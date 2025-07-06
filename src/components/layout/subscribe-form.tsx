'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { sendWelcomeEmail } from '@/ai/flows/send-welcome-email-flow';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type SubscribeFormValues = z.infer<typeof formSchema>;

export function SubscribeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<SubscribeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<SubscribeFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await sendWelcomeEmail(data);

      if (response.success) {
        toast({
          title: "Subscription Successful!",
          description: response.message,
        });
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-start gap-2">
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email address..."
                  {...field}
                  className="bg-background h-12"
                />
              </FormControl>
              <FormMessage className="text-left" />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="h-12" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <span>Subscribe</span>
          )}
        </Button>
      </form>
    </Form>
  );
}
