
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, Copy, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { EventCategory } from '@/lib/types';
import { events } from '@/lib/data'; // Import existing events
import { generateEventsFile } from '@/ai/flows/generate-events-file-flow';

const eventSchema = z.object({
  name: z.string().min(3, "Event name is required."),
  date: z.string().min(8, "A full date is required (e.g., 'April 19, 2025')."),
  time: z.string().min(5, "A time or time range is required."),
  location: z.string().min(3, "Location is required."),
  image: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  description: z.string().min(20, "Short description must be at least 20 characters."),
  fullDescription: z.string().min(50, "Full description must be at least 50 characters."),
  category: z.enum(['Cultural', 'Food', 'Music', 'Dance'], {
    required_error: "You need to select a category.",
  }),
});

type EventFormValues = z.infer<typeof eventSchema>;

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\\s-]/g, '')
    .replace(/\\s+/g, '-')
    .slice(0, 50);
};

export default function CreateEventPage() {
  const { toast } = useToast();
  const [generatedCode, setGeneratedCode] = useState('// Fill out the form and click "Generate File" to create the code here.');
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: '',
      date: '',
      time: '',
      location: '',
      image: 'https://placehold.co/600x400.png',
      description: '',
      fullDescription: '',
      category: undefined,
    },
    mode: 'onBlur',
  });

  const handleGenerateCode = async (values: EventFormValues) => {
    setIsGenerating(true);
    setGeneratedCode('// Generating AI-powered file content... please wait.');
    
    const slug = generateSlug(values.name || 'new-event');
    const image = values.image || 'https://placehold.co/600x400.png';
    
    const newEventObject = {
      // ID will be set by the AI flow to ensure uniqueness
      id: 999, // Placeholder ID
      slug: slug,
      name: values.name,
      date: values.date,
      time: values.time,
      location: values.location,
      image: image,
      description: values.description,
      fullDescription: values.fullDescription,
      category: values.category,
    };

    try {
      const fullFileContent = await generateEventsFile({
        newEvent: newEventObject,
        existingEvents: JSON.stringify(events),
      });

      if (fullFileContent) {
        setGeneratedCode(fullFileContent);
        toast({
          title: "File Generated!",
          description: "The full content of your data file has been generated.",
        });
      } else {
        throw new Error("The AI returned empty content.");
      }
    } catch (error) {
      console.error(error);
      setGeneratedCode('// An error occurred during generation. Please try again.');
      toast({
        variant: 'destructive',
        title: "Generation Failed",
        description: "Could not generate the file content. Check the console for errors.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Code Copied!",
      description: "You can now paste it into your data file.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Event Code Generator</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Fill out this form to generate the entire `data.ts` file with your new event included.
        </p>
      </section>

      <div className="grid lg:grid-cols-2 gap-12">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Enter the information for your new event.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleGenerateCode)} className="space-y-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Event Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="date" render={({ field }) => (
                    <FormItem><FormLabel>Date</FormLabel><FormControl><Input placeholder="e.g., May 5, 2025" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="time" render={({ field }) => (
                    <FormItem><FormLabel>Time</FormLabel><FormControl><Input placeholder="e.g., 10:00 AM - 4:00 PM" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                 <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., Goodyear Ballpark" {...field} /></FormControl><FormMessage /></FormItem>
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
                 <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Short Description (for cards)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="fullDescription" render={({ field }) => (
                  <FormItem><FormLabel>Full Description (for event page)</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="image" render={({ field }) => (
                  <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <Button type="submit" disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate File Content
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="sticky top-24 h-fit">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Generated `data.ts` File Content</CardTitle>
              <CardDescription>Copy the entire content below to update your events.</CardDescription>
            </CardHeader>
            <CardContent>
               <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertTitle>How to Use</AlertTitle>
                  <AlertDescription>
                    1. Click the copy button below.
                    <br />
                    2. Open the file: <code className="font-mono text-sm bg-muted p-1 rounded-sm">src/lib/data.ts</code>
                    <br />
                    3. Select ALL the existing content and paste to replace it completely.
                  </AlertDescription>
              </Alert>
              <div className="relative mt-4">
                <pre className="bg-secondary p-4 rounded-md text-sm overflow-x-auto max-h-[500px]">
                  <code>
                    {generatedCode}
                  </code>
                </pre>
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={handleCopyCode} disabled={isGenerating || generatedCode.startsWith('//')}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
