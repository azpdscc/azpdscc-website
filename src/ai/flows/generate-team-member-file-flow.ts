
'use server';
/**
 * @fileOverview An AI flow to generate the full content of the data file with a new team member.
 *
 * - generateTeamMemberFile: Takes new member data and returns the full TS file content.
 * - GenerateTeamMemberFileInput: The input type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getEvents } from '@/services/events';
import { getTeamMembers } from '@/services/team';
import type { TeamMember } from '@/lib/types';

const GenerateTeamMemberFileInputSchema = z.object({
  newMember: z.any().describe('The new team member object to add.'),
});
export type GenerateTeamMemberFileInput = z.infer<
  typeof GenerateTeamMemberFileInputSchema
>;

const FileContentSchema = z.object({
  fileContent: z.string().describe('The entire, complete TypeScript code for the data.ts file.'),
});

// Helper function to manually generate the file content as a fallback
const generateFileContentManually = async (newMember: Omit<TeamMember, 'id'>): Promise<string> => {
  const teamMembers = await getTeamMembers();
  const events = await getEvents();
  
  // Firestore IDs are strings, so we can't just find the max number.
  // We'll add it without an ID and let the service handle it, but for a pure file-based
  // approach, you'd need a different strategy. For now, we'll just log it.
  console.log("Adding new member manually:", newMember);
  const updatedTeamMembers = [...teamMembers, { ...newMember, id: 'temp-id' }];
  
  const eventsString = JSON.stringify(events, null, 2)
    .replace(/"([^"]+)":/g, '$1:');

  const teamMembersString = JSON.stringify(updatedTeamMembers, null, 2)
    .replace(/"([^"]+)":/g, '$1:');

  return `
import type { Event, TeamMember } from './types';

export const events: Event[] = ${eventsString};

export const teamMembers: TeamMember[] = ${teamMembersString};
  `.trim();
};

export async function generateTeamMemberFile(
  input: GenerateTeamMemberFileInput
): Promise<string> {
  try {
    const { output } = await generateTeamMemberFileFlow(input);
    if (output?.fileContent) {
      return output.fileContent;
    }
    // If AI fails or returns empty content, use the manual fallback
    console.warn("AI generation failed or returned empty. Using manual fallback.");
    return await generateFileContentManually(input.newMember);
  } catch (error) {
    console.error("Error in generateTeamMemberFile flow, switching to manual fallback:", error);
    return await generateFileContentManually(input.newMember);
  }
}

const generateTeamMemberFileFlow = ai.defineFlow(
  {
    name: 'generateTeamMemberFileFlow',
    inputSchema: GenerateTeamMemberFileInputSchema,
    outputSchema: FileContentSchema,
  },
  async (input) => {
    // We pass the full data to the prompt context to ensure it has everything.
    const fullData = {
      existingEvents: await getEvents(),
      existingTeamMembers: await getTeamMembers(),
      newMember: input.newMember,
    };

    const { output } = await ai.generate({
      prompt: `
        You are a TypeScript code generation assistant. Your task is to update a data file ('data.ts').
        You will be given a new team member object to add.
        Your goal is to add the new team member to the 'teamMembers' array and generate the complete content for the TypeScript file.

        - The new member should be added to the END of the 'teamMembers' array.
        - You must generate a new unique string ID for the new member. It should not match any existing ID.
        - Ensure the final output is a single, valid TypeScript file string.
        - Do not include any explanations or markdown formatting. Only output the raw file content.
        - Preserve the 'events' export and all its existing data.

        Here is the new team member to add:
        \`\`\`json
        {{{JSONstringify newMember}}}
        \`\`\`

        Here is the full existing data for context (events and team members):
        \`\`\`json
        {{{JSONstringify .}}}
        \`\`\`
      `,
      context: fullData,
      customizers: {
        JSONstringify: (obj: any) => JSON.stringify(obj, null, 2),
      },
      config: {
        temperature: 0.1,
      },
      output: {
        format: 'json',
        schema: FileContentSchema,
      },
    });

    if (!output || !output.fileContent) {
        throw new Error("AI failed to generate file content.");
    }

    return output;
  }
);
