
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

export default function BetaTestingPlanPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Beta Testing Plan</CardTitle>
          <CardDescription>A comprehensive checklist to ensure the website is ready for launch. Please have testers for each role go through their respective sections.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <section>
            <h2 className="font-headline text-2xl font-bold mb-4">I. Public User (Front-End)</h2>
            <div className="space-y-4">
                <ChecklistItem>Navigate to all main pages using the header and footer links (Events, Vendors, Sponsorship, etc.).</ChecklistItem>
                <ChecklistItem>On the Homepage, verify the hero carousel loads and the "Upcoming Event" slide appears if there is an event.</ChecklistItem>
                <ChecklistItem>Verify the Holiday Banner appears only on the day of a holiday and disappears the next day.</ChecklistItem>
                <ChecklistItem>Submit the "Contact Us" form with valid data and verify a success message appears and an email is received.</ChecklistItem>
                <ChecklistItem>Submit the "Volunteer" form and verify a success message and email confirmation.</ChecklistItem>
                <ChecklistItem>Submit the "Subscribe" form in the footer and verify the success message and email confirmation.</ChecklistItem>
                <ChecklistItem>On the "Donate" page, test the Zelle and Check donation forms, ensuring success messages appear and admin emails are received.</ChecklistItem>
                <ChecklistItem>On all forms with a phone number, verify the SMS consent checkbox is present and required for submission where applicable.</ChecklistItem>
                <ChecklistItem>View an upcoming event and a past event to ensure the details and action buttons (e.g., "View Photos") change correctly.</ChecklistItem>
                <ChecklistItem>View a blog post and verify all content loads correctly.</ChecklistItem>
                <ChecklistItem>Resize the browser window to mobile, tablet, and desktop sizes to check for responsiveness issues on at least 3 different pages.</ChecklistItem>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="font-headline text-2xl font-bold mb-4">II. Site Administrator</h2>
             <div className="space-y-4">
                <ChecklistItem>Log in to the main admin dashboard using the credentials from the `.env` file.</ChecklistItem>
                <ChecklistItem>Navigate to "Manage Events" and create a new test event. Verify it appears on the public site.</ChecklistItem>
                <ChecklistItem>Edit the test event and verify the changes are reflected on the public site.</ChecklistItem>
                <ChecklistItem>Delete the test event and verify it is removed from the public site.</ChecklistItem>
                <ChecklistItem>Repeat the Create, Edit, and Delete process for a Team Member, a Sponsor, and a Blog Post.</ChecklistItem>
                <ChecklistItem>Use the AI generator in the Blog Post form to create content.</ChecklistItem>
                <ChecklistItem>Go to the "Volunteer Hours" page and send a test confirmation letter. Verify the email is received by the "volunteer" and a copy is sent to the admin.</ChecklistItem>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="font-headline text-2xl font-bold mb-4">III. Event Staff (Vendors & Performers)</h2>
            <div className="space-y-4">
                <h3 className="font-headline text-xl font-semibold">Vendor Management</h3>
                <ChecklistItem>As a public user, submit a test vendor application from the `/vendors/apply` page.</ChecklistItem>
                <ChecklistItem>As an admin, log in and navigate to "Manage Vendors". Verify the new application is in the "Pending" list.</ChecklistItem>
                <ChecklistItem>Click "Verify & Send Ticket" for the test application. Verify a success message appears and the vendor receives a ticket email with a QR code.</ChecklistItem>
                <ChecklistItem>Verify the application moves to the "Verified Applications" list.</ChecklistItem>
                 <h3 className="font-headline text-xl font-semibold pt-4">Performance Management</h3>
                 <ChecklistItem>As a public user, submit a test performance application from the `/perform/register` page.</ChecklistItem>
                 <ChecklistItem>As an admin or performance manager, log in to the "Performers Admin" and verify the new application appears in the list.</ChecklistItem>
                 <h3 className="font-headline text-xl font-semibold pt-4">Event Day Check-In</h3>
                 <ChecklistItem>Log in to the "Vendor Check-In Login" using the separate volunteer credentials.</ChecklistItem>
                 <ChecklistItem>On the "Event Check-In" page, verify the test vendor appears in the "Live List" tab.</ChecklistItem>
                 <ChecklistItem>Go to the "Scan QR Code" tab. Use a phone to scan the QR code from the vendor's ticket email.</ChecklistItem>
                 <ChecklistItem>Verify the vendor's details appear. Click "Confirm and Check-In Vendor".</ChecklistItem>
                 <ChecklistItem>Verify a success message is shown and the vendor's status updates to "Checked-In" in the "Live List".</ChecklistItem>
            </div>
          </section>

        </CardContent>
      </Card>
    </div>
  );
}
