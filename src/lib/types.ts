export interface Project {
  id: string;
  title: string;
  objective: string;
  deliverables: string[];
  tools: string[];
  longTermScope: string;
  imageUrl: string;
  imageHint: string;
}

export interface Application {
  id: string;
  name: string;
  location: string;
  specialization: string;
  skills: string;
  gradYear: string;
  college: string;
  contact: string;
  email: string;
  workType: 'Team' | 'Individual';
  projectInterest: string;
  projectId: string;
}
