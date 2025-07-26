'use server'

import { suggestProjects, type ApplicantProfile, type ProjectSuggestionOutput } from '@/ai/flows/project-suggestion'
import { getApplications as getApplicationsFromDb } from '@/services/firestore';
import type { Project, Application } from '@/lib/types';
import { initialProjects } from '@/data/initial-projects';

export async function getProjectSuggestions(data: ApplicantProfile): Promise<ProjectSuggestionOutput | { error: string }> {
  try {
    const projects: Project[] = initialProjects.map((p, i) => ({ ...p, id: `proj-${i}`}));
    const result = await suggestProjects({ ...data, projects });
    if (!result?.suggestedProjects) {
      return { error: 'AI could not generate suggestions. Please try again.' };
    }
    return result;
  } catch (error) {
    console.error("Error getting project suggestions:", error);
    return { error: 'An unexpected error occurred while fetching AI suggestions.' };
  }
}

export async function getProjects(): Promise<Project[]> {
    return initialProjects.map((p, i) => ({ ...p, id: `proj-${i}` }));
}

export async function getApplications(): Promise<Application[]> {
    return await getApplicationsFromDb();
}
