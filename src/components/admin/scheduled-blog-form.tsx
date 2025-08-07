
'use client';

import { useActionState, useState, useEffect } from 'react';
import type { ScheduledBlogPost, GenerateBlogPostOutput } from '@/lib/types';
import type { ScheduledBlogFormState } from '@/app/admin/scheduled-blog/actions';
import { createScheduledBlogPostAction, updateScheduledBlogPostAction } from '@/app/admin/scheduled-blog/actions';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { format, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import { generateBlogPost } from '@/ai/flows/generate-blog-post-flow';
import { useToast } from '@/hooks/use-toast';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CalendarIcon, Loader2, Sparkles } from 'lucide-react';
import { SubmitButton } from './submit-button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ScheduledBlogFormProps {
  post?: ScheduledBlogPost;
}

type ScheduledBlogPostFormData = Omit<ScheduledBlogPost, 'id' | 'scheduledDate'> & { scheduledDate: Date };


export function ScheduledBlogForm({ post }: ScheduledBlogFormProps) {
  const isEditing = !!post;
  const action = isEditing ? updateScheduledBlogPostAction.bind(null, post.id) : createScheduledBlogPostAction;
  const initialState: ScheduledBlogFormState = { errors: {}, message: '' };
  const [formState, formAction] = useActionState(action, initialState);
  const { toast } = useToast();

  const [date, setDate] = useState<Date | undefined>(undefined);
  
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewContent, setPreviewContent] = useState<GenerateBlogPostOutput | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);

  const form = useForm<ScheduledBlogPostFormData>({
    defaultValues: {
      topic: post?.topic || '',
      image: post?.image || 'https://placehold.co/800x400.png',
      author: post?.author || 'PDSCC Team',
      status: post?.status || 'Pending',
    }
  });


  useEffect(() => {
    if (post?.scheduledDate) {
      setDate(parse(post.scheduledDate, 'yyyy-MM-dd', new Date()));
    } else {
      setDate(new Date());
    }
  }, [post?.scheduledDate]);

  const handleGeneratePreview = async () => {
    const topic = form.getValues('topic');
    if (!topic) {
        toast({
            variant: 'destructive',
            title: "Topic required",
            description: "Please enter a topic before generating a preview.",
        });
        return;
    }

    setIsPreviewing(true);
    try {
        const result = await generateBlogPost({ topic });
        setPreviewContent(result);
        setShowPreviewDialog(true);
    } catch (error) {
        console.error("Failed to generate blog post preview:", error);
        toast({
            variant: 'destructive',
            title: "Preview Failed",
            description: "Could not generate a preview at this time. Please try again.",
        });
    } finally {
        setIsPreviewing(false);
    }
  };


  return (
    <>
      <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Blog Post Topic</Label>
            <Input id="topic" name="topic" defaultValue={post?.topic} required placeholder="e.g., The history of Diwali" />
            {formState.errors?.topic && <p className="text-destructive text-sm mt-1">{formState.errors.topic.join(', ')}</p>}
          </div>

          <div className="space-y-2">
            <Label>AI Preview</Label>
            <Button type="button" variant="secondary" onClick={handleGeneratePreview} disabled={isPreviewing}>
                {isPreviewing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Preview Post
            </Button>
            <p className="text-sm text-muted-foreground">Generate a preview to see what the post will look like.</p>
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

      <AlertDialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline text-2xl">{previewContent?.title || 'Preview'}</AlertDialogTitle>
            <AlertDialogDescription>
              This is a preview of the generated blog post. Review the content below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="prose prose-sm dark:prose-invert max-h-[60vh] overflow-y-auto">
            <p><strong>Excerpt:</strong> {previewContent?.excerpt}</p>
            <div dangerouslySetInnerHTML={{ __html: previewContent?.content || '' }} />
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowPreviewDialog(false)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
