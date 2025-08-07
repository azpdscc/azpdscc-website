
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { generateBlogPost } from '@/ai/flows/generate-blog-post-flow';
import { createBlogPost } from '@/services/blog';
import { deleteScheduledBlogPost } from '@/services/scheduled-blog';

export type ScheduledBlogFormState = {
  errors?: {
    topic?: string[];
    author?: string[];
    _form?: string[];
  };
  message?: string;
};

// This schema must match the one in the form component
const scheduledBlogPostSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
  author: z.string().min(1, "Author is required"),
});

export async function createDraftBlogPostAction(
  prevState: ScheduledBlogFormState,
  formData: FormData
): Promise<ScheduledBlogFormState> {
  const validatedFields = scheduledBlogPostSchema.safeParse({
    topic: formData.get('topic'),
    author: formData.get('author'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to generate draft. Please check the errors below.',
    };
  }

  try {
    // 1. Generate the blog post content from the topic
    const generatedContent = await generateBlogPost({ topic: validatedFields.data.topic });

    // 2. Create the new blog post in the database with "Draft" status
    const newPostData = {
      ...generatedContent,
      author: validatedFields.data.author,
      date: format(new Date(), 'MMMM dd, yyyy'), // Set creation date
      image: 'https://placehold.co/800x400.png', // Default placeholder
      status: 'Draft' as const, // Set status to Draft
    };

    await createBlogPost(newPostData);

  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unknown error occurred.';
    return {
      errors: {
        _form: ['An unexpected error occurred while generating the draft.', message],
      },
    };
  }

  // Redirect to the main blog admin page where the new draft will be visible
  revalidatePath('/admin/blog');
  redirect('/admin/blog');
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
