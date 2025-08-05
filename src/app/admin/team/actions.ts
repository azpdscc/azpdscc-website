
'use server';

import { z } from 'zod';
import { createTeamMember, updateTeamMember, deleteTeamMember } from '@/services/team';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type TeamFormState = {
  errors?: {
    name?: string[];
    role?: string[];
    image?: string[];
    bio?: string[];
    _form?: string[];
  };
  message?: string;
};

const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  image: z.string().url("Must be a valid image URL"),
  bio: z.string().min(1, "Bio is required"),
});

export async function createTeamMemberAction(
  prevState: TeamFormState,
  formData: FormData
): Promise<TeamFormState> {
  const validatedFields = teamMemberSchema.safeParse({
    name: formData.get('name'),
    role: formData.get('role'),
    image: formData.get('image'),
    bio: formData.get('bio'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create team member.',
    };
  }

  try {
    await createTeamMember(validatedFields.data);
  } catch (err) {
     const message = err instanceof Error ? err.message : 'An unknown error occurred.';
     return {
      errors: {
        _form: ['An unexpected error occurred.', message],
      },
    };
  }

  revalidatePath('/admin/team');
  revalidatePath('/about');
  redirect('/admin/team');
}

export async function updateTeamMemberAction(
  id: string,
  prevState: TeamFormState,
  formData: FormData
): Promise<TeamFormState> {
  const validatedFields = teamMemberSchema.safeParse({
    name: formData.get('name'),
    role: formData.get('role'),
    image: formData.get('image'),
    bio: formData.get('bio'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await updateTeamMember(id, validatedFields.data);
  } catch (err) {
     const message = err instanceof Error ? err.message : 'An unknown error occurred.';
     return {
      errors: {
        _form: ['An unexpected error occurred.', message],
      },
    };
  }
  
  revalidatePath('/admin/team');
  revalidatePath('/about');
  redirect('/admin/team');
}

export async function deleteTeamMemberAction(id: string) {
    try {
        await deleteTeamMember(id);
        revalidatePath('/admin/team');
        revalidatePath('/about');
        return { success: true, message: 'Team member deleted successfully.' };
    } catch (error) {
        console.error('Failed to delete team member:', error);
        return { success: false, message: 'Failed to delete team member.' };
    }
}
