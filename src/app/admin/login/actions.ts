
'use server';

import { z } from 'zod';

export type LoginState = {
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

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {

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

  // Use secure environment variables for admin credentials
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    console.error("ADMIN_USERNAME or ADMIN_PASSWORD are not set in environment variables.");
    return {
      success: false,
      errors: { _form: ["Admin login system is not configured correctly. Please contact support."] },
    };
  }

  const isUsernameValid = username === expectedUsername;
  const isPasswordValid = password === expectedPassword;

  if (isUsernameValid && isPasswordValid) {
    // Return success. The client-side will handle sessionStorage and redirection.
    return { success: true, errors: {} };
  } else {
    return {
      success: false,
      errors: { _form: ["Invalid username or password."] },
    };
  }
}
