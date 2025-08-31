
'use server';

import { z } from 'zod';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export type LoginState = {
  success: boolean;
  errors: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
};

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
});

// This is a server-side "proxy" action to call the client-side Firebase SDK.
// We return the credentials to the client, which will then use them to sign in.
// This is a common pattern to avoid exposing Firebase client SDK logic directly in Server Actions.
export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {

  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Because signInWithEmailAndPassword is a client-side Firebase call,
  // we can't execute it here directly. We just validate and return success.
  // The client will handle the actual sign-in. This action serves as a secure
  // validator for the form data before it's used on the client.
  return { success: true, errors: {} };
}
