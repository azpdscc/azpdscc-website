
# Application Security Instructions

This document provides instructions for securing your PDSCC website admin panel.

**IMPORTANT:** Your current Firestore security rules are configured to allow **anyone** to read and write to your database. This is insecure and was only done for initial development. You **must** implement proper authentication before launching your website to the public.

## Securing Your Admin Panel

To secure your application, you need to implement a login system for administrators and update your Firestore security rules to only allow authenticated admins to write data.

### Step 1: Implement Admin Login

You will need to create a login page where administrators can sign in. We recommend using Firebase Authentication with the "Email/Password" sign-in provider.

You would typically create a new page at `/admin/login` and use the Firebase SDK to handle the sign-in process.

**Example Code for a Login Form:**

```javascript
// src/app/admin/login/page.tsx
'use client';
import { useActionState } from 'react';
import { loginAction } from './actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending}>Login</Button>
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, { errors: {} });

  return (
    <form action={formAction}>
      <div>
        <Label htmlFor="name">Your Name</Label>
        <Input type="text" id="name" name="name" required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" required />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" name="password" required />
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
  );
}

```

### Step 2: Update Firestore Security Rules

Once you have a login system, you must update your `firestore.rules` file to restrict write access to authenticated users only.

Replace the content of `firestore.rules` with the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to everyone for collections that need to be public
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null; // ONLY allows logged-in users to write
    }

    match /teamMembers/{memberId} {
      allow read: if true;
      allow write: if request.auth != null; // ONLY allows logged-in users to write
    }

    match /sponsors/{sponsorId} {
      allow read: if true;
      allow write: if request.auth != null; // ONLY allows logged-in users to write
    }

    match /blogPosts/{postId} {
      allow read: if true;
      allow write: if request.auth != null; // ONLY allows logged-in users to write
    }
    
    // Allow only authenticated users to create admin logs
    match /adminLogs/{logId} {
        allow read, write: if request.auth != null;
    }
  }
}
```

### Step 3: Deploy Your Security Rules

After editing the `firestore.rules` file, you must deploy them to Firebase for them to take effect.

1.  **Install the Firebase CLI** if you haven't already:
    `npm install -g firebase-tools`

2.  **Login to Firebase** in your terminal:
    `firebase login`

3.  **Deploy the rules** from your project's root directory:
    `firebase deploy --only firestore:rules`

By following these steps, you will create a secure admin section where only authorized users can manage your website's content.
