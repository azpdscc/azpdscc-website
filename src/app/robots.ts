
import type { MetadataRoute } from 'next';
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://pdscc.org';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
            '/admin/', 
            '/verify-ticket',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
