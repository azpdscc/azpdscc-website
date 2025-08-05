'use client';

import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { getTeamMemberById } from '@/services/team';
import type { TeamMember } from '@/lib/types';
import { TeamMemberForm } from '@/components/admin/team-member-form';
import { updateTeamMemberAction, type TeamMemberFormState } from '../../actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditTeamMemberPage({ params }: { params: { id: string } }) {
  const [member, setMember] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initialState: TeamMemberFormState = { errors: {}, success: false, message: '' };
  const updateActionWithId = updateTeamMemberAction.bind(null, params.id);
  const [formState, action] = useActionState(updateActionWithId, initialState);
  
  useEffect(() => {
    async function fetchMember() {
      setIsLoading(true);
      const fetchedMember = await getTeamMemberById(params.id);
      setMember(fetchedMember);
      setIsLoading(false);
    }
    fetchMember();
  }, [params.id]);

  if (isLoading) {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card className="max-w-4xl mx-auto">
                <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-24" />
                </CardContent>
            </Card>
        </div>
    );
  }

  if (!member) {
    return <p className="text-center p-8">Team member not found.</p>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Edit Member: {member.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <TeamMemberForm
            member={member}
            formAction={action}
            formState={formState}
          />
        </CardContent>
      </Card>
    </div>
  );
}
