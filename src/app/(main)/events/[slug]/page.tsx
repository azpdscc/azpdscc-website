
'use client';

import { Suspense } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getEventBySlug } from '@/services/events';
import { EventDetailPageClient } from '@/components/events/event-detail-page';
import { Skeleton } from '@/components/ui/skeleton';

function EventPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Skeleton className="h-[50vh] w-full mb-8" />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-8 w-1/3 mt-8" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="md:col-span-1">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  )
}

export default function EventDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

    const Fallback = () => <EventPageSkeleton />;
    
    const EventLoader = () => {
        const [event, setEvent] = React.useState(null);
        const [isLoading, setIsLoading] = React.useState(true);

        React.useEffect(() => {
            if (slug) {
                setIsLoading(true);
                getEventBySlug(slug).then(eventData => {
                    if (!eventData) {
                        notFound();
                    } else {
                        setEvent(eventData);
                    }
                    setIsLoading(false);
                });
            }
        }, [slug]);

        if (isLoading || !event) {
            return <EventPageSkeleton />;
        }

        return <EventDetailPageClient event={event} />;
    }

    return (
        <Suspense fallback={<Fallback />}>
            <EventLoader />
        </Suspense>
    );
}
