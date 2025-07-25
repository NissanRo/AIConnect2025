// src/services/firestore.ts
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, runTransaction } from 'firebase/firestore';
import type { Project, Application } from '@/lib/types';
import { initialProjects } from '@/data/initial-projects';

const PROJECTS_COLLECTION = 'projects';
const APPLICATIONS_COLLECTION = 'applications';

// Seed initial projects if the collection is empty
export async function seedInitialProjects() {
    const projectsSnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    if (projectsSnapshot.empty) {
        console.log('No projects found, seeding initial projects...');
        const promises = initialProjects.map(project => {
            return addDoc(collection(db, PROJECTS_COLLECTION), project);
        });
        await Promise.all(promises);
        console.log('Initial projects seeded.');
    }
}


// Project Functions
export async function getProjects(): Promise<Project[]> {
  await seedInitialProjects();
  const projectsCollection = query(collection(db, PROJECTS_COLLECTION), orderBy("code"));
  const projectsSnapshot = await getDocs(projectsCollection);
  return projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
}

export async function addProject(project: Omit<Project, 'id' | 'code'>): Promise<string> {
  const projectsRef = collection(db, PROJECTS_COLLECTION);
  
  return runTransaction(db, async (transaction) => {
    const projectsQuery = query(projectsRef, orderBy('code', 'desc'));
    const snapshot = await getDocs(projectsQuery);
    let newCode = 'PROJ-001';
    if (!snapshot.empty) {
      const lastProject = snapshot.docs[0].data() as Project;
      const lastCodeNumber = parseInt(lastProject.code.split('-')[1]);
      const newCodeNumber = lastCodeNumber + 1;
      newCode = `PROJ-${newCodeNumber.toString().padStart(3, '0')}`;
    }
    
    const newProjectData = { ...project, code: newCode };
    const docRef = doc(projectsRef); // create a new doc reference with an auto-generated ID
    transaction.set(docRef, newProjectData);
    return docRef.id;
  });
}


export async function updateProject(id: string, project: Partial<Omit<Project, 'id'>>) {
  const projectRef = doc(db, PROJECTS_COLLECTION, id);
  await updateDoc(projectRef, project);
}

export async function deleteProject(id: string) {
  const projectRef = doc(db, PROJECTS_COLLECTION, id);
  await deleteDoc(projectRef);
}


// Application Functions
export async function getApplications(): Promise<Application[]> {
  const applicationsCollection = query(collection(db, APPLICATIONS_COLLECTION), orderBy("name"));
  const appsSnapshot = await getDocs(applicationsCollection);
  return appsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Application));
}

export async function addApplication(application: Omit<Application, 'id'>) {
    const docRef = await addDoc(collection(db, APPLICATIONS_COLLECTION), application);
    return docRef.id;
}
