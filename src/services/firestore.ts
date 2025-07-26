// src/services/firestore.ts
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, runTransaction, writeBatch } from 'firebase/firestore';
import type { Project, Application } from '@/lib/types';
import { initialProjects } from '@/data/initial-projects';

const PROJECTS_COLLECTION = 'projects';
const APPLICATIONS_COLLECTION = 'applications';

// Project Functions
export async function getProjects(): Promise<Project[]> {
    try {
        const projectsCollection = query(collection(db, PROJECTS_COLLECTION), orderBy("order"));
        const projectsSnapshot = await getDocs(projectsCollection);
        if (projectsSnapshot.empty) {
            console.warn("Projects collection is empty. Run 'npm run db:seed' to populate it.");
            return [];
        }
        return projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    } catch (error) {
        console.error("Error fetching projects from Firestore:", error);
        // Fallback to local data if there is an error
        return initialProjects.map((p, i) => ({ ...p, id: `local-${i+1}` }));
    }
}

export async function addProject(project: Omit<Project, 'id' | 'code' | 'order'>): Promise<string> {
  const projectsRef = collection(db, PROJECTS_COLLECTION);
  
  return runTransaction(db, async (transaction) => {
    const codeQuery = query(projectsRef, orderBy('code', 'desc'));
    const orderQuery = query(projectsRef, orderBy('order', 'desc'));
    
    const codeSnapshot = await getDocs(codeQuery);
    const orderSnapshot = await getDocs(orderQuery);
    
    let newCode = 'PROJ-001';
    if (!codeSnapshot.empty) {
      const lastProjectCode = codeSnapshot.docs[0].data().code;
      const lastCodeNumber = parseInt(lastProjectCode.split('-')[1]);
      const newCodeNumber = lastCodeNumber + 1;
      newCode = `PROJ-${newCodeNumber.toString().padStart(3, '0')}`;
    }

    let newOrder = 1;
    if (!orderSnapshot.empty) {
        const lastProjectByOrder = orderSnapshot.docs[0].data() as Project;
        newOrder = lastProjectByOrder.order + 1;
    }
    
    const newProjectData = { ...project, code: newCode, order: newOrder };
    const docRef = doc(projectsRef);
    transaction.set(docRef, newProjectData);
    return docRef.id;
  });
}


export async function updateProject(id: string, project: Partial<Omit<Project, 'id' | 'code' | 'order'>>) {
  const projectRef = doc(db, PROJECTS_COLLECTION, id);
  await updateDoc(projectRef, project);
}

export async function updateProjectsOrder(projects: Pick<Project, 'id' | 'order'>[]) {
    const batch = writeBatch(db);
    projects.forEach(project => {
        const projectRef = doc(db, PROJECTS_COLLECTION, project.id);
        batch.update(projectRef, { order: project.order });
    });
    await batch.commit();
}


export async function deleteProject(id: string) {
  const projectRef = doc(db, PROJECTS_COLLECTION, id);
  await deleteDoc(projectRef);
}


// Application Functions
export async function getApplications(): Promise<Application[]> {
    try {
        const applicationsCollection = query(collection(db, APPLICATIONS_COLLECTION), orderBy("name"));
        const appsSnapshot = await getDocs(applicationsCollection);
        return appsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Application));
    } catch (error) {
        console.error("Error fetching applications from Firestore:", error);
        return [];
    }
}

export async function addApplication(application: Omit<Application, 'id'>) {
    const docRef = await addDoc(collection(db, APPLICATIONS_COLLECTION), application);
    return docRef.id;
}
