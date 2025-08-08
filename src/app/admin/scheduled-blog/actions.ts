
'use server';

import { z } from 'zod';
import { createScheduledBlogPost, deleteScheduledBlogPost } from '@/services/scheduled-blog';
import { revalidatePath } from 'next/cache';

export type ScheduledBlogFormState = {
  errors?: {
    title?: string[];
    publishDate?: string[];
    image?: string[];
    _form?: string[];
  };
  message?: string;
};

const scheduledBlogPostSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters long."),
  publishDate: z.coerce.date({ required_error: 'Please select a date.'}),
  image: z.string().url("Must be a valid URL"),
});

export async function createScheduledBlogPostAction(
  prevState: ScheduledBlogFormState,
  formData: FormData
): Promise<ScheduledBlogFormState> {
  const validatedFields = scheduledBlogPostSchema.safeParse({
    title: formData.get('title'),
    publishDate: formData.get('publishDate'),
    image: formData.get('image'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to schedule post.',
    };
  }

  try {
    await createScheduledBlogPost(validatedFields.data);
  } catch (err) {
     const message = err instanceof Error ? err.message : 'An unknown error occurred.';
     return {
      errors: {
        _form: ['An unexpected error occurred while scheduling the post.', message],
      },
    };
  }

  revalidatePath('/admin/scheduled-blog');
  return {
    message: 'Successfully scheduled the new blog post!',
  }
}


export async function deleteScheduledBlogPostAction(id: string) {
    try {
        await deleteScheduledBlogPost(id);
        revalidatePath('/admin/scheduled-blog');
        return { success: true, message: 'Scheduled post deleted successfully.' };
    } catch (error) {
        console.error('Failed to delete scheduled post:', error);
        return { success: false, message: 'Failed to delete scheduled post.' };
    }
}
