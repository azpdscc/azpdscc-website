
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CalendarIcon, Sparkles } from 'lucide-react';
import type { Event, EventCategory } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState } from 'react';
import { generateEventDescriptions } from '@/ai/flows/generate-event-descriptions-flow';

const eventSchema = z.object({
  name: z.string().min(3, "Event name is required."),
  date: z.date({
    required_error: "A date is required.",
  }),
  time: z.string().regex(/^\d{1,2}:\d{2}\s(AM|PM)\s-\s\d{1,2}:\d{2}\s(AM|PM)$/, "Time must be in 'H:MM AM/PM - H:MM AM/PM' format (e.g., 2:00 PM - 7:00 PM)."),
  locationName: z.string().min(3, "Location name is required."),
  locationAddress: z.string().min(10, "A full address is required."),
  image: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  description: z.string().min(20, "Short description must be at least 20 characters."),
  fullDescription: z.string().min(50, "Full description must be at least 50 characters."),
  category: z.enum(['Cultural', 'Food', 'Music', 'Dance'], {
    required_error: "You need to select a category.",
  }),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  type: 'Add' | 'Edit';
  event?: Event;
  action: (data: any) => Promise<void | { error: string }>;
}

export function EventForm({ type, event, action }: EventFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: event?.name || '',
      date: event?.date ? new Date(event.date) : new Date(),
      time: event?.time || '',
      locationName: event?.locationName || '',
      locationAddress: event?.locationAddress || '',
      image: event?.image || 'https://placehold.co/600x400.png',
      description: event?.description || '',
      fullDescription: event?.fullDescription || '',
      category: event?.category || undefined,
    },
    mode: 'onBlur',
  });

  const { isSubmitting } = form.formState;

  const handleGenerateDescriptions = async () => {
    if (!aiPrompt) {
        toast({
            variant: 'destructive',
            title: "Prompt is empty",
            description: "Please enter some details about the event to generate descriptions.",
        });
        return;
    }
    setIsGenerating(true);
    try {
        const result = await generateEventDescriptions({ prompt: aiPrompt });
        if (result) {
            form.setValue('description', result.description, { shouldValidate: true });
            form.setValue('fullDescription', result.fullDescription, { shouldValidate: true });
            toast({
                title: "Descriptions Generated!",
                description: "The AI has filled in the description fields for you.",
            });
        }
    } catch (error) {
        toast({
            variant: 'destructive',
            title: "Generation Failed",
            description: "Could not generate descriptions. Please try again.",
        });
    } finally {
        setIsGenerating(false);
    }
  };

  const onSubmit: SubmitHandler<EventFormValues> = async (data) => {
    try {
      // Convert date object back to the string format Firestore expects
      const dataForAction = {
        ...data,
        date: format(data.date, 'MMMM dd, yyyy'),
      };
      
      await action(dataForAction);
      
      // The action function will redirect on success, so this code will only
      // be reached if there's no redirect. We can assume success here.
      toast({
        title: `Event ${type === 'Add' ? 'Created' : 'Updated'}`,
        description: `Your event has been successfully ${type === 'Add' ? 'created' : 'updated'}. Redirecting...`,
      });
      // Manually redirect as a fallback if the server action doesn't
      router.push('/admin/events');

    } catch (error) {
      // Next.js redirect throws an error, which we can safely ignore.
      // Any other error will be a genuine issue.
      if (error && typeof error === 'object' && 'digest' in error && (error as any).digest?.startsWith('NEXT_REDIRECT')) {
        // This is a redirect error, so we can ignore it.
        return;
      }

      console.error("Form submission error:", error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: `Could not ${type.toLowerCase()} the event. Please try again.`,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Event Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid md:grid-cols-2 gap-4">
          <FormField control={form.control} name="date" render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="time" render={({ field }) => (
            <FormItem><FormLabel>Time</FormLabel><FormControl><Input placeholder="e.g., 2:00 PM - 7:00 PM" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
         <FormField control={form.control} name="locationName" render={({ field }) => (
          <FormItem><FormLabel>Location Name</FormLabel><FormControl><Input placeholder="e.g., Goodyear Ballpark" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
         <FormField control={form.control} name="locationAddress" render={({ field }) => (
          <FormItem><FormLabel>Location Address</FormLabel><FormControl><Input placeholder="e.g., 1933 S Ballpark Way, Goodyear, AZ 85338" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
         <FormField control={form.control} name="category" render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="Cultural">Cultural</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Music">Music</SelectItem>
                <SelectItem value="Dance">Dance</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <div className="space-y-2 p-4 border rounded-lg bg-secondary/50">
            <FormLabel htmlFor="ai-prompt">AI Description Generator</FormLabel>
            <Textarea
                id="ai-prompt"
                placeholder="Provide a few details about the event, and let AI write the descriptions for you. e.g., A vibrant Vaisakhi Mela celebrating Punjabi culture with live Bhangra music, food stalls, and kids' activities."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
            />
            <Button type="button" variant="outline" size="sm" onClick={handleGenerateDescriptions} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Descriptions
            </Button>
        </div>

         <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem><FormLabel>Short Description (for cards)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="fullDescription" render={({ field }) => (
          <FormItem><FormLabel>Full Description (for event page)</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
        )} />
         <FormField control={form.control} name="image" render={({ field }) => (
          <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {type} Event
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </Form>
  );
}
