
import { getSponsorById } from '@/services/sponsors';
import { SponsorForm } from '@/components/admin/sponsor-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';

export default async function EditSponsorPage({ params }: { params: { id: string } }) {
  const sponsor = await getSponsorById(params.id);
  
  if (!sponsor) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Edit Sponsor: {sponsor.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <SponsorForm sponsor={sponsor} />
        </CardContent>
      </Card>
    </div>
  );
}
