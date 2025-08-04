
import type { Event, TeamMember } from './types';

// Event data is now fetched from Firestore. This is kept for type reference and potential fallback.
export const events: Event[] = [];

// Team member data is now fetched from Firestore. This file can be removed or kept for type reference.
export const teamMembers: Omit<TeamMember, 'id'>[] = [];
