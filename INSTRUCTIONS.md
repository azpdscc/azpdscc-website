
# Application Management Guide

This document serves as a reference guide for managing the content and configuration of your PDSCC website.

## 1. Managing Website Content

All dynamic content on the website (such as Events, Team Members, Sponsors, and Blog Posts) is managed through the secure **Admin Panel**.

**Step-by-step guide:**

1.  **Access the Admin Panel:** In your browser, navigate to `/admin`.
2.  **Log In:** Use your administrator credentials to log in.
3.  **Navigate:** Use the dashboard links to go to the section you wish to manage (e.g., "Manage Events").
4.  **Add, Edit, or Delete:** Use the on-screen buttons to create new items, update existing ones, or remove them. Changes will be reflected on the live website immediately.

## 2. Updating Images

The website's images are linked from an external source. To change an image (like a sponsor's logo or a team member's photo):

- **For Team Members & Sponsors:** Use the Admin Panel to edit the item and paste the new image URL into the "Image URL" field.
- **For Static Images:** For images directly embedded in the code (like on the "About Us" page), you will need to edit the page file (e.g., `src/app/(main)/about/page.tsx`) and replace the `src` URL in the `<Image>` component.

It's highly recommended to upload your images to a dedicated hosting service (like Cloudinary, Firebase Storage, or an S3 bucket) and use the resulting URL.

## 3. Email Delivery Configuration

The website's forms use **Resend** to send emails. This is configured via two server secrets:

-   `RESEND_API_KEY`: Your secret API key from Resend.com.
-   **Recipient Email Addresses:** The "To" addresses are set directly within the relevant AI flow files (e.g., `src/ai/flows/send-contact-inquiry-flow.ts`).

To change these, you must update the secret in your hosting provider's Secret Manager or modify the flow files and redeploy.

## 4. Updating Social Media & Contact Info

Your organization's social media links, phone number, and physical address are located in the following files:

-   `src/components/layout/header.tsx`
-   `src/components/layout/footer.tsx`
-   `src/app/(main)/contact/page.tsx`

To update them, you must edit these files directly.
