
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
import { FileText, Copy, Loader2, Sparkles, Twitter, Facebook } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { EventCategory } from '@/lib/types';
import { events } from '@/lib/data';
import { generateEventsFile } from '@/ai/flows/generate-events-file-flow';
import { generateSocialPosts, type GenerateSocialPostsOutput } from '@/ai/flows/generate-social-posts-flow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';

const eventSchema = z.object({
  name: z.string().min(3, "Event name is required."),
  date: z.string().regex(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s\d{1,2},\s\d{4}$/, "Date must be in 'Month Day, Year' format (e.g., August 02, 2025)."),
  time: z.string().regex(/^\d{1,2}:\d{2}\s(AM|PM)\s-\s\d{1,2}:\d{2}\s(AM|PM)$/, "Time must be in 'H:MM AM/PM - H:MM AM/PM' format (e.g., 2:00 PM - 7:00 PM)."),
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
  const [socialPosts, setSocialPosts] = useState<GenerateSocialPostsOutput | null>(null);
  const [isGeneratingSocial, setIsGeneratingSocial] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const CORRECT_PASSWORD = 'azpdscc-admin-2024';
  const AUTH_KEY = 'event-creator-auth';

  useEffect(() => {
    try {
      const isAuthed = localStorage.getItem(AUTH_KEY);
      if (isAuthed === btoa(CORRECT_PASSWORD)) {
          setIsAuthenticated(true);
      }
    } catch (e) {
      console.warn('localStorage not available for auth check.');
    }
  }, []);

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
    setSocialPosts(null);
    setIsGeneratingSocial(true);
    setGeneratedCode('// Generating AI-powered file content... please wait.');
    
    const slug = generateSlug(values.name || 'new-event');
    const image = values.image || 'https://placehold.co/600x400.png';
    
    const newEventObject = {
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
        throw new Error("The AI returned empty content for the file.");
      }

      try {
        const posts = await generateSocialPosts({
          name: values.name,
          date: values.date,
          description: values.description,
          slug: slug,
        });
        setSocialPosts(posts);
      } catch (socialError) {
        console.error(socialError);
        setSocialPosts(null);
        toast({
          variant: 'destructive',
          title: "Social Post Generation Failed",
          description: "Could not generate social media posts, but your file content is ready.",
        });
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
      setIsGeneratingSocial(false);
    }
  };

  const handleCopyCode = (textToCopy: string, type: string) => {
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: `${type} Copied!`,
      description: `The ${type.toLowerCase()} has been copied to your clipboard.`,
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      try {
        localStorage.setItem(AUTH_KEY, btoa(CORRECT_PASSWORD));
      } catch (e) {
        console.warn('localStorage not available for auth persistence.');
      }
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Admin Access Required</CardTitle>
            <CardDescription>Please enter the password to access the Event Creator.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  autoFocus
                />
              </div>
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              <Button type="submit" className="w-full">
                Unlock
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Event Code Generator</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Fill out this form to generate the entire `data.ts` file and get AI-generated social media posts.
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
                    <FormItem><FormLabel>Date</FormLabel><FormControl><Input placeholder="e.g., August 02, 2025" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="time" render={({ field }) => (
                    <FormItem><FormLabel>Time</FormLabel><FormControl><Input placeholder="e.g., 2:00 PM - 7:00 PM" {...field} /></FormControl><FormMessage /></FormItem>
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
                    Generate Content
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="sticky top-24 h-fit space-y-8">
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
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleCopyCode(generatedCode, 'File Content')} disabled={isGenerating || generatedCode.startsWith('//')}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {(isGeneratingSocial || socialPosts) && (
            <Card className="shadow-lg animate-in fade-in-50">
              <CardHeader>
                <CardTitle>AI-Generated Social Posts</CardTitle>
                <CardDescription>Copy these posts to share on your social media accounts.</CardDescription>
              </CardHeader>
              <CardContent>
                {isGeneratingSocial ? (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : socialPosts && (
                  <Tabs defaultValue="twitter">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="twitter"><Twitter className="mr-2 h-4 w-4" /> Twitter</TabsTrigger>
                      <TabsTrigger value="facebook"><Facebook className="mr-2 h-4 w-4" /> Facebook & Insta</TabsTrigger>
                    </TabsList>
                    <TabsContent value="twitter">
                      <div className="relative mt-2">
                        <Textarea readOnly value={socialPosts.twitterPost} rows={5} className="pr-12 bg-secondary" />
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleCopyCode(socialPosts.twitterPost, 'Tweet')}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="facebook">
                       <div className="relative mt-2">
                        <Textarea readOnly value={socialPosts.facebookPost} rows={8} className="pr-12 bg-secondary" />
                         <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleCopyCode(socialPosts.facebookPost, 'Facebook Post')}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
