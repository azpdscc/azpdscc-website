'use client';

import { useActionState, useRef, useEffect } from 'react';
import type { TeamMember } from '@/lib/types';
import type { TeamFormState } from '@/app/admin/team/actions';
import { createTeamMemberAction, updateTeamMemberAction } from '@/app/admin/team/actions';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { ActionSubmitButton } from './submit-button';
import { useAuth } from '@/hooks/use-auth';

interface TeamFormProps {
  member?: TeamMember;
}

export function TeamForm({ member }: TeamFormProps) {
  const isEditing = !!member;
  const { user } = useAuth();
  const tokenRef = useRef<HTMLInputElement>(null);

  const actionToUse = isEditing && member ? updateTeamMemberAction.bind(null, member.id) : createTeamMemberAction;
  const initialState: TeamFormState = { errors: {}, message: '' };
  const [formState, formAction] = useActionState(actionToUse, initialState);

  useEffect(() => {
    const setToken = async () => {
        if (user && tokenRef.current) {
            const token = await user.getIdToken();
            tokenRef.current.value = token;
        }
    }
    setToken();
  }, [user]);

  return (
    <form action={formAction} className="space-y-6">
        <input type="hidden" name="token" ref={tokenRef} />
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" defaultValue={member?.name} required />
                {formState.errors?.name && <p className="text-destructive text-sm mt-1">{formState.errors.name.join(', ')}</p>}
            </div>
            <div>
                 <Label htmlFor="order">Display Order</Label>
                <Input id="order" name="order" type="number" defaultValue={member?.order ?? 99} required />
                {formState.errors?.order && <p className="text-destructive text-sm mt-1">{formState.errors.order.join(', ')}</p>}
            </div>
        </div>

        <div>
            <Label htmlFor="role">Role / Title</Label>
            <Input id="role" name="role" defaultValue={member?.role} required />
            {formState.errors?.role && <p className="text-destructive text-sm mt-1">{formState.errors.role.join(', ')}</p>}
        </div>
        
        <div>
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" name="image" defaultValue={member?.image || 'https://placehold.co/400x400.png'} />
            {formState.errors?.image && <p className="text-destructive text-sm mt-1">{formState.errors.image.join(', ')}</p>}
        </div>

        <div>
            <Label htmlFor="bio">Short Bio</Label>
            <Textarea id="bio" name="bio" defaultValue={member?.bio} rows={3} required />
            {formState.errors?.bio && <p className="text-destructive text-sm mt-1">{formState.errors.bio.join(', ')}</p>}
        </div>

        {formState.errors?._form && (
            <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{formState.errors._form.join(', ')}</AlertDescription>
            </Alert>
        )}

        <div className="flex items-center gap-4">
            <ActionSubmitButton isEditing={isEditing} disabled={!user} />
            <Button variant="outline" asChild>
                <Link href="/admin/team">Cancel</Link>
            </Button>
        </div>
    </form>
  );
}
