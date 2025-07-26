export interface Project {
  id: string;
  code: string;
  title: string;
  objective: string;
  deliverables: string[];
  tools: string[];
  longTermScope: string;
  imageUrl: string;
  imageHint: string;
  order: number;
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
  projectInterests: string[]; // Changed from single to multiple
  projectIds: string[]; // Changed from single to multiple
}
