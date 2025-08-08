
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { generateBlogPost } from '@/ai/flows/generate-blog-post-flow';
import { createBlogPost } from '@/services/blog';
import { redirect } from 'next/navigation';

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

  const { title, image, publishDate } = validatedFields.data;

  try {
    // Step 1: Generate the blog post content immediately
    const generatedContent = await generateBlogPost({ topic: title });

    // Step 2: Create the new blog post as a 'Draft'
    const newPostData = {
      ...generatedContent,
      author: 'PDSCC Team',
      date: publishDate, // Use the scheduled publish date
      image: image,
      status: 'Draft' as const,
    };
    await createBlogPost(newPostData);

  } catch (err) {
     const message = err instanceof Error ? err.message : 'An unknown error occurred.';
     return {
      errors: {
        _form: ['An unexpected error occurred while generating the post draft.', message],
      },
    };
  }

  revalidatePath('/admin/blog');
  // Redirect to the blog admin page so the user can see the new draft.
  redirect('/admin/blog');
}
