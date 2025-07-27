
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, Copy, Loader2, Sparkles, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateTeamMemberFile } from '@/ai/flows/generate-team-member-file-flow';
import { Label } from '@/components/ui/label';

const memberSchema = z.object({
  name: z.string().min(3, "Member name is required."),
  role: z.string().min(3, "Role is required."),
  bio: z.string().min(10, "Bio must be at least 10 characters long."),
  image: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

type MemberFormValues = z.infer<typeof memberSchema>;

export default function AddMemberPage() {
  const { toast } = useToast();
  const [generatedCode, setGeneratedCode] = useState('// Fill out the form and click "Generate File" to create the code here.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const CORRECT_PASSWORD = 'azpdscc-admin-2024';
  const AUTH_KEY = 'member-creator-auth';

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

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: '',
      role: '',
      bio: '',
      image: 'https://placehold.co/400x400.png',
    },
    mode: 'onBlur',
  });

  const handleGenerateCode = async (values: MemberFormValues) => {
    setIsGenerating(true);
    setGeneratedCode('// Generating AI-powered file content... please wait.');
    
    const image = values.image || 'https://placehold.co/400x400.png';
    
    const newMemberObject = {
      id: 999, // Placeholder ID
      name: values.name,
      role: values.role,
      image: image,
      bio: values.bio,
    };

    try {
      const fullFileContent = await generateTeamMemberFile({
        newMember: newMemberObject,
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

  const handleCopyCode = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: 'File Content Copied!',
      description: 'The file content has been copied to your clipboard.',
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
            <CardDescription>Please enter the password to access the Team Member Generator.</CardDescription>
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
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Team Member Generator</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Fill out this form to add a new member to the "About Us" page. This tool will generate the updated `data.ts` file content.
        </p>
      </section>

      <div className="grid lg:grid-cols-2 gap-12">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>New Member Details</CardTitle>
            <CardDescription>Enter the information for the new team member.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleGenerateCode)} className="space-y-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="role" render={({ field }) => (
                  <FormItem><FormLabel>Role</FormLabel><FormControl><Input placeholder="e.g., Director" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="bio" render={({ field }) => (
                  <FormItem><FormLabel>Short Bio</FormLabel><FormControl><Textarea placeholder="A brief description of their role or contribution." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="image" render={({ field }) => (
                  <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <Button type="submit" disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
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
              <CardDescription>Copy the entire content below to update your team members.</CardDescription>
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
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleCopyCode(generatedCode)} disabled={isGenerating || generatedCode.startsWith('//')}>
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

