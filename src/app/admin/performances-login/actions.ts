
'use server';

import { z } from 'zod';

export type PerformanceLoginState = {
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

export async function performanceLoginAction(
  prevState: PerformanceLoginState,
  formData: FormData
): Promise<PerformanceLoginState> {

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

  // These credentials should be stored securely in environment variables.
  const expectedUsername = process.env.PERFORMER_USERNAME;
  const expectedPassword = process.env.PERFORMER_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    console.error("Performer credentials are not set in environment variables.");
    return {
      success: false,
      errors: { _form: ["Login system is not configured. Please contact the administrator."] },
    };
  }

  const isUsernameValid = username === expectedUsername;
  const isPasswordValid = password === expectedPassword;

  if (isUsernameValid && isPasswordValid) {
    return { success: true, errors: {} };
  } else {
    return {
      success: false,
      errors: { _form: ["Invalid username or password."] },
    };
  }
}
