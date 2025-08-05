
import { getTeamMemberById } from '@/services/team';
import { TeamForm } from '@/components/admin/team-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';

export default async function EditTeamMemberPage({ params }: { params: { id: string } }) {
  const member = await getTeamMemberById(params.id);
  
  if (!member) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Edit Team Member: {member.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <TeamForm member={member} />
        </CardContent>
      </Card>
    </div>
  );
}
