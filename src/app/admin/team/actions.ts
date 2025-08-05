
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createTeamMember, updateTeamMember, deleteTeamMember } from '@/services/team';
import type { TeamMember } from '@/lib/types';
import { z } from 'zod';

// This is the shape of the data coming from the form
const memberFormSchema = z.object({
  name: z.string().min(3, "Member name is required."),
  role: z.string().min(3, "Role is required."),
  bio: z.string().min(10, "Bio must be at least 10 characters long."),
  image: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

export async function createTeamMemberAction(formData: FormData) {
  const validatedFields = memberFormSchema.safeParse({
    name: formData.get('name'),
    role: formData.get('role'),
    bio: formData.get('bio'),
    image: formData.get('image'),
  });

  if (!validatedFields.success) {
    // This part is currently not set up to return errors to the form,
    // but the validation ensures bad data doesn't get sent to the database.
    console.error('Form validation failed:', validatedFields.error.flatten().fieldErrors);
    return; // Stop execution if validation fails
  }

  const result = await createTeamMember({
      ...validatedFields.data,
      image: validatedFields.data.image || 'https://placehold.co/400x400.png', // Fallback to placeholder
  });

  if (result) {
    revalidatePath('/about');
    revalidatePath('/admin/team');
    redirect('/admin/team');
  }
}

export async function updateTeamMemberAction(id: string, formData: FormData) {
    const validatedFields = memberFormSchema.safeParse({
        name: formData.get('name'),
        role: formData.get('role'),
        bio: formData.get('bio'),
        image: formData.get('image'),
    });

    if (!validatedFields.success) {
        console.error('Form validation failed:', validatedFields.error.flatten().fieldErrors);
        return;
    }

  const result = await updateTeamMember(id, {
      ...validatedFields.data,
      image: validatedFields.data.image || 'https://placehold.co/400x400.png',
  });

  if (result) {
    revalidatePath('/about');
    revalidatePath('/admin/team');
    redirect('/admin/team');
  }
}

const DeleteFormSchema = z.object({
  id: z.string(),
});

export async function deleteTeamMemberAction(formData: FormData) {
    const validatedFields = DeleteFormSchema.safeParse({
        id: formData.get('id'),
    });

    if (!validatedFields.success) {
        return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Delete Member.',
        };
    }
    
    const { id } = validatedFields.data;

    await deleteTeamMember(id);
    revalidatePath('/about');
    revalidatePath('/admin/team');
}
