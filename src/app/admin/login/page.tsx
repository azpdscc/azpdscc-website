
'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from './actions';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, Lock } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
        </Button>
    )
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(loginAction, { success: false, errors: {} });

  useEffect(() => {
    // On successful login from the server action, set a flag in session storage
    // and redirect to the admin dashboard.
    if (state.success) {
      sessionStorage.setItem('admin-authenticated', 'true');
      router.push('/admin');
    }
  }, [state.success, router]);

  // This effect checks if the user is already logged in via sessionStorage
  // and redirects them if they try to access the login page.
  useEffect(() => {
    if (sessionStorage.getItem('admin-authenticated') === 'true') {
        router.push('/admin');
    }
  }, [router]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
                <Lock className="mx-auto h-12 w-12 text-primary mb-2" strokeWidth={1.5} />
                <CardTitle className="font-headline text-2xl">Admin Login</CardTitle>
                <CardDescription>Enter your administrator credentials to access the dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <div>
                        <Label htmlFor="username">Username</Label>
                        <Input type="text" id="username" name="username" required />
                        {state.errors?.username && <p className="text-destructive text-sm mt-1">{state.errors.username.join(', ')}</p>}
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" id="password" name="password" required />
                        {state.errors?.password && <p className="text-destructive text-sm mt-1">{state.errors.password.join(', ')}</p>}
                    </div>
                    {state.errors?._form && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Login Failed</AlertTitle>
                            <AlertDescription>{state.errors._form.join(', ')}</AlertDescription>
                        </Alert>
                    )}
                    <SubmitButton />
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
