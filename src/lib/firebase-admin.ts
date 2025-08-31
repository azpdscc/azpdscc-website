
/**
 * @fileoverview This file is intentionally left blank.
 * The Firebase Admin SDK initialization logic has been moved directly into the API
 * route that uses it (/src/app/api/admin/blog/route.ts). This ensures that the SDK
 * is only initialized in the specific serverless function where it's needed,
 * making the process more robust and preventing potential initialization conflicts
 * in different environments.
 */
