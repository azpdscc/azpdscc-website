
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMemberForm } from "@/components/admin/team-member-form";
import { createTeamMemberAction } from "../actions";
import { useEffect, useState } from "react";

export default function AddTeamMemberPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Add a New Team Member</CardTitle>
                <CardDescription>Fill out the details for the new team member.</CardDescription>
            </CardHeader>
            <CardContent>
                {isClient ? (
                    <TeamMemberForm
                        type="Add"
                        action={createTeamMemberAction}
                    />
                ) : (
                    <p>Loading form...</p>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
