
/**
 * @fileoverview This file is intentionally left blank.
 * The Resend client initialization has been moved directly into each
 * AI flow that sends email to ensure robustness and correct handling
 * of environment variables in the server-side context.
 *
 * This centralization attempt was causing issues with how Next.js and Genkit
 * handle environment variables in different contexts, leading to the
 * "Server configuration error for sending emails."
 *
 * This file can be removed in the future if no other shared AI configuration is needed.
 */
