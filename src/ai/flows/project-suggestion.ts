// src/ai/flows/project-suggestion.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting internship projects to intern applicants based on their profile.
 *
 * The flow analyzes the applicant's specialization and skills to recommend the most suitable projects.
 * @param {ApplicantProfile} input - The input to the projectSuggestionFlow containing applicant's profile information.
 * @returns {Promise<ProjectSuggestionOutput>} - A promise that resolves to the suggested projects.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ApplicantProfileSchema = z.object({
  specialization: z.string().describe('The applicant\'s area of specialization, e.g., Computer Science, Electrical Engineering.'),
  skills: z.string().describe('A comma-separated list of the applicant\'s skills, e.g., programming, data analysis, machine learning.'),
});
export type ApplicantProfile = z.infer<typeof ApplicantProfileSchema>;

const ProjectSuggestionOutputSchema = z.object({
  suggestedProjects: z.array(
    z.object({
      id: z.number().describe('The ID of the suggested project.'),
      title: z.string().describe('The title of the suggested project.'),
      reason: z.string().describe('The reason why this project is a good fit for the applicant based on their profile.'),
    })
  ).describe('An array of suggested projects with reasons for each suggestion.'),
});
export type ProjectSuggestionOutput = z.infer<typeof ProjectSuggestionOutputSchema>;


export async function suggestProjects(input: ApplicantProfile): Promise<ProjectSuggestionOutput> {
  return projectSuggestionFlow(input);
}

const projectSuggestionPrompt = ai.definePrompt({
  name: 'projectSuggestionPrompt',
  input: {
    schema: ApplicantProfileSchema,
  },
  output: {
    schema: ProjectSuggestionOutputSchema,
  },
  prompt: `Given the following applicant profile, suggest the most suitable internship projects. Explain the reason for each suggestion.

Applicant Specialization: {{{specialization}}}
Applicant Skills: {{{skills}}}

Return the suggested projects in JSON format:
{{$instructions}}
`,
});

const projectSuggestionFlow = ai.defineFlow(
  {
    name: 'projectSuggestionFlow',
    inputSchema: ApplicantProfileSchema,
    outputSchema: ProjectSuggestionOutputSchema,
  },
  async input => {
    const {output} = await projectSuggestionPrompt(input);
    return output!;
  }
);
