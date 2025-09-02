
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPosts, getBlogPostBySlug } from '@/services/blog';
import { BlogPostPageClient } from '@/components/blog/blog-post-page-client';
import type { BlogPost } from '@/lib/types';

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const post : BlogPost | null = await getBlogPostBySlug(slug);
 
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
  // Only generate static pages for published posts
  return posts
    .filter(p => p.status === 'Published')
    .map((post) => ({
      slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post || post.status !== 'Published') {
    notFound();
  }

  return <BlogPostPageClient initialPost={post} />;
}
