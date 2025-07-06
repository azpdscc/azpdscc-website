
"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

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
});

type VolunteerFormValues = z.infer<typeof volunteerFormSchema>;

export function VolunteerForm() {
  const { toast } = useToast();
  const form = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      interests: [],
      message: "",
    },
  });

  const onSubmit: SubmitHandler<VolunteerFormValues> = (data) => {
    // In a real application, you would send this to your backend
    console.log(data);
    toast({
      title: "Thank You for Volunteering!",
      description: "Your information has been received. We will contact you soon with next steps.",
    });
    form.reset();
  };

  return (
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
          <FormItem><FormLabel>Phone Number (Optional)</FormLabel><FormControl><Input type="tel" placeholder="(555) 555-5555" {...field} /></FormControl><FormMessage /></FormMessage>
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
        
        <Button type="submit" size="lg">Submit Application</Button>
      </form>
    </Form>
  );
}
