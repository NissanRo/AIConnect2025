import AIConnectClientPage from '@/components/ai-connect-client-page';
import { initialProjects } from '@/data/initial-projects';

export default function Home() {
  return <AIConnectClientPage initialProjects={initialProjects} />;
}
