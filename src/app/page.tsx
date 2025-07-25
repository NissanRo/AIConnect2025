import AIConnectClientPage from '@/components/ai-connect-client-page';
import { getProjects } from '@/app/actions';

export default async function Home() {
  const projects = await getProjects();
  return <AIConnectClientPage initialProjects={projects} />;
}
