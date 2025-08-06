
import { SponsorForm } from '@/components/admin/sponsor-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AddSponsorPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Add New Sponsor</CardTitle>
        </CardHeader>
        <CardContent>
          <SponsorForm />
        </CardContent>
      </Card>
    </div>
  );
}
