
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateNewEventCode } from '@/ai/flows/generate-new-event-code-flow';
import { generateEventDescriptions } from '@/ai/flows/generate-event-descriptions-flow';
import { getEvents } from '@/services/events';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Copy, Check, Lock, Shield, CalendarIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { TimePicker } from '@/components/ui/time-picker';


const ADMIN_PASSWORD = "azpdscc-admin-2024";

const formSchema = z.object({
  name: z.string().min(3, 'Event name is required'),
  date: z.date({ required_error: 'A date is required.'}),
  startTime: z.date({ required_error: 'A start time is required.'}),
  endTime: z.date({ required_error: 'An end time is required.'}),
  locationName: z.string().min(1, 'Location name is required'),
  locationAddress: z.string().min(1, 'Location address is required'),
  category: z.enum(['Cultural', 'Food', 'Music', 'Dance']),
  description: z.string().min(1, 'Short description is required'),
  fullDescription: z.string().min(1, 'Full description is required'),
});

type FormValues = z.infer<typeof formSchema>;

export function EventCodeGenerator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState({ fileContent: '', socialPosts: '' });
  const [isCopied, setIsCopied] = useState({ file: false, social: false });
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: 'Diwali Festival of Lights 2024',
        date: new Date('2024-11-02T12:00:00'),
        startTime: new Date('2024-11-02T17:00:00'),
        endTime: new Date('2024-11-02T22:00:00'),
        locationName: 'Goodyear Ballpark',
        locationAddress: '1933 S Ballpark Way, Goodyear, AZ 85338',
        category: 'Cultural',
        description: '',
        fullDescription: '',
    },
  });
  
  const handleGenerateDescriptions = async () => {
    const eventName = form.getValues('name');
    if (!eventName) {
        form.setError('name', { type: 'manual', message: 'Please enter an event name first.'});
        return;
    }

    setIsGenerating(true);
    try {
        const result = await generateEventDescriptions({ prompt: eventName });
        if (result) {
            form.setValue('description', result.description, { shouldValidate: true });
            form.setValue('fullDescription', result.fullDescription, { shouldValidate: true });
        }
    } catch (error) {
        console.error("Failed to generate descriptions:", error);
         toast({
            variant: 'destructive',
            title: 'AI Error',
            description: 'Failed to generate descriptions. Please try again.',
        });
    } finally {
        setIsGenerating(false);
    }
  };


  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedContent({ fileContent: '', socialPosts: '' });
    try {
        const existingEvents = await getEvents();
        
        const formattedData = {
            ...data,
            date: format(data.date, 'MMMM dd, yyyy'),
            time: `${format(data.startTime, 'h:mm a')} - ${format(data.endTime, 'h:mm a')}`
        }

        const response = await generateNewEventCode({
            newEvent: {
                name: formattedData.name,
                date: formattedData.date,
                time: formattedData.time,
                locationName: formattedData.locationName,
                locationAddress: formattedData.locationAddress,
                category: formattedData.category,
                description: formattedData.description,
                fullDescription: formattedData.fullDescription,
            },
            existingEvents,
        });

      if (response.fileContent && response.socialPosts) {
        setGeneratedContent(response);
        toast({
          title: 'Content Generated!',
          description: 'Your file content and social media posts are ready.',
        });
      } else {
        throw new Error('AI response was missing content.');
      }
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to generate content. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'file' | 'social') => {
    navigator.clipboard.writeText(text);
    setIsCopied({ ...isCopied, [type]: true });
    setTimeout(() => setIsCopied({ ...isCopied, [type]: false }), 2000);
  };
  
  if (!isAuthenticated) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <Shield className="h-12 w-12 text-primary" strokeWidth={1.5} />
                    </div>
                    <CardTitle className="text-center font-headline text-2xl">Admin Access Required</CardTitle>
                    <CardDescription className="text-center">
                        This tool is for authorized administrators only.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password"
                            />
                            {error && <p className="text-sm text-destructive">{error}</p>}
                        </div>
                        <Button type="submit" className="w-full">
                            <Lock className="mr-2 h-4 w-4" />
                            Unlock
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
  }


  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
            <Sparkles className="mx-auto h-12 w-12 text-primary" strokeWidth={1.5} />
            <h1 className="font-headline text-4xl mt-4">Event Code Generator</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Fill in the details for your new event. The AI will generate the complete, formatted code for the `data.ts` file, including your new event.
            </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>1. Enter New Event Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                             <FormField name="name" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Event Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <div className="grid md:grid-cols-3 gap-4">
                                <FormField control={form.control} name="date" render={({ field }) => (
                                    <FormItem className="flex flex-col md:col-span-1">
                                        <FormLabel>Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
                                <FormField control={form.control} name="startTime" render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Start Time</FormLabel>
                                        <TimePicker setDate={field.onChange} date={field.value} />
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="endTime" render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>End Time</FormLabel>
                                        <TimePicker setDate={field.onChange} date={field.value} />
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </div>
                             <FormField name="locationName" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Location Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField name="locationAddress" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Location Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField name="category" control={form.control} render={({ field }) => (
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
                            
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <FormLabel>Descriptions</FormLabel>
                                    <Button type="button" variant="secondary" size="sm" onClick={handleGenerateDescriptions} disabled={isGenerating}>
                                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                        Generate with AI
                                    </Button>
                                </div>
                                <FormField name="description" control={form.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-normal text-muted-foreground">Short Description</FormLabel>
                                    <FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField name="fullDescription" control={form.control} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-normal text-muted-foreground">Full Description</FormLabel>
                                        <FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                            </div>

                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                Generate Final Code
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <div className="space-y-8 mt-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>2. Generated `data.ts` File Content</CardTitle>
                        <CardDescription>
                            Copy this entire block of code and paste it into the `src/lib/data.ts` file, replacing all existing content.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto max-h-[400px]">
                                {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : generatedContent.fileContent || "Generated code will appear here..."}
                            </pre>
                             {generatedContent.fileContent && (
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8"
                                    onClick={() => copyToClipboard(generatedContent.fileContent, 'file')}
                                >
                                    {isCopied.file ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                             )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>3. Generated Social Media Posts</CardTitle>
                        <CardDescription>
                            Use these posts for promoting the event on your social channels.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="relative">
                            <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto max-h-[400px] whitespace-pre-wrap">
                                {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : generatedContent.socialPosts || "Generated posts will appear here..."}
                            </pre>
                             {generatedContent.socialPosts && (
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8"
                                    onClick={() => copyToClipboard(generatedContent.socialPosts, 'social')}
                                >
                                    {isCopied.social ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                             )}
                        </div>
                    </CardContent>
                </Card>
                 <Alert>
                    <AlertTitle>How to Update the Website</AlertTitle>
                    <AlertDescription>
                        1. Click the 'Copy' button on the 'Generated data.ts File Content' card.<br/>
                        2. Open the file `src/lib/data.ts` in your code editor.<br/>
                        3. Select ALL the text in the file and PASTE to replace it with the copied code.<br/>
                        4. Save the file. The new event will now appear on the website.
                    </AlertDescription>
                </Alert>
            </div>
        </div>
      </div>
    </div>
  );
}
