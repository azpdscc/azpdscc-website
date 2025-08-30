
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Instagram, Twitter, Facebook, Mail, Youtube, Lock, HandHeart, UserCheck, Mic, MessageSquareText, Ticket } from 'lucide-react';
import { SubscribeForm } from './subscribe-form';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function Footer() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <footer className="bg-secondary border-t relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-pattern opacity-[0.04]" />
      <div className="relative z-10">
        <div className="container mx-auto px-4 pt-16 pb-8">
          {!isAdminPage && (
            <div className="mb-16">
                 <Card className="max-w-3xl mx-auto shadow-lg">
                    <CardHeader className="text-center">
                         <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                            <Mail className="h-10 w-10 text-primary" strokeWidth={1.5} />
                        </div>
                        <CardTitle className="font-headline text-3xl">Stay Connected</CardTitle>
                        <CardDescription>
                            Subscribe for the latest news on festivals, community events, and special announcements. Opt-in to receive your electronic raffle tickets by phone!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SubscribeForm />
                    </CardContent>
                </Card>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <Logo />
              <p className="mt-4 text-muted-foreground text-sm">
                To celebrate and share the vibrant culture of North India through sports and festivals in the Phoenix community.
              </p>
              <div className="mt-4 flex space-x-4">
                <Link href="/contact" className="text-muted-foreground hover:text-primary" aria-label="Contact Us">
                  <Mail className="h-5 w-5" strokeWidth={1.5} />
                </Link>
                <Link href="https://x.com/AZPDSCC" className="text-muted-foreground hover:text-primary" aria-label="Twitter">
                  <Twitter className="h-5 w-5" strokeWidth={1.5} />
                </Link>
                <Link href="https://www.facebook.com/pdscc" className="text-muted-foreground hover:text-primary" aria-label="Facebook">
                  <Facebook className="h-5 w-5" strokeWidth={1.5} />
                </Link>
                <Link href="https://www.instagram.com/azpdscc/" className="text-muted-foreground hover:text-primary" aria-label="Instagram">
                  <Instagram className="h-5 w-5" strokeWidth={1.5} />
                </Link>
                <Link href="https://www.youtube.com/@AZPDSCC" className="text-muted-foreground hover:text-primary" aria-label="YouTube">
                  <Youtube className="h-5 w-5" strokeWidth={1.5} />
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-headline font-semibold text-foreground">Quick Links</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
                <li><Link href="/events" className="text-muted-foreground hover:text-primary">Events</Link></li>
                <li><Link href="/vendors" className="text-muted-foreground hover:text-primary">Vendors</Link></li>
                <li><Link href="/perform" className="text-muted-foreground hover:text-primary">Performers</Link></li>
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
                <li><Link href="/sms-policy" className="text-muted-foreground hover:text-primary">SMS Policy</Link></li>
                <li>
                  <Link href="/admin" className="text-muted-foreground hover:text-primary flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Admin Login
                  </Link>
                </li>
                 <li>
                  <Link href="/admin/vendor-check-in-login" className="text-muted-foreground hover:text-primary flex items-center gap-1">
                      <UserCheck className="h-3 w-3" />
                      Vendor Check-in Login
                  </Link>
                </li>
                 <li>
                  <Link href="/admin/performances-login" className="text-muted-foreground hover:text-primary flex items-center gap-1">
                      <Mic className="h-3 w-3" />
                      Performers Admin
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline font-semibold text-foreground">Get Involved</h3>
              <address className="mt-4 text-muted-foreground text-sm not-italic">
                AZPDSCC Community Lane<br />
                Buckeye, AZ 85326<br />
                Email: <a href="mailto:admin@azpdscc.org" className="text-primary hover:underline">admin@azpdscc.org</a><br/>
                Phone: <a href="tel:6023172239" className="text-primary hover:underline">(602) 317-2239</a>
              </address>
               <Button asChild className="mt-4">
                  <Link href="/volunteer">
                      <HandHeart className="mr-2"/>
                      Volunteer
                  </Link>
               </Button>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} AZPDSCC.org. All rights reserved.</p>
            <p className="mt-2">Web Development by Kulraj Singh</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
