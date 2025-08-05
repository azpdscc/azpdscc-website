
'use client';

import { useState } from 'react';
import type { Event } from '@/lib/types';
import type { EventFormState } from '@/app/admin/events/actions';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { generateEventDescriptions } from '@/ai/flows/generate-event-descriptions-flow';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CalendarIcon, Loader2, Sparkles } from 'lucide-react';
import { SubmitButton } from './submit-button';

const eventFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  locationName: z.string().min(1, "Location name is required"),
  locationAddress: z.string().min(1, "Address is required"),
  image: z.string().url("Must be a valid URL"),
  description: z.string().min(1, "Short description is required"),
  fullDescription: z.string().min(1, "Full description is required"),
  category: z.enum(['Cultural', 'Food', 'Music', 'Dance']),
  descriptionPrompt: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  event?: Event;
  formAction: (payload: FormData) => void;
  formState: EventFormState;
}

export function EventForm({ event, formAction, formState }: EventFormProps) {
  const isEditing = !!event;
  const [isGenerating, setIsGenerating] = useState(false);
  const [description, setDescription] = useState(event?.description || '');
  const [fullDescription, setFullDescription] = useState(event?.fullDescription || '');

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: event?.name || '',
      date: event?.date ? format(new Date(event.date), 'yyyy-MM-dd') : '',
      time: event?.time || '',
      locationName: event?.locationName || '',
      locationAddress: event?.locationAddress || '',
      image: event?.image || '',
      description: event?.description || '',
      fullDescription: event?.fullDescription || '',
      category: event?.category || 'Cultural',
      descriptionPrompt: '',
    },
  });

  const handleGenerateDescriptions = async () => {
    const prompt = form.getValues('descriptionPrompt');
    const eventName = form.getValues('name');
    if (!prompt || !eventName) {
        form.setError('descriptionPrompt', { type: 'manual', message: 'Please enter a prompt and event name first.'});
        return;
    }

    setIsGenerating(true);
    try {
        const result = await generateEventDescriptions({ prompt: `Event name: ${eventName}. Details: ${prompt}` });
        if (result) {
            form.setValue('description', result.description, { shouldValidate: true });
            form.setValue('fullDescription', result.fullDescription, { shouldValidate: true });
            setDescription(result.description);
            setFullDescription(result.fullDescription);
        }
    } catch (error) {
        console.error("Failed to generate descriptions:", error);
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid md:grid-cols-2 gap-4">
             <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Event Date</FormLabel>
                   <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                       <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., 5:00 PM - 10:00 PM" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <div className="space-y-2">
            <FormLabel>AI-Powered Descriptions</FormLabel>
            <FormField
              control={form.control}
              name="descriptionPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea {...field} placeholder="Enter a simple prompt for the AI. E.g., 'A fun festival to celebrate Vaisakhi with music, food stalls, and Bhangra performances.'" rows={3}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" variant="secondary" onClick={handleGenerateDescriptions} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Descriptions
            </Button>
        </div>


        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea {...field} value={description} onChange={(e) => { field.onChange(e); setDescription(e.target.value)}} rows={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="fullDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Description</FormLabel>
              <FormControl>
                <Textarea {...field} value={fullDescription} onChange={(e) => { field.onChange(e); setFullDescription(e.target.value)}} rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="locationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="locationAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Cultural">Cultural</SelectItem>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Music">Music</SelectItem>
                      <SelectItem value="Dance">Dance</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        {formState.errors?._form && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{formState.errors._form.join(', ')}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-4">
          <SubmitButton isEditing={isEditing} />
          <Button variant="outline" asChild>
            <Link href="/admin/events">Cancel</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
