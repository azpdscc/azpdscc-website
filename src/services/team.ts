/**
 * @fileoverview This file contains functions for retrieving team member data.
 * For this prototype, it pulls from a static data file.
 */

import { teamMembers as staticTeamMembers } from '@/lib/static-data';
import type { TeamMember } from '@/lib/types';

/**
 * Fetches all team members.
 * In a real application, this would fetch from a database.
 * @returns {Promise<TeamMember[]>} A promise that resolves to an array of team members.
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  // Simulate an async operation
  return Promise.resolve(staticTeamMembers);
}
