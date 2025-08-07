
'use client';

import { useState, useActionState } from 'react';
import type { ScheduledBlogFormState } from '@/app/admin/scheduled-blog/actions';
import { createDraftBlogPostAction } from '@/app/admin/scheduled-blog/actions';
import { generateBlogPost, type GenerateBlogPostOutput } from '@/ai/flows/generate-blog-post-flow';

import Link from 'next/link';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { SubmitButton } from './submit-button';
import { Form, FormField, FormItem, FormMessage, FormControl } from '@/components/ui/form';

const scheduledBlogPostSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
  author: z.string().min(1, "Author is required"),
});

export type ScheduledBlogPostFormData = z.infer<typeof scheduledBlogPostSchema>;


export function ScheduledBlogForm() {
  const initialState: ScheduledBlogFormState = { errors: {}, message: '' };
  const [formState, formAction] = useActionState(createDraftBlogPostAction, initialState);

  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState<GenerateBlogPostOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<ScheduledBlogPostFormData>({
    resolver: zodResolver(scheduledBlogPostSchema),
    defaultValues: {
      topic: '',
      author: 'PDSCC Team',
    },
  });

  const handleGeneratePreview = async () => {
    const topic = form.getValues('topic');
    if (!topic) {
      form.setError('topic', { type: 'manual', message: 'Topic is required to generate a preview.' });
      return;
    }
     if (topic.length < 3) {
      form.setError('topic', { type: 'manual', message: 'Topic must be at least 3 characters long.' });
      return;
    }


    setIsGenerating(true);
    setPreview(null);

    try {
        const result = await generateBlogPost({ topic });
        if (result) {
            setPreview(result);
        } else {
            toast({
                variant: "destructive",
                title: "Preview Failed",
                description: "Could not generate a preview at this time. Please try again.",
            });
        }
    } catch (error) {
        console.error("Failed to generate blog post preview:", error);
         toast({
            variant: "destructive",
            title: "Preview Failed",
            description: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    } finally {
        setIsGenerating(false);
    }
  };


  return (
    <Form {...form}>
      <form action={formAction} className="space-y-6">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
                <FormItem>
                    <Label htmlFor="topic">Blog Post Topic</Label>
                    <FormControl>
                        <Input {...field} id="topic" required placeholder="e.g., The history of Diwali" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
          
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
                <FormItem>
                    <Label htmlFor="author">Author</Label>
                    <FormControl>
                        <Input {...field} id="author" required />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
          />
          
          {formState.errors?._form && (
              <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{formState.errors._form.join(', ')}</AlertDescription>
              </Alert>
          )}

          <div className="flex items-center gap-4">
              <SubmitButton isEditing={false} createText="Generate Draft" />
              <Button type="button" variant="outline" onClick={handleGeneratePreview} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Preview Post
              </Button>
              <Button variant="ghost" asChild>
                  <Link href="/admin/blog">Cancel</Link>
              </Button>
          </div>
      </form>
       {preview && (
        <AlertDialog open={!!preview} onOpenChange={(isOpen) => !isOpen && setPreview(null)}>
          <AlertDialogContent className="max-w-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>{preview.title}</AlertDialogTitle>
              <AlertDialogDescription>
                This is a preview of the generated post. The final version will be saved as a draft.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="max-h-[60vh] overflow-y-auto pr-4">
                <div 
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: preview.content }}
                />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Form>
  );
}

