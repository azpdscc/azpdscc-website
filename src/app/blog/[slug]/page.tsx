
import type { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPosts, getBlogPostBySlug } from '@/services/blog';
import { getEvents } from '@/services/events';
import { Button } from '@/components/ui/button';
import { Calendar, User, Ticket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { isPast, isToday } from 'date-fns';

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const post = await getBlogPostBySlug(slug);
 
  if (!post) {
    return {
        title: 'Post Not Found | PDSCC Blog',
        description: 'The blog post you are looking for could not be found.',
    }
  }

  // Fallback to parent metadata for OpenGraph images if post image doesn't exist
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${post.title} | PDSCC Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image, ...previousImages],
    },
  }
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  // Only generate static pages for published, non-future posts
  return posts
    .filter(p => p.status === 'Published' && (isToday(new Date(p.date)) || isPast(new Date(p.date))))
    .map((post) => ({
      slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: { slug:string } }) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }
  
  const postDate = new Date(post.date);
  // Do not show the page if the post is a draft OR if it's a published post with a future date.
  if (post.status === 'Draft' || (post.status === 'Published' && !isToday(postDate) && !isPast(postDate))) {
      notFound();
  }

  // Check if post is about a specific event and find that event
  let relatedEvent = null;
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
        relatedEvent = upcomingMatchingEvents[0];
      }
  }


  return (
    <article>
      <header className="relative h-[50vh] min-h-[400px] w-full">
         <Image
          src={post.image}
          alt={post.title}
          data-ai-hint="blog post header"
          fill
          sizes="100vw"
          priority
          className="z-0 object-cover"
        />
        <div className="absolute inset-0 bg-black/60 bg-hero-pattern opacity-10" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground p-4 container mx-auto">
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
