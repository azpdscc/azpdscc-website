
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { VolunteerHoursForm } from '@/components/admin/volunteer-hours-form';

export default function VolunteerHoursPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Send Volunteer Hours Confirmation</CardTitle>
          <CardDescription>
            Fill out this form to generate and email an official confirmation letter to a volunteer for their service hours. A copy will be sent to the admin email for your records.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VolunteerHoursForm />
        </CardContent>
      </Card>
    </div>
  );
}
