
'use client';

import type { TeamMember } from '@/lib/types';
import type { TeamMemberFormState } from '@/app/admin/team/actions';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { SubmitButton } from './submit-button';

interface TeamMemberFormProps {
  member?: TeamMember;
  formAction: (payload: FormData) => void;
  formState: TeamMemberFormState;
}

export function TeamMemberForm({ member, formAction, formState }: TeamMemberFormProps) {
  const isEditing = !!member;

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" defaultValue={member?.name} />
        {formState.errors?.name && <p className="text-sm text-destructive mt-1">{formState.errors.name[0]}</p>}
      </div>

      <div>
        <Label htmlFor="role">Role / Title</Label>
        <Input id="role" name="role" defaultValue={member?.role} />
        {formState.errors?.role && <p className="text-sm text-destructive mt-1">{formState.errors.role[0]}</p>}
      </div>

      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input id="image" name="image" defaultValue={member?.image} placeholder="https://your-s3-bucket.../image.png" />
        {formState.errors?.image && <p className="text-sm text-destructive mt-1">{formState.errors.image[0]}</p>}
      </div>
      
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" defaultValue={member?.bio} rows={4} />
        {formState.errors?.bio && <p className="text-sm text-destructive mt-1">{formState.errors.bio[0]}</p>}
      </div>

      {formState.errors?._form && (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{formState.errors._form[0]}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-4">
        <SubmitButton isEditing={isEditing} createText="Add Member" updateText="Update Member" />
        <Button variant="outline" asChild>
          <Link href="/admin/team">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
