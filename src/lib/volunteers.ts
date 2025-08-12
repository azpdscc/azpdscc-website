
/**
 * @fileoverview This file contains a simple list of volunteer email addresses
 * for role-based access control.
 * This file is no longer in use as a simpler, hardcoded volunteer login system was implemented.
 * It is kept for historical purposes but can be safely deleted.
 */

// IMPORTANT: This list is no longer used for authentication.
// The hardcoded credentials are now stored in environment variables.
const volunteerEmails: string[] = [
    // 'booth@pdscc.org',
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
