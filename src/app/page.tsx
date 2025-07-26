import AIConnectClientPage from '@/components/ai-connect-client-page';
import { getProjects, getApplications } from '@/app/actions';

export default async function Home() {
  const projects = await getProjects();
  const applications = await getApplications();
  return <AIConnectClientPage initialProjects={projects} initialApplications={applications} />;
}
