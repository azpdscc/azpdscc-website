
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Montserrat, Open_Sans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ConditionalTicker } from '@/components/layout/conditional-ticker';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import './globals.css';
import { ConditionalLayout } from '@/components/layout/conditional-layout';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
  weight: '700',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});


export const metadata: Metadata = {
  metadataBase: new URL('https://www.azpdscc.org'),
  title: {
    template: '%s | PDSCC Hub',
    default: 'PDSCC | Arizona Indian Community & Festivals Hub',
  },
  description: "Your hub for Arizona Indian festivals, community events, and culture. Connect with the Phoenix Indian community, AZ Desis, and find vendor booths in Arizona.",
  openGraph: {
      title: 'PDSCC | Arizona Indian Community & Festivals Hub',
      description: "Your hub for Arizona Indian festivals, community events, and culture.",
      url: 'https://www.azpdscc.org',
      siteName: 'PDSCC Hub',
      images: [
        {
          url: 'https://pdscc-images-website-2025.s3.us-east-1.amazonaws.com/og-image.png',
          width: 1200,
          height: 630,
          alt: 'A collage of vibrant PDSCC community events',
        },
      ],
      locale: 'en_US',
      type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDSCC | Arizona Indian Community & Festivals Hub',
    description: "Your hub for Arizona Indian festivals, community events, and culture.",
    creator: '@azpdscc',
    images: ['https://pdscc-images-website-2025.s3.us-east-1.amazonaws.com/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PDSCC',
    url: 'https://www.azpdscc.org',
    logo: 'https://pdscc-images-website-2025.s3.us-east-1.amazonaws.com/Home+Page/SIte++Logo.svg',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'AZPDSCC Community Lane',
      addressLocality: 'Buckeye',
      addressRegion: 'AZ',
      postalCode: '85326',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'admin@azpdscc.org',
      telephone: '+1-602-317-2239',
      contactType: 'customer support',
    },
    sameAs: [
      "https://twitter.com/azpdscc",
      "https://facebook.com/pdscc",
      "https://instagram.com/azpdscc",
      "https://www.youtube.com/@AZPDSCC",
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning className={cn(montserrat.variable, openSans.variable)}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="font-body antialiased">
        <ConditionalLayout>
            {children}
        </ConditionalLayout>
        <Toaster />
      </body>
    </html>
  );
}
