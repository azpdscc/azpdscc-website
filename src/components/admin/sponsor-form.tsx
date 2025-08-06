
'use client';

import { useActionState } from 'react';
import type { Sponsor } from '@/lib/types';
import type { SponsorFormState } from '@/app/admin/sponsors/actions';
import { createSponsorAction, updateSponsorAction } from '@/app/admin/sponsors/actions';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { SubmitButton } from './submit-button';

interface SponsorFormProps {
  sponsor?: Sponsor;
}

export function SponsorForm({ sponsor }: SponsorFormProps) {
  const isEditing = !!sponsor;

  const action = isEditing ? updateSponsorAction.bind(null, sponsor.id) : createSponsorAction;
  const initialState: SponsorFormState = { errors: {}, message: '' };
  const [formState, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6">
        <div>
            <Label htmlFor="name">Sponsor Name</Label>
            <Input id="name" name="name" defaultValue={sponsor?.name} required />
            {formState.errors?.name && <p className="text-destructive text-sm mt-1">{formState.errors.name.join(', ')}</p>}
        </div>
        
        <div>
            <Label htmlFor="logo">Logo URL</Label>
            <Input id="logo" name="logo" defaultValue={sponsor?.logo} required placeholder="https://..." />
            {formState.errors?.logo && <p className="text-destructive text-sm mt-1">{formState.errors.logo.join(', ')}</p>}
        </div>
        
        <div>
            <Label htmlFor="website">Website URL (Optional)</Label>
            <Input id="website" name="website" defaultValue={sponsor?.website} placeholder="https://..." />
            {formState.errors?.website && <p className="text-destructive text-sm mt-1">{formState.errors.website.join(', ')}</p>}
        </div>

        <div>
            <Label htmlFor="level">Sponsorship Level</Label>
            <Select name="level" defaultValue={sponsor?.level || 'Gold'}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a level" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Diamond">Diamond</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Silver">Silver</SelectItem>
                    <SelectItem value="Bronze">Bronze</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
            </Select>
            {formState.errors?.level && <p className="text-destructive text-sm mt-1">{formState.errors.level.join(', ')}</p>}
        </div>


        {formState.errors?._form && (
            <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{formState.errors._form.join(', ')}</AlertDescription>
            </Alert>
        )}

        <div className="flex items-center gap-4">
            <SubmitButton isEditing={isEditing} />
            <Button variant="outline" asChild>
                <Link href="/admin/sponsors">Cancel</Link>
            </Button>
        </div>
    </form>
  );
}
