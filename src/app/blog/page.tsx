
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getBlogPosts, processScheduledBlogPosts } from '@/services/blog';
import { ArrowRight, User, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'PDSCC Blog | Phoenix Indian Community Stories',
  description: 'Explore articles about Indian festivals, culture, food, and community stories from the PDSCC Hub for AZ Desis and the Phoenix Indian community.',
};

export default async function BlogPage() {
  // Check for any scheduled posts that are due and publish them.
  await processScheduledBlogPosts();

  const allPosts = await getBlogPosts();
  
  // A post is publicly visible only if its status is "Published".
  const blogPosts = allPosts.filter(post => post.status === 'Published');

  return (
    <div className="bg-background">
      <section className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center text-center text-primary-foreground bg-primary">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-accent/20 bg-hero-pattern opacity-10" />
        <div className="relative z-10 p-4 container mx-auto">
          <h1 className="font-headline text-4xl md:text-6xl font-bold !text-primary-foreground drop-shadow-lg">
            Our Community Blog
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl !text-primary-foreground/90 drop-shadow-md">
            Stories, insights, and updates from the heart of the Phoenix Indian community.
          </p>
        </div>
      </section>

      <main className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="sr-only">Blog Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="flex flex-col h-full shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1">
                <CardHeader className="p-0">
                  <Link href={`/blog/${post.slug}`} className="block relative h-56 w-full">
                    <Image
                      src={post.image}
                      alt={post.title}
                      data-ai-hint="blog post illustration"
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </Link>
                </CardHeader>
                <CardContent className="p-6 flex-grow">
                  <CardTitle className="font-headline text-xl mb-3 leading-tight">
                     <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">{post.title}</Link>
                  </CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground mb-4 space-x-4">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" strokeWidth={1.5} />
                        <span>{post.author}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" strokeWidth={1.5} />
                        <span>{post.date}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="p-6 bg-secondary/50">
                  <Link href={`/blog/${post.slug}`} className="font-bold text-primary hover:underline flex items-center">
                    Read More <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
