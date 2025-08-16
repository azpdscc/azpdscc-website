
'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { vendorCheckInLoginAction } from './actions';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, UserCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
        </Button>
    )
}

export default function VendorCheckInLoginPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(vendorCheckInLoginAction, { success: false, errors: {} });

  useEffect(() => {
    if (state.success) {
      // Store a simple flag in session storage
      sessionStorage.setItem('vendor-checkin-authenticated', 'true');
      router.push('/admin/check-in');
    }
  }, [state.success, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
                <UserCheck className="mx-auto h-12 w-12 text-primary mb-2" strokeWidth={1.5} />
                <CardTitle className="font-headline text-2xl">Vendor Check-In Login</CardTitle>
                <CardDescription>Enter the event-specific credentials to access the check-in tool.</CardDescription>
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
             <CardFooter>
                 <Button variant="link" asChild className="mx-auto">
                    <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Go back to main site</Link>
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
