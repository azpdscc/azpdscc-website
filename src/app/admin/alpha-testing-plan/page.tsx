
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const ChecklistItem = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-start gap-3">
        <Checkbox id={children?.toString()} className="mt-1" />
        <Label htmlFor={children?.toString()} className="text-base leading-snug text-muted-foreground">{children}</Label>
    </div>
)

export default function AlphaTestingPlanPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Alpha Testing Plan (Internal)</CardTitle>
          <CardDescription>
            This checklist is for the internal development team to verify core functionality and identify critical bugs before wider (beta) testing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <section>
            <h2 className="font-headline text-2xl font-bold mb-4">Phase 1: Environment & Setup</h2>
            <div className="space-y-4">
                <ChecklistItem>Verify all required environment variables (`.env.local`) are present and correctly loaded (Firebase keys, Resend API key, Admin credentials).</ChecklistItem>
                <ChecklistItem>Confirm the Firebase configuration in `src/lib/firebase.ts` is correct and the application connects to Firestore successfully.</ChecklistItem>
                <ChecklistItem>Review Firestore security rules (`firestore.rules`) to ensure they match the intended access patterns (e.g., public read, admin write).</ChecklistItem>
                <ChecklistItem>Ensure the Next.js configuration (`next.config.ts`) has the correct image remote patterns for all image sources.</ChecklistItem>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="font-headline text-2xl font-bold mb-4">Phase 2: Core Functionality (CRUD)</h2>
             <div className="space-y-4">
                <ChecklistItem>Create, Read, Update, and Delete (CRUD) an **Event**. Verify each operation succeeds and data appears correctly in Firestore and on the UI.</ChecklistItem>
                <ChecklistItem>CRUD a **Team Member**. Verify the member appears on the About page and ordering works as expected.</ChecklistItem>
                <ChecklistItem>CRUD a **Sponsor**. Verify the sponsor appears on the Sponsorship page and homepage.</ChecklistItem>
                <ChecklistItem>CRUD a **Blog Post**. Verify draft vs. published status works, and the post is accessible via its slug.</ChecklistItem>
                <ChecklistItem>CRUD a **Vendor Application**. Manually add a record in Firestore and verify it appears in the admin vendor list.</ChecklistItem>
                <ChecklistItem>CRUD a **Performance Application**. Manually add a record and verify it appears in the performances admin list.</ChecklistItem>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="font-headline text-2xl font-bold mb-4">Phase 3: AI Flows & External Services</h2>
            <div className="space-y-4">
                <h3 className="font-headline text-xl font-semibold">Email Delivery (Resend)</h3>
                <ChecklistItem>Submit the Contact form and confirm two emails are sent (one to admin, one confirmation to user).</ChecklistItem>
                <ChecklistItem>Submit every other form that sends email and confirm the correct emails are sent to the correct recipients.</ChecklistItem>
                <h3 className="font-headline text-xl font-semibold pt-4">Generative AI (Genkit)</h3>
                 <ChecklistItem>Test the "Generate Event Descriptions" flow. Provide a simple prompt and ensure it returns both a short and long description in the correct format.</ChecklistItem>
                 <ChecklistItem>Test the "Generate Blog Post" flow. Provide a topic and ensure it returns a title, slug, excerpt, and valid HTML content.</ChecklistItem>
                 <ChecklistItem>Test the "Calculate Holidays" flow for the current year and the next year. Verify the dates returned are accurate.</ChecklistItem>
                 <ChecklistItem>Test all other AI-powered email generation prompts (e.g., welcome email, vendor receipts) to ensure they produce coherent, correctly formatted text.</ChecklistItem>
            </div>
          </section>
          
           <Separator />

          <section>
            <h2 className="font-headline text-2xl font-bold mb-4">Phase 4: Security & Access Control</h2>
            <div className="space-y-4">
                <ChecklistItem>Attempt to access any `/admin` page without logging in. Verify redirection to `/admin/login`.</ChecklistItem>
                <ChecklistItem>Log in with incorrect admin credentials. Verify an error message is shown.</ChecklistItem>
                <ChecklistItem>Log in with correct admin credentials. Verify access is granted and the session flag is set.</ChecklistItem>
                <ChecklistItem>Log out. Verify the session flag is cleared and access is revoked.</ChecklistItem>
                <ChecklistItem>Repeat the login/logout/access-denial process for the Vendor Check-In login (`/admin/vendor-check-in-login`).</ChecklistItem>
                <ChecklistItem>Repeat the login/logout/access-denial process for the Performers Admin login (`/admin/performances-login`).</ChecklistItem>
            </div>
          </section>

        </CardContent>
      </Card>
    </div>
  );
}
