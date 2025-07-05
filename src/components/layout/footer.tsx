
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Github, Twitter, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-muted-foreground text-sm">
              Connecting Arizona&apos;s Indian Community, AZ Desis, and the greater Phoenix Indian community through culture & celebration.
            </p>
            <div className="mt-4 flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" strokeWidth={1.5} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" strokeWidth={1.5} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-headline font-semibold text-foreground">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/events" className="text-muted-foreground hover:text-primary">Events</Link></li>
              <li><Link href="/vendors" className="text-muted-foreground hover:text-primary">Vendors</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold text-foreground">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
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
