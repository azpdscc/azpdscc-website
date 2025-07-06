# Application Management Instructions

This document provides instructions for managing the content and configuration of your AZPDSCC website.

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

The site includes an **Event Code Generator** to make adding new events simple and error-free.

**Step-by-step guide:**

1.  **Access the Tool:** In your browser, navigate to the `/events/create` page.
2.  **Enter Password:** You will be prompted for a password. Enter `azpdscc-admin-2024` to unlock the page.
3.  **Fill Out Form:** Complete all the fields for your new event (name, date, description, etc.).
4.  **Generate Content:** Click the **"Generate Content"** button.
5.  **Copy File Content:** The tool will generate the entire, updated content for your events data file. Click the **"Copy"** button next to the "Generated `data.ts` File Content" card.
6.  **Update the File:**
    - Open the file `src/lib/data.ts` in your code editor.
    - Select ALL the existing content in that file (you can use `Ctrl+A` or `Cmd+A`).
    - Paste (`Ctrl+V` or `Cmd+V`) to completely replace the old content with the newly copied code.
7.  **Save the file.** Your new event will now appear on the website.

The tool also generates social media posts, which you can copy and use for promotion.

## 3. How to Configure Email Delivery

The website's forms (Contact, Donations, Vendor Applications, etc.) use a service called **Resend** to send emails. To make this work in your live environment (like AWS Amplify), you need to configure two things:

### A. Set Your API Key

1.  Sign up for a free account at [Resend.com](https://resend.com).
2.  Create an API Key in your Resend dashboard.
3.  In the root directory of your project, create a new file named `.env.local` (this file is for secret keys and is ignored by source control).
4.  Add your Resend API key to this file like so:
    ```
    RESEND_API_KEY=re_xxxxxxxxxxxxxxx
    ```
    Replace `re_xxxxxxxxxxxxxxx` with your actual key. When you deploy to AWS Amplify, you will need to add this as an environment variable in the Amplify console.

### B. Set the Recipient Email Addresses

The email addresses that receive the form submissions are currently set to placeholders in the AI flow files. You must change these to your organization's actual email addresses.

-   **Contact Form:**
    -   File: `src/ai/flows/send-contact-inquiry-flow.ts`
    -   Find the line `to: 'admin@azpdscc.org'` and change the email address.

-   **Vendor Application Form:**
    -   File: `src/ai/flows/send-vendor-application-flow.ts`
    -   Find the line `to: 'vendors@azpdscc.org'` and change the email address.

-   **General Vendor Registration:**
    -   File: `src/ai/flows/send-general-registration-flow.ts`
    -   Find the line `to: 'vendors@azpdscc.org'` and change the email address.

By following these steps, you can ensure all forms deliver emails to the correct inboxes.
