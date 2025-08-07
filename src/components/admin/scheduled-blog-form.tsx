
'use client';

import { useActionState, useState } from 'react';
import type { ScheduledBlogPost } from '@/lib/types';
import type { ScheduledBlogFormState } from '@/app/admin/scheduled-blog/actions';
import { createScheduledBlogPostAction, updateScheduledBlogPostAction } from '@/app/admin/scheduled-blog/actions';
import Link from 'next/link';
import { format, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import { generateBlogPost } from '@/ai/flows/generate-blog-post-flow';
import type { GenerateBlogPostOutput } from '@/ai/flows/generate-blog-post-flow';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AlertCircle, CalendarIcon, Loader2, Sparkles } from 'lucide-react';
import { SubmitButton } from './submit-button';

interface ScheduledBlogFormProps {
  post?: ScheduledBlogPost;
}

export function ScheduledBlogForm({ post }: ScheduledBlogFormProps) {
  const isEditing = !!post;

  const action = isEditing ? updateScheduledBlogPostAction.bind(null, post.id) : createScheduledBlogPostAction;
  const initialState: ScheduledBlogFormState = { errors: {}, message: '' };
  const [formState, formAction] = useActionState(action, initialState);

  // The scheduledDate is a 'yyyy-MM-dd' string. We need to parse it for the calendar.
  const [date, setDate] = useState<Date | undefined>(
      post?.scheduledDate ? parse(post.scheduledDate, 'yyyy-MM-dd', new Date()) : new Date()
  );
  const [topic, setTopic] = useState(post?.topic || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewContent, setPreviewContent] = useState<GenerateBlogPostOutput | null>(null);
  const [showPreview, setShowPreview] = useState(false);


  const handleGeneratePreview = async () => {
    if (!topic) {
        alert("Please enter a topic first to generate a preview.");
        return;
    }

    setIsGenerating(true);
    try {
        const result = await generateBlogPost({ topic });
        setPreviewContent(result);
        setShowPreview(true);
    } catch (error) {
        console.error("Failed to generate blog post preview:", error);
        alert("Failed to generate blog post preview. Please try again.");
    } finally {
        setIsGenerating(false);
    }
  };


  return (
    <>
      <form action={formAction} className="space-y-6">
          <div>
              <Label htmlFor="topic">Blog Post Topic</Label>
              <div className="flex items-center gap-2">
                 <Input id="topic" name="topic" value={topic} onChange={(e) => setTopic(e.target.value)} required placeholder="e.g., The history of Diwali" />
                 <AlertDialog open={showPreview} onOpenChange={setShowPreview}>
                    <AlertDialogTrigger asChild>
                        <Button type="button" variant="secondary" onClick={handleGeneratePreview} disabled={isGenerating || !topic}>
                            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Preview Post
                        </Button>
                    </AlertDialogTrigger>
                    {previewContent && (
                        <AlertDialogContent className="max-w-3xl">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="font-headline text-2xl">{previewContent.title}</AlertDialogTitle>
                                <AlertDialogDescription className="text-left">
                                   This is a preview of the content that will be generated for your topic. You can close this window and refine your topic for a different result.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                             <div className="mt-4 text-sm max-h-[60vh] overflow-y-auto pr-4">
                                <p className="font-bold">Excerpt:</p>
                                <p className="italic text-muted-foreground mb-4">{previewContent.excerpt}</p>
                                <p className="font-bold">Full Content:</p>
                                <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: previewContent.content }} />
                            </div>
                            <AlertDialogAction>Close</AlertDialogAction>
                        </AlertDialogContent>
                    )}
                 </AlertDialog>
              </div>
              {formState.errors?.topic && <p className="text-destructive text-sm mt-1">{formState.errors.topic.join(', ')}</p>}
          </div>
          
          <div>
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" name="image" defaultValue={post?.image || 'https://placehold.co/800x400.png'} required />
              {formState.errors?.image && <p className="text-destructive text-sm mt-1">{formState.errors.image.join(', ')}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
                <Label htmlFor="author">Author</Label>
                <Input id="author" name="author" defaultValue={post?.author || 'PDSCC Team'} required />
                {formState.errors?.author && <p className="text-destructive text-sm mt-1">{formState.errors.author.join(', ')}</p>}
            </div>
             <div>
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={post?.status || 'Pending'}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                    </SelectContent>
                </Select>
                {formState.errors?.status && <p className="text-destructive text-sm mt-1">{formState.errors.status.join(', ')}</p>}
            </div>
          </div>
          
          <div>
              <Label htmlFor="date">Scheduled Publication Date</Label>
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                </Popover>
                <input type="hidden" name="scheduledDate" value={date ? date.toISOString() : ''} />
                {formState.errors?.scheduledDate && <p className="text-destructive text-sm mt-1">{formState.errors.scheduledDate.join(', ')}</p>}
          </div>
          
          {formState.errors?._form && (
              <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{formState.errors._form.join(', ')}</AlertDescription>
              </Alert>
          )}

          <div className="flex items-center gap-4">
              <SubmitButton isEditing={isEditing} createText="Schedule Post" />
              <Button variant="outline" asChild>
                  <Link href="/admin/scheduled-blog">Cancel</Link>
              </Button>
          </div>
      </form>
    </>
  );
}
