'use server'

import { suggestProjects, type ApplicantProfile, type ProjectSuggestionOutput } from '@/ai/flows/project-suggestion'

export async function getProjectSuggestions(data: ApplicantProfile): Promise<ProjectSuggestionOutput | { error: string }> {
  try {
    const result = await suggestProjects(data);
    if (!result?.suggestedProjects) {
      return { error: 'AI could not generate suggestions. Please try again.' };
    }
    return result;
  } catch (error) {
    console.error("Error getting project suggestions:", error);
    return { error: 'An unexpected error occurred while fetching AI suggestions.' };
  }
}
