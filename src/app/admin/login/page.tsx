
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from './actions';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, Loader2, Lock } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

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
  const [formState, formAction] = useActionState(loginAction, { success: false, errors: {} });
  const [clientError, setClientError] = useState<string | null>(null);

  // This effect checks if the user is already logged in via Firebase Auth
  // and redirects them if they try to access the login page.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/admin');
      }
    });
    return () => unsubscribe();
  }, [router]);
  
  // This handles the actual Firebase sign-in on the client
  // after the server action has validated the form.
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      
      // We still call the server action for validation
      formAction(formData);

      if (formState.success) {
          try {
              const email = formData.get('email') as string;
              const password = formData.get('password') as string;
              await signInWithEmailAndPassword(auth, email, password);
              // The onAuthStateChanged listener above will handle redirection
          } catch (error: any) {
              let message = "An unknown error occurred.";
              if (error.code === 'auth/invalid-credential') {
                  message = "Invalid email or password. Please try again.";
              }
              setClientError(message);
          }
      }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
                <Lock className="mx-auto h-12 w-12 text-primary mb-2" strokeWidth={1.5} />
                <CardTitle className="font-headline text-2xl">Admin Login</CardTitle>
                <CardDescription>Enter your administrator credentials to access the dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                     <div>
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" name="email" required />
                        {formState.errors?.email && <p className="text-destructive text-sm mt-1">{formState.errors.email.join(', ')}</p>}
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" id="password" name="password" required />
                        {formState.errors?.password && <p className="text-destructive text-sm mt-1">{formState.errors.password.join(', ')}</p>}
                    </div>
                    {clientError && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Login Failed</AlertTitle>
                            <AlertDescription>{clientError}</AlertDescription>
                        </Alert>
                    )}
                    <SubmitButton />
                </form>
            </CardContent>
            <CardFooter>
                 <Button variant="link" asChild className="mx-auto">
                    <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Go back to main site</Link>
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
