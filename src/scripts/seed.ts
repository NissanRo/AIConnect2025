// src/scripts/seed.ts
import { db } from '@/lib/firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { initialProjects } from '@/data/initial-projects';

const PROJECTS_COLLECTION = 'projects';

async function seedDatabase() {
  try {
    console.log('Checking if database needs seeding...');
    const projectsSnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    
    if (projectsSnapshot.empty) {
      console.log('No projects found. Seeding initial projects...');
      const batch = writeBatch(db);
      initialProjects.forEach((project) => {
        const docRef = doc(collection(db, PROJECTS_COLLECTION));
        batch.set(docRef, project);
      });
      await batch.commit();
      console.log('✅ Initial projects seeded successfully.');
    } else {
      console.log('Database already contains projects. No seeding needed.');
    }
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    process.exit(1);
  }
}

seedDatabase().then(() => {
    // The script will exit automatically when the async operations are done.
    // We manually exit here to be explicit and avoid hangs in case of misconfiguration.
    console.log('Seeding script finished.');
    process.exit(0);
});
