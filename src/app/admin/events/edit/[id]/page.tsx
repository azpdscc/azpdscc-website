
import { getEventById } from '@/services/events';
import { EventForm } from '@/components/admin/event-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id);
  
  if (!event) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Edit Event: {event.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm
            event={event}
          />
        </CardContent>
      </Card>
    </div>
  );
}
