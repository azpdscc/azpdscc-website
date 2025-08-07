
'use client';

import { useActionState } from 'react';
import type { ScheduledBlogFormState } from '@/app/admin/scheduled-blog/actions';
import { createDraftBlogPostAction } from '@/app/admin/scheduled-blog/actions';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { SubmitButton } from './submit-button';

export function ScheduledBlogForm() {
  const initialState: ScheduledBlogFormState = { errors: {}, message: '' };
  const [formState, formAction] = useActionState(createDraftBlogPostAction, initialState);

  return (
    <>
      <form action={formAction} className="space-y-6">
          <div>
              <Label htmlFor="topic">Blog Post Topic</Label>
              <Input id="topic" name="topic" required placeholder="e.g., The history of Diwali" />
              {formState.errors?.topic && <p className="text-destructive text-sm mt-1">{formState.errors.topic.join(', ')}</p>}
          </div>
          
          <div>
              <Label htmlFor="author">Author</Label>
              <Input id="author" name="author" defaultValue="PDSCC Team" required />
              {formState.errors?.author && <p className="text-destructive text-sm mt-1">{formState.errors.author.join(', ')}</p>}
          </div>
          
          {formState.errors?._form && (
              <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{formState.errors._form.join(', ')}</AlertDescription>
              </Alert>
          )}

          <div className="flex items-center gap-4">
              <SubmitButton isEditing={false} createText="Generate Draft" />
              <Button variant="outline" asChild>
                  <Link href="/admin/blog">Cancel</Link>
              </Button>
          </div>
      </form>
    </>
  );
}
