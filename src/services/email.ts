/**
 * @fileoverview Centralized service for handling all email sending via Resend.
 * This service initializes the Resend client once and provides a reusable function
 * for sending emails, ensuring consistent API key handling and error management.
 */
import { Resend } from 'resend';

// Initialize the Resend client once using the API key from environment variables.
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface EmailParams {
  from: string;
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

/**
 * Sends an email using the central Resend client.
 * @param params - The email parameters (from, to, subject, html/text).
 * @returns A promise that resolves when the email is sent.
 * @throws An error if the Resend API key is not configured.
 */
export async function sendEmail(params: EmailParams) {
  if (!resend) {
    console.error("Resend API key is not configured. Email cannot be sent.");
    // This error will be caught by the calling flow and result in a user-facing message.
    throw new Error('The email service is not configured correctly on the server. Please contact support.');
  }
  
  try {
    await resend.emails.send(params);
  } catch (error) {
    console.error("Failed to send email:", error);
    // Re-throw the error to be handled by the calling flow.
    throw error;
  }
}
