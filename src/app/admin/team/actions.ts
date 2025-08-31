
'use server';

import { z } from 'zod';
import { createTeamMember, updateTeamMember, deleteTeamMember } from '@/services/team';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { verifyIdToken } from '@/lib/firebase-admin';

export type TeamFormState = {
  errors?: {
    name?: string[];
    role?: string[];
    image?: string[];
    bio?: string[];
    order?: string[];
    _form?: string[];
    token?: string[];
  };
  message?: string;
};

const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  image: z.string().url("Must be a valid image URL").optional().or(z.literal('')),
  bio: z.string().min(1, "Bio is required"),
  order: z.coerce.number().default(99),
  token: z.string().min(1, "Authentication token is missing."),
});

const placeholderImage = 'https://placehold.co/400x400.png';

export async function createTeamMemberAction(
  prevState: TeamFormState,
  formData: FormData
): Promise<TeamFormState> {
  const validatedFields = teamMemberSchema.safeParse({
    name: formData.get('name'),
    role: formData.get('role'),
    image: formData.get('image'),
    bio: formData.get('bio'),
    order: formData.get('order'),
    token: formData.get('token'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create team member.',
    };
  }

  try {
    await verifyIdToken(validatedFields.data.token);
    const { token, ...memberDataFromForm } = validatedFields.data;
    const memberData = {
      ...memberDataFromForm,
      image: memberDataFromForm.image || placeholderImage,
    };
    await createTeamMember(memberData);
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
    order: formData.get('order'),
    token: formData.get('token'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    await verifyIdToken(validatedFields.data.token);
    const { token, ...memberDataFromForm } = validatedFields.data;
    const memberData = {
      ...memberDataFromForm,
      image: memberDataFromForm.image || placeholderImage,
    };
    await updateTeamMember(id, memberData);
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

export async function deleteTeamMemberAction(id: string, token: string) {
    try {
        if (!token) throw new Error("Authentication token is missing.");
        await verifyIdToken(token);
        await deleteTeamMember(id);
        revalidatePath('/admin/team');
        revalidatePath('/about');
        return { success: true, message: 'Team member deleted successfully.' };
    } catch (error) {
        console.error('Failed to delete team member:', error);
        const message = error instanceof Error ? error.message : 'Failed to delete team member.';
        return { success: false, message };
    }
}
