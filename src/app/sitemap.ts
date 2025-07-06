
import type { MetadataRoute } from 'next';
import { events } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.azpdscc.org';

  // Static routes
  const staticRoutes = [
    { url: `${baseUrl}/`, lastModified: new Date(), priority: 1.0, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.8, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/events`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/vendors`, lastModified: new Date(), priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/vendors/apply`, lastModified: new Date(), priority: 0.7, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/vendors/join`, lastModified: new Date(), priority: 0.7, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/vendor-dashboard`, lastModified: new Date(), priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/donate`, lastModified: new Date(), priority: 0.7, changeFrequency: 'yearly' as const },
    { url: `${baseUrl}/volunteer`, lastModified: new Date(), priority: 0.7, changeFrequency: 'yearly' as const },
  ];

  // Dynamic event routes
  const eventRoutes = events.map(event => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: new Date(),
    priority: 0.9,
    changeFrequency: 'yearly' as const,
  }));

  return [
    ...staticRoutes,
    ...eventRoutes
  ];
}
