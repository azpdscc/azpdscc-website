
'use client';

import * as React from 'react';
import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import type { BlogFormState } from '@/app/admin/blog/actions';
import { createScheduledBlogPostAction } from '@/app/admin/blog/actions';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { AlertCircle, CalendarIcon, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { redirect } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Schedule Post
    </Button>
  );
}

export function ScheduledBlogForm() {
  const initialState: BlogFormState = { errors: {}, message: '' };
  const [formState, formAction] = useActionState(createScheduledBlogPostAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const [date, setDate] = React.useState<Date | undefined>();

  useEffect(() => {
    if (formState.message) {
      toast({
        title: "Success!",
        description: formState.message,
        action: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
      formRef.current?.reset();
      setDate(undefined);
    }
  }, [formState, toast]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <div>
        <Label htmlFor="title">Post Title</Label>
        <Input id="title" name="title" placeholder="e.g., The Story of Vaisakhi" required />
        {formState.errors?.title && <p className="text-destructive text-sm mt-1">{formState.errors.title.join(', ')}</p>}
      </div>

      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input id="image" name="image" defaultValue="https://placehold.co/800x400.png" required />
        {formState.errors?.image && <p className="text-destructive text-sm mt-1">{formState.errors.image.join(', ')}</p>}
      </div>
      
      <div>
        <Label htmlFor="publishDate">Publish Date</Label>
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
        <input type="hidden" name="publishDate" value={date ? date.toISOString() : ''} />
        {formState.errors?.publishDate && <p className="text-destructive text-sm mt-1">{formState.errors.publishDate.join(', ')}</p>}
      </div>

      {formState.errors?._form && (
          <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{formState.errors._form.join(', ')}</AlertDescription>
          </Alert>
      )}
      
      <SubmitButton />
    </form>
  );
}
