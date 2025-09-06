
import type { Metadata } from 'next';
import { BlogPageClient } from '@/components/blog/blog-page-client';
import { getBlogPosts } from '@/services/blog';
import type { BlogPost } from '@/lib/types';

export const metadata: Metadata = {
  title: 'PDSCC Blog | Phoenix Punjabi Indian Community Stories',
  description: 'Explore articles about Punjabi Indian festivals, culture, food, and community stories from the PDSCC Hub for AZ Desis and the Phoenix Punjabi Indian community.',
};

export default async function BlogPage() {
  const allPosts = await getBlogPosts();
  const publishedPosts = allPosts.filter(post => post.status === 'Published');

  return <BlogPageClient initialPosts={publishedPosts} />;
}
