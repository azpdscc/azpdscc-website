
'use client';

import { getTeamMemberById } from '@/services/team';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMemberForm } from "@/components/admin/team-member-form";
import { updateTeamMemberAction } from '../../actions';
import { useEffect, useState } from 'react';
import type { TeamMember } from '@/lib/types';

export default function EditTeamMemberPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMember() {
      const fetchedMember = await getTeamMemberById(id);
      if (!fetchedMember) {
        notFound();
      }
      setMember(fetchedMember);
      setLoading(false);
    }
    fetchMember();
  }, [id]);
  
  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Loading Member...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please wait...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!member) {
    return null; // notFound() would have been called
  }

  const updateMemberWithId = updateTeamMemberAction.bind(null, id);

  return (
    <div className="container mx-auto p-4 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Edit Team Member</CardTitle>
                <CardDescription>Update the details for "{member.name}".</CardDescription>
            </CardHeader>
            <CardContent>
                <TeamMemberForm 
                    type="Edit"
                    member={member}
                    action={updateMemberWithId}
                />
            </CardContent>
        </Card>
    </div>
  );
}
