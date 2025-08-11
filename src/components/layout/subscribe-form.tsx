
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
import { Loader2, CheckCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';


const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
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
      email: "",
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

  return (
    <>
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
