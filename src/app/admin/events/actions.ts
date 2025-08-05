
'use server';

import { z } from 'zod';
import { createEvent, updateEvent, deleteEvent } from '@/services/events';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';

export type EventFormState = {
  errors: {
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
  };
  success: boolean;
  message: string;
};

const createSlug = (name: string) => {
    return name
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}

// Zod schema for validating form data
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
});

export async function createEventAction(
  prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
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
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
      message: 'Failed to create event. Please check the errors below.',
    };
  }

  try {
    const slug = createSlug(validatedFields.data.name);

    const eventData = {
      ...validatedFields.data,
      slug,
      date: format(validatedFields.data.date, 'MMMM dd, yyyy')
    };
    
    const newEventId = await createEvent(eventData);

    if (!newEventId) {
       throw new Error('Database operation failed to return an ID.');
    }

    revalidatePath('/events');
    revalidatePath(`/events/${slug}`);
    revalidatePath('/');
    
  } catch (err) {
     const message = err instanceof Error ? err.message : 'An unknown error occurred.';
     return {
      errors: {
        _form: ['An unexpected error occurred while creating the event.', message],
      },
      success: false,
      message: `An unexpected error occurred while creating the event. ${message}`,
    };
  }

  redirect('/admin/events');
}

export async function updateEventAction(
  id: string,
  prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {

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
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
      message: 'Failed to update event. Please check the errors below.',
    };
  }

  try {
    const slug = createSlug(validatedFields.data.name);

    // Format the validated Date object into a string for Firestore
    const eventData = {
      ...validatedFields.data,
      slug,
      date: format(validatedFields.data.date, 'MMMM dd, yyyy')
    };

    await updateEvent(id, eventData);
    
    revalidatePath('/events');
    revalidatePath(`/events/${slug}`);
    revalidatePath('/admin/events');
    
  } catch (err) {
     console.error(err);
     const message = err instanceof Error ? err.message : 'An unknown error occurred.';
     return {
      errors: {
        _form: ['An unexpected error occurred while updating the event.', message],
      },
      success: false,
      message: `An unexpected error occurred while updating the event: ${message}`,
    };
  }
  redirect('/admin/events');
}

export async function deleteEventAction(id: string) {
    try {
        await deleteEvent(id);
        revalidatePath('/admin/events');
        revalidatePath('/events');
        revalidatePath('/');
        return { success: true, message: 'Event deleted successfully.' };
    } catch (error) {
        console.error('Failed to delete event:', error);
        return { success: false, message: 'Failed to delete event.' };
    }
}
