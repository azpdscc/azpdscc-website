'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getEventBySlug } from '@/services/events';
import { EventDetailPageClient } from '@/components/events/event-detail-page';
import { Skeleton } from '@/components/ui/skeleton';
import { generateEventHighlights } from '@/ai/flows/generate-event-highlights-flow';
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

export default function EventDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

    const Fallback = () => <EventPageSkeleton />;
    
    const EventLoader = () => {
        const [event, setEvent] = useState<Event | null>(null);
        const [highlights, setHighlights] = useState<string[]>([]);
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            if (slug) {
                setIsLoading(true);
                getEventBySlug(slug).then(async (eventData) => {
                    if (!eventData) {
                        notFound();
                    } else {
                        setEvent(eventData);
                        try {
                          const highlightResult = await generateEventHighlights({
                            eventName: eventData.name,
                            eventDescription: eventData.fullDescription
                          });
                          if (highlightResult && highlightResult.highlights) {
                            setHighlights(highlightResult.highlights);
                          }
                        } catch (e) {
                          console.error("Could not generate event highlights", e);
                        }
                    }
                    setIsLoading(false);
                });
            }
        }, [slug]);

        if (isLoading || !event) {
            return <EventPageSkeleton />;
        }

        return <EventDetailPageClient event={event} highlights={highlights} />;
    }

    return (
        <Suspense fallback={<Fallback />}>
            <EventLoader />
        </Suspense>
    );
}
