
'use server';

import { z } from 'zod';
import { createSponsor, updateSponsor, deleteSponsor } from '@/services/sponsors';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type SponsorFormState = {
  errors?: {
    name?: string[];
    logo?: string[];
    level?: string[];
    website?: string[];
    _form?: string[];
  };
  message?: string;
};

const sponsorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logo: z.string().url("Must be a valid image URL"),
  level: z.enum(['Diamond', 'Gold', 'Silver', 'Bronze', 'Other'], { required_error: 'Please select a level.'}),
  website: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

export async function createSponsorAction(
  prevState: SponsorFormState,
  formData: FormData
): Promise<SponsorFormState> {
  const validatedFields = sponsorSchema.safeParse({
    name: formData.get('name'),
    logo: formData.get('logo'),
    level: formData.get('level'),
    website: formData.get('website'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create sponsor.',
    };
  }

  try {
    await createSponsor(validatedFields.data);
  } catch (err) {
     const message = err instanceof Error ? err.message : 'An unknown error occurred.';
     return {
      errors: {
        _form: ['An unexpected error occurred.', message],
      },
    };
  }

  revalidatePath('/admin/sponsors');
  revalidatePath('/');
  redirect('/admin/sponsors');
}

export async function updateSponsorAction(
  id: string,
  prevState: SponsorFormState,
  formData: FormData
): Promise<SponsorFormState> {
  const validatedFields = sponsorSchema.safeParse({
    name: formData.get('name'),
    logo: formData.get('logo'),
    level: formData.get('level'),
    website: formData.get('website'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await updateSponsor(id, validatedFields.data);
  } catch (err) {
     const message = err instanceof Error ? err.message : 'An unknown error occurred.';
     return {
      errors: {
        _form: ['An unexpected error occurred.', message],
      },
    };
  }
  
  revalidatePath('/admin/sponsors');
  revalidatePath('/');
  redirect('/admin/sponsors');
}

export async function deleteSponsorAction(id: string) {
    try {
        await deleteSponsor(id);
        revalidatePath('/admin/sponsors');
        revalidatePath('/');
        return { success: true, message: 'Sponsor deleted successfully.' };
    } catch (error) {
        console.error('Failed to delete sponsor:', error);
        return { success: false, message: 'Failed to delete sponsor.' };
    }
}
