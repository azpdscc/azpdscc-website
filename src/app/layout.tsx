import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | AZPDSCC Hub',
    default: 'AZPDSCC | Arizona Indian Community & Festivals Hub',
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
    name: 'AZPDSCC',
    url: 'https://www.azpdscc.org',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Community Lane',
      addressLocality: 'Phoenix',
      addressRegion: 'AZ',
      postalCode: '85001',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'admin@pdscc.org',
      contactType: 'customer support',
    },
    sameAs: [
      "https://twitter.com/azpdscc",
      "https://facebook.com/azpdscc",
      "https://github.com/azpdscc",
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="font-body antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
