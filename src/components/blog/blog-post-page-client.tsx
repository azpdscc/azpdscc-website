
'use client';
import { useEffect, useState } from 'react';
import type { BlogPost, Event } from '@/lib/types';
import { getEvents } from '@/services/events';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Ticket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeroImage } from '@/components/layout/hero-image';

interface BlogPostPageClientProps {
  initialPost: BlogPost;
}

export function BlogPostPageClient({ initialPost }: BlogPostPageClientProps) {
  const [post, setPost] = useState<BlogPost>(initialPost);
  const [relatedEvent, setRelatedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedData = async () => {
      setLoading(true);
      
      // The post is already passed in, so we just need to find related events
      const postTitleLower = post.title.toLowerCase();
      const eventKeywords = ['vaisakhi', 'teeyan'];
      const keywordInTitle = eventKeywords.find(keyword => postTitleLower.includes(keyword));

      if (keywordInTitle) {
          const allEvents = await getEvents();
          const now = new Date();
          now.setHours(0, 0, 0, 0);

          const upcomingMatchingEvents = allEvents
            .filter(e => e.name.toLowerCase().includes(keywordInTitle) && new Date(e.date) >= now)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          if (upcomingMatchingEvents.length > 0) {
            setRelatedEvent(upcomingMatchingEvents[0]);
          }
      }
      setLoading(false);
    };

    fetchRelatedData();
  }, [post]);

  return (
    <article>
      <header className="relative h-[50vh] min-h-[400px] w-full flex items-center justify-center text-center text-primary-foreground">
        <HeroImage src={post.image} alt={post.title} aiHint="blog post header" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 container mx-auto">
          <h1 className="font-headline text-4xl md:text-6xl font-bold !text-primary-foreground drop-shadow-lg">
            {post.title}
          </h1>
           <div className="mt-6 flex items-center space-x-6 text-lg !text-primary-foreground/90">
                <div className="flex items-center gap-2">
                    <User className="h-5 w-5" strokeWidth={1.5} />
                    <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" strokeWidth={1.5} />
                    <span>{post.date}</span>
                </div>
            </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {relatedEvent && (
              <Card className="mt-12 bg-primary/10 border-primary/20">
                <CardContent className="p-6 text-center">
                    <h2 className="font-headline text-2xl font-bold text-primary mb-2">
                        Experience It Live!
                    </h2>
                    <p className="text-muted-foreground mb-4">
                        Excited about {relatedEvent.name.split(' ')[0]}? Join us for our upcoming celebration!
                    </p>
                    <Button asChild size="lg">
                        <Link href={`/events/${relatedEvent.slug}`}>
                            <Ticket className="mr-2 h-5 w-5" />
                            View {relatedEvent.name}
                        </Link>
                    </Button>
                </CardContent>
              </Card>
          )}
        </div>
      </div>
    </article>
  );
}
