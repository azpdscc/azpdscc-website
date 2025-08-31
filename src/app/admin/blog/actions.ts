
'use server';

import { z } from 'zod';
import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getBlogPostById } from '@/services/blog';

// This is the URL of our new, secure API route.
// It will be called by our server actions.
const getAbsoluteUrl = (path: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return `${baseUrl}${path}`;
};


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

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string(), 
  author: z.string().min(1, "Author is required"),
  date: z.coerce.date({ required_error: 'Please select a date.'}),
  image: z.string().url("Must be a valid URL"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  status: z.enum(['Draft', 'Published']),
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

async function makeAdminApiRequest(endpoint: string, method: 'POST' | 'PUT' | 'DELETE', body: any) {
    const apiUrl = getAbsoluteUrl(endpoint);
    const apiKey = process.env.ADMIN_API_KEY;

    if (!apiKey) {
        throw new Error('Admin API key is not configured on the server.');
    }
    
    const response = await fetch(apiUrl, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'x-admin-api-key': apiKey,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    return response.json();
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
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create post. Please check the errors below.',
    };
  }
  
  try {
    const { date, ...restOfData } = validatedFields.data;
    const postToSave = {
        ...restOfData,
        date: date.toISOString(), // Send as ISO string
    };
    await makeAdminApiRequest('/api/admin/blog', 'POST', postToSave);

  } catch (err) {
     const message = err instanceof Error ? err.message : 'An unknown error occurred.';
     return {
      errors: {
        _form: ['An unexpected error occurred while creating the post.', message],
      },
    };
  }

  revalidateTag('blogPosts');
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
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const { date, ...restOfData } = validatedFields.data;
     const postToUpdate = {
        ...restOfData,
        date: date.toISOString(), // Send as ISO string
    };
    await makeAdminApiRequest(`/api/admin/blog`, 'PUT', { id, ...postToUpdate });
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
  redirect('/admin/blog');
}

export async function deleteBlogPostAction(id: string) {
    try {
        const postToDelete = await getBlogPostById(id);
        if (!postToDelete) {
             return { success: false, message: 'Could not find the post to delete.' };
        }
        
        await makeAdminApiRequest(`/api/admin/blog`, 'DELETE', { id });
        
        revalidateTag('blogPosts');
        if (postToDelete.slug) {
            revalidatePath(`/blog/${postToDelete.slug}`);
        }
        
        return { success: true, message: 'Blog post deleted successfully.' };
    } catch (error) {
        console.error('Failed to delete blog post:', error);
        const message = error instanceof Error ? error.message : 'Failed to delete blog post.';
        return { success: false, message };
    }
}
