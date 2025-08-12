
/**
 * @fileoverview This file contains a simple list of volunteer email addresses
 * for role-based access control.
 */

// IMPORTANT: Add the email addresses of your trusted check-in staff to this array.
// These users will ONLY be able to access the /admin/check-in page.
// All other users who can log in will be treated as full administrators.
const volunteerEmails: string[] = [
    'booth@pdscc.org',
    // 'volunteer1@example.com',
    // 'volunteer2@example.com',
];


/**
 * Checks if a given email is in the volunteer list.
 * @param email The email address to check. Can be null or undefined.
 * @returns {boolean} True if the email is in the volunteer list, false otherwise.
 */
export function isVolunteer(email: string | null | undefined): boolean {
    if (!email) {
        return false;
    }
    return volunteerEmails.includes(email.toLowerCase());
}
