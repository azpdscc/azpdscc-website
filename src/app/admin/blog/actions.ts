
'use server';

import { z } from 'zod';
import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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

async function makeAdminApiRequest(endpoint: string, method: 'POST' | 'PUT' | 'DELETE', token: string, body: any) {
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
            'Authorization': `Bearer ${token}`, // Pass the user's token for verification in the API
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `API request failed with status ${response.status}`);
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
    token: formData.get('token'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create post. Please check the errors below.',
    };
  }
  
  try {
    const { token, date, ...restOfData } = validatedFields.data;
    const postToSave = {
        ...restOfData,
        date: date.toISOString(),
    };

    await makeAdminApiRequest('/api/admin/blog', 'POST', token, postToSave);

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
    token: formData.get('token'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const { token, date, ...restOfData } = validatedFields.data;
     const postToUpdate = {
        ...restOfData,
        date: date.toISOString(),
    };
    await makeAdminApiRequest(`/api/admin/blog`, 'PUT', token, { id, ...postToUpdate });
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

export async function deleteBlogPostAction(id: string, token: string): Promise<{ success: boolean; message: string }> {
    try {
        if (!token) throw new Error("Authentication token is missing.");
        
        await makeAdminApiRequest(`/api/admin/blog`, 'DELETE', token, { id });
        
        revalidateTag('blogPosts');
        
        return { success: true, message: 'Blog post deleted successfully.' };
    } catch (error) {
        console.error('Failed to delete blog post:', error);
        const message = error instanceof Error ? error.message : 'Failed to delete blog post.';
        return { success: false, message };
    }
}
