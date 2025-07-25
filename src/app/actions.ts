'use server'

import { suggestProjects, type ApplicantProfile, type ProjectSuggestionOutput } from '@/ai/flows/project-suggestion'
import { getProjects as getProjectsFromDb, addProject as addProjectToDb, updateProject as updateProjectInDb, deleteProject as deleteProjectFromDb, addApplication as addApplicationToDb, getApplications as getApplicationsFromDb, updateProjectsOrder as updateProjectsOrderInDb } from '@/services/firestore';
import type { Project, Application } from '@/lib/types';

export async function getProjectSuggestions(data: ApplicantProfile): Promise<ProjectSuggestionOutput | { error: string }> {
  try {
    const projects = await getProjectsFromDb();
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
    return await getProjectsFromDb();
}

export async function addProject(project: Omit<Project, 'id'| 'code' | 'order'>): Promise<Project> {
    const id = await addProjectToDb(project);
    const projects = await getProjectsFromDb();
    const newProject = projects.find(p => p.id === id);
    if (!newProject) {
        throw new Error('Could not find newly created project');
    }
    return newProject
}

export async function updateProject(id: string, project: Omit<Project, 'id'>) {
    await updateProjectInDb(id, project);
}

export async function updateProjectsOrder(projects: Pick<Project, 'id' | 'order'>[]) {
    await updateProjectsOrderInDb(projects);
}

export async function deleteProject(id: string) {
    await deleteProjectFromDb(id);
}

export async function getApplications(): Promise<Application[]> {
    return await getApplicationsFromDb();
}

export async function addApplication(application: Omit<Application, 'id'>): Promise<Application> {
    const id = await addApplicationToDb(application);
    return { id, ...application };
}
