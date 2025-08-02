
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { sendVendorApplication } from '@/ai/flows/send-vendor-application-flow';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  organization: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(10, "Please enter a valid phone number."),
  boothType: z.enum(['10x10-own', '10x10-our', '10x20-own', '10x20-our'], {
    required_error: "You need to select a booth type.",
  }),
  productDescription: z.string().min(20, "Description must be at least 20 characters.").max(500),
  zelleSenderName: z.string().min(2, "Zelle sender name is required."),
  zelleDateSent: z.date({ required_error: "Please select the date you sent the payment." }),
  paymentSent: z.boolean().refine(val => val === true, { message: "You must confirm payment has been sent." }),
});

type VendorApplicationFormValues = z.infer<typeof formSchema>;

const boothOptions: { [key: string]: string } = {
  '10x10-own': '10x10 Booth (Own Canopy) - $250',
  '10x10-our': '10x10 Booth (Our Canopy) - $350',
  '10x20-own': '10x20 Booth (Own Canopy) - $500',
  '10x20-our': '10x20 Booth (Our Canopy) - $650',
};

const boothPrices: { [key: string]: number } = {
  '10x10-own': 250,
  '10x10-our': 350,
  '10x20-own': 500,
  '10x20-our': 650,
};

export function ApplicationForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<VendorApplicationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      organization: "",
      email: "",
      phone: "",
      boothType: undefined,
      productDescription: "",
      paymentSent: false,
      zelleSenderName: "",
      zelleDateSent: undefined,
    },
  });

  const triggerValidation = async (fields: (keyof VendorApplicationFormValues)[]) => {
    const result = await form.trigger(fields);
    if (result) {
      setStep(prev => prev + 1);
    }
  };

  const onSubmit: SubmitHandler<VendorApplicationFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await sendVendorApplication({
        name: data.name,
        organization: data.organization,
        email: data.email,
        boothType: boothOptions[data.boothType], // Send the full string description
        totalPrice: boothPrices[data.boothType],
      });

      if (response.success) {
        toast({
          title: "Application Submitted!",
          description: response.message,
        });
        form.reset();
        setStep(1);
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
        description: "Could not process the application at this time. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedBoothType = form.watch('boothType');
  const totalPrice = selectedBoothType ? boothPrices[selectedBoothType] : 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center space-x-4 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-bold",
                s < step && "bg-green-500 text-white",
                s === step && "bg-primary text-primary-foreground",
                s > step && "bg-secondary text-secondary-foreground"
              )}>{s}</div>
              {s < 3 && <div className={cn("w-16 h-1", s < step ? 'bg-green-500' : 'bg-secondary')} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <section className="space-y-4">
            <h2 className="font-headline text-2xl">Step 1: Contact Information</h2>
            <FormField name="name" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="organization" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Organization (Optional)</FormLabel><FormControl><Input placeholder="Your Company LLC" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="email" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="phone" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="(555) 555-5555" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <Button type="button" onClick={() => triggerValidation(['name', 'email', 'phone'])}>Next</Button>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-4">
            <h2 className="font-headline text-2xl">Step 2: Booth Details</h2>
            <FormField name="boothType" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Booth Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select a booth type" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {Object.entries(boothOptions).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name="productDescription" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Product/Service Description</FormLabel>
                <FormControl><Textarea placeholder="Describe what you will be selling or offering at your booth..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button type="button" onClick={() => triggerValidation(['boothType', 'productDescription'])}>Proceed to Payment</Button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-6">
            <h2 className="font-headline text-2xl">Step 3: Payment & Confirmation</h2>
            <div className="p-6 border rounded-lg bg-secondary">
              <h3 className="font-headline font-bold text-lg">Application Summary</h3>
              <p><strong>Booth Type:</strong> {selectedBoothType ? boothOptions[selectedBoothType] : 'N/A'}</p>
              <p className="font-bold text-xl mt-2">Total Amount Due: <span className="text-primary">${totalPrice}</span></p>
            </div>
            
            <div className="p-6 border-2 border-primary/50 rounded-lg bg-primary/5">
                <h3 className="font-headline font-bold text-lg text-primary">Complete Your Booth Payment via Zelle</h3>
                <p className="mt-2 text-muted-foreground">Please send the total amount of <strong>${totalPrice}</strong> via Zelle to:</p>
                <p className="text-2xl font-mono bg-background p-2 rounded-md text-center my-4">admin@azpdscc.org</p>
                <p className="font-bold text-destructive">Important: You must include your name or organization name in the Zelle memo for us to identify your payment.</p>
                <p className="mt-2 text-sm text-muted-foreground">Your booth registration will be confirmed only after payment is received and verified by our team.</p>
            </div>

            <h3 className="font-headline text-lg">Confirm Your Payment</h3>
            <FormField name="zelleSenderName" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Name on Zelle Account</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="zelleDateSent" render={({ field }) => (
              <FormItem className="flex flex-col"><FormLabel>Date Sent</FormLabel>
                <Popover>
                  <PopoverTrigger asChild><FormControl>
                      <Button variant={"outline"} className={cn("w-full sm:w-[240px] pl-3 text-left font-normal", !field.value && "text-white")}>
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" strokeWidth={1.5} />
                      </Button>
                  </FormControl></PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                  </PopoverContent>
                </Popover><FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="paymentSent" render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>I confirm that I have sent the Zelle payment of ${totalPrice}.</FormLabel>
                </div>
              </FormItem>
            )} />
            
            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Application
              </Button>
            </div>
          </section>
        )}
      </form>
    </Form>
  );
}
