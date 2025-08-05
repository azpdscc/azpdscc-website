
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createEvent, updateEvent, deleteEvent, batchCreateEvents } from '@/services/events';
import type { Event } from '@/lib/types';
import { z } from 'zod';
import { format } from 'date-fns';

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\\s-]/g, '')
    .replace(/\\s+/g, '-')
    .slice(0, 50);
};

const eventSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters."),
  date: z.string().min(1, "Date is required."),
  time: z.string().regex(/^\d{1,2}:\d{2}\s(AM|PM)\s-\s\d{1,2}:\d{2}\s(AM|PM)$/, "Time must be in 'H:MM AM/PM - H:MM AM/PM' format (e.g., 2:00 PM - 7:00 PM)."),
  locationName: z.string().min(3, "Location name is required."),
  locationAddress: z.string().min(10, "A full address is required."),
  image: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  description: z.string().min(20, "Short description must be at least 20 characters."),
  fullDescription: z.string().min(50, "Full description must be at least 50 characters."),
  category: z.enum(['Cultural', 'Food', 'Music', 'Dance'], {
    errorMap: () => ({ message: "Please select a valid category." })
  }),
});


export interface EventFormState {
    errors: {
        _form?: string[];
        name?: string[];
        date?: string[];
        time?: string[];
        locationName?: string[];
        locationAddress?: string[];
        image?: string[];
        description?: string[];
        fullDescription?: string[];
        category?: string[];
    };
    success: boolean;
    message: string;
}


export async function createEventAction(
    formState: EventFormState,
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
      message: "Validation failed. Please check the fields.",
    };
  }
  
  const slug = generateSlug(validatedFields.data.name);
  const dataWithSlug = { 
    ...validatedFields.data,
    slug,
    image: validatedFields.data.image || 'https://placehold.co/600x400.png',
  };
  
  try {
    const result = await createEvent(dataWithSlug);
    if (!result) {
        throw new Error("Database operation failed.");
    }
  } catch (error) {
    return {
        errors: { _form: ["An unexpected error occurred while creating the event."] },
        success: false,
        message: "Failed to create event."
    }
  }

  revalidatePath('/events');
  revalidatePath('/admin/events');
  revalidatePath('/');
  redirect('/admin/events');
}

export async function updateEventAction(
    id: string,
    formState: EventFormState,
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
        message: "Validation failed. Please check the fields."
    };
  }
  
  const slug = generateSlug(validatedFields.data.name);
  const dataWithSlug = { 
    ...validatedFields.data,
     slug,
    image: validatedFields.data.image || 'https://placehold.co/600x400.png',
  };

  try {
    const result = await updateEvent(id, dataWithSlug);
    if (!result) {
        throw new Error("Database update failed.");
    }
  } catch (error) {
     return {
        errors: { _form: ["An unexpected error occurred while updating the event."] },
        success: false,
        message: "Failed to update event."
    }
  }

  revalidatePath('/events');
  revalidatePath(`/events/${slug}`);
  revalidatePath('/admin/events');
  revalidatePath('/');
  redirect('/admin/events');
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
