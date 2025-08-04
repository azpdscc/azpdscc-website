
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createTeamMember, updateTeamMember, deleteTeamMember } from '@/services/team';
import type { TeamMember } from '@/lib/types';
import { z } from 'zod';

type MemberFormData = Omit<TeamMember, 'id'>;

export async function createTeamMemberAction(formData: MemberFormData) {
  const result = await createTeamMember(formData);

  if (result) {
    revalidatePath('/about');
    revalidatePath('/admin/team');
    redirect('/admin/team');
  }
}

export async function updateTeamMemberAction(id: string, formData: MemberFormData) {
  const result = await updateTeamMember(id, formData);

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
