'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import type { Application } from '@/lib/types';

const APPLICATIONS_COLLECTION = 'applications';

// Application Functions
export async function getApplications(): Promise<Application[]> {
    try {
        const applicationsCollection = query(collection(db, APPLICATIONS_COLLECTION), orderBy("name"));
        const appsSnapshot = await getDocs(applicationsCollection);
        if (appsSnapshot.empty) {
            console.log("No applications found in Firestore.");
            return [];
        }
        return appsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Application));
    } catch (error) {
        console.error("Error fetching applications from Firestore:", error);
        console.warn("FALLBACK: Could not fetch applications. Returning empty list.");
        return [];
    }
}

export async function addApplication(application: Omit<Application, 'id'>) {
    const docRef = await addDoc(collection(db, APPLICATIONS_COLLECTION), application);
    return docRef.id;
}
