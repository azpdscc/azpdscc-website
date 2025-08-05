
'use client';

import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import type { TeamMember } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface TeamMemberFormProps {
  type: 'Add' | 'Edit';
  member?: TeamMember;
  action: (data: FormData) => Promise<void>;
}

// The SubmitButton MUST be a separate component defined inside or outside,
// but it must be rendered as a child of the form for `useFormStatus` to work.
function SubmitButton({ type }: { type: 'Add' | 'Edit' }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {type} Member
        </Button>
    )
}

export function TeamMemberForm({ type, member, action }: TeamMemberFormProps) {
  const router = useRouter();
  const defaultImage = 'https://placehold.co/400x400.png';

  return (
    <form action={action} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" placeholder="e.g., Jane Doe" defaultValue={member?.name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input id="role" name="role" placeholder="e.g., Director" defaultValue={member?.role} required />
      </div>
       <div className="space-y-2">
        <Label htmlFor="bio">Short Bio</Label>
        <Textarea id="bio" name="bio" placeholder="A brief description of their role or contribution." defaultValue={member?.bio} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input id="image" name="image" defaultValue={member?.image || defaultImage} required />
      </div>
      
      <div className="flex gap-4">
        <SubmitButton type={type} />
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
