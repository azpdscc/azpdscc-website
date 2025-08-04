
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';
import { SubscribeForm } from './subscribe-form';

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 mb-12 text-center">
            <Mail className="mx-auto h-12 w-12 text-primary mb-4" strokeWidth={1.5}/>
            <h2 className="font-headline text-3xl font-bold text-foreground">Stay Connected</h2>
            <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
                Never miss an update. Subscribe to our mailing list for the latest news on festivals, community events, and special announcements.
            </p>
            <div className="mt-6 max-w-lg mx-auto">
                <SubscribeForm />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-2 text-muted-foreground text-sm font-semibold">Phoenix Desi Sports and Cultural Club</p>
            <p className="mt-4 text-muted-foreground text-sm">
              To celebrate and share the vibrant culture of North India through sports and festivals in the Phoenix community.
            </p>
            <div className="mt-4 flex space-x-4">
              <Link href="https://x.com/AZPDSCC" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" strokeWidth={1.5} />
              </Link>
              <Link href="https://www.facebook.com/pdscc" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" strokeWidth={1.5} />
              </Link>
              <Link href="https://www.instagram.com/azpdscc/" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-headline font-semibold text-foreground">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/events" className="text-muted-foreground hover:text-primary">Events</Link></li>
              <li><Link href="/vendors" className="text-muted-foreground hover:text-primary">Vendors</Link></li>
              <li><Link href="/sponsorship" className="text-muted-foreground hover:text-primary">Sponsorship</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold text-foreground">Legal & Admin</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/events/create" className="text-muted-foreground hover:text-primary">Event Generator</Link></li>
              <li><Link href="/about/add" className="text-muted-foreground hover:text-primary">Member Generator</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold text-foreground">Contact</h3>
            <address className="mt-4 text-muted-foreground text-sm not-italic">
              AZPDSCC Community Lane<br />
              Buckeye, AZ 85326<br />
              Email: <a href="mailto:admin@azpdscc.org" className="text-primary hover:underline">admin@azpdscc.org</a><br/>
              Phone: <a href="tel:6023172239" className="text-primary hover:underline">(602) 317-2239</a>
            </address>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AZPDSCC.org. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
