
'use server';

import { z } from 'zod';
import { createScheduledBlogPost, deleteScheduledBlogPost } from '@/services/scheduled-blog';
import { revalidatePath } from 'next/cache';
import { generateBlogPost } from '@/ai/flows/generate-blog-post-flow';
import { createBlogPost } from '@/services/blog';
import { redirect } from 'next/navigation';
import { Timestamp } from 'firebase/firestore';

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
    const newPostId = await createBlogPost(newPostData);

    // Step 3: Create the scheduled post record, linking to the new draft
    await createScheduledBlogPost({
      title,
      image,
      publishDate: Timestamp.fromDate(publishDate),
      generatedPostId: newPostId,
    });

  } catch (err) {
     const message = err instanceof Error ? err.message : 'An unknown error occurred.';
     return {
      errors: {
        _form: ['An unexpected error occurred while generating the post draft.', message],
      },
    };
  }

  revalidatePath('/admin/scheduled-blog');
  revalidatePath('/admin/blog');
  // Redirect to the new draft so the user can review it immediately
  redirect('/admin/blog');
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
