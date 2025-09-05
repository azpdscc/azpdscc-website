
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { Montserrat, Open_Sans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { ConditionalTicker } from '@/components/layout/conditional-ticker';
import './globals.css';

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
  metadataBase: new URL('https://pdscc.org'),
  title: {
    template: '%s | PDSCC Hub',
    default: 'PDSCC | Arizona Punjabi Indian Community & Festivals Hub',
  },
  description: "Your hub for Arizona Punjabi Indian festivals, community events, and culture. Connect with the Phoenix Punjabi Indian community, AZ Desis, and find vendor booths in Arizona.",
  openGraph: {
      title: 'PDSCC | Arizona Punjabi Indian Community & Festivals Hub',
      description: "Your hub for Arizona Punjabi Indian festivals, community events, and culture.",
      url: 'https://pdscc.org',
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
    title: 'PDSCC | Arizona Punjabi Indian Community & Festivals Hub',
    description: "Your hub for Arizona Punjabi Indian festivals, community events, and culture.",
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
    url: 'https://pdscc.org',
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
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="font-body antialiased">
         <div className="flex min-h-screen flex-col">
            <Header />
            <ConditionalTicker />
            <Breadcrumbs />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
