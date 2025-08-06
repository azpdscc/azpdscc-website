
import type { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBlogPosts, getBlogPostBySlug } from '@/services/blog';
import { Calendar, User } from 'lucide-react';

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
 
  if (!post) {
    return {
        title: 'Post Not Found | PDSCC Blog',
        description: 'The blog post you are looking for could not be found.',
    }
  }

  return {
    title: `${post.title} | PDSCC Blog`,
    description: post.excerpt,
  }
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
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
        <div className="absolute inset-0 bg-black/60" />
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
            className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground text-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    </article>
  );
}
