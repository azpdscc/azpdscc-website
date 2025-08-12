
'use server';

import { z } from 'zod';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { createAdminLoginLog } from '@/services/admin-logs';
import { redirect } from 'next/navigation';

export type LoginFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    _form?: string[];
  };
};

const loginSchema = z.object({
    name: z.string().min(2, "Name is required."),
    // The form field is named 'email' but labeled 'Username'. It must be a valid email format.
    email: z.string().email("The username must be a valid email address (e.g., booth@pdscc.org)."),
    password: z.string().min(6, "Password must be at least 6 characters."),
});


export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {

  const validatedFields = loginSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;
  const auth = getAuth(app);

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // If login is successful, create a log entry.
    await createAdminLoginLog({
        userId: user.uid,
        username: user.email!, // The email is the unique username
        name: name,
    });

  } catch (error: any) {
    let errorMessage = "An unknown error occurred.";
    if (error.code) {
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                errorMessage = "Invalid username or password. Please try again.";
                break;
            default:
                errorMessage = "An error occurred during login. Please try again later.";
                break;
        }
    }
    return {
      errors: {
        _form: [errorMessage],
      },
    };
  }

  // Redirect to the admin dashboard on successful login.
  redirect('/admin');
}
