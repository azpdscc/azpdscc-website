
import type { Event, TeamMember } from './types';
import { events as staticEvents, teamMembers as staticTeamMembers } from './static-data';

// Event data is now fetched from Firestore. This is kept for type reference and potential fallback.
export const events: Event[] = staticEvents;

// Team member data is now fetched from Firestore. This file can be removed or kept for type reference.
export const teamMembers: TeamMember[] = staticTeamMembers;
