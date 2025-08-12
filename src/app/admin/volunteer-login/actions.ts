
'use server';

import { z } from 'zod';

export type VolunteerLoginState = {
  success: boolean;
  errors: {
    username?: string[];
    password?: string[];
    _form?: string[];
  };
};

const loginSchema = z.object({
    username: z.string().min(1, "Username is required."),
    password: z.string().min(1, "Password is required."),
});

export async function volunteerLoginAction(
  prevState: VolunteerLoginState,
  formData: FormData
): Promise<VolunteerLoginState> {

  const validatedFields = loginSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validatedFields.data;

  // These credentials are now stored securely in environment variables.
  const expectedUsername = process.env.VOLUNTEER_USERNAME;
  const expectedPassword = process.env.VOLUNTEER_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    console.error("Volunteer credentials are not set in environment variables.");
    return {
      success: false,
      errors: { _form: ["Login system is not configured. Please contact the administrator."] },
    };
  }

  const isUsernameValid = username === expectedUsername;
  const isPasswordValid = password === expectedPassword;

  if (isUsernameValid && isPasswordValid) {
    // We don't create a session here, we just return success.
    // The client-side will handle session storage and redirection.
    return { success: true, errors: {} };
  } else {
    return {
      success: false,
      errors: { _form: ["Invalid username or password."] },
    };
  }
}
