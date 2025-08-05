
'use server';

import { z } from 'zod';
import { createTeamMember, updateTeamMember, deleteTeamMember } from '@/services/team';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type TeamMemberFormState = {
  errors: {
    name?: string[];
    role?: string[];
    bio?: string[];
    image?: string[];
    _form?: string[];
  };
  success: boolean;
  message: string;
};

const teamMemberSchema = z.object({
  name: z.string().min(2, "Name is required"),
  role: z.string().min(2, "Role is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(200, "Bio cannot exceed 200 characters"),
  image: z.string().url("A valid image URL is required"),
});

export async function createTeamMemberAction(
  prevState: TeamMemberFormState,
  formData: FormData
): Promise<TeamMemberFormState> {
  const validatedFields = teamMemberSchema.safeParse({
    name: formData.get('name'),
    role: formData.get('role'),
    bio: formData.get('bio'),
    image: formData.get('image'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
      message: 'Failed to create team member.',
    };
  }

  try {
    await createTeamMember(validatedFields.data);
    // Moved redirect into the try block to ensure it only runs on success
    revalidatePath('/about');
    revalidatePath('/admin/team');
    redirect('/admin/team');
  } catch (err) {
    return {
      errors: { _form: ['Database error. Failed to create member.'] },
      success: false,
      message: 'Database error. Failed to create member.',
    };
  }
}

export async function updateTeamMemberAction(
  id: string,
  prevState: TeamMemberFormState,
  formData: FormData
): Promise<TeamMemberFormState> {
  const validatedFields = teamMemberSchema.safeParse({
    name: formData.get('name'),
    role: formData.get('role'),
    bio: formData.get('bio'),
    image: formData.get('image'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
      message: 'Failed to update team member.',
    };
  }

  try {
    await updateTeamMember(id, validatedFields.data);
    // Moved redirect into the try block to ensure it only runs on success
    revalidatePath('/about');
    revalidatePath('/admin/team');
    redirect('/admin/team');
  } catch (err) {
     return {
      errors: { _form: ['Database error. Failed to update member.'] },
      success: false,
      message: 'Database error. Failed to update member.',
    };
  }
}


export async function deleteTeamMemberAction(id: string) {
    try {
        await deleteTeamMember(id);
        revalidatePath('/admin/team');
        revalidatePath('/about');
        return { success: true, message: 'Team Member deleted.' };
    } catch (error) {
        console.error('Failed to delete team member:', error);
        return { success: false, message: 'Failed to delete team member.' };
    }
}
