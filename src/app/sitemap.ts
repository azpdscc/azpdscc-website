
import type { MetadataRoute } from 'next';
import { getEvents } from '@/services/events';
import { getBlogPosts } from '@/services/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.azpdscc.org';

  // Static routes
  const staticRoutes = [
    { url: `${baseUrl}/`, lastModified: new Date(), priority: 1.0, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.8, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/events`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/blog`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/vendors`, lastModified: new Date(), priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/vendors/apply`, lastModified: new Date(), priority: 0.7, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/vendors/join`, lastModified: new Date(), priority: 0.7, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/perform`, lastModified: new Date(), priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/perform/register`, lastModified: new Date(), priority: 0.6, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/sponsorship`, lastModified: new Date(), priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/donate`, lastModified: new Date(), priority: 0.7, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/volunteer`, lastModified: new Date(), priority: 0.7, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.7, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/faq`, lastModified: new Date(), priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), priority: 0.3, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/terms-of-service`, lastModified: new Date(), priority: 0.3, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/sms-policy`, lastModified: new Date(), priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  // Dynamic event routes from Firestore
  const events = await getEvents();
  const eventRoutes = events.map(event => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: new Date(),
    priority: 0.9,
    changeFrequency: 'yearly' as const,
  }));

  // Dynamic blog post routes from Firestore, only including published posts
  const blogPosts = await getBlogPosts();
  const blogRoutes = blogPosts
    .filter(post => post.status === 'Published')
    .map(post => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(), // Ideally, you'd use a post's updated_at field here
        priority: 0.8,
        changeFrequency: 'monthly' as const,
  }));

  return [
    ...staticRoutes,
    ...eventRoutes,
    ...blogRoutes
  ];
}
