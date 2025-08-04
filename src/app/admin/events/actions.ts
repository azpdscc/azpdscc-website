
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createEvent, updateEvent, deleteEvent, batchCreateEvents } from '@/services/events';
import type { EventFormData, Event } from '@/lib/types';
import { z } from 'zod';

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\\s-]/g, '')
    .replace(/\\s+/g, '-')
    .slice(0, 50);
};

export async function createEventAction(formData: EventFormData) {
  const slug = generateSlug(formData.name);
  const dataWithSlug = { ...formData, slug };
  
  const result = await createEvent(dataWithSlug);

  if (result) {
    revalidatePath('/events');
    revalidatePath('/admin/events');
    revalidatePath('/');
    redirect('/admin/events');
  } 
  // No explicit 'else' needed as redirect throws an error, stopping execution.
  // If createEvent throws, the error will be caught by the form's try/catch block.
}

export async function updateEventAction(id: string, formData: EventFormData) {
  const slug = generateSlug(formData.name);
  const dataWithSlug = { ...formData, slug };

  const result = await updateEvent(id, dataWithSlug);

  if (result) {
    revalidatePath('/events');
    revalidatePath(`/events/${slug}`);
    revalidatePath('/admin/events');
    revalidatePath('/');
    redirect('/admin/events');
  }
}

const DeleteFormSchema = z.object({
  id: z.string(),
});

export async function deleteEventAction(formData: FormData) {
    const validatedFields = DeleteFormSchema.safeParse({
        id: formData.get('id'),
    });

    if (!validatedFields.success) {
        return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Delete Event.',
        };
    }
    
    const { id } = validatedFields.data;

  await deleteEvent(id);
  // Revalidate paths after deletion
  revalidatePath('/events');
  revalidatePath('/admin/events');
  revalidatePath('/');
}

const EventsFileSchema = z.object({
  events: z.array(z.any()), // Basic validation, can be improved
});

export async function importEventsAction(jsonContent: string) {
  try {
    const parsed = JSON.parse(jsonContent);
    const validation = EventsFileSchema.safeParse(parsed);

    if (!validation.success) {
      return { success: false, message: 'Invalid JSON format. Expected an object with an "events" array.' };
    }

    // Add slugs to each event
    const eventsWithSlugs = validation.data.events.map((event: Omit<Event, 'id' | 'slug'>) => ({
      ...event,
      slug: generateSlug(event.name),
    }));

    const success = await batchCreateEvents(eventsWithSlugs);

    if (success) {
      revalidatePath('/events');
      revalidatePath('/admin/events');
      revalidatePath('/');
      return { success: true, message: 'Events imported successfully!' };
    } else {
      return { success: false, message: 'Failed to import events to the database.' };
    }
  } catch (error) {
    console.error("Import error:", error);
    return { success: false, message: 'Failed to parse JSON content. Please check the file for errors.' };
  }
}
