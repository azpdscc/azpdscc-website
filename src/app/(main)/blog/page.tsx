
import type { Metadata } from 'next';
import { BlogPageClient } from '@/components/blog/blog-page-client';

export const metadata: Metadata = {
  title: 'PDSCC Blog | Phoenix Punjabi Indian Community Stories',
  description: 'Explore articles about Punjabi Indian festivals, culture, food, and community stories from the PDSCC Hub for AZ Desis and the Phoenix Punjabi Indian community.',
};

export default function BlogPage() {
  return <BlogPageClient />;
}
