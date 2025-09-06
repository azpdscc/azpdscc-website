
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/services/events';
import { EventDetailPageClient } from '@/components/events/event-detail-page';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata, ResolvingMetadata } from 'next';
import type { Event } from '@/lib/types';

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const event: Event | null = await getEventBySlug(slug);
 
  if (!event) {
    return {
        title: 'Event Not Found | PDSCC',
        description: 'The event you are looking for could not be found.',
    }
  }
 
  const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: `${event.name} | PDSCC Events`,
    description: event.description, // Use the short description for the meta tag
    openGraph: {
      title: event.name,
      description: event.description,
      images: [event.image, ...previousImages],
    },
  }
}

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

// This is now a Server Component
export default async function EventDetailPage({ params }: Props) {
    const slug = params.slug;

    // Fetch initial event data on the server
    const event = await getEventBySlug(slug);
    if (!event) {
        notFound();
    }
    
    return (
      <Suspense fallback={<EventPageSkeleton />}>
        {/* Pass initial server-fetched data to the client component */}
        <EventDetailPageClient event={event} />
      </Suspense>
    );
}
