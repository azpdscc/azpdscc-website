
'use server';

import { z } from 'zod';
import { createEvent, updateEvent, deleteEvent } from '@/services/events';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';

export type EventFormState = {
  errors: {
    name?: string[];
    slug?: string[];
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

// Use a consistent, simple time format validation.
const timeRegex = /^\d{1,2}:\d{2}\s(AM|PM)\s-\s\d{1,2}:\d{2}\s(AM|PM)$/;

const eventSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  date: z.date({ required_error: 'Please select a date.'}),
  time: z.string().regex(timeRegex, "Time must be in 'H:MM AM/PM - H:MM AM/PM' format"),
  locationName: z.string().min(3, "Location name is required"),
  locationAddress: z.string().min(10, "Full address is required"),
  image: z.string().url("Must be a valid URL"),
  description: z.string().min(20, "Short description must be at least 20 characters").max(150, "Short description cannot exceed 150 characters"),
  fullDescription: z.string().min(50, "Full description must be at least 50 words"),
  category: z.enum(['Cultural', 'Food', 'Music', 'Dance']),
});


export async function createEventAction(
  prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  
  const dateEntry = formData.get('date');
  const dateObject = dateEntry ? new Date(dateEntry.toString()) : null;

  const validatedFields = eventSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    date: dateObject,
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

  const eventData = {
    ...validatedFields.data,
    date: format(validatedFields.data.date, 'MMMM dd, yyyy')
  };

  try {
    const newEventId = await createEvent(eventData);
    if (!newEventId) {
      throw new Error('Database operation failed.');
    }
    // Moved redirect into the try block to ensure it only runs on success
    revalidatePath('/events');
    revalidatePath('/admin/events');
    revalidatePath('/');
    redirect('/admin/events');
  } catch (err) {
    return {
      errors: {
        _form: ['An unexpected error occurred while creating the event.'],
      },
      success: false,
      message: 'An unexpected error occurred while creating the event.',
    };
  }
}


export async function updateEventAction(
  id: string,
  prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {

  const dateEntry = formData.get('date');
  const dateObject = dateEntry ? new Date(dateEntry.toString()) : null;

  const validatedFields = eventSchema.safeParse({
    name: formData.get('name'),
    slug: formData.get('slug'),
    date: dateObject,
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

  const eventData = {
    ...validatedFields.data,
    date: format(validatedFields.data.date, 'MMMM dd, yyyy')
  };

  try {
    const success = await updateEvent(id, eventData);
    if (!success) {
      throw new Error('Database update failed.');
    }
    // Moved redirect into the try block to ensure it only runs on success
    revalidatePath('/events');
    revalidatePath(`/events/${validatedFields.data.slug}`);
    revalidatePath('/admin/events');
    redirect('/admin/events');
  } catch (err) {
     return {
      errors: {
        _form: ['An unexpected error occurred while updating the event.'],
      },
      success: false,
      message: 'An unexpected error occurred while updating the event.',
    };
  }
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
