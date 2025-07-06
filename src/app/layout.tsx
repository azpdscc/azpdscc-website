
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Montserrat, Open_Sans } from 'next/font/google';
import { cn } from '@/lib/utils';
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
  title: {
    template: '%s | PDSCC Hub',
    default: 'PDSCC | Arizona Indian Community & Festivals Hub',
  },
  description: "Your hub for Arizona Indian festivals, community events, and culture. Connect with the Phoenix Indian community, AZ Desis, and find vendor booths in Arizona.",
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
      "https://facebook.com/azpdscc",
      "https://instagram.com/azpdscc",
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
        <div className="flex min-h-screen flex-col">
          <Header />
          <ConditionalTicker />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
