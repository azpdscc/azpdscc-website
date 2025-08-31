
'use server';

import { z } from 'zod';
import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import { verifyIdToken } from '@/lib/firebase-admin';

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
    token?: string[];
  };
  message?: string;
};

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string(), 
  author: z.string().min(1, "Author is required"),
  date: z.coerce.date({ required_error: 'Please select a date.'}),
  image: z.string().url("Must be a valid URL"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  status: z.enum(['Draft', 'Published']),
  token: z.string().min(1, "Authentication token is missing."),
});

const createSlug = (title: string) => {
    return title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

export async function createBlogPostAction(
  prevState: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  const title = formData.get('title') as string;
  
  const validatedFields = blogPostSchema.safeParse({
    title: title,
    slug: createSlug(title),
    author: formData.get('author'),
    date: formData.get('date'),
    image: formData.get('image'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    status: formData.get('status'),
    token: formData.get('token'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create post. Please check the errors below.',
    };
  }
  
  try {
    const { token, ...restOfData } = validatedFields.data;
    await verifyIdToken(token);
    
    const postToSave = {
        ...restOfData,
        date: restOfData.date.toISOString(),
    };

    await adminDb.collection('blogPosts').add(postToSave);

  } catch (err) {
     const message = err instanceof Error ? err.message : 'An unknown error occurred.';
     return {
      errors: {
        _form: ['An unexpected error occurred while creating the post.', message],
      },
    };
  }

  revalidateTag('blogPosts');
  revalidatePath('/blog');
  revalidatePath('/admin/blog');
  redirect('/admin/blog');
}


export async function updateBlogPostAction(
  id: string,
  prevState: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {

  const title = formData.get('title') as string;

  const validatedFields = blogPostSchema.safeParse({
    title: title,
    slug: createSlug(title),
    author: formData.get('author'),
    date: formData.get('date'),
    image: formData.get('image'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    status: formData.get('status'),
    token: formData.get('token'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const { token, ...restOfData } = validatedFields.data;
    await verifyIdToken(token);

     const postToUpdate = {
        ...restOfData,
        date: restOfData.date.toISOString(),
    };
    await adminDb.collection('blogPosts').doc(id).update(postToUpdate);

  } catch (err) {
     const message = err instanceof Error ? err.message : 'An unknown error occurred.';
     return {
      errors: {
        _form: ['An unexpected error occurred while updating the post.', message],
      },
    };
  }
  
  revalidateTag('blogPosts');
  revalidatePath(`/blog/${validatedFields.data.slug}`);
  revalidatePath('/admin/blog');
  redirect('/admin/blog');
}

export async function deleteBlogPostAction(id: string, token: string): Promise<{ success: boolean; message: string }> {
    try {
        if (!token) throw new Error("Authentication token is missing.");
        await verifyIdToken(token);
        
        await adminDb.collection('blogPosts').doc(id).delete();
        
        revalidateTag('blogPosts');
        revalidatePath('/blog');
        revalidatePath('/admin/blog');
        
        return { success: true, message: 'Blog post deleted successfully.' };
    } catch (error) {
        console.error('Failed to delete blog post:', error);
        const message = error instanceof Error ? error.message : 'Failed to delete blog post.';
        return { success: false, message };
    }
}
