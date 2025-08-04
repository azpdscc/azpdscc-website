
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, Copy, Loader2, Sparkles, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateEventsFile } from '@/ai/flows/generate-events-file-flow';
import { importEventsAction } from '../actions';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

export default function ImportEventsPage() {
  const { toast } = useToast();
  const [generatedCode, setGeneratedCode] = useState('// Click "Generate File" to create the JSON content here.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    setGeneratedCode('// Generating AI-powered file content... please wait.');
    
    try {
      const result = await generateEventsFile();

      if (result.fileContent) {
        setGeneratedCode(result.fileContent);
        toast({
          title: "File Generated!",
          description: "The JSON content for past events has been generated.",
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

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: 'Content Copied!',
      description: 'The JSON has been copied to your clipboard.',
    });
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
        const result = await importEventsAction(generatedCode);
        if (result.success) {
            toast({
                title: "Import Successful!",
                description: result.message,
            });
        } else {
            toast({
                variant: 'destructive',
                title: "Import Failed",
                description: result.message,
            });
        }
    } catch (error) {
        toast({
            variant: 'destructive',
            title: "An Error Occurred",
            description: "Could not import the events. Please try again.",
        });
    } finally {
        setIsImporting(false);
    }
  };


  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Past Events Importer</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Use this AI-powered tool to quickly populate your site with realistic past events.
        </p>
      </section>

      <Card className="shadow-lg max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Generated `events.json` File Content</CardTitle>
          <CardDescription>Click generate, then import the data into your database.</CardDescription>
        </CardHeader>
        <CardContent>
           <Alert className="mb-4">
              <FileText className="h-4 w-4" />
              <AlertTitle>How to Use</AlertTitle>
              <AlertDescription>
                1. Click the "Generate File" button below.
                <br />
                2. The AI will create a list of past events in JSON format.
                <br />
                3. Click the "Import to Database" button to add them all at once.
              </AlertDescription>
          </Alert>
           <div className="flex gap-4 mb-4">
                <Button onClick={handleGenerateCode} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate File
                </Button>
                 <Button onClick={handleImport} disabled={isImporting || generatedCode.startsWith('//')}>
                    {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    Import to Database
                </Button>
                 <Button variant="outline" asChild>
                    <Link href="/admin/events">Back to Events</Link>
                </Button>
           </div>
          <div className="relative mt-4">
            <Textarea 
                className="font-mono text-sm min-h-[500px]"
                value={generatedCode}
                readOnly
            />
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={handleCopyCode} disabled={isGenerating || generatedCode.startsWith('//')}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
