'use client';
import { useActionState } from 'react';
import { TeamMemberForm } from '@/components/admin/team-member-form';
import { createTeamMemberAction, type TeamMemberFormState } from '../actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AddTeamMemberPage() {
  const initialState: TeamMemberFormState = { errors: {}, success: false, message: '' };
  const [formState, action] = useActionState(createTeamMemberAction, initialState);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Add New Team Member</CardTitle>
        </CardHeader>
        <CardContent>
          <TeamMemberForm formAction={action} formState={formState} />
        </CardContent>
      </Card>
    </div>
  );
}
