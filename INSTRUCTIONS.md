# Application Management Instructions

This document provides instructions for managing the content and configuration of your PDSCC website.

## 1. How to Update Placeholder Images

The website uses placeholder images from `https://placehold.co`. You should replace these with your own high-quality event photos.

- **Identify Placeholders:** In the code, placeholder images look like this:
  ```html
  <Image 
    src="https://placehold.co/600x400.png" 
    alt="A descriptive caption"
    data-ai-hint="community gathering" 
  />
  ```
  The `data-ai-hint` attribute gives you a clue about what kind of image should be there.

- **Replace the `src`:** To update the image, simply replace the `src` URL with a link to your own image. It's highly recommended to upload your images to a dedicated hosting service (like Cloudinary, Firebase Storage, or an S3 bucket) rather than storing them directly in the project.

  **Example:**
  ```html
  <Image 
    src="https://your-image-hosting-service.com/path/to/your/image.jpg" 
    alt="A descriptive caption"
    data-ai-hint="community gathering" 
  />
  ```

## 2. How to Add New Events

To add, edit, or delete events, use the secure admin panel.

**Step-by-step guide:**

1.  **Access the Admin Panel:** In your browser, navigate to the `/admin/events` page.
2.  **Add an Event:** Click the "Add Event" button.
3.  **Fill Out Form:** Complete all the fields for your new event (name, date, description, etc.). You can use the "Generate Descriptions" button to have AI help you write compelling copy.
4.  **Save the Event:** Click "Create". Your new event will now appear on the website.

You can also edit or delete existing events from this same page.

## 3. How to Set Up Automated Blog Posting

The website can automatically generate and publish blog posts based on the topics you schedule in the Admin Panel (`/admin/scheduled-blog`). To make this work, you need to set up a "cron job" (a scheduled task) that runs periodically (e.g., once a day).

### A. Set Your Cron Secret Key

1.  In the root directory of your project, find or create a file named `.env.local` (this file is for secret keys and is ignored by source control).
2.  Generate a long, random, and secret string. You can use a password generator for this.
3.  Add this secret key to your `.env.local` file:
    ```
    CRON_SECRET=your_super_secret_key_here
    ```
    If you deploy your site, you must add this as an environment variable in your hosting provider's settings.

### B. Configure the Scheduler

You need to schedule a task to send an HTTP GET request to a specific URL once per day. Most hosting providers (like Vercel, Netlify, or Google Cloud) offer a way to set up cron jobs.

-   **URL to Request:** `https://your-website-url.com/api/cron/run-weekly-post?secret=your_super_secret_key_here`
    (Replace `your-website-url.com` with your actual domain and `your_super_secret_key_here` with the secret you just created).

-   **Method:** `GET`

-   **Schedule:** Run once per day (e.g., at midnight).

**Example using `curl`:**
You would configure your scheduler to execute a command similar to this:
```bash
curl "https://your-website-url.com/api/cron/run-weekly-post?secret=your_super_secret_key_here"
```

When this runs, the system will check for any "Pending" blog posts whose scheduled date has arrived, generate the content, and publish it.

## 4. How to Configure Email Delivery

The website's forms (Contact, Donations, Vendor Applications, etc.) use a service called **Resend** to send emails. To make this work in your live environment, you need to configure two things:

### A. Set Your API Key

1.  Sign up for a free account at [Resend.com](https://resend.com).
2.  Create an API Key in your Resend dashboard.
3.  In the root directory of your project, create a new file named `.env.local` (this file is for secret keys and is ignored by source control).
4.  Add your Resend API key to this file like so:
    ```
    RESEND_API_KEY=re_xxxxxxxxxxxxxxx
    ```
    Replace `re_xxxxxxxxxxxxxxx` with your actual key. If you deploy your site, you will need to add this as an environment variable in your hosting provider's settings.

### B. Set the Recipient Email Addresses

The email addresses that receive the form submissions are currently set to placeholders in the AI flow files. You must change these to your organization's actual email addresses.

-   **Contact Form:**
    -   File: `src/ai/flows/send-contact-inquiry-flow.ts`
    -   Find the line `to: 'admin@azpdscc.org'` and change the email address.

-   **Vendor Application Form:**
    -   File: `srcai/flows/send-vendor-application-flow.ts`
    -   Find the line `to: 'admin@azpdscc.org'` and change the email address.

-   **General Vendor Registration:**
    -   File: `src/ai/flows/send-general-registration-flow.ts`
    -   Find the line `to: 'admin@azpdscc.org'` and change the email address.

-   **Donations:**
    -   File: `src/ai/flows/send-donation-receipt-flow.ts`
    -   Find the line `to: 'admin@azpdscc.org'` and change the email address.

-   **Sponsorships:**
    -   File: `src/ai/flows/send-sponsorship-inquiry-flow.ts`
    -   Find the line `to: 'admin@azpdscc.org'` and change the email address.

-   **Volunteers:**
    -   File: `srcai/flows/send-volunteer-inquiry-flow.ts`
    -   Find the line `to: 'admin@azpdscc.org'` and change the email address.

## 5. How to Update Social Media Links

The header and footer contain social media icons. You need to update them to point to your organization's profiles.

-   **Files to Edit:**
    -   `src/components/layout/header.tsx`
    -   `src/components/layout/footer.tsx`
-   **What to do:** In both files, find the links that look like this:
    ```html
    <Link href="https://twitter.com/AZPDSCC" ...>
    ```
-   **Change the `href` attribute:** Replace the placeholder URL with the full URL to your social media page.

## 6. How to Update Contact Information

Your organization's phone number and physical address are displayed in a few places.

-   **Files to Edit:**
    -   `src/app/contact/page.tsx`
    -   `src/components/layout/footer.tsx`
-   **What to do:** Open these files and find the placeholder phone number `(602) 317-2239` and address `AZPDSCC Community Lane, Buckeye, AZ 85326`. Replace them with your correct information.

## 7. How to Manage Other Content (Team & Blog)

-   **For Team Members:** Use the admin panel at `/admin/team` to add, edit, or delete team members. Their information will automatically update on the "About Us" page.

-   **For Sponsors:** Use the admin panel at `/admin/sponsors` to manage your sponsors. They will automatically appear on the homepage and sponsorship page.

-   **For Blog Posts:** Use the admin panel at `/admin/blog` to add, edit, or delete blog posts.
