
'use server';

import { z } from 'zod';
import { createBlogPost, updateBlogPost, deleteBlogPost, getBlogPostById } from '@/services/blog';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { generateBlogPost } from '@/ai/flows/generate-blog-post-flow';

export type BlogFormState = {
  errors?: {
    title?: string[];
    slug?: string[];
    author?: string[];
    date?: string[];
    image?: string[];
    excerpt?: string[];
    content?: string[];
    status?: string[];
    _form?: string[];
  };
  message?: string;
};

// This schema is used for both creating and updating standard posts.
const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  author: z.string().min(1, "Author is required"),
  date: z.coerce.date({ required_error: 'Please select a date.'}),
  image: z.string().url("Must be a valid URL"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  status: z.enum(['Draft', 'Published']),
});

// This schema is used specifically for the AI-powered scheduling form.
const scheduledBlogPostSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters long."),
  publishDate: z.coerce.date({ required_error: 'Please select a date.'}),
  image: z.string().url("Must be a valid URL"),
});


export async function createBlogPostAction(
  prevState: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  const validatedFields = blogPostSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    author: formData.get('author'),
    date: formData.get('date'),
    image: formData.get('image'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create post. Please check the errors below.',
    };
  }
  
  try {
    await createBlogPost(validatedFields.data);
  } catch (err) {
     const message = err instanceof Error ? err.message : 'An unknown error occurred.';
     return {
      errors: {
        _form: ['An unexpected error occurred while creating the post.', message],
      },
    };
  }

  revalidatePath('/blog');
  revalidatePath('/admin/blog');
  redirect('/admin/blog');
}

export async function createScheduledBlogPostAction(
  prevState: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
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
    const generatedContent = await generateBlogPost({ topic: title });

    const newPostData = {
      ...generatedContent,
      author: 'PDSCC Team',
      date: publishDate,
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
  redirect('/admin/blog');
}


export async function updateBlogPostAction(
  id: string,
  prevState: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {

  const validatedFields = blogPostSchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    author: formData.get('author'),
    date: formData.get('date'),
    image: formData.get('image'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const postData = {
      ...validatedFields.data,
  };

  try {
    await updateBlogPost(id, postData);
  } catch (err) {
     const message = err instanceof Error ? err.message : 'An unknown error occurred.';
     return {
      errors: {
        _form: ['An unexpected error occurred while updating the post.', message],
      },
    };
  }
  
  revalidatePath('/blog');
  revalidatePath(`/blog/${postData.slug}`);
  revalidatePath('/admin/blog');
  redirect('/admin/blog');
}

export async function deleteBlogPostAction(id: string) {
    try {
        const postToDelete = await getBlogPostById(id);
        if (!postToDelete) {
             return { success: false, message: 'Could not find the post to delete.' };
        }
        await deleteBlogPost(id);
        
        revalidatePath('/admin/blog');
        revalidatePath('/blog');
        // Revalidate the specific post page to prevent lingering cached versions
        if (postToDelete.slug) {
            revalidatePath(`/blog/${postToDelete.slug}`);
        }

        return { success: true, message: 'Blog post deleted successfully.' };
    } catch (error) {
        console.error('Failed to delete blog post:', error);
        return { success: false, message: 'Failed to delete blog post.' };
    }
}
