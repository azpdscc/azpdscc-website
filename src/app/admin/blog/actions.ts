
'use server';

import { z } from 'zod';
import { createBlogPost, updateBlogPost, deleteBlogPost } from '@/services/blog';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type BlogFormState = {
  errors?: {
    title?: string[];
    slug?: string[];
    author?: string[];
    date?: string[];
    image?: string[];
    excerpt?: string[];
    content?: string[];
    _form?: string[];
  };
  message?: string;
};

// Removed 'status' from the schema as it's no longer manually controlled.
const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  author: z.string().min(1, "Author is required"),
  date: z.coerce.date({ required_error: 'Please select a date.'}),
  image: z.string().url("Must be a valid URL"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
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
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create post. Please check the errors below.',
    };
  }
  
  const postData = {
      ...validatedFields.data,
      status: 'Published' as const, // Posts created manually are always published
  };

  try {
    await createBlogPost(postData);
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
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // When updating, we don't need to change the status. It's handled by the publishing logic.
  const postData = {
      ...validatedFields.data
  };

  try {
    // We pass the partial data, and status is not included.
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
  revalidatePath('/admin/scheduled-blog'); // Revalidate in case it came from a scheduled post
  redirect('/admin/blog');
}

export async function deleteBlogPostAction(id: string) {
    try {
        await deleteBlogPost(id);
        revalidatePath('/admin/blog');
        revalidatePath('/blog');
        return { success: true, message: 'Blog post deleted successfully.' };
    } catch (error) {
        console.error('Failed to delete blog post:', error);
        return { success: false, message: 'Failed to delete blog post.' };
    }
}
