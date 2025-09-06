
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | PDSCC',
  description: 'Please read our Terms of Service carefully before using the PDSCC website and its services.',
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-background">
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                  <FileText className="h-10 w-10 text-primary" strokeWidth={1.5} />
                </div>
                <CardTitle className="font-headline text-4xl">Terms of Service</CardTitle>
                <p className="text-muted-foreground">Last Updated: August 1, 2025</p>
              </CardHeader>
              <CardContent className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground space-y-6">
                <p>
                  Welcome to the Phoenix Desi Sports and Cultural Club ("PDSCC," "we," "us," "our"). These Terms of Service ("Terms") govern your membership, participation in our events, and use of our website pdscc.org ("Services"). By accessing or using our Services, you agree to be bound by these Terms.
                </p>

                <h2 className="font-headline text-2xl text-foreground">1. Description of Services</h2>
                <p>
                  PDSCC is a 501(c)(3) non-profit organization dedicated to promoting sports, cultural activities, and community spirit among the Desi community in the greater Phoenix area. Our services include organizing sports leagues, tournaments, cultural events, and community gatherings.
                </p>

                <h2 className="font-headline text-2xl text-foreground">2. Membership and Registration</h2>
                <p>
                    To become a member or participate in certain events, you may be required to register and pay applicable fees. You agree to provide accurate, current, and complete information during the registration process. Membership is non-transferable. PDSCC reserves the right to approve, deny, or terminate membership at its discretion.
                </p>
                
                <h2 className="font-headline text-2xl text-foreground">3. Code of Conduct</h2>
                <p>
                  All members, volunteers, and participants are expected to uphold the values of sportsmanship, respect, and integrity. The following conduct is strictly prohibited at any PDSCC event or on our online platforms:
                </p>
                 <ul>
                    <li>Harassment, discrimination, or bullying of any kind.</li>
                    <li>Violence, threats, or unsportsmanlike conduct.</li>
                    <li>Use of illegal substances.</li>
                    <li>Damage to property or facilities.</li>
                    <li>Violation of any event rules or regulations.</li>
                 </ul>
                 <p>
                    Failure to adhere to this Code of Conduct may result in immediate removal from an event, suspension of membership, and/or a permanent ban from all PDSCC activities, without a refund.
                 </p>

                <h2 className="font-headline text-2xl text-foreground">4. Assumption of Risk and Waiver of Liability</h2>
                <p>
                  Participation in sports and physical activities carries inherent risks of injury. By participating in any PDSCC sports event or activity, you voluntarily and knowingly agree to the following:
                </p>
                <ul>
                    <li>You acknowledge and assume all risks associated with participation, including but not limited to falls, contact with other participants, effects of the weather, and condition of the playing surfaces, which may result in minor or serious injury, or even death.</li>
                    <li>You, on behalf of yourself, your heirs, and your personal representatives, hereby release, waive, and forever discharge PDSCC, its directors, officers, volunteers, agents, and representatives from any and all claims, liabilities, demands, or causes of action whatsoever arising out of or related to any loss, damage, or injury, including death, that may be sustained by you while participating in or traveling to or from a PDSCC activity.</li>
                </ul>
                
                <h2 className="font-headline text-2xl text-foreground">5. Photography and Videography Consent</h2>
                <p>
                  By attending a PDSCC event, you grant us the irrevocable right to use, reproduce, and publish any photographs or videos taken of you for promotional purposes on our website, social media, and other marketing materials. If you do not wish for your image to be used, you must make a reasonable effort to avoid being photographed or notify an event organizer.
                </p>

                <h2 className="font-headline text-2xl text-foreground">6. Donations</h2>
                <p>
                    As a 501(c)(3) non-profit organization, we gratefully accept donations to support our mission. All donations are non-refundable. We will provide a tax receipt for donations as required by law.
                </p>

                 <h2 className="font-headline text-2xl text-foreground">7. Intellectual Property</h2>
                 <p>
                    All content on our website, including the PDSCC name, logo, text, and graphics, is the property of Phoenix Desi Sports and Cultural Club and is protected by copyright and trademark laws. You may not use our intellectual property without our prior written consent.
                 </p>

                <h2 className="font-headline text-2xl text-foreground">8. Limitation of Liability</h2>
                <p>
                    To the fullest extent permitted by law, PDSCC shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, resulting from your access to or use of our Services.
                </p>
                
                <h2 className="font-headline text-2xl text-foreground">9. Governing Law and Dispute Resolution</h2>
                <p>
                  These Terms shall be governed by the laws of the State of Arizona. Any dispute arising from these Terms or your participation in PDSCC activities shall be resolved through binding arbitration in Maricopa County, Arizona.
                </p>
                
                <h2 className="font-headline text-2xl text-foreground">10. Changes to These Terms</h2>
                <p>
                    We reserve the right to modify these Terms at any time. We will post the revised Terms on our website, and your continued use of our Services after such changes will constitute your acceptance of the new Terms.
                </p>

                <h2 className="font-headline text-2xl text-foreground">11. Contact Us</h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us at: Phoenix Desi Sports and Cultural Club Email: <a href="mailto:admin@azpdscc.org" className="text-primary hover:underline">admin@azpdscc.org</a> Website: azpdscc.org
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
