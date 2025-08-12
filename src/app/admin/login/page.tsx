
'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { loginAction } from './actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
        </Button>
    )
}

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(loginAction, { errors: {} });

  // This effect will run on the client side to redirect if the user is already logged in.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            // If user is detected, redirect them to the admin dashboard.
            router.push('/admin');
        }
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
                <Logo className="justify-center mb-2" />
                <CardTitle className="font-headline text-2xl">Admin Login</CardTitle>
                <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Your Name</Label>
                        <Input type="text" id="name" name="name" required placeholder="John Doe" />
                        {state.errors?.name && <p className="text-destructive text-sm mt-1">{state.errors.name.join(', ')}</p>}
                    </div>
                    <div>
                        <Label htmlFor="email">Username</Label>
                        <Input type="text" id="email" name="email" required placeholder="admin or booth@pdscc.org"/>
                         {state.errors?.email && <p className="text-destructive text-sm mt-1">{state.errors.email.join(', ')}</p>}
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
