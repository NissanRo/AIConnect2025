export interface Project {
  id: number;
  title: string;
  objective: string;
  deliverables: string[];
  tools: string[];
  longTermScope: string;
  imageUrl: string;
  imageHint: string;
}

export interface Application {
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
  projectId: number;
}
