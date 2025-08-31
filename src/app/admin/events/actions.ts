
'use server';

import { z } from 'zod';
import { createEvent, updateEvent, deleteEvent } from '@/services/events';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { verifyIdToken } from '@/lib/firebase-admin';

export type FormState = {
  errors?: {
    name?: string[];
    date?: string[];
    time?: string[];
    locationName?: string[];
    locationAddress?: string[];
    image?: string[];
    description?: string[];
    fullDescription?: string[];
    category?: string[];
    _form?: string[];
    token?: string[];
  };
  message?: string;
};

const createSlug = (name: string) => {
    return name
        .toLowerCase()
        .replace(/\s+/g, '-') 
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

const eventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  date: z.coerce.date({ required_error: 'Please select a date.'}),
  time: z.string().min(1, "Time is required"),
  locationName: z.string().min(1, "Location name is required"),
  locationAddress: z.string().min(1, "Address is required"),
  image: z.string().url("Must be a valid URL"),
  description: z.string().min(1, "Short description is required"),
  fullDescription: z.string().min(1, "Full description is required"),
  category: z.enum(['Cultural', 'Food', 'Music', 'Dance']),
  token: z.string().min(1, "Authentication token is missing."),
});

export async function createEventAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = eventSchema.safeParse({
    name: formData.get('name'),
    date: formData.get('date'),
    time: formData.get('time'),
    locationName: formData.get('locationName'),
    locationAddress: formData.get('locationAddress'),
    image: formData.get('image'),
    description: formData.get('description'),
    fullDescription: formData.get('fullDescription'),
    category: formData.get('category'),
    token: formData.get('token'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create event. Please check the errors below.',
    };
  }

  const slug = createSlug(validatedFields.data.name);
  
  try {
    await verifyIdToken(validatedFields.data.token);
    const { token, ...eventData } = validatedFields.data;
    await createEvent({ ...eventData, slug });
  } catch (err) {
     const message = err instanceof Error ? err.message : 'An unknown error occurred.';
     return {
      errors: {
        _form: ['An unexpected error occurred while creating the event.', message],
      },
    };
  }

  revalidatePath('/events');
  revalidatePath('/admin/events');
  revalidatePath('/');
  redirect('/admin/events');
}

export async function updateEventAction(
  id: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {

  const validatedFields = eventSchema.safeParse({
    name: formData.get('name'),
    date: formData.get('date'),
    time: formData.get('time'),
    locationName: formData.get('locationName'),
    locationAddress: formData.get('locationAddress'),
    image: formData.get('image'),
    description: formData.get('description'),
    fullDescription: formData.get('fullDescription'),
    category: formData.get('category'),
    token: formData.get('token'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const slug = createSlug(validatedFields.data.name);

  try {
    await verifyIdToken(validatedFields.data.token);
    const { token, ...eventData } = validatedFields.data;
    await updateEvent(id, { ...eventData, slug });
  } catch (err) {
     const message = err instanceof Error ? err.message : 'An unknown error occurred.';
     return {
      errors: {
        _form: ['An unexpected error occurred while updating the event.', message],
      },
    };
  }
  
  revalidatePath('/events');
  revalidatePath(`/events/${slug}`);
  revalidatePath('/admin/events');
  redirect('/admin/events');
}

export async function deleteEventAction(id: string, token: string) {
    try {
        if (!token) throw new Error("Authentication token is missing.");
        await verifyIdToken(token);
        await deleteEvent(id);
        revalidatePath('/admin/events');
        revalidatePath('/events');
        revalidatePath('/');
        return { success: true, message: 'Event deleted successfully.' };
    } catch (error) {
        console.error('Failed to delete event:', error);
        const message = error instanceof Error ? error.message : 'Failed to delete event.';
        return { success: false, message };
    }
}
