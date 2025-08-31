'use client';

import { useState, useActionState, useEffect, useRef } from 'react';
import type { BlogPost } from '@/lib/types';
import type { BlogFormState } from '@/app/admin/blog/actions';
import { createBlogPostAction, updateBlogPostAction } from '@/app/admin/blog/actions';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { generateBlogPost } from '@/ai/flows/generate-blog-post-flow';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CalendarIcon, Loader2, Sparkles } from 'lucide-react';
import { ActionSubmitButton } from './submit-button';
import { useAuth } from '@/hooks/use-auth.tsx';

interface BlogFormProps {
  post?: BlogPost;
}

export function BlogForm({ post }: BlogFormProps) {
  const isEditing = !!post;
  const { user } = useAuth();
  const tokenRef = useRef<HTMLInputElement>(null);

  const action = isEditing ? updateBlogPostAction.bind(null, post.id) : createBlogPostAction;
  const initialState: BlogFormState = { errors: {}, message: '' };
  const [formState, formAction] = useActionState(action, initialState);

  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  
  const [title, setTitle] = useState(post?.title || '');
  const [author, setAuthor] = useState(post?.author || 'PDSCC Team');
  const [image, setImage] = useState(post?.image || 'https://placehold.co/800x400.png');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [date, setDate] = useState<Date | undefined>(post?.date ? new Date(post.date) : new Date());
  const [status, setStatus] = useState<'Draft' | 'Published'>(post?.status || 'Draft');
  
  useEffect(() => {
    if (isEditing && post?.date) {
        setDate(new Date(post.date));
    }
    if (!isEditing) {
        setStatus('Draft');
    }
  }, [isEditing, post?.date]);


  const handleGeneratePost = async () => {
    if (!topic) {
        alert("Please enter a topic first.");
        return;
    }

    setIsGenerating(true);
    try {
        const result = await generateBlogPost({ topic });
        if (result) {
            setTitle(result.title);
            setExcerpt(result.excerpt);
            setContent(result.content);
        }
    } catch (error) {
        console.error("Failed to generate blog post:", error);
        alert("Failed to generate blog post. Please try again.");
    } finally {
        setIsGenerating(false);
    }
  };

  // Update the hidden token field when the user's token changes
  useEffect(() => {
    const setToken = async () => {
        if (user && tokenRef.current) {
            const token = await user.getIdToken();
            tokenRef.current.value = token;
        }
    }
    setToken();
  }, [user]);


  return (
    <>
        <div className="space-y-4 p-4 border rounded-lg bg-secondary/50 mb-6">
            <Label htmlFor="topic" className="text-lg font-semibold">AI Content Generator</Label>
            <p className="text-sm text-muted-foreground">Enter a topic and let AI create a draft for you. Remember to review and edit the generated content before saving.</p>
            <div className="flex items-center gap-2">
                <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., The importance of Vaisakhi" />
                <Button type="button" variant="secondary" onClick={handleGeneratePost} disabled={isGenerating || !topic}>
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate Post
                </Button>
            </div>
        </div>

      <form action={formAction} className="space-y-6">
          <input type="hidden" name="token" ref={tokenRef} />
          <div>
              <Label htmlFor="title">Post Title</Label>
              <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              {formState.errors?.title && <p className="text-destructive text-sm mt-1">{formState.errors.title.join(', ')}</p>}
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
                <Label htmlFor="author">Author</Label>
                <Input id="author" name="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                {formState.errors?.author && <p className="text-destructive text-sm mt-1">{formState.errors.author.join(', ')}</p>}
            </div>
            <div>
                <Label htmlFor="date">Publication Date</Label>
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
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
                <input type="hidden" name="date" value={date ? date.toISOString() : ''} />
                {formState.errors?.date && <p className="text-destructive text-sm mt-1">{formState.errors.date.join(', ')}</p>}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" name="image" value={image} onChange={(e) => setImage(e.target.value)} required />
                {formState.errors?.image && <p className="text-destructive text-sm mt-1">{formState.errors.image.join(', ')}</p>}
            </div>
             <div>
                <Label htmlFor="status">Status</Label>
                <Select name="status" value={status} onValueChange={(value: 'Draft' | 'Published') => setStatus(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                    </SelectContent>
                </Select>
                {formState.errors?.status && <p className="text-destructive text-sm mt-1">{formState.errors.status.join(', ')}</p>}
            </div>
          </div>

          <div>
              <Label htmlFor="excerpt">Excerpt / Short Summary</Label>
              <Textarea id="excerpt" name="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} required />
              {formState.errors?.excerpt && <p className="text-destructive text-sm mt-1">{formState.errors.excerpt.join(', ')}</p>}
          </div>
          
          <div>
              <Label htmlFor="content">Full Content (Supports HTML)</Label>
              <Textarea id="content" name="content" value={content} onChange={(e) => setContent(e.target.value)} rows={15} required />
              {formState.errors?.content && <p className="text-destructive text-sm mt-1">{formState.errors.content.join(', ')}</p>}
          </div>

          {formState.errors?._form && (
              <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{formState.errors._form.join(', ')}</AlertDescription>
              </Alert>
          )}

          <div className="flex items-center gap-4">
              <ActionSubmitButton isEditing={isEditing} createText="Save Post" disabled={!user} />
              <Button type="button" variant="outline" asChild>
                  <Link href="/admin/blog">Cancel</Link>
              </Button>
          </div>
      </form>
    </>
  );
}
