
'use server';

import { z } from 'zod';
import { createScheduledBlogPost, updateScheduledBlogPost, deleteScheduledBlogPost } from '@/services/scheduled-blog';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';

export type ScheduledBlogFormState = {
  errors?: {
    topic?: string[];
    image?: string[];
    scheduledDate?: string[];
    status?: string[];
    author?: string[];
    _form?: string[];
  };
  message?: string;
};

const scheduledBlogPostSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  image: z.string().url("Must be a valid URL"),
  scheduledDate: z.coerce.date({ required_error: 'Please select a date.'}),
  status: z.enum(['Pending', 'Published']),
  author: z.string().min(1, "Author is required"),
});

export async function createScheduledBlogPostAction(
  prevState: ScheduledBlogFormState,
  formData: FormData
): Promise<ScheduledBlogFormState> {
  const validatedFields = scheduledBlogPostSchema.safeParse({
    topic: formData.get('topic'),
    image: formData.get('image'),
    scheduledDate: formData.get('scheduledDate'),
    status: formData.get('status'),
    author: formData.get('author'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to schedule post. Please check the errors below.',
    };
  }
  
  const postData = {
      ...validatedFields.data,
      scheduledDate: format(validatedFields.data.scheduledDate, 'yyyy-MM-dd')
  };

  try {
    await createScheduledBlogPost(postData);
  } catch (err) {
     const message = err instanceof Error ? err.message : 'An unknown error occurred.';
     return {
      errors: {
        _form: ['An unexpected error occurred.', message],
      },
    };
  }

  revalidatePath('/admin/scheduled-blog');
  redirect('/admin/scheduled-blog');
}

export async function updateScheduledBlogPostAction(
  id: string,
  prevState: ScheduledBlogFormState,
  formData: FormData
): Promise<ScheduledBlogFormState> {

  const validatedFields = scheduledBlogPostSchema.safeParse({
    topic: formData.get('topic'),
    image: formData.get('image'),
    scheduledDate: formData.get('scheduledDate'),
    status: formData.get('status'),
    author: formData.get('author'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const postData = {
      ...validatedFields.data,
      scheduledDate: format(validatedFields.data.scheduledDate, 'yyyy-MM-dd')
  };

  try {
    await updateScheduledBlogPost(id, postData);
  } catch (err) {
     const message = err instanceof Error ? err.message : 'An unknown error occurred.';
     return {
      errors: {
        _form: ['An unexpected error occurred.', message],
      },
    };
  }
  
  revalidatePath('/admin/scheduled-blog');
  redirect('/admin/scheduled-blog');
}

export async function deleteScheduledBlogPostAction(id: string) {
    try {
        await deleteScheduledBlogPost(id);
        revalidatePath('/admin/scheduled-blog');
        return { success: true, message: 'Scheduled blog post deleted successfully.' };
    } catch (error) {
        console.error('Failed to delete scheduled blog post:', error);
        return { success: false, message: 'Failed to delete post.' };
    }
}
