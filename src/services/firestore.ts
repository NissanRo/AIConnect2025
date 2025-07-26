// src/services/firestore.ts
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, runTransaction, writeBatch, getDoc } from 'firebase/firestore';
import type { Project, Application } from '@/lib/types';
import { initialProjects } from '@/data/initial-projects';

const PROJECTS_COLLECTION = 'projects';
const APPLICATIONS_COLLECTION = 'applications';

async function isFirestoreAvailable(): Promise<boolean> {
    try {
        // Try a simple read to check connectivity and permissions
        await getDoc(doc(db, '_health', 'check'));
        return true;
    } catch (error: any) {
        if (error.code === 'permission-denied' || error.code === 'unimplemented' || error.code === 'unavailable') {
            console.warn('Firestore is not available or permissions are denied. Falling back to local data.');
            return false;
        }
        // For other errors, we might want to let them surface
        console.error("An unexpected error occurred while checking Firestore availability:", error);
        return false;
    }
}


// Seed initial projects if the collection is empty
export async function seedInitialProjects() {
    const projectsSnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    if (projectsSnapshot.empty) {
        console.log('No projects found, seeding initial projects...');
        const batch = writeBatch(db);
        initialProjects.forEach((project, index) => {
            const docRef = doc(collection(db, PROJECTS_COLLECTION));
            batch.set(docRef, { ...project, order: index + 1 });
        });
        await batch.commit();
        console.log('Initial projects seeded.');
    } else {
        // One-time migration for existing projects that don't have an order
        const batch = writeBatch(db);
        let order = 1;
        const projectsToMigrate = projectsSnapshot.docs.filter(doc => doc.data().order === undefined);
        if (projectsToMigrate.length > 0) {
            console.log(`Migrating ${projectsToMigrate.length} projects to add order field...`);
            // Sort by code to give a predictable initial order
            const sortedDocs = projectsToMigrate.sort((a,b) => a.data().code.localeCompare(b.data().code));
            sortedDocs.forEach(docSnapshot => {
                batch.update(docSnapshot.ref, { order: order++ });
            });
            await batch.commit();
            console.log('Projects migrated.');
        }
    }
}


// Project Functions
export async function getProjects(): Promise<Project[]> {
    const available = await isFirestoreAvailable();
    if (!available) {
        // Firestore is not set up, return the initial hardcoded data with IDs
        return initialProjects.map((p, i) => ({ ...p, id: `local-${i+1}` }));
    }
  
    try {
        await seedInitialProjects();
        const projectsCollection = query(collection(db, PROJECTS_COLLECTION), orderBy("order"));
        const projectsSnapshot = await getDocs(projectsCollection);
        return projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    } catch (error) {
        console.error("Error fetching projects from Firestore, falling back to local data:", error);
        return initialProjects.map((p, i) => ({ ...p, id: `local-${i+1}` }));
    }
}

export async function addProject(project: Omit<Project, 'id' | 'code' | 'order'>): Promise<string> {
  const projectsRef = collection(db, PROJECTS_COLLECTION);
  
  return runTransaction(db, async (transaction) => {
    const projectsQuery = query(projectsRef, orderBy('code', 'desc'));
    const orderQuery = query(projectsRef, orderBy('order', 'desc'));
    
    const codeSnapshot = await getDocs(projectsQuery);
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
    const docRef = doc(projectsRef); // create a new doc reference with an auto-generated ID
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
    const available = await isFirestoreAvailable();
    if (!available) return [];

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
