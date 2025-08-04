
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createEvent, updateEvent, deleteEvent } from '@/services/events';
import type { EventFormData } from '@/lib/types';
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
  } else {
    throw new Error('Failed to create event.');
  }
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
  } else {
    throw new Error('Failed to update event.');
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

  const result = await deleteEvent(id);

  if (result) {
    revalidatePath('/events');
    revalidatePath('/admin/events');
    revalidatePath('/');
  } else {
    throw new Error('Failed to delete event.');
  }
}
