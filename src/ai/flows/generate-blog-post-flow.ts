
'use server';
/**
 * @fileOverview An AI flow to generate a full blog post from a topic.
 *
 * This flow uses a two-step process:
 * 1. Research: Gathers up-to-date information on a topic using Google Search.
 * 2. Write: Uses the research to write a complete, formatted blog post.
 *
 * - generateBlogPost: Takes a topic and generates a title, slug, excerpt, and content.
 * - GenerateBlogPostInput: The input type for the flow.
 * - GenerateBlogPostOutput: The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Input schema for the flow
const GenerateBlogPostInputSchema = z.object({
  topic: z.string().describe('The topic or title for the blog post.'),
});
export type GenerateBlogPostInput = z.infer<
  typeof GenerateBlogPostInputSchema
>;

// Output schema for the flow, designed for structured JSON output
const GenerateBlogPostOutputSchema = z.object({
  title: z
    .string()
    .describe(
      'A compelling, SEO-friendly title for the blog post. Max 70 characters.'
    ),
  slug: z
    .string()
    .describe("A URL-friendly slug for the blog post (e.g., 'my-new-post')."),
  excerpt: z
    .string()
    .describe(
      'A short, engaging summary of the post for social media and previews. Max 160 characters.'
    ),
  content: z
    .string()
    .describe(
      'The full content of the blog post, written in a warm, informative, and community-focused tone. It should be at least 300 words long and formatted with paragraphs using HTML tags like <p> and <h2>.'
    ),
});
export type GenerateBlogPostOutput = z.infer<
  typeof GenerateBlogPostOutputSchema
>;

/**
 * Public function to trigger the blog post generation flow.
 * @param input The topic for the blog post.
 * @returns A promise that resolves to the generated post content.
 */
export async function generateBlogPost(
  input: GenerateBlogPostInput
): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(input);
}

// STEP 1: Define the text for the research prompt.
const researchPromptText = `You are a research assistant. Your goal is to gather relevant, up-to-date information on a given topic to help a writer create a blog post.
  
Please research the following topic: "{{{topic}}}"

Provide a summary of your findings as a block of text. Focus on information from the last year to ensure the content is current.`;


// STEP 2: A writing prompt that takes the research and formats the output.
// It does NOT use tools, so it can be defined and called directly.
const writingPrompt = ai.definePrompt({
  name: 'blogPostWritingPrompt',
  input: {
    schema: z.object({
      topic: z.string(),
      research: z.string(),
    }),
  },
  output: { schema: GenerateBlogPostOutputSchema },
  prompt: `You are an expert content creator for PDSCC (Phoenix Desi Sports and Cultural Club), a non-profit organization that serves the Phoenix Indian community and AZ Desis.

Your task is to write a complete, engaging, and SEO-friendly blog post based on the provided topic and research notes.

**Topic:** "{{{topic}}}"

**Research Notes:**
\`\`\`
{{{research}}}
\`\`\`

**Instructions:**
1.  **Tone**: The tone must be warm, welcoming, informative, and community-focused.
2.  **Keywords**: Naturally incorporate the following keywords throughout the post where relevant: "PDSCC", "Phoenix Indian community", "AZ Desis", "Arizona Indian festivals". This is crucial for SEO.
3.  **Title**: Create a catchy title (max 70 characters).
4.  **Slug**: Generate a URL-friendly slug from the title.
5.  **Excerpt**: Write a concise summary (max 160 characters).
6.  **Content**: Write the full blog post (minimum 300 words) based on the provided research. The content should be well-structured with an introduction, multiple body paragraphs, and a conclusion. **Format the content using HTML tags** such as \`<p>\` for paragraphs and \`<h2>\` for subheadings to ensure it's web-ready.
7.  **PDSCC Connection**: Ensure the post always connects back to the mission or activities of PDSCC, reinforcing the organization's role in the community.

Return the output in the requested JSON format.`,
});

// The main Genkit flow that chains the two steps together.
const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async (input) => {
    // Step 1: Run the research prompt using ai.generate() directly
    const researchResult = await ai.generate({
      prompt: researchPromptText,
      input: input,
      tools: [ai.googleSearch],
    });
    
    const researchText = researchResult.text;

    if (!researchText) {
        throw new Error("AI failed to conduct research.");
    }

    // Step 2: Run the writing prompt with the research results
    const { output } = await writingPrompt({
      topic: input.topic,
      research: researchText,
    });

    if (!output) {
      throw new Error('AI failed to generate the blog post.');
    }

    return output;
  }
);
