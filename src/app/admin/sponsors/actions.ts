
'use server';

import { z } from 'zod';
import { createSponsor, updateSponsor, deleteSponsor } from '@/services/sponsors';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { verifyIdToken } from '@/lib/firebase-admin';

export type SponsorFormState = {
  errors?: {
    name?: string[];
    logo?: string[];
    level?: string[];
    website?: string[];
    _form?: string[];
    token?: string[];
  };
  message?: string;
};

const sponsorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logo: z.string().url("Must be a valid image URL"),
  level: z.enum(['Diamond', 'Gold', 'Silver', 'Bronze', 'Other'], { required_error: 'Please select a level.'}),
  website: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  token: z.string().min(1, "Authentication token is missing."),
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
    token: formData.get('token'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create sponsor.',
    };
  }

  try {
    await verifyIdToken(validatedFields.data.token);
    const { token, ...sponsorData } = validatedFields.data;
    await createSponsor(sponsorData);
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
  revalidatePath('/sponsorship');
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
    token: formData.get('token'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await verifyIdToken(validatedFields.data.token);
    const { token, ...sponsorData } = validatedFields.data;
    await updateSponsor(id, sponsorData);
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
  revalidatePath('/sponsorship');
  redirect('/admin/sponsors');
}

export async function deleteSponsorAction(id: string, token: string) {
    try {
        if (!token) throw new Error("Authentication token is missing.");
        await verifyIdToken(token);
        await deleteSponsor(id);
        revalidatePath('/admin/sponsors');
        revalidatePath('/');
        revalidatePath('/sponsorship');
        return { success: true, message: 'Sponsor deleted successfully.' };
    } catch (error) {
        console.error('Failed to delete sponsor:', error);
        const message = error instanceof Error ? error.message : 'Failed to delete sponsor.';
        return { success: false, message };
    }
}
